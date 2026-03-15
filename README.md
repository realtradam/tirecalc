# Bicycle Wheel Circumference

A small learning app (React + TypeScript + Vite) to measure bicycle wheel circumference by rolling the wheel or by entering diameter. This project is a port of the tire size calculator that once lived on the Cateye website but was removed. It was reimplemented here for usefulness and learning.

## Tech

React · TypeScript · Vite · TailwindCSS · DaisyUI · Docker · Nginx

---

## Development (Docker)

```bash
docker compose build
docker compose up -d
```

Served on port 5173 — open http://localhost:5173

See [docker_readme.md](docker_readme.md) for the full development Docker guide.

---

## Production Static Build (Docker)

The production setup uses a **multi-stage Docker build**:

1. **Build stage** — Installs dependencies and runs `npm run build` to produce static assets in `dist/`.
2. **Production stage** — Copies the built assets into an Nginx Alpine image that serves them on port 80.

### Build and run locally

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Then open http://localhost:80.

> **Note:** The `ports` mapping in `docker-compose.prod.yml` is commented out by default (intended for Dokploy/Traefik). Uncomment the `ports` line for local testing:
>
> ```yaml
> ports:
>   - "80:80"
> ```

### Files involved

| File                      | Purpose                                                  |
| ------------------------- | -------------------------------------------------------- |
| `Dockerfile.prod`         | Multi-stage build: Node (build) → Nginx (serve)          |
| `docker-compose.prod.yml` | Production compose file (single `web` service)           |
| `nginx.conf`              | Nginx config with SPA fallback routing and gzip          |

---

## Deploying to Dokploy

Dokploy is a self-hosted PaaS that uses Traefik as a reverse proxy. The production compose file is ready for Dokploy out of the box.

### Prerequisites

- A VPS with [Dokploy installed](https://docs.dokploy.com/get-started/installation)
- A domain name with a DNS **A record** pointing to your server's IP
- Your GitHub repository connected to Dokploy (see below)

### Step 1 — Connect GitHub to Dokploy

1. Log in to the Dokploy dashboard (`http://<your-server-ip>:3000`).
2. Go to **Settings → Git Providers**.
3. Click **"+ Add Git Provider"** and follow the prompts to create a **GitHub App**.
4. After creation, click **"Install"** next to the provider and grant access to this repository (or all repositories).

### Step 2 — Create a Project

1. Go to **Dashboard → Projects**.
2. Click **"+ Create Project"**, give it a name (e.g. "Tire Calculator"), and click **"Create"**.

### Step 3 — Create a Compose Service

1. Inside the project, click **"+ Create Service"** → **"Compose"**.
2. Fill in:
   - **Name**: e.g. "tirecalc"
   - **Compose Type**: `docker-compose` (default)
3. Click **"Create"**.

### Step 4 — Configure the Source

1. On the compose page, set the source to **"GitHub"**.
2. Select your **GitHub Provider**, **Repository**, and **Branch** (e.g. `main`).
3. Set **Compose Path** to:
   ```
   ./docker-compose.prod.yml
   ```
4. Click **"Save"**.

### Step 5 — Add a Domain

1. Go to the **"Domains"** tab.
2. Click **"+ Add Domain"** and fill in:
   - **Host**: your domain (e.g. `tirecalc.example.com`)
   - **Service Name**: `web` (must match the service name in `docker-compose.prod.yml`)
   - **Port**: `80`
   - **HTTPS**: toggle **on**
   - **Certificate Type**: `letsencrypt`
3. Click **"Save"**.

> Make sure your DNS A record is already pointing to the server. Let's Encrypt needs this to issue a certificate.

### Step 6 — Deploy

1. Click the **"Deploy"** button.
2. Monitor progress in the **"Deployments"** tab.
3. Once the status shows **"Done" ✅**, the app is live at your domain.

### Step 7 — Enable Auto-Deploy (optional)

Auto-deploy is enabled by default when using the GitHub App integration. Every push to the configured branch will trigger a new deployment automatically.

If you prefer manual webhook control:

1. Find the **webhook URL** in the compose settings:
   ```
   https://<your-dokploy-host>/api/deploy/compose/<refreshToken>
   ```
2. In your GitHub repo, go to **Settings → Webhooks → Add webhook**.
3. Set:
   - **Payload URL**: the webhook URL above
   - **Content type**: `application/json`
   - **Events**: "Just the push event"
4. Click **"Add webhook"**.

### Troubleshooting

| Problem | Likely cause | Fix |
| --- | --- | --- |
| 502 Bad Gateway | Container not running or wrong port | Check deployment logs; verify domain port is `80` and service name is `web` |
| Site not loading | DNS not configured | Add an A record pointing your domain to the server IP |
| SSL error | DNS not propagated yet | Wait a few minutes for propagation; check Traefik logs |
| Build fails | Missing dependencies or TypeScript errors | Check deployment logs for build output; run `npm run build` locally to reproduce |
| Stale content after deploy | Browser cache | Hard-refresh (`Ctrl-Shift-R`); Vite hashes asset filenames so this is rare |
