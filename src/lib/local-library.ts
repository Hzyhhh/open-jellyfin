import { promises as fs } from "node:fs";
import path from "node:path";
import { episodeMetadata } from "@/lib/episode-metadata";
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

async function readRootVideoFiles() {
  try {
    const entries = await fs.readdir(VIDEO_ROOT, { withFileTypes: true });
    return entries.filter((entry) => {
      if (!entry.isFile()) {
        return false;
      }

      const extension = path.extname(entry.name).toLowerCase();
      return VIDEO_EXTENSIONS.has(extension);
    });
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
    const fileKey = path.parse(file.name).name;
    const metadata = episodeMetadata[fileKey];
    const title = metadata?.title ?? humanFileTitle(file.name);
    const { seasonNumber, episodeNumber } = extractEpisodeNumbers(title);
    const relativePath = `${seriesDirName}/${file.name}`;

    return {
      id: relativePath,
      slug: slugify(file.name),
      title,
      seriesSlug,
      seriesTitle: seriesDirName,
      source: "local" as const,
      description: metadata?.description,
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
  const rootFiles = await readRootVideoFiles();
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

  if (rootFiles.length > 0) {
    const rootSeriesSlug = "all";
    const rootEpisodes = rootFiles.map((file) => {
      const fileKey = path.parse(file.name).name;
      const metadata = episodeMetadata[fileKey];
      const title = metadata?.title ?? humanFileTitle(file.name);
      const { seasonNumber, episodeNumber } = extractEpisodeNumbers(title);

      return {
        id: file.name,
        slug: slugify(file.name),
        title,
        seriesSlug: rootSeriesSlug,
        seriesTitle: "全部剧集",
        source: "local" as const,
        description: metadata?.description,
        seasonNumber,
        episodeNumber,
        streamUrl: `/api/local-video/${encodeURIComponent(file.name)}`,
        rawPath: file.name,
      };
    }).sort((left, right) => {
      const leftEpisode = left.episodeNumber ?? Number.MAX_SAFE_INTEGER;
      const rightEpisode = right.episodeNumber ?? Number.MAX_SAFE_INTEGER;

      if (leftEpisode !== rightEpisode) {
        return leftEpisode - rightEpisode;
      }

      return left.title.localeCompare(right.title, "zh-Hans-CN");
    });

    seriesList.unshift({
      id: "__root__",
      slug: rootSeriesSlug,
      title: "全部剧集",
      source: "local" as const,
      description: "当前目录中的 MP4 文件会直接按剧集列表展示，不需要额外子文件夹。",
      episodeCount: rootEpisodes.length,
      coverText: "全部",
      episodes: rootEpisodes,
    });
  }

  return seriesList.sort((left, right) => {
    if (left.id === "__root__") {
      return -1;
    }

    if (right.id === "__root__") {
      return 1;
    }

    return left.title.localeCompare(right.title, "zh-Hans-CN");
  });
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
