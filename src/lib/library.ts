import { hasR2Config } from "@/lib/config";
import { getR2SeriesBySlug, getR2SeriesList } from "@/lib/r2-library";

export async function getSeriesList() {
  if (!hasR2Config()) {
    return [];
  }

  try {
    return getR2SeriesList();
  } catch (error) {
    console.error("Failed to load series list from R2.", error);
    return [];
  }
}

export async function getSeriesBySlug(slug: string) {
  if (!hasR2Config()) {
    return undefined;
  }

  try {
    return getR2SeriesBySlug(slug);
  } catch (error) {
    console.error(`Failed to load series ${slug} from R2.`, error);
    return undefined;
  }
}

export async function getEpisodeByPath(rawPath: string) {
  const seriesList = await getSeriesList();

  return seriesList
    .flatMap((series) => series.episodes)
    .find((episode) => episode.rawPath === rawPath);
}
