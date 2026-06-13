#!/usr/bin/env node
/**
 * nds-migrate — React→Nudge DS 코드모드 CLI (PoC: button transform).
 * 사용: nds-migrate <file.tsx ...>  — 인식된 패턴만 결정적으로 교체, 나머지는 그대로 둔다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import jscodeshift from "jscodeshift";
import transform, { parser } from "./transforms/button.js";

const files = process.argv.slice(2).filter((a) => !a.startsWith("-"));
if (files.length === 0) {
  console.log("usage: nds-migrate <file.tsx ...>   (PoC: button transform only)");
  process.exit(0);
}

const j = jscodeshift.withParser(parser);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = { jscodeshift: j, j, stats: () => {}, report: () => {} } as any;

let changed = 0;
for (const file of files) {
  const src = readFileSync(file, "utf8");
  const out = transform({ path: file, source: src }, api, {});
  if (out != null && out !== src) {
    writeFileSync(file, out);
    console.log("✓ migrated", file);
    changed++;
  }
}
console.log(`\n${changed} / ${files.length} file(s) changed.`);
