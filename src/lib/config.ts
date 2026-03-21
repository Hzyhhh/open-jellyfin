import { ContentSource } from "@/lib/types";

export const storageSource = (process.env.STORAGE_SOURCE ?? "local") as ContentSource;

export const r2Config = {
  accountId: process.env.R2_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET,
  prefix: process.env.R2_PREFIX?.replace(/^\/+|\/+$/g, ""),
};

export function hasR2Config() {
  return Boolean(
    r2Config.accountId &&
      r2Config.accessKeyId &&
      r2Config.secretAccessKey &&
      r2Config.bucket,
  );
}
