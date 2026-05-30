import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    // mockup-core 는 ESM-only 이고 packaged 빌드에서 node_modules 동봉을 피하려
    // main 번들에 인라인한다(cheerio/@babel 도 transitive 로 함께 번들). 나머지
    // (electron, node built-ins)는 외부화.
    plugins: [externalizeDepsPlugin({ exclude: ["@nudge-design/mockup-core"] })],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    plugins: [react()],
  },
});
