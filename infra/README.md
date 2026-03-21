# 基础设施说明

## 推荐路径

如果你当前是在 macOS 开发，建议：

1. 本地直接安装 `Tailscale`
2. 本地直接安装 `Jellyfin`，或者准备一台 Linux/NAS 作为服务器
3. 让 Jellyfin 扫描本仓库下的 `videos` 目录

## Docker 示例

仓库里提供了一个 `docker-compose.linux.yml`，适合 Linux 服务器参考。

注意：

- `network_mode: host` 更适合 Linux
- macOS Docker Desktop 对 host networking 的行为不同，通常不建议照搬
- 真正对外访问时，优先让设备走 Tailscale，不要把 Jellyfin 暴露到公网
