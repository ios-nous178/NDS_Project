#!/usr/bin/env node
/**
 * Reads /tmp/figma-icons/icons.json, downloads each asset URL,
 * normalizes the SVG (currentColor + 24x24 viewBox + position),
 * writes to packages/icons/svg/<name>.svg.
 *
 * Composite SVGs (multi-layer) need to be handcrafted — see _composites.json.
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const { normalize } = require("./normalize-figma.cjs");

const ICONS_JSON = path.join(__dirname, "figma-icons.json");
const SVG_OUT = path.join(__dirname, "..", "svg");

function fetchBytes(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      })
      .on("error", reject);
  });
}

async function main() {
  const cfg = JSON.parse(fs.readFileSync(ICONS_JSON, "utf-8"));
  const entries = Object.entries(cfg).filter(([k, v]) => !k.startsWith("_") && v && v.url);
  console.log(`Processing ${entries.length} icons`);

  for (const [name, opts] of entries) {
    try {
      const svg = await fetchBytes(opts.url);
      if (!svg.includes("<svg")) {
        console.error(`  ✗ ${name}: not an SVG`);
        continue;
      }
      const normOpts = {};
      if (opts.x !== undefined) normOpts.x = opts.x;
      if (opts.y !== undefined) normOpts.y = opts.y;
      if (opts.preTransform) normOpts.preTransform = opts.preTransform;
      const out = normalize(svg, normOpts);
      const outFile = path.join(SVG_OUT, `${name}.svg`);
      fs.writeFileSync(outFile, out);
      console.log(`  ✓ ${name}`);
    } catch (e) {
      console.error(`  ✗ ${name}: ${e.message}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
