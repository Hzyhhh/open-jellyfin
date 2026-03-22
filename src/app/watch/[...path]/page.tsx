import Link from "next/link";
import { notFound } from "next/navigation";
import { getEpisodeByPath } from "@/lib/library";

export const dynamic = "force-dynamic";

export default async function WatchPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const rawPath = path.map(decodeURIComponent).join("/");
  const episode = await getEpisodeByPath(rawPath);

  if (!episode) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="liquid-glass-card overflow-hidden rounded-[2rem] p-4 sm:p-6">
        <Link
          href="/"
          className="interactive-card liquid-glass-button inline-flex items-center rounded-full px-4 py-2 text-sm text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(20,40,29,0.12)] focus-visible:-translate-y-0.5 focus-visible:shadow-[0_16px_28px_rgba(20,40,29,0.12)] focus-visible:outline-none active:scale-[0.98] active:translate-y-0"
        >
          返回剧集列表
        </Link>

        <div className="liquid-glass-media mt-5 overflow-hidden rounded-[1.6rem] p-0.5">
          <video
            controls
            preload="metadata"
            className="aspect-video rounded-[1.35rem] bg-black"
            src={episode.streamUrl}
          />
        </div>

        <div className="px-1 pt-5">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            {episode.title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            {episode.description ?? "点击播放器即可开始播放。"}
          </p>
        </div>
      </div>
    </main>
  );
}
