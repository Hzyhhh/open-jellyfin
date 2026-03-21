import { hasR2Config } from "@/lib/config";
import { getR2SeriesBySlug, getR2SeriesList } from "@/lib/r2-library";

export async function getSeriesList() {
  if (!hasR2Config()) {
    return [];
  }

  return getR2SeriesList();
}

export async function getSeriesBySlug(slug: string) {
  if (!hasR2Config()) {
    return undefined;
  }

  return getR2SeriesBySlug(slug);
}
