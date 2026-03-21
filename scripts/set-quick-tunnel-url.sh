#!/bin/sh

set -eu

if [ "${1:-}" = "" ]; then
  echo "Usage: npm run quick-url:set -- https://your-random.trycloudflare.com"
  exit 1
fi

URL="$(printf "%s" "$1" | sed 's:/*$::')"
ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

TMP_FILE="$(mktemp)"

awk -v url="$URL" '
  BEGIN { found = 0 }
  /^NEXT_PUBLIC_JELLYFIN_PUBLIC_URL=/ {
    print "NEXT_PUBLIC_JELLYFIN_PUBLIC_URL=" url
    found = 1
    next
  }
  { print }
  END {
    if (found == 0) {
      print "NEXT_PUBLIC_JELLYFIN_PUBLIC_URL=" url
    }
  }
' "$ENV_FILE" > "$TMP_FILE"

mv "$TMP_FILE" "$ENV_FILE"

echo "Updated NEXT_PUBLIC_JELLYFIN_PUBLIC_URL in $ENV_FILE"
echo "Current value: $URL"
