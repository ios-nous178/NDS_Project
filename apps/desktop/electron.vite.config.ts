import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    // 일반 deps 는 외부화하되, workspace @nudge-design/* 패키지는 main 번들에 인라인한다.
    // electron-builder 가 pnpm workspace symlink 를 따라가면 apps/desktop 밖
    // packages/* 파일(.turbo, dist/*.map 등)을 asar 대상으로 잡아 패키징이 깨진다.
    plugins: [
      externalizeDepsPlugin({
        exclude: [
          "@nudge-design/mockup-core",
          "@nudge-design/html",
          "@nudge-design/assets",
          "@nudge-design/icons",
          "@nudge-design/styles",
          "@nudge-design/tokens",
        ],
      }),
    ],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    plugins: [react()],
  },
});
