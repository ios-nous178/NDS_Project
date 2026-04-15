#!/usr/bin/env node

/**
 * Figma link completeness checker for componentInventory.json.
 *
 * - Outputs GitHub Actions annotations (::warning::) per missing component
 * - Writes a Job Summary table to $GITHUB_STEP_SUMMARY
 * - Exits with code 0 (warnings only, does not block CI)
 */

import { readFileSync, appendFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const inventoryPath = resolve(__dirname, "../metadata/componentInventory.json");
const inventory = JSON.parse(readFileSync(inventoryPath, "utf-8"));

const missing = inventory.filter((c) => !c.figmaUrl);
const linked = inventory.filter((c) => c.figmaUrl);
const total = inventory.length;
const coverage = ((linked.length / total) * 100).toFixed(0);

// ── Console output (local dev) ──
console.log(`\nFigma link coverage: ${linked.length}/${total} (${coverage}%)\n`);

if (missing.length > 0) {
  console.log("Missing Figma links:");
  for (const c of missing) {
    console.log(`  - ${c.name} (${c.category})`);
  }
  console.log(`\nAdd figmaUrl and figmaNodeId to metadata/componentInventory.json`);
}

// ── GitHub Actions annotations ──
const isCI = process.env.CI === "true";

if (isCI && missing.length > 0) {
  for (const c of missing) {
    console.log(
      `::warning file=metadata/componentInventory.json,title=Figma link missing::` +
        `${c.name} (${c.category}) has no Figma link. Design-code traceability is incomplete.`,
    );
  }
}

// ── GitHub Job Summary ──
const summaryPath = process.env.GITHUB_STEP_SUMMARY;

if (summaryPath) {
  const rows = inventory
    .map((c) => {
      const status = c.figmaUrl ? ":white_check_mark:" : ":warning:";
      const link = c.figmaUrl ? `[Open in Figma](${c.figmaUrl})` : "_not linked_";
      return `| ${status} | ${c.name} | ${c.category} | ${link} |`;
    })
    .join("\n");

  const emoji = missing.length === 0 ? ":tada:" : ":art:";
  const summary = `## ${emoji} Figma Link Coverage: ${linked.length}/${total} (${coverage}%)

| Status | Component | Category | Figma |
|--------|-----------|----------|-------|
${rows}

${
  missing.length > 0
    ? `> **${missing.length} component(s)** are missing Figma links. ` +
      `Update \`metadata/componentInventory.json\` to connect them.`
    : "> All components are linked to Figma!"
}
`;

  appendFileSync(summaryPath, summary);
}

// Always exit 0 — this is a warning, not a blocker
process.exit(0);
