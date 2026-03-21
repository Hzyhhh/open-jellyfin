import Link from "next/link";
import { getSeriesList } from "@/lib/library";
import { Episode, Series } from "@/lib/types";

export default async function Home() {
  const seriesList = await getSeriesList();
  const episodes = flattenEpisodes(seriesList);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      {episodes.length === 0 ? (
        <div className="panel rounded-[2rem] p-8 text-sm leading-7 text-muted">
          当前还没有检测到电视剧资源。先确认本地目录
          <code className="font-mono"> /Volumes/2T/zhuyu </code>
          中已经有视频文件，例如
          <code className="font-mono"> /Volumes/2T/zhuyu/30.MP4</code>
          ，刷新后这里就会显示。
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {episodes.map((episode, index) => (
            <EpisodeCard key={episode.id} episode={episode} index={index} />
          ))}
        </div>
      )}
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

function EpisodeCard({
  episode,
  index,
}: {
  episode: Episode;
  index: number;
}) {
  return (
    <article className="panel overflow-hidden rounded-[1.5rem] p-3 sm:p-4">
      <video
        controls
        preload="metadata"
        className="aspect-video rounded-[1.2rem] bg-black"
        src={episode.streamUrl}
      />

      <div className="flex items-start justify-between gap-4 px-1 pt-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span>{episode.source}</span>
            {episode.durationLabel ? <span>{episode.durationLabel}</span> : null}
            {episode.seriesTitle !== episode.title ? <span>{episode.seriesTitle}</span> : null}
          </div>
          <h2 className="mt-2 truncate text-xl font-semibold text-foreground">
            {episode.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {episode.description ?? "点击视频即可开始播放。"}
          </p>
        </div>
        <Link
          href={`/series/${episode.seriesSlug}/${episode.slug}`}
          className="shrink-0 rounded-full border border-line px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-strong"
        >
          打开
        </Link>
      </div>
    </article>
  );
}
