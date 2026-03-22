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
      <div className="panel rounded-[2rem] p-4 sm:p-6">
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-accent hover:text-foreground"
        >
          返回剧集列表
        </Link>

        <div className="mt-5">
          <video
            controls
            preload="metadata"
            className="aspect-video rounded-[1.2rem] bg-black"
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
