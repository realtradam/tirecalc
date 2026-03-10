# Docker Development Setup

This guide explains how to run the Bicycle Wheel Circumference app inside a
Docker container with **live reload** — edit files on your host and see changes
instantly in the browser, even from another PC on your network.

---

### Prerequisites

| Tool           | Minimum version | Check with            |
| -------------- | --------------- | --------------------- |
| Docker Engine  | 20.10+          | `docker --version`    |
| Docker Compose | 2.0+ (V2)       | `docker compose version` |

> **Note:** On most modern Docker Desktop / Docker Engine installs the
> `docker compose` (V2) sub-command is included. If you only have the
> legacy `docker-compose` binary, the commands below work the same way —
> just replace `docker compose` with `docker-compose`.

---

### How it works

```
┌──────────────────────────────────────────────────────────┐
│  Host machine                                            │
│                                                          │
│  project root  ──bind-mount──▸  /app (container)         │
│  (your editor)                   │                       │
│                                  ├─ npm install          │
│                                  └─ vite dev (0.0.0.0)   │
│                                       │                  │
│  http://localhost:5173  ◂─────────────┘                  │
│  http://<host-ip>:5173  ◂─── other PCs on LAN            │
└──────────────────────────────────────────────────────────┘
```

* The project directory is **mounted** into the container, so every file
  change on the host is visible inside Docker immediately.
* Vite’s dev server uses **polling** (`usePolling: true`) to detect changes
  on bind-mounted volumes (native filesystem events don’t cross the Docker
  boundary reliably).
* The container uses the official **Node.js 25 Alpine** image, keeping the
  image small and Node pre-installed with no extra tooling.

---

### Quick start

#### 1. Clone the repository

```bash
git clone <repo-url>
cd tirecalc
```

#### 2. Build the Docker image

This pulls the Node.js Alpine base image and copies in the entrypoint
script. You only need to rebuild when the `Dockerfile` itself changes.

```bash
docker compose build
```

#### 3. Start the dev server

```bash
docker compose up
```

The first run will also execute `npm install` inside the container.
Once you see output like:

```
  VITE v7.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://0.0.0.0:5173/
```

the app is ready.

#### 4. Open in your browser

| From where           | URL                              |
| -------------------- | -------------------------------- |
| Same machine         | `http://localhost:5173`           |
| Another PC on LAN    | `http://<host-ip>:5173`          |

> Replace `<host-ip>` with the IP address of the machine running Docker.
> You can find it with `ip addr` (Linux) or `ipconfig` (Windows).

#### 5. Edit files and see live reload

Open any file under `src/` in your editor on the **host** machine. When you
save, Vite’s HMR (Hot Module Replacement) will push the update to every
connected browser tab automatically.

---

### Useful commands

| Action                              | Command                              |
| ----------------------------------- | ------------------------------------ |
| Start in background (detached)      | `docker compose up -d`               |
| View logs while detached            | `docker compose logs -f`             |
| Stop the container                  | `docker compose down`                |
| Rebuild after Dockerfile changes    | `docker compose build`               |
| Rebuild and start in one step       | `docker compose up --build`          |
| Open a shell inside the container   | `docker compose exec dev sh`         |
| Run a one-off npm command           | `docker compose exec dev npm <cmd>`  |
| Remove anonymous volumes (clean)    | `docker compose down -v`             |

---

### Changing the Node.js version

1. Update the `FROM` line in the `Dockerfile` to the desired major version:

   ```dockerfile
   FROM node:25-alpine
   ```

2. Rebuild the image:

   ```bash
   docker compose build --no-cache
   ```

3. Start the container again:

   ```bash
   docker compose up
   ```

> **Tip:** You can pin an exact version (e.g. `node:25.8.0-alpine`) if you
> need a specific patch release.

---

### Troubleshooting

**Hot reload not working?**
Make sure `vite.config.ts` has `server.watch.usePolling` set to `true`.
This is already configured in the repo. If you still see stale content, try
a hard-refresh (`Ctrl-Shift-R`) or restart the container.

**Port 5173 already in use?**
Either stop the process occupying the port, or change the mapping in
`docker-compose.yml`:

```yaml
ports:
  - "3000:5173"   # host:container
```

Then access the app at `http://localhost:3000`.

**Permission errors on node_modules?**
The container runs as root by default. If your host user doesn’t match,
you can run `docker compose down -v` to remove the anonymous
`node_modules` volume and let it be recreated.

**Cannot access from another PC on the network?**
Verify that no firewall on the Docker host is blocking port 5173. On Linux
you can temporarily open it with:

```bash
sudo ufw allow 5173/tcp
```

