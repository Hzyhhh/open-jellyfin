import { notFound } from "next/navigation";
import { PlayerShell } from "@/components/player-shell";
import { getSeriesBySlug } from "@/lib/library";

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string; episodeSlug: string }>;
}) {
  const { slug, episodeSlug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  const episode = series.episodes.find((item) => item.slug === episodeSlug);

  if (!episode) {
    notFound();
  }

  return <PlayerShell series={series} episode={episode} />;
}
