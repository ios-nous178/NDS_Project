#!/usr/bin/env node
/**
 * SSOT consistency gate.
 *
 * Storybook / docs / MCP derived artifacts are checked together so the root lint
 * chain can validate the shared source-of-truth surface in one place.
 *
 * 게이트 정의는 scripts/gates.mjs 가 SSOT — fix-all.mjs(pnpm fix) /
 * precommit-gate.mjs 와 같은 목록을 공유한다. 게이트 추가/변경은 gates.mjs 에서.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BUILD_FILTERS, GATES } from "./gates.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const steps = [
  ...BUILD_FILTERS.map((filter) => ({
    label: `build ${filter}`,
    command: "pnpm",
    args: ["--filter", filter, "build"],
  })),
  ...GATES.filter((g) => g.ssot).map((g) => ({
    label: `check ${g.label}`,
    command: g.check[0],
    args: g.check.slice(1),
  })),
];

for (const step of steps) {
  console.log(`\n[check:ssot] ${step.label}`);
  execFileSync(step.command, step.args, { cwd: ROOT, stdio: "inherit" });
}
