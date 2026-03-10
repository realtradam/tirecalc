# --------------------------------------------------------------------------
# Dockerfile — Development image for the Bicycle Wheel Circumference app.
#
# Key concepts:
#   • Uses the official Node.js Alpine image, which ships with Node and npm
#     pre-installed — no version manager needed.
#   • Alpine Linux produces a very small image (~50 MB base layer).
#   • The working directory is /app, which will be bind-mounted at runtime
#     so edits on the host are immediately visible inside the container.
#   • The entrypoint script installs npm deps (if needed) and starts the
#     Vite dev server, which serves on 0.0.0.0 so it is LAN-accessible.
# --------------------------------------------------------------------------

# --- Base image ---
# The official Node.js Alpine image bundles Node 25.x and npm.
# Alpine keeps the image footprint minimal.
FROM node:25-alpine

# --- Working directory ---
# At runtime the project root is bind-mounted here, so the source code
# inside the container always mirrors the host filesystem.
WORKDIR /app

# --- Entrypoint ---
# A small script that:
#   1. Installs npm dependencies (handles first run or new packages).
#   2. Starts the Vite dev server bound to 0.0.0.0:5173.
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["docker-entrypoint.sh"]
