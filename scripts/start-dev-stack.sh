#!/bin/sh

set -eu

sh ./scripts/start-services.sh

echo "Starting Next.js dev server..."
exec npm run dev
