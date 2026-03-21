import { contentSource, hasJellyfinConfig } from "@/lib/config";
import { getJellyfinSeriesBySlug, getJellyfinSeriesList } from "@/lib/jellyfin";
import { getLocalSeriesBySlug, getLocalSeriesList } from "@/lib/local-library";

export async function getSeriesList() {
  if (contentSource === "jellyfin" && hasJellyfinConfig()) {
    return getJellyfinSeriesList();
  }

  return getLocalSeriesList();
}

export async function getSeriesBySlug(slug: string) {
  if (contentSource === "jellyfin" && hasJellyfinConfig()) {
    return getJellyfinSeriesBySlug(slug);
  }

  return getLocalSeriesBySlug(slug);
}
