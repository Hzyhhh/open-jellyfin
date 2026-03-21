import { promises as fs } from "node:fs";
import path from "node:path";
import { Episode, Series } from "@/lib/types";
import { extractEpisodeNumbers, humanFileTitle, slugify } from "@/lib/utils";

const VIDEO_ROOT = (
  process.env.LOCAL_VIDEO_ROOT || "/Volumes/2T/zhuyu"
).replace(/\/$/, "");
const VIDEO_EXTENSIONS = new Set([".mp4", ".mkv", ".mov", ".m4v", ".webm"]);

async function readSeriesDirectories() {
  try {
    const entries = await fs.readdir(VIDEO_ROOT, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory());
  } catch {
    return [];
  }
}

async function readEpisodesFromSeries(seriesDirName: string): Promise<Episode[]> {
  const absoluteSeriesPath = path.join(VIDEO_ROOT, seriesDirName);
  const entries = await fs.readdir(absoluteSeriesPath, { withFileTypes: true });
  const files = entries.filter((entry) => {
    if (!entry.isFile()) {
      return false;
    }

    const extension = path.extname(entry.name).toLowerCase();
    return VIDEO_EXTENSIONS.has(extension);
  });

  const seriesSlug = slugify(seriesDirName);

  const episodes = files.map((file) => {
    const title = humanFileTitle(file.name);
    const { seasonNumber, episodeNumber } = extractEpisodeNumbers(title);
    const relativePath = `${seriesDirName}/${file.name}`;

    return {
      id: relativePath,
      slug: slugify(file.name),
      title,
      seriesSlug,
      seriesTitle: seriesDirName,
      source: "local" as const,
      seasonNumber,
      episodeNumber,
      streamUrl: `/api/local-video/${relativePath.split("/").map(encodeURIComponent).join("/")}`,
      rawPath: relativePath,
    };
  });

  return episodes.sort((left, right) => {
    const leftEpisode = left.episodeNumber ?? Number.MAX_SAFE_INTEGER;
    const rightEpisode = right.episodeNumber ?? Number.MAX_SAFE_INTEGER;

    if (leftEpisode !== rightEpisode) {
      return leftEpisode - rightEpisode;
    }

    return left.title.localeCompare(right.title, "zh-Hans-CN");
  });
}

export async function getLocalSeriesList(): Promise<Series[]> {
  const directories = await readSeriesDirectories();
  const seriesList = await Promise.all(
    directories.map(async (directory) => {
      const episodes = await readEpisodesFromSeries(directory.name);

      return {
        id: directory.name,
        slug: slugify(directory.name),
        title: directory.name,
        source: "local" as const,
        description: "当前直接从本地视频目录读取，适合开发联调和小规模私有播放。",
        episodeCount: episodes.length,
        coverText: directory.name.slice(0, 2).toUpperCase(),
        episodes,
      };
    }),
  );

  return seriesList.sort((left, right) =>
    left.title.localeCompare(right.title, "zh-Hans-CN"),
  );
}

export async function getLocalSeriesBySlug(slug: string) {
  const series = await getLocalSeriesList();
  return series.find((item) => item.slug === slug);
}

export function getLocalVideoAbsolutePath(relativePath: string) {
  const normalizedPath = path.normalize(relativePath);
  const absolutePath = path.join(VIDEO_ROOT, normalizedPath);

  if (!absolutePath.startsWith(VIDEO_ROOT)) {
    throw new Error("Invalid video path.");
  }

  return absolutePath;
}
