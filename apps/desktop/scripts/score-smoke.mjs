#!/usr/bin/env node
/**
 * 독립 LLM scorer(D2) 스모크 — PATH 의 claude 로 샘플/지정 HTML 을 실제 채점한다.
 *
 *   node apps/desktop/scripts/score-smoke.mjs [path/to/mockup.html]
 *
 * 환경변수: CLAUDE_BIN(기본 PATH 의 'claude') · BRAND · SURFACE.
 * 실제 모델을 호출하므로 토큰을 쓴다. 앱(electron) 없이 scorer.ts 만 type-strip 로 로드.
 */
import { readFileSync } from "node:fs";
import { scoreMockupQuality } from "../src/main/scorer.ts";

const file = process.argv[2];
const html = file
  ? readFileSync(file, "utf8")
  : `<main class="mockup-screen">
       <h1>로그인</h1>
       <form>
         <label>이메일<nds-input type="email"></nds-input></label>
         <nds-button color="primary">로그인</nds-button>
       </form>
     </main>`;

console.error(`[score-smoke] scoring ${file ?? "(inline sample)"} … (실제 claude 호출)`);
const res = await scoreMockupQuality({
  html,
  brand: process.env.BRAND,
  surface: process.env.SURFACE,
  bin: process.env.CLAUDE_BIN ?? "claude",
  env: process.env,
  timeoutMs: 120_000,
});
console.log(JSON.stringify(res, null, 2));
process.exit(res.ok ? 0 : 1);
