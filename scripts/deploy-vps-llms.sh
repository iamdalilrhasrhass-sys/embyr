#!/usr/bin/env bash
set -euo pipefail

VPS_HOST="${VPS_HOST:-root@72.62.187.63}"
REMOTE_APP_DIR="${REMOTE_APP_DIR:-/root/embir}"
REMOTE_BRANCH="${REMOTE_BRANCH:-feat/recover-logo}"
PM2_APP="${PM2_APP:-embyr-web}"
EXPECTED_COMMIT="${EXPECTED_COMMIT:-}"

ssh "$VPS_HOST" bash -s <<EOF
set -euo pipefail

if [ ! -d "$REMOTE_APP_DIR" ]; then
  if [ -d "/root/embyr" ]; then
    cd /root/embyr
  else
    echo "Cannot find /root/embir or /root/embyr" >&2
    exit 1
  fi
else
  cd "$REMOTE_APP_DIR"
fi

git fetch origin
git switch "$REMOTE_BRANCH" || git switch master
git pull --ff-only origin "\$(git branch --show-current)"

if [ -n "$EXPECTED_COMMIT" ] && ! git rev-parse --verify --quiet "$EXPECTED_COMMIT" >/dev/null; then
  echo "Expected commit $EXPECTED_COMMIT is not present after pull" >&2
  exit 1
fi

if [ ! -f public/llms.txt ] || [ ! -f src/app/llms.txt/route.ts ]; then
  echo "llms.txt assets missing after pull" >&2
  exit 1
fi

npm run build
pm2 restart "$PM2_APP" || pm2 restart embir-web
sleep 3
curl -fsS http://127.0.0.1:3100/llms.txt | sed -n '1,40p'
curl -fsS http://127.0.0.1:3100/sitemap.xml >/dev/null
curl -fsS http://127.0.0.1:3100/fr/tinder-vs-embir >/dev/null
EOF
