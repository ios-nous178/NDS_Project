#!/usr/bin/env node
/**
 * Mirror @nudge-design/styles' bundled CSS into this package so consumers can
 * `import "@nudge-design/html/styles.css"` without reaching into a peer.
 *
 * The CSS SSOT now lives in @nudge-design/styles (see packages/styles). This
 * package was previously copying from @nudge-design/react/dist/styles.css; the
 * split decoupled @nudge-design/html from @nudge-design/react at install time.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stylesSrc = path.resolve(__dirname, "../../styles/dist/styles.css");
const outCss = path.resolve(__dirname, "../dist/styles.css");

if (!fs.existsSync(stylesSrc)) {
  console.error(
    `[@nudge-design/html] @nudge-design/styles bundled CSS not found at ${stylesSrc}. ` +
      `Run \`pnpm build --filter @nudge-design/styles\` first.`,
  );
  process.exit(1);
}

fs.mkdirSync(path.dirname(outCss), { recursive: true });
fs.copyFileSync(stylesSrc, outCss);
const size = (fs.statSync(outCss).size / 1024).toFixed(1);
console.log(`Mirrored styles.css from @nudge-design/styles → dist/styles.css (${size} KB)`);
