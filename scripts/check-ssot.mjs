#!/usr/bin/env node
/**
 * SSOT consistency gate.
 *
 * Storybook / docs / MCP derived artifacts are checked together so the root lint
 * chain can validate the shared source-of-truth surface in one place.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const steps = [
  {
    label: "build @nudge-design/tokens",
    command: "pnpm",
    args: ["--filter", "@nudge-design/tokens", "build"],
  },
  {
    label: "build @nudge-design/icons",
    command: "pnpm",
    args: ["--filter", "@nudge-design/icons", "build"],
  },
  {
    label: "build @nudge-design/styles",
    command: "pnpm",
    args: ["--filter", "@nudge-design/styles", "build"],
  },
  {
    label: "build @nudge-design/react",
    command: "pnpm",
    args: ["--filter", "@nudge-design/react", "build"],
  },
  {
    label: "build @nudge-design/mcp",
    command: "pnpm",
    args: ["--filter", "@nudge-design/mcp", "build"],
  },
  {
    label: "check MCP catalog freshness",
    command: "node",
    args: ["scripts/check-mcp-catalog.mjs", "--no-build"],
  },
  {
    label: "check react/html mirror parity",
    command: "node",
    args: ["scripts/check-mirror-parity.mjs", "--no-regen"],
  },
  {
    label: "check input focus-preservation tests",
    command: "node",
    args: ["scripts/check-input-tests.mjs"],
  },
  {
    label: "check Storybook catalog coverage",
    command: "node",
    args: ["scripts/check-storybook-catalog.mjs"],
  },
  {
    label: "check component guide JSON",
    command: "node",
    args: ["scripts/generate-component-guides.mjs", "--check"],
  },
  {
    label: "check brand coverage docs",
    command: "node",
    args: ["scripts/generate-brand-coverage.mjs", "--check"],
  },
  {
    label: "check guide markdown",
    command: "node",
    args: ["scripts/generate-guide-docs.mjs", "--check"],
  },
  {
    label: "check MCP tools reference",
    command: "node",
    args: ["scripts/generate-mcp-tools-reference.mjs", "--check"],
  },
];

for (const step of steps) {
  console.log(`\n[check:ssot] ${step.label}`);
  execFileSync(step.command, step.args, { cwd: ROOT, stdio: "inherit" });
}
