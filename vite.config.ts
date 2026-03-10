import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // --- Dev-server settings (important for Docker) ---
  server: {
    // Bind to all interfaces so the app is reachable from outside the
    // container (other PCs on the LAN, or the Docker host itself).
    host: true,

    // Allow specific hostnames (useful when accessing the dev server via
    // a machine name on the LAN such as "arch-razer").
    // Vite's `host: true` already binds to all interfaces; this explicit
    // whitelist helps documentation and tooling that may inspect the config.
    allowedHosts: ['arch-razer', 'tirecalc.malcz.com'],

    // Explicitly set the port (must match the EXPOSE in Dockerfile).
    port: 5173,

    // Use polling for file-change detection. Filesystem events (inotify)
    // do not propagate reliably across Docker bind-mounts, so Vite/
    // chokidar must fall back to polling. The interval (in ms) controls
    // how frequently it checks — 100 ms is a good balance between
    // responsiveness and CPU usage.
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
})
