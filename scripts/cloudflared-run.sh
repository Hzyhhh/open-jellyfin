#!/bin/sh

set -eu

CONFIG_PATH="${HOME}/.cloudflared/config.yml"

if [ ! -f "$CONFIG_PATH" ]; then
  echo "Missing $CONFIG_PATH"
  echo "Copy ./cloudflared/config.example.yml to ~/.cloudflared/config.yml and fill the tunnel id first."
  exit 1
fi

exec cloudflared tunnel --config "$CONFIG_PATH" run
