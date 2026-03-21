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
              "这一版页面直接从本地视频目录读取资源，重点先保证网页内稳定播放和更短的传输链路。"}
          </p>
        </div>

        <aside className="panel rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">使用建议</p>
          <ul className="mt-4 space-y-4 text-sm leading-7 text-muted">
            <li>优先先用网页链路验证首帧速度和拖动进度条的响应。</li>
            <li>公网临时访问时，用 `npm run tunnel:quick:web` 暴露本地站点。</li>
            <li>如果浏览器仍然卡顿，再继续检查视频编码和上行带宽。</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
