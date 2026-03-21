import { getSeriesList } from "@/lib/library";
import { Episode, Series } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const seriesList = await getSeriesList();
  const episodes = flattenEpisodes(seriesList);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      {episodes.length === 0 ? (
        <div className="panel rounded-[2rem] p-8 text-sm leading-7 text-muted">
          当前还没有检测到 Cloudflare R2 中的电视剧资源。先确认
          <code className="font-mono"> zhuyu-video </code>
          存储桶里已经上传了视频文件，例如
          <code className="font-mono"> 31.MP4 </code>
          ，刷新后这里就会显示。
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {episodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
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
}: {
  episode: Episode;
}) {
  return (
    <article className="panel overflow-hidden rounded-[1.5rem] p-3 sm:p-4">
      <video
        controls
        preload="metadata"
        className="aspect-video rounded-[1.2rem] bg-black"
        src={episode.streamUrl}
      />

      <div className="px-1 pt-4">
        <h2 className="truncate text-xl font-semibold text-foreground">
          {episode.title}
        </h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
          {episode.description ?? "点击视频即可开始播放。"}
        </p>
      </div>
    </article>
  );
}
