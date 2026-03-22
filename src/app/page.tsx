import Image from "next/image";
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
  const watchHref = `/watch/${episode.rawPath
    ?.split("/")
    .map(encodeURIComponent)
    .join("/")}`;

  return (
    <a
      href={watchHref}
      className="interactive-card liquid-glass-card block overflow-hidden rounded-[1.75rem] p-3 transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(20,40,29,0.18)] focus-visible:-translate-y-0.5 focus-visible:shadow-[0_24px_50px_rgba(20,40,29,0.18)] focus-visible:outline-none active:scale-[0.985] active:translate-y-0 sm:p-4"
      aria-label={`打开 ${episode.title} 详情页`}
    >
      <article>
        <div className="liquid-glass-media relative aspect-video overflow-hidden rounded-[1.35rem]">
          <Image
            src="/image.png"
            alt={episode.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover saturate-[1.05]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.42),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02)_52%,rgba(20,40,29,0.12))]" />
        </div>

        <div className="px-1 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="truncate text-xl font-semibold text-foreground">
              {episode.title}
            </h2>
            <span className="liquid-glass-pill shrink-0 rounded-full px-3 py-1 text-[11px] tracking-[0.18em] uppercase">
              点击播放
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
            {episode.description ?? "点击进入详情页播放。"}
          </p>
        </div>
      </article>
    </a>
  );
}
