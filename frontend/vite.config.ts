import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig(({ command }) => ({
  plugins: [react(), viteSingleFile(), tailwindcss()],

  // ビルド(npm run build)ではwindowのgoogleを使用、テスト(npm run dev)はモックを使用
  resolve: {
    alias: [
      {
        find: "@/mocks/googleMock",
        replacement:
          command === "build"
            ? "data:text/javascript,export const google = window.google;"
            : path.resolve(__dirname, "./src/mocks/googleMock.ts"),
      },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
}));
