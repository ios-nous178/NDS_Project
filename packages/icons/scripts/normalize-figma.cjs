#!/usr/bin/env node
/**
 * Normalize a raw Figma asset SVG into a 24x24 svg with currentColor.
 *
 * Usage: node normalize.js <input.svg> <output.svg> [x] [y] [scale]
 *   x, y  — translate offset (default: center within 24x24)
 *   scale — uniform scale (default: 1)
 *
 * Behavior:
 *   - Parse outer <svg viewBox> to get content viewBox
 *   - Strip outer <svg ...> and </svg>, keep inner content
 *   - Replace var(--stroke-0, #xxx)  → currentColor
 *   - Replace var(--fill-0,   #xxx)  → currentColor
 *   - If a stroke="#xxx" or fill="#xxx" is non-transparent and not "none", convert to currentColor too
 *   - Wrap in 24x24 svg with <g transform="translate(x y)"> if needed
 */
const fs = require("fs");

function normalize(svg, opts = {}) {
  const vbMatch = svg.match(/viewBox="([\d.\- ]+)"/);
  if (!vbMatch) throw new Error("missing viewBox");
  const [vbX, vbY, vbW, vbH] = vbMatch[1].trim().split(/\s+/).map(Number);

  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>\s*$/);
  if (!innerMatch) throw new Error("cannot extract inner content");
  let inner = innerMatch[1].trim();

  inner = inner.replace(/var\(--(?:stroke|fill)-\d+,\s*[^)]+\)/g, "currentColor");

  inner = inner.replace(/\s(stroke|fill)="(#[0-9a-fA-F]{3,8})"/g, (m, attr, hex) => {
    const lower = hex.toLowerCase();
    if (lower === "#fff" || lower === "#ffffff") {
      return ` ${attr}="currentColor"`;
    }
    return ` ${attr}="currentColor"`;
  });

  const tx = opts.x !== undefined ? opts.x : (24 - vbW) / 2 - vbX;
  const ty = opts.y !== undefined ? opts.y : (24 - vbH) / 2 - vbY;
  const scale = opts.scale || 1;

  const parts = [`translate(${tx} ${ty})`];
  if (opts.preTransform) parts.push(opts.preTransform);
  if (scale !== 1) parts.push(`scale(${scale})`);
  const transform = parts.join(" ");

  const needsWrapper = !(vbX === 0 && vbY === 0 && vbW === 24 && vbH === 24) || opts.preTransform;
  const body = needsWrapper
    ? `  <g transform="${transform}">\n    ${inner}\n  </g>\n`
    : `  ${inner}\n`;

  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n${body}</svg>\n`;
}

if (require.main === module) {
  const [, , input, output, xStr, yStr, scaleStr] = process.argv;
  if (!input || !output) {
    console.error("Usage: normalize.js <input.svg> <output.svg> [x] [y] [scale]");
    process.exit(1);
  }
  const svg = fs.readFileSync(input, "utf-8");
  const opts = {};
  if (xStr !== undefined) opts.x = parseFloat(xStr);
  if (yStr !== undefined) opts.y = parseFloat(yStr);
  if (scaleStr !== undefined) opts.scale = parseFloat(scaleStr);
  fs.writeFileSync(output, normalize(svg, opts));
  console.log(`Wrote ${output}`);
}

module.exports = { normalize };
