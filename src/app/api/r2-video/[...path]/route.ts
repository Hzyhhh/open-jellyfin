import path from "node:path";
import { Readable } from "node:stream";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";
import { r2Config } from "@/lib/config";

function getR2Client() {
  const { accountId, accessKeyId, secretAccessKey } = r2Config;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing Cloudflare R2 configuration.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

function getContentType(filePath: string, fallback?: string) {
  if (fallback) {
    return fallback;
  }

  switch (path.extname(filePath).toLowerCase()) {
    case ".mp4":
    case ".m4v":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".mov":
      return "video/quicktime";
    case ".mkv":
      return "video/x-matroska";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { bucket, prefix } = r2Config;

  if (!bucket) {
    return new Response("Missing Cloudflare R2 bucket.", { status: 500 });
  }

  const { path: segments } = await context.params;
  const relativePath = segments.map(decodeURIComponent).join("/");
  const key = prefix ? `${prefix}/${relativePath}` : relativePath;
  const range = request.headers.get("range");
  const client = getR2Client();
  const upstream = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      Range: range ?? undefined,
    }),
  );

  const body = upstream.Body;

  if (!body || !(body instanceof Readable)) {
    return new Response("Missing R2 stream body.", { status: 502 });
  }

  const headers = new Headers();

  if (upstream.AcceptRanges) {
    headers.set("Accept-Ranges", upstream.AcceptRanges);
  }

  if (upstream.ContentLength != null) {
    headers.set("Content-Length", String(upstream.ContentLength));
  }

  if (upstream.ContentRange) {
    headers.set("Content-Range", upstream.ContentRange);
  }

  if (upstream.ETag) {
    headers.set("ETag", upstream.ETag);
  }

  if (upstream.LastModified) {
    headers.set("Last-Modified", upstream.LastModified.toUTCString());
  }

  headers.set("Content-Type", getContentType(relativePath, upstream.ContentType));

  return new Response(Readable.toWeb(body) as BodyInit, {
    status: range ? 206 : 200,
    headers,
  });
}
