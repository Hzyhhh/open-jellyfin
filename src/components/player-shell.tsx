import Link from "next/link";
import { Episode, Series } from "@/lib/types";

export function PlayerShell({
  series,
  episode,
}: {
  series: Series;
  episode: Episode;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Link href="/" className="text-sm text-muted underline-offset-4 hover:underline">
            Back to library
          </Link>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              {series.title}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">
              {episode.title}
            </h1>
          </div>
        </div>
        <Link
          href={`/series/${series.slug}`}
          className="rounded-full border border-line px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-strong"
        >
          查看全部集数
        </Link>
      </div>

      <section className="panel overflow-hidden rounded-[2rem] p-3">
        <video
          controls
          preload="metadata"
          className="aspect-video rounded-[1.4rem] bg-black"
          src={episode.streamUrl}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="panel rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">当前播放</p>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">{episode.title}</h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
            {episode.seasonNumber ? <span className="pill rounded-full px-3 py-1">Season {episode.seasonNumber}</span> : null}
            {episode.episodeNumber ? <span className="pill rounded-full px-3 py-1">Episode {episode.episodeNumber}</span> : null}
            {episode.durationLabel ? <span className="pill rounded-full px-3 py-1">{episode.durationLabel}</span> : null}
            <span className="pill rounded-full px-3 py-1">{episode.source}</span>
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-muted">
            {episode.description ??
              "这一版页面先保证电视剧资源能在网页内稳定播放。投屏阶段建议优先使用 Jellyfin 电视端客户端，网页负责选片和入口。"}
          </p>
        </div>

        <aside className="panel rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">投屏建议</p>
          <ul className="mt-4 space-y-4 text-sm leading-7 text-muted">
            <li>电视能装 Jellyfin 客户端时，优先让电视直接连 Jellyfin。</li>
            <li>手机接入同一个 Tailscale tailnet 后，可作为选片和遥控入口。</li>
            <li>网页播放器适合电脑和平板直接观看，也适合作为前端门户。</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
