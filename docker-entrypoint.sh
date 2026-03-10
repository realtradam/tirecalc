#!/bin/sh
# --------------------------------------------------------------------------
# docker-entrypoint.sh — Runs inside the container on every start.
#
# Purpose:
#   1. Install / update npm dependencies so newly added packages are picked
#      up without rebuilding the image.
#   2. Start the Vite dev server on all interfaces (0.0.0.0) so the app
#      is reachable from the host machine and other PCs on the LAN.
#
# Note: Alpine ships with /bin/sh (BusyBox ash), not bash.
# --------------------------------------------------------------------------
set -eu

echo "==> Installing npm dependencies …"
npm install

echo "==> Starting Vite dev server (listening on 0.0.0.0:5173) …"
exec npx vite --host 0.0.0.0 --port 5173
