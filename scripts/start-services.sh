#!/bin/sh

set -eu

TAILSCALE_SOCKET="/Users/hzyhhh/.tailscale-userspace/tailscaled.sock"
TAILSCALE_STATE="/Users/hzyhhh/.tailscale-userspace/tailscaled.state"
TAILSCALE_LOG="/tmp/zhuyu-tailscaled.log"
TAILSCALED_BIN="/opt/homebrew/opt/tailscale/bin/tailscaled"

mkdir -p "/Users/hzyhhh/.tailscale-userspace"

echo "Starting Jellyfin..."
if pgrep -f "/Applications/Jellyfin.app/Contents/MacOS/Jellyfin Server" >/dev/null 2>&1; then
  echo "Jellyfin is already running."
else
  open -a Jellyfin
  echo "Jellyfin launch requested."
fi

echo "Starting Tailscale userspace daemon..."
if tailscale --socket="$TAILSCALE_SOCKET" status >/dev/null 2>&1; then
  echo "Tailscale is already running and logged in."
else
  if pgrep -f "$TAILSCALED_BIN" >/dev/null 2>&1; then
    echo "tailscaled process already exists. Reusing it."
  else
    nohup "$TAILSCALED_BIN" \
      --tun=userspace-networking \
      --socket="$TAILSCALE_SOCKET" \
      --state="$TAILSCALE_STATE" \
      --socks5-server=localhost:1055 \
      --outbound-http-proxy-listen=localhost:1056 \
      >"$TAILSCALE_LOG" 2>&1 &
    sleep 2
    echo "tailscaled started in background. Log: $TAILSCALE_LOG"
  fi

  if tailscale --socket="$TAILSCALE_SOCKET" status >/dev/null 2>&1; then
    echo "Tailscale is available."
  else
    echo "Tailscale daemon started, but login may still be required."
    echo "Run: npm run tailscale:login"
  fi
fi

echo "Done."
