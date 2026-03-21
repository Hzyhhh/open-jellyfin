import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesBySlug } from "@/lib/library";

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <Link href="/" className="text-sm text-muted underline-offset-4 hover:underline">
          Back to library
        </Link>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              {series.source} series
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-foreground">
              {series.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
              {series.description ??
                "这个详情页会把当前剧集的全部资源展示出来，并给出网页内播放入口。"}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-surface-strong px-5 py-4 text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Total</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {series.episodeCount}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        {series.episodes.map((episode) => (
          <Link
            key={episode.id}
            href={`/series/${series.slug}/${episode.slug}`}
            className="panel grid gap-4 rounded-[1.5rem] p-4 transition-transform duration-200 hover:-translate-y-0.5 sm:grid-cols-[1fr_auto] sm:items-center"
          >
            <div>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted">
                {episode.seasonNumber ? <span>Season {episode.seasonNumber}</span> : null}
                {episode.episodeNumber ? <span>Episode {episode.episodeNumber}</span> : null}
                {episode.durationLabel ? <span>{episode.durationLabel}</span> : null}
              </div>
              <h2 className="mt-3 text-xl font-semibold text-foreground">
                {episode.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                {episode.description ??
                  "点击后会进入网页播放器。等 Jellyfin 接管后，这里也会自动沿用 Jellyfin 的播放源。"}
              </p>
            </div>
            <div className="justify-self-start rounded-full border border-line px-4 py-2 text-sm text-foreground sm:justify-self-end">
              Play
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
