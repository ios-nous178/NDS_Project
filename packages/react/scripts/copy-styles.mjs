#!/usr/bin/env node
/**
 * Copy @nudge-design/styles' bundled CSS into this package so the legacy
 * `import "@nudge-design/react/styles.css"` entry keeps working.
 *
 * The CSS pipeline (extract-styles.mjs) now lives in @nudge-design/styles — see
 * packages/styles/scripts/extract-styles.mjs. We mirror the file here so we
 * don't break existing consumer imports / docs / MCP setup output.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stylesSrc = path.resolve(__dirname, "../../styles/dist/styles.css");
const outCss = path.resolve(__dirname, "../dist/styles.css");

if (!fs.existsSync(stylesSrc)) {
  console.error(
    `[@nudge-design/react] @nudge-design/styles bundled CSS not found at ${stylesSrc}. ` +
      `Run \`pnpm build --filter @nudge-design/styles\` first.`,
  );
  process.exit(1);
}

fs.mkdirSync(path.dirname(outCss), { recursive: true });
fs.copyFileSync(stylesSrc, outCss);
const size = (fs.statSync(outCss).size / 1024).toFixed(1);
console.log(`Mirrored styles.css from @nudge-design/styles → dist/styles.css (${size} KB)`);
