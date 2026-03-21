import Link from "next/link";

const steps = [
  {
    title: "1. 本地视频先放在 /Volumes/2T/zhuyu",
    body: "上传脚本会从这块 2T 磁盘读取 MP4 文件，并按当前文件名上传到 Cloudflare R2。",
  },
  {
    title: "2. 在 .env.local 中填好 R2 凭证",
    body: "把 STORAGE_SOURCE 设为 r2，并填写 R2_ACCOUNT_ID、R2_ACCESS_KEY_ID、R2_SECRET_ACCESS_KEY、R2_BUCKET。当前 bucket 名称是 zhuyu-video。",
  },
  {
    title: "3. 运行 npm run r2:upload 上传视频",
    body: "脚本会使用 R2 的 S3 兼容接口分片上传大视频文件，适合当前 1GB 以上的 MP4 资源。",
  },
  {
    title: "4. 启动站点后直接从 R2 播放",
    body: "运行 npm run dev 后，页面会通过 /api/r2-video/... 读取 Cloudflare R2 中的对象，不再依赖本地磁盘或临时隧道。",
  },
  {
    title: "5. Vercel 线上部署也走同一套 R2 配置",
    body: "把同样的 R2 环境变量同步到 Vercel 后，线上页面也能从同一个 bucket 中读取视频内容。",
  },
  {
    title: "6. 后续可再绑定自定义域名或公有访问",
    body: "当前项目先通过服务端 R2 代理读取对象，后面如果需要更轻的静态分发，再决定是否为 bucket 增加公共域名。",
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
          Cloudflare R2 方案说明
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
          当前仓库会把本地
          <code className="font-mono"> /Volumes/2T/zhuyu </code>
          中的视频先上传到 Cloudflare R2，再通过
          <code className="font-mono"> /api/r2-video </code>
          提供统一的视频流入口。
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
STORAGE_SOURCE=r2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=zhuyu-video
R2_PREFIX=
`}
          </pre>
        </article>
      </section>
    </main>
  );
}
