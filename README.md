# Zhuyu Video

一个基于 `Next.js + Jellyfin + Tailscale` 的私有视频站点原型。

## 当前已经实现

- 项目内新增 `videos` 目录作为本地视频源
- 首页自动扫描电视剧目录
- 剧集详情页和网页内播放器
- `local` / `jellyfin` 两种内容源模式切换
- 本地视频流式播放接口
- Jellyfin 与 Tailscale 的接入约定

## 开发启动

1. 安装依赖
2. 复制 `.env.example` 为 `.env.local`
3. 确认 `NEXT_PUBLIC_CONTENT_SOURCE=local`
4. 往 `videos` 目录里放电视剧资源
5. 运行 `npm run dev`

## 一键启动本地栈

如果你重启过电脑，想一次性拉起 `Jellyfin`、`Tailscale userspace` 和前端开发服务器，直接运行：

```bash
npm run dev:stack
```

只启动 `Jellyfin + Tailscale`：

```bash
npm run services:start
```

查看 Tailscale 状态：

```bash
npm run tailscale:status
```

如果 Tailscale 提示未登录：

```bash
npm run tailscale:login
```

## videos 目录格式

```text
videos/
  三体/
    S01E01.mp4
    S01E02.mp4
  繁花/
    第01集.mp4
```

## 切换到 Jellyfin

当 Jellyfin 已经扫描同一个 `videos` 目录后：

1. 生成 Jellyfin API Key
2. 获取 Jellyfin 用户 ID
3. 修改 `.env.local`

```bash
NEXT_PUBLIC_CONTENT_SOURCE=jellyfin
JELLYFIN_BASE_URL=http://100.x.x.x:8096
JELLYFIN_API_KEY=your_api_key
JELLYFIN_USER_ID=your_user_id
```

## Quick Tunnel 临时公网访问

如果你不迁移 DNS，又想临时从公网访问本机 Jellyfin，可以使用：

```bash
npm run tunnel:quick:jellyfin
```

这个命令默认走 `http2`。

终端会输出一个随机地址，例如：

```text
https://xxxxx.trycloudflare.com
```

这个地址可以直接访问：

```text
https://xxxxx.trycloudflare.com/web/
```

如果你想让前端项目记录当前这条临时媒体地址，执行：

```bash
npm run quick-url:set -- https://xxxxx.trycloudflare.com
```

注意：

- Quick Tunnel 地址是随机的
- 终端进程一停，地址就失效
- 它适合测试和临时访问，不适合正式长期上线

## Tailscale 建议

- 运行 Jellyfin 的设备安装 Tailscale
- 观看设备安装 Tailscale
- 所有设备加入同一 tailnet
- 前端和 Jellyfin 都只在私有网络里访问
