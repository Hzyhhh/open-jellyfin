# Cloudflare Tunnel 子域名配置说明

## 1. 两个子域名怎么分工

- `zhuyu.cion.asia`
  - 前端网页域名
  - 最终建议指向 `Vercel`
  - 如果你还没部署前端，也可以临时让它通过 Tunnel 指向本机 `http://127.0.0.1:3000`

- `zhuyuvedio.cion.asia`
  - Jellyfin 媒体域名
  - 负责把外网请求转发到本机 `http://127.0.0.1:8096`

## 2. 当前最大的真实阻塞点

你现在的域名 `cion.asia` 还没有托管到 Cloudflare。

当前查询结果：

- `cion.asia NS -> gazelle.dnspod.net`
- `cion.asia NS -> star.dnspod.net`

Cloudflare 官方文档要求：

- 想发布 Tunnel 的公网应用，必须有一个 `domain on Cloudflare`

参考：

- <https://developers.cloudflare.com/tunnel/setup/>

所以当前不能直接把 `zhuyu.cion.asia` 和 `zhuyuvedio.cion.asia` 绑定到 Cloudflare Tunnel。

## 3. 推荐实施方案

### 方案 A：正式方案

把 `cion.asia` 的 DNS 托管迁移到 Cloudflare。

迁移完成后：

1. 登录 Cloudflare
2. 添加站点 `cion.asia`
3. 按 Cloudflare 提示把域名 NS 改成 Cloudflare 给你的 nameserver
4. 等 DNS 生效
5. 再执行下面的 Tunnel 配置

### 方案 B：临时验证方案

如果你只是想先验证 Tunnel 是否可行，可以先运行：

```bash
npm run tunnel:quick:jellyfin
```

它会给你一个随机的 `trycloudflare.com` 地址，临时映射到本机 Jellyfin。

网页也一样：

```bash
npm run tunnel:quick:web
```

这只能用于测试，不适合正式使用。

## 4. 正式 Tunnel 配置步骤

当 `cion.asia` 已经切到 Cloudflare 后，按下面执行。

### 4.1 登录 Cloudflare

```bash
npm run tunnel:login
```

这会打开浏览器，授权当前机器管理你的 Cloudflare zone。

### 4.2 创建 Tunnel

```bash
cloudflared tunnel create zhuyu-stack
```

执行后你会得到一个 tunnel id，并在 `~/.cloudflared/` 生成证书与凭据文件。

### 4.3 绑定两个子域名

```bash
cloudflared tunnel route dns zhuyu-stack zhuyu.cion.asia
cloudflared tunnel route dns zhuyu-stack zhuyuvedio.cion.asia
```

### 4.4 写入本机 config

复制：

```bash
cp ./cloudflared/config.example.yml ~/.cloudflared/config.yml
```

然后把：

- `replace-with-your-tunnel-id`
- `credentials-file`

替换成实际值。

最终配置会把：

- `zhuyu.cion.asia -> http://127.0.0.1:3000`
- `zhuyuvedio.cion.asia -> http://127.0.0.1:8096`

## 5. 启动 Tunnel

```bash
npm run tunnel:run
```

## 6. 前端最终如何配置

### 如果前端还在本机开发

可先让：

- `zhuyu.cion.asia -> localhost:3000`
- `zhuyuvedio.cion.asia -> localhost:8096`

### 如果前端部署到 Vercel

推荐改成：

- `zhuyu.cion.asia -> Vercel`
- `zhuyuvedio.cion.asia -> Cloudflare Tunnel -> localhost:8096`

也就是说：

- 前端域名不再走本机 Tunnel
- 只有媒体域名走本地 Jellyfin Tunnel

## 7. 当前项目里已准备好的命令

```bash
npm run tunnel:quick:web
npm run tunnel:quick:jellyfin
npm run tunnel:login
npm run tunnel:create
npm run tunnel:run
```
