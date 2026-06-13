#!/usr/bin/env node
/**
 * nds-migrate — React→Nudge DS 코드모드 CLI (PoC).
 * 사용: nds-migrate <file.tsx ...>  — 인식된 패턴만 결정적으로 교체, 나머지는 그대로 둔다.
 * transform 을 순서대로 적용(button → input → badge). Modal 등 compound·앱별 차이가 큰 것은
 * codemod 대상이 아님(사람/LLM 몫).
 */
import { readFileSync, writeFileSync } from "node:fs";
import jscodeshift from "jscodeshift";
import type { Transform } from "jscodeshift";
import buttonT, { parser } from "./transforms/button.js";
import inputT from "./transforms/input.js";
import badgeT from "./transforms/badge.js";

const TRANSFORMS: Transform[] = [buttonT, inputT, badgeT];

const files = process.argv.slice(2).filter((a) => !a.startsWith("-"));
if (files.length === 0) {
  console.log("usage: nds-migrate <file.tsx ...>   (PoC: button·input·badge)");
  process.exit(0);
}

const j = jscodeshift.withParser(parser);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = { jscodeshift: j, j, stats: () => {}, report: () => {} } as any;

let changed = 0;
for (const file of files) {
  let src = readFileSync(file, "utf8");
  let touched = false;
  for (const t of TRANSFORMS) {
    const out = t({ path: file, source: src }, api, {}) as string | undefined;
    if (out != null && out !== src) {
      src = out;
      touched = true;
    }
  }
  if (touched) {
    writeFileSync(file, src);
    console.log("✓ migrated", file);
    changed++;
  }
}
console.log(`\n${changed} / ${files.length} file(s) changed.`);
