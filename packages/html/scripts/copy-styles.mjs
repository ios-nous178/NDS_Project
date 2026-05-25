#!/usr/bin/env node
/**
 * @nudge-eap/react 의 styles.css 를 그대로 가져와 @nudge-eap/html/dist/styles.css 로 노출.
 *
 * 이유: nds-* 클래스 룰의 SSOT 는 packages/react 의 extract-styles 파이프라인이다.
 * <nds-button> 은 그 룰의 매칭 대상이 동일하므로 (DOM 모양이 같음) CSS 도 재사용.
 *
 * 추후 (10개 컴포넌트 완성 후) — extract-styles 를 html 쪽에서 부분 추출하도록
 * 분리할지, 아니면 react 의 css 가 진짜 단일 SSOT 로 굳어질지 결정.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reactCss = path.resolve(__dirname, "../../react/dist/styles.css");
const outCss = path.resolve(__dirname, "../dist/styles.css");

if (!fs.existsSync(reactCss)) {
  console.error(
    `[@nudge-eap/html] @nudge-eap/react styles.css not found at ${reactCss}. ` +
      `Run \`pnpm build --filter @nudge-eap/react\` first.`,
  );
  process.exit(1);
}

fs.mkdirSync(path.dirname(outCss), { recursive: true });
fs.copyFileSync(reactCss, outCss);
const size = (fs.statSync(outCss).size / 1024).toFixed(1);
console.log(`Copied React DS stylesheet → dist/styles.css (${size} KB)`);
