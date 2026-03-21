import path from "node:path";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { episodeMetadata } from "@/lib/episode-metadata";
import { r2Config } from "@/lib/config";
import { Episode, Series } from "@/lib/types";
import { extractEpisodeNumbers, humanFileTitle, slugify } from "@/lib/utils";

const VIDEO_EXTENSIONS = new Set([".mp4", ".mkv", ".mov", ".m4v", ".webm"]);

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

function getKeyPrefix() {
  return r2Config.prefix ? `${r2Config.prefix}/` : "";
}

function buildEpisodeFromKey(key: string): Episode {
  const normalizedKey = key.replace(/^\/+/, "");
  const fileName = path.basename(normalizedKey);
  const fileKey = path.parse(fileName).name;
  const metadata = episodeMetadata[fileKey];
  const title = metadata?.title ?? humanFileTitle(fileName);
  const { seasonNumber, episodeNumber } = extractEpisodeNumbers(title);

  return {
    id: normalizedKey,
    slug: slugify(fileName),
    title,
    seriesSlug: "all",
    seriesTitle: "全部剧集",
    source: "r2",
    description: metadata?.description,
    seasonNumber,
    episodeNumber,
    streamUrl: `/api/r2-video/${normalizedKey.split("/").map(encodeURIComponent).join("/")}`,
    rawPath: normalizedKey,
  };
}

export async function getR2SeriesList(): Promise<Series[]> {
  const { bucket } = r2Config;

  if (!bucket) {
    throw new Error("Missing Cloudflare R2 bucket.");
  }

  const client = getR2Client();
  const prefix = getKeyPrefix();
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix || undefined,
  });

  const response = await client.send(command);
  const contents = response.Contents ?? [];
  const episodes = contents
    .map((item) => item.Key)
    .filter((key): key is string => Boolean(key))
    .filter((key) => !key.endsWith("/"))
    .filter((key) => {
      const extension = path.extname(key).toLowerCase();
      return VIDEO_EXTENSIONS.has(extension);
    })
    .map((key) => (prefix && key.startsWith(prefix) ? key.slice(prefix.length) : key))
    .map(buildEpisodeFromKey)
    .sort((left, right) => {
      const leftEpisode = left.episodeNumber ?? Number.MAX_SAFE_INTEGER;
      const rightEpisode = right.episodeNumber ?? Number.MAX_SAFE_INTEGER;

      if (leftEpisode !== rightEpisode) {
        return leftEpisode - rightEpisode;
      }

      return left.title.localeCompare(right.title, "zh-Hans-CN");
    });

  if (episodes.length === 0) {
    return [];
  }

  return [
    {
      id: "__r2_root__",
      slug: "all",
      title: "全部剧集",
      source: "r2",
      description: "当前视频已从 Cloudflare R2 读取，适合稳定线上播放。",
      episodeCount: episodes.length,
      coverText: "全部",
      episodes,
    },
  ];
}

export async function getR2SeriesBySlug(slug: string) {
  const seriesList = await getR2SeriesList();
  return seriesList.find((item) => item.slug === slug);
}
