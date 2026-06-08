import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { quizScorePlugin } from "./scripts/vite-quiz-score-plugin.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export default defineConfig({
  plugins: [react(), quizScorePlugin(repoRoot)],
  server: {
    port: 5173,
  },
});

