import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiUrl =
    env.API_URL ||
    (mode === "development"
      ? "http://localhost:5000/api"
      : "https://lor-generator-ibc6.onrender.com/api");

  return {
    plugins: [react(), tailwindcss()],

    define: {
      __API_URL__: JSON.stringify(apiUrl.replace(/\/+$/, "")),
    },

    server: {
      host: "0.0.0.0",
      port: 5173,
    },
  };
});
