import Link from "next/link";
import { Hero } from "@/components/hero";
import { SeriesCard } from "@/components/series-card";
import { contentSource } from "@/lib/config";
import { getSeriesList } from "@/lib/library";

export default async function Home() {
  const seriesList = await getSeriesList();
  const totalEpisodes = seriesList.reduce(
    (sum, series) => sum + series.episodeCount,
    0,
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <Hero
        totalSeries={seriesList.length}
        totalEpisodes={totalEpisodes}
        sourceLabel={contentSource === "jellyfin" ? "Jellyfin" : "Local Folder"}
      />

      <section className="grid gap-4 rounded-[2rem] border border-line bg-surface/60 p-5 sm:grid-cols-3">
        <InfoCard
          title="视频目录"
          value="/videos"
          description="每个一级文件夹视为一部电视剧，文件名会自动解析为集数。"
        />
        <InfoCard
          title="当前模式"
          value={contentSource}
          description="默认是 local。配置 Jellyfin 环境变量后可切换到 jellyfin。"
        />
        <InfoCard
          title="私有访问"
          value="Tailscale"
          description="建议让服务器和观看设备加入同一 tailnet，不直接暴露公网端口。"
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">Series</p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">正在接入的网站片库</h2>
          </div>
          <Link
            href="/setup"
            className="rounded-full border border-line px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-strong"
          >
            查看部署说明
          </Link>
        </div>

        {seriesList.length === 0 ? (
          <div className="panel rounded-[2rem] p-8 text-sm leading-7 text-muted">
            当前还没有检测到电视剧资源。先在 <code className="font-mono">videos</code>{" "}
            目录中新增一个剧集文件夹，例如
            <code className="font-mono"> videos/三体/S01E01.mp4</code>，刷新后这里就会显示。
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {seriesList.map((series) => (
              <SeriesCard key={series.id} series={series} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function InfoCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-line bg-surface-strong p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{title}</p>
      <p className="mt-3 font-mono text-lg text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
