import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [react()],
    server: {
      port: 3001,
      proxy: isProduction
        ? undefined
        : {
            "/api": {
              target: "http://127.0.0.1:5000",
              changeOrigin: true,
            },
          },
    },
  };
});
