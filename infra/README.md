# 基础设施说明

当前项目已经切换为本地视频直出方案。

核心链路：

1. 本地 Next.js 读取 `/Volumes/2T/zhuyu`
2. 通过 `/api/local-video/...` 提供 Range 视频流
3. 需要临时公网访问时，再用 `cloudflared` 暴露本地网页

仓库里的 `docker-compose.linux.yml` 可以继续保留作历史参考，但不再是当前主链路。
