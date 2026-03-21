import { createReadStream } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const VIDEO_ROOT = (process.env.LOCAL_VIDEO_ROOT || "/Volumes/2T/zhuyu").replace(/\/$/, "");
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.R2_BUCKET;
const PREFIX = process.env.R2_PREFIX?.replace(/^\/+|\/+$/g, "") || "";
const VIDEO_EXTENSIONS = new Set([".mp4", ".mkv", ".mov", ".m4v", ".webm"]);
const MAX_RETRIES = 3;

function requireEnv(value, name) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }

  return `${size.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

async function readVideoFiles(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .filter((entry) => VIDEO_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => path.join(root, entry.name))
    .sort((left, right) => left.localeCompare(right, "zh-Hans-CN"));
}

async function main() {
  const accountId = requireEnv(ACCOUNT_ID, "R2_ACCOUNT_ID");
  const accessKeyId = requireEnv(ACCESS_KEY_ID, "R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv(SECRET_ACCESS_KEY, "R2_SECRET_ACCESS_KEY");
  const bucket = requireEnv(BUCKET, "R2_BUCKET");

  const files = await readVideoFiles(VIDEO_ROOT);

  if (files.length === 0) {
    throw new Error(`No video files found in ${VIDEO_ROOT}`);
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  console.log(`Uploading ${files.length} files from ${VIDEO_ROOT} to R2 bucket ${bucket}${PREFIX ? `/${PREFIX}` : ""}`);

  for (const filePath of files) {
    const stat = await fs.stat(filePath);
    const fileName = path.basename(filePath);
    const key = PREFIX ? `${PREFIX}/${fileName}` : fileName;

    console.log(`\n→ ${fileName} (${formatBytes(stat.size)})`);

    try {
      const head = await client.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );

      if (head.ContentLength === stat.size) {
        console.log(`✓ Skipped ${key} (already uploaded)`);
        continue;
      }
    } catch {
      // Object does not exist yet or cannot be read; continue to upload.
    }

    let uploaded = false;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
      try {
        const upload = new Upload({
          client,
          params: {
            Bucket: bucket,
            Key: key,
            Body: createReadStream(filePath),
            ContentType: "video/mp4",
          },
          queueSize: 4,
          partSize: 8 * 1024 * 1024,
          leavePartsOnError: false,
        });

        let lastLoggedPercent = -1;
        upload.on("httpUploadProgress", (progress) => {
          if (!progress.loaded || !progress.total) {
            return;
          }

          const percent = Math.floor((progress.loaded / progress.total) * 100);

          if (percent !== lastLoggedPercent && percent % 10 === 0) {
            console.log(`  ${percent}%`);
            lastLoggedPercent = percent;
          }
        });

        await upload.done();
        console.log(`✓ Uploaded to ${key}`);
        uploaded = true;
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        if (attempt === MAX_RETRIES) {
          throw error;
        }

        console.log(`  Retry ${attempt}/${MAX_RETRIES - 1} after error: ${message}`);
      }
    }

    if (!uploaded) {
      throw new Error(`Failed to upload ${key}`);
    }
  }

  console.log("\nAll uploads completed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
