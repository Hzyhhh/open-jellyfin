type HeroProps = {
  totalSeries: number;
  totalEpisodes: number;
  sourceLabel: string;
};

export function Hero({ totalSeries, totalEpisodes, sourceLabel }: HeroProps) {
  return (
    <section className="grain panel relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-12">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute bottom-0 left-8 h-24 w-24 rounded-full bg-hero blur-2xl" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-5">
          <p className="pill inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.24em]">
            private screening stack
          </p>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              你的电视剧资源先落在本地目录，再逐步切换到 Jellyfin 私有媒体库。
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
              当前网站已经支持从项目里的 <code className="font-mono">videos</code>{" "}
              目录直接读取资源。等 Jellyfin 和 Tailscale 跑起来后，只需要改环境变量，
              前端就可以切换到私有媒体服务模式。
            </p>
          </div>
        </div>
        <div className="grid min-w-[280px] grid-cols-2 gap-4 text-sm">
          <Metric label="当前片库来源" value={sourceLabel} />
          <Metric label="电视剧数量" value={`${totalSeries}`} />
          <Metric label="总集数" value={`${totalEpisodes}`} />
          <Metric label="推荐投屏路径" value="电视端直连" />
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-line bg-surface-strong p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
