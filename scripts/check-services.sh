#!/bin/sh

set -eu

echo "Jellyfin:"
if lsof -nP -iTCP:8096 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "  OK - listening on 8096"
else
  echo "  FAIL - not listening on 8096"
fi

echo "Tailscale:"
if pgrep -af tailscaled >/dev/null 2>&1; then
  echo "  OK - tailscaled process is running"
else
  echo "  FAIL - tailscaled process not found"
fi

echo "Next.js:"
if lsof -nP -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "  OK - listening on 3000"
else
  echo "  INFO - dev server not running on 3000"
fi
