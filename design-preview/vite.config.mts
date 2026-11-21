import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
const directory = fileURLToPath(new URL(".", import.meta.url));
export default defineConfig({
  root: directory,
  publicDir: false,
  server: { host: "127.0.0.1", port: 4173, strictPort: true, fs: { allow: [fileURLToPath(new URL("..", import.meta.url))] } },
  esbuild: { jsx: "automatic" },
});
