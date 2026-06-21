/**
 * figma-plugin/plugin.template.js + dist/next/figma-variables.json → figma-plugin/code.js
 * (토큰 데이터를 플러그인 코드에 인라인 임베드 — 플러그인은 로컬 파일을 못 읽으므로).
 * 실행: node scripts/build-figma-plugin.cjs  (build 가 generate-next 후 자동 실행).
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "figma-plugin");
const data = fs.readFileSync(
  path.join(__dirname, "..", "dist", "next", "figma-variables.json"),
  "utf8",
);
const template = fs.readFileSync(path.join(dir, "plugin.template.js"), "utf8");

const code = template.replace("__TOKENS_JSON__", data.trim());
fs.writeFileSync(path.join(dir, "code.js"), code);
console.log(`Generated ${path.join(dir, "code.js")} (Figma plugin, tokens embedded)`);
