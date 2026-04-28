import { defineConfig, loadEnv } from "vite"; // Import loadEnv
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all envs regardless of the VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = new URL(env.API || "http://localhost:3000/api/v1");

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
      tailwindcss(),
    ],
    server: {
      host: true,
      strictPort: true,
      allowedHosts: ["sluk-hrms.onrender.com"],
      port: process.env.PORT ? Number(process.env.PORT) : 3500,
      proxy: {
        "/api": {
          secure: false,
          changeOrigin: true,
          target: apiTarget.origin,
          rewrite: (path) => path.replace(/^\/api/, apiTarget.pathname),
        },
      },
    },
    resolve: {
      alias: {
        "@sluk": path.resolve(__dirname, "./"),
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
