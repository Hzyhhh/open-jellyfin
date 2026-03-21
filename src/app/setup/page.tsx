import Link from "next/link";

const steps = [
  {
    title: "1. 把电视剧资源放进 videos 目录",
    body: "每个一级文件夹代表一部剧，文件名建议带上 S01E01 或 第01集，这样前端能更稳定地解析顺序。",
  },
  {
    title: "2. 本地开发先用 local 模式",
    body: "复制 .env.example 为 .env.local，并把 NEXT_PUBLIC_CONTENT_SOURCE 保持为 local。这样网站会直接读取项目目录里的视频资源。",
  },
  {
    title: "3. Jellyfin 扫描同一个 videos 目录",
    body: "后续安装 Jellyfin 时，把项目里的 videos 目录挂载进去，让 Jellyfin 和这个网站共用一套资源。",
  },
  {
    title: "4. Tailscale 负责私有访问链路",
    body: "让运行 Jellyfin 的设备和手机/平板/电视加入同一个 tailnet。网页和 Jellyfin 都不要直接暴露到公网。",
  },
  {
    title: "5. 切换到 jellyfin 模式",
    body: "在 .env.local 里填上 JELLYFIN_BASE_URL、JELLYFIN_API_KEY、JELLYFIN_USER_ID，并把 NEXT_PUBLIC_CONTENT_SOURCE 改成 jellyfin。",
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
          Jellyfin + Tailscale 接入说明
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
          当前仓库已经具备两种资源模式：直接读取本地
          <code className="font-mono"> videos </code>
          目录，或者读取 Jellyfin 片库。推荐先用本地模式联调页面，再把同一个目录挂到
          Jellyfin 上，并通过 Tailscale 做私有访问。
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
{`videos/
  三体/
    S01E01.mp4
    S01E02.mp4
  繁花/
    第01集.mp4
    第02集.mp4`}
          </pre>
        </article>

        <article className="panel rounded-[1.5rem] p-5">
          <h2 className="text-xl font-semibold text-foreground">环境变量</h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#111111] p-4 font-mono text-sm text-white">
{`NEXT_PUBLIC_CONTENT_SOURCE=local
JELLYFIN_BASE_URL=http://100.x.x.x:8096
JELLYFIN_API_KEY=your_api_key
JELLYFIN_USER_ID=your_user_id`}
          </pre>
        </article>
      </section>
    </main>
  );
}
