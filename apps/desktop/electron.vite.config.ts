import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    // mockup-core 를 비롯한 deps 전부 외부화한다. main 은 ESM 이라 ESM-only 인
    // mockup-core 를 그대로 import 하면 되고(인터롭 OK), 외부화해야 cheerio→undici
    // 의 동적 import 가 동적으로 남는다. 번들에 인라인하면 electron-vite 의
    // inlineDynamicImports 가 undici 의 `import "node:sqlite"` 를 시작 시점에 정적
    // 링크해 Electron 의 Node(=node:sqlite 미존재)에서 크래시한다.
    // (packaged 동봉은 Phase 4 에서 electron-builder files 로 처리.)
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    plugins: [react()],
  },
});
