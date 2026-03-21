export type ContentSource = "local" | "jellyfin";

export type Episode = {
  id: string;
  slug: string;
  title: string;
  seriesSlug: string;
  seriesTitle: string;
  source: ContentSource;
  description?: string;
  durationLabel?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  streamUrl: string;
  rawPath?: string;
};

export type Series = {
  id: string;
  slug: string;
  title: string;
  source: ContentSource;
  description?: string;
  episodeCount: number;
  coverText: string;
  episodes: Episode[];
};
