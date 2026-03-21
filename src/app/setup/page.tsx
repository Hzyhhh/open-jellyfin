import Link from "next/link";

const steps = [
  {
    title: "1. 把电视剧资源放进 /Volumes/2T/zhuyu",
    body: "当前规则支持根目录直接平铺 MP4 文件，例如 30.MP4 到 40.MP4，不需要额外子文件夹。",
  },
  {
    title: "2. 本地开发先用 local 模式",
    body: "复制 .env.example 为 .env.local，并把 LOCAL_VIDEO_ROOT 保持为 /Volumes/2T/zhuyu。这样网站会直接读取这块 2T 磁盘里的视频资源。",
  },
  {
    title: "3. 本地网页服务启动后直接播放",
    body: "运行 npm run dev 后，网页里的每个视频卡片会直接走 /api/local-video/... 接口，不再依赖 Jellyfin。",
  },
  {
    title: "4. 临时公网访问走网页 Quick Tunnel",
    body: "如果你想临时从公网访问这套站点，直接运行 npm run tunnel:quick:web，让 cloudflared 把本地 Next.js 服务暴露成一个 trycloudflare.com 地址。",
  },
  {
    title: "5. Vercel 只适合作为前端演示",
    body: "Vercel 无法直接读取你本机 /Volumes/2T/zhuyu 里的视频文件，所以真正的视频播放链路仍然应该跑在本地网页服务上。",
  },
];

export default function SetupPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <Link href="/" className="text-sm text-muted underline-offset-4 hover:underline">
          Back to library
        </Link>
        <h1 className="mt-5 text-4xl font-semibold text-foreground">
          本地直出方案说明
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
          当前仓库会直接读取本地
          <code className="font-mono"> /Volumes/2T/zhuyu </code>
          目录，并通过 <code className="font-mono">/api/local-video</code> 提供视频流。这样链路更短，适合先验证网页直出是否比 Jellyfin 更快。
        </p>
      </section>

      <section className="grid gap-4">
        {steps.map((step) => (
          <article key={step.title} className="panel rounded-[1.5rem] p-5">
            <h2 className="text-xl font-semibold text-foreground">{step.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{step.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="panel rounded-[1.5rem] p-5">
          <h2 className="text-xl font-semibold text-foreground">资源目录约定</h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#111111] p-4 font-mono text-sm text-white">
{`/Volumes/2T/zhuyu/
  30.MP4
  31.MP4
  32.MP4
  ...
  40.MP4`}
          </pre>
        </article>

        <article className="panel rounded-[1.5rem] p-5">
          <h2 className="text-xl font-semibold text-foreground">环境变量</h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#111111] p-4 font-mono text-sm text-white">
{`LOCAL_VIDEO_ROOT=/Volumes/2T/zhuyu
`}
          </pre>
        </article>
      </section>
    </main>
  );
}
