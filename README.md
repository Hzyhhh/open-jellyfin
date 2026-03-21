# Zhuyu Video

一个基于 `Next.js` 和 `Cloudflare R2` 的视频站点原型。

## 当前已经实现

- 本地视频目录默认从 `/Volumes/2T/zhuyu` 读取用于上传
- 首页自动扫描 Cloudflare R2 中的视频对象
- 首页内直接播放视频
- R2 视频流式播放接口

## 开发启动

1. 安装依赖
2. 复制 `.env.example` 为 `.env.local`
3. 确认 `LOCAL_VIDEO_ROOT=/Volumes/2T/zhuyu`
4. 在 `.env.local` 中填写 R2 凭证并设置 `STORAGE_SOURCE=r2`
5. 往 `/Volumes/2T/zhuyu` 目录里放视频资源
6. 先执行 `npm run r2:upload`
7. 再运行 `npm run dev`

## 本地视频目录格式

```text
/Volumes/2T/zhuyu/
  30.MP4
  31.MP4
  32.MP4
  ...
  40.MP4
```

## Cloudflare R2 接入

当前项目统一从 Cloudflare R2 读取视频。需要在 `.env.local` 中提供：

```bash
STORAGE_SOURCE=r2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET=your_bucket_name
R2_PREFIX=
```

当前项目会：

- 用 R2 的 S3 兼容接口列出对象
- 自动把对象映射成剧集列表
- 通过 `/api/r2-video/...` 代理并支持 `Range` 播放

上传本地视频到 R2：

```bash
npm run r2:upload
```

脚本会从 `LOCAL_VIDEO_ROOT` 指向的目录读取视频文件，并用 R2 的 S3 兼容接口进行分片上传。上传完成后，本地和 Vercel 都可以复用同一套 R2 配置直接播放。

R2 官方文档：

- S3 API 兼容：<https://developers.cloudflare.com/r2/api/s3/api/>
- Public buckets：<https://developers.cloudflare.com/r2/data-access/public-buckets/>
- Custom domains：<https://developers.cloudflare.com/r2/data-access/public-buckets/custom-domains/>
