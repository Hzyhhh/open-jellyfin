export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\u4e00-\u9fff-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function extractEpisodeNumbers(value: string) {
  const seasonMatch = value.match(/[Ss](\d{1,2})/);
  const episodeMatch = value.match(/[Ee](\d{1,3})/) || value.match(/第\s*(\d{1,3})\s*[集话]/);

  return {
    seasonNumber: seasonMatch ? Number(seasonMatch[1]) : undefined,
    episodeNumber: episodeMatch ? Number(episodeMatch[1]) : undefined,
  };
}

export function humanFileTitle(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[_\.]+/g, " ").trim();
}

export function formatSeconds(totalSeconds?: number) {
  if (!totalSeconds || Number.isNaN(totalSeconds)) {
    return undefined;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}
