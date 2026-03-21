import Link from "next/link";
import { Series } from "@/lib/types";

export function SeriesCard({ series }: { series: Series }) {
  return (
    <Link
      href={`/series/${series.slug}`}
      className="panel group flex h-full flex-col justify-between rounded-[1.75rem] p-5 transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              {series.source}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">
              {series.title}
            </h2>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-hero text-xl font-semibold text-foreground">
            {series.coverText}
          </div>
        </div>
        <p className="line-clamp-3 text-sm leading-7 text-muted">
          {series.description ?? "这个剧集目录已经接入当前站点，可以直接进入并选择集数播放。"}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-sm text-muted">
        <span>{series.episodeCount} episodes</span>
        <span className="font-mono text-accent transition-colors group-hover:text-accent-strong">
          Open Series
        </span>
      </div>
    </Link>
  );
}
