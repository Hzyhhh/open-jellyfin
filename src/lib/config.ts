import { ContentSource } from "@/lib/types";

export const contentSource = (process.env.NEXT_PUBLIC_CONTENT_SOURCE ??
  "local") as ContentSource;

export const jellyfinConfig = {
  baseUrl: process.env.JELLYFIN_BASE_URL?.replace(/\/$/, ""),
  publicBaseUrl: (
    process.env.NEXT_PUBLIC_JELLYFIN_PUBLIC_URL ?? process.env.JELLYFIN_BASE_URL
  )?.replace(/\/$/, ""),
  userId: process.env.JELLYFIN_USER_ID,
  apiKey: process.env.JELLYFIN_API_KEY,
};

export function hasJellyfinConfig() {
  return Boolean(
    jellyfinConfig.baseUrl && jellyfinConfig.userId && jellyfinConfig.apiKey,
  );
}
