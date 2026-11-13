import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/user": "http://localhost:8081",
      "/api": "http://localhost:8081",
      "/photosOfUser": "http://localhost:8081",
      "/commentsOfUser": "http://localhost:8081",
      "/images": "http://localhost:8081",
    },
  },
});
