import { jellyfinConfig } from "@/lib/config";
import { Episode, Series } from "@/lib/types";
import { formatSeconds, slugify } from "@/lib/utils";

type JellyfinSeriesItem = {
  Id: string;
  Name: string;
  Overview?: string;
};

type JellyfinEpisodeItem = {
  Id: string;
  Name: string;
  Overview?: string;
  RunTimeTicks?: number;
  ParentIndexNumber?: number;
  IndexNumber?: number;
};

type JellyfinMovieItem = {
  Id: string;
  Name: string;
  Overview?: string;
  RunTimeTicks?: number;
  ProductionYear?: number;
};

async function jellyfinFetch<T>(input: string) {
  const { baseUrl, apiKey } = jellyfinConfig;

  if (!baseUrl || !apiKey) {
    throw new Error("Missing Jellyfin configuration.");
  }

  const response = await fetch(`${baseUrl}${input}`, {
    headers: {
      "X-Emby-Token": apiKey,
    },
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    throw new Error(`Jellyfin request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

function getJellyfinStreamUrl(itemId: string) {
  return `/api/jellyfin-stream/${itemId}`;
}

export async function getJellyfinSeriesList(): Promise<Series[]> {
  const { userId } = jellyfinConfig;

  if (!userId) {
    throw new Error("Missing Jellyfin user id.");
  }

  const response = await jellyfinFetch<{ Items: JellyfinSeriesItem[] }>(
    `/Users/${userId}/Items?Recursive=true&IncludeItemTypes=Series&Fields=Overview`,
  );

  if (response.Items.length === 0) {
    return getJellyfinMovieList();
  }

  const seriesList = await Promise.all(
    response.Items.map(async (item) => {
      const episodes = await getJellyfinEpisodes(item.Id, item.Name);

      return {
        id: item.Id,
        slug: slugify(item.Name),
        title: item.Name,
        source: "jellyfin" as const,
        description: item.Overview,
        episodeCount: episodes.length,
        coverText: item.Name.slice(0, 2).toUpperCase(),
        episodes,
      };
    }),
  );

  return seriesList.sort((left, right) =>
    left.title.localeCompare(right.title, "zh-Hans-CN"),
  );
}

async function getJellyfinEpisodes(
  seriesId: string,
  seriesTitle: string,
): Promise<Episode[]> {
  const { userId } = jellyfinConfig;

  const response = await jellyfinFetch<{ Items: JellyfinEpisodeItem[] }>(
    `/Shows/${seriesId}/Episodes?UserId=${userId}&Fields=Overview,RunTimeTicks`,
  );

  return response.Items.map((item) => ({
    id: item.Id,
    slug: slugify(item.Name),
    title: item.Name,
    seriesSlug: slugify(seriesTitle),
    seriesTitle,
    source: "jellyfin" as const,
    description: item.Overview,
    seasonNumber: item.ParentIndexNumber,
    episodeNumber: item.IndexNumber,
    durationLabel: formatSeconds(
      item.RunTimeTicks ? item.RunTimeTicks / 10_000_000 : undefined,
    ),
    streamUrl: getJellyfinStreamUrl(item.Id),
  })).sort((left, right) => {
    const leftSeason = left.seasonNumber ?? 1;
    const rightSeason = right.seasonNumber ?? 1;

    if (leftSeason !== rightSeason) {
      return leftSeason - rightSeason;
    }

    const leftEpisode = left.episodeNumber ?? Number.MAX_SAFE_INTEGER;
    const rightEpisode = right.episodeNumber ?? Number.MAX_SAFE_INTEGER;

    return leftEpisode - rightEpisode;
  });
}

export async function getJellyfinSeriesBySlug(slug: string) {
  const seriesList = await getJellyfinSeriesList();
  return seriesList.find((item) => item.slug === slug);
}

async function getJellyfinMovieList(): Promise<Series[]> {
  const { userId } = jellyfinConfig;

  if (!userId) {
    throw new Error("Missing Jellyfin user id.");
  }

  const response = await jellyfinFetch<{ Items: JellyfinMovieItem[] }>(
    `/Users/${userId}/Items?Recursive=true&IncludeItemTypes=Movie&Fields=Overview,RunTimeTicks`,
  );

  return response.Items.map((item) => {
    const slug = slugify(item.Name);

    return {
      id: item.Id,
      slug,
      title: item.Name,
      source: "jellyfin" as const,
      description: item.Overview ?? "当前资源在 Jellyfin 中被识别为单部影片。",
      episodeCount: 1,
      coverText: item.Name.slice(0, 2).toUpperCase(),
      episodes: [
        {
          id: item.Id,
          slug: `${slug}-play`,
          title: item.Name,
          seriesSlug: slug,
          seriesTitle: item.Name,
          source: "jellyfin" as const,
          description: item.Overview,
          durationLabel: formatSeconds(
            item.RunTimeTicks ? item.RunTimeTicks / 10_000_000 : undefined,
          ),
          streamUrl: getJellyfinStreamUrl(item.Id),
        },
      ],
    };
  }).sort((left, right) => left.title.localeCompare(right.title, "zh-Hans-CN"));
}
