import { getLocalSeriesBySlug, getLocalSeriesList } from "@/lib/local-library";

export async function getSeriesList() {
  return getLocalSeriesList();
}

export async function getSeriesBySlug(slug: string) {
  return getLocalSeriesBySlug(slug);
}
