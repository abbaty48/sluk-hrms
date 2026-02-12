import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
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
        target: "http://localhost:3000",
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  resolve: {
    alias: {
      "@sluk": path.resolve(__dirname, "./"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
