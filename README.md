# Zhuyu Video

一个基于 `Next.js` 的本地视频直出站点原型。

## 当前已经实现

- 本地视频目录默认读取 `/Volumes/2T/zhuyu`
- 首页自动扫描本地视频文件
- 剧集详情页和网页内播放器
- 本地视频流式播放接口

## 开发启动

1. 安装依赖
2. 复制 `.env.example` 为 `.env.local`
3. 确认 `LOCAL_VIDEO_ROOT=/Volumes/2T/zhuyu`
4. 往 `/Volumes/2T/zhuyu` 目录里放视频资源
5. 运行 `npm run dev`

## 本地视频目录格式

```text
/Volumes/2T/zhuyu/
  30.MP4
  31.MP4
  32.MP4
  ...
  40.MP4
```

## Quick Tunnel 临时公网访问

如果你不迁移 DNS，又想临时从公网访问本机网页，可以使用：

```bash
npm run tunnel:quick:web
```

这个命令默认走 `http2`。

终端会输出一个随机地址，例如：

```text
https://xxxxx.trycloudflare.com
```

这个地址可以直接访问首页：

```text
https://xxxxx.trycloudflare.com
```

注意：

- Quick Tunnel 地址是随机的
- 终端进程一停，地址就失效
- 它适合测试和临时访问，不适合正式长期上线

## Vercel 说明

Vercel 适合部署页面代码，但它无法直接读取你本机
`/Volumes/2T/zhuyu` 里的视频文件。

如果你要验证真正的本地直出速度，应该：

1. 本地运行 `npm run dev`
2. 再运行 `npm run tunnel:quick:web`
3. 通过生成的 `trycloudflare.com` 地址访问

这才是“本地视频 -> 本地 Next.js -> 临时域名”的真实链路。
