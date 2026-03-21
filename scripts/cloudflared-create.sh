#!/bin/sh

set -eu

echo "Before creating a named tunnel:"
echo "1. Move cion.asia DNS hosting to Cloudflare, or use a Cloudflare-managed zone."
echo "2. Run: npm run tunnel:login"
echo "3. Then create the tunnel manually:"
echo "   cloudflared tunnel create zhuyu-stack"
echo "4. Route hostnames:"
echo "   cloudflared tunnel route dns zhuyu-stack zhuyu.cion.asia"
echo "   cloudflared tunnel route dns zhuyu-stack zhuyuvedio.cion.asia"
echo "5. Copy cloudflared/config.example.yml to ~/.cloudflared/config.yml and fill tunnel id."
