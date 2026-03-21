import Link from "next/link";
import { getSeriesList } from "@/lib/library";
import { Episode, Series } from "@/lib/types";

export default async function Home() {
  const seriesList = await getSeriesList();
  const episodes = flattenEpisodes(seriesList);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              全部剧集
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted">共 {episodes.length} 条</p>
            <Link
              href="/setup"
              className="rounded-full border border-line px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-strong"
            >
              部署说明
            </Link>
          </div>
        </div>

        {episodes.length === 0 ? (
          <div className="panel rounded-[2rem] p-8 text-sm leading-7 text-muted">
            当前还没有检测到电视剧资源。先在 <code className="font-mono">videos</code>{" "}
            目录中新增一个剧集文件夹，例如
            <code className="font-mono"> videos/三体/S01E01.mp4</code>，刷新后这里就会显示。
          </div>
        ) : (
          <div className="grid gap-3">
            {episodes.map((episode, index) => (
              <EpisodeRow key={episode.id} episode={episode} index={index} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function flattenEpisodes(seriesList: Series[]) {
  return seriesList
    .flatMap((series) => series.episodes)
    .sort((left, right) => {
      const leftNumber = toNumericSortValue(left.title, left.episodeNumber);
      const rightNumber = toNumericSortValue(right.title, right.episodeNumber);

      if (leftNumber !== rightNumber) {
        return leftNumber - rightNumber;
      }

      return left.title.localeCompare(right.title, "zh-Hans-CN");
    });
}

function toNumericSortValue(title: string, episodeNumber?: number) {
  if (episodeNumber) {
    return episodeNumber;
  }

  const matched = title.match(/\d+/);
  return matched ? Number(matched[0]) : Number.MAX_SAFE_INTEGER;
}

function EpisodeRow({
  episode,
  index,
}: {
  episode: Episode;
  index: number;
}) {
  return (
    <Link
      href={`/series/${episode.seriesSlug}/${episode.slug}`}
      className="panel group grid gap-4 rounded-[1.5rem] p-4 transition-transform duration-200 hover:-translate-y-0.5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-5"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-hero text-xl font-semibold text-foreground">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
          <span>{episode.source}</span>
          {episode.durationLabel ? <span>{episode.durationLabel}</span> : null}
          {episode.seriesTitle !== episode.title ? <span>{episode.seriesTitle}</span> : null}
        </div>
        <h2 className="mt-2 truncate text-xl font-semibold text-foreground">
          {episode.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
          {episode.description ?? "点击后进入视频播放页。"}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <span className="pill rounded-full px-3 py-1 text-sm">
          {episode.episodeNumber ? `第 ${episode.episodeNumber} 集` : "立即播放"}
        </span>
        <span className="font-mono text-sm text-accent transition-colors group-hover:text-accent-strong">
          Play
        </span>
      </div>
    </Link>
  );
}
