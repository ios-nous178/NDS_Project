/**
 * MCP의 COMPONENT_GUIDES / PATTERN_GUIDES 를 JSON 으로 직렬화해
 * Storybook(All Components)에서 dependency 없이 읽을 수 있게 한다.
 *
 * 입력: packages/mcp/dist/guides.js (mcp 빌드 산출물)
 * 출력: metadata/componentGuides.json
 *
 * mcp dist 가 아직 없으면(클린 체크아웃) 조용히 skip 하고 종료 코드 0.
 * — turbo dependsOn 으로 mcp:build 가 먼저 도는 경우엔 항상 존재.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const guidesDistPath = path.join(rootDir, "packages/mcp/dist/guides.js");
const outputPath = path.join(rootDir, "metadata/componentGuides.json");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(guidesDistPath))) {
  console.warn(
    "[generate-component-guides] packages/mcp/dist/guides.js 가 없어 skip. (mcp build 후 다시 시도하세요)",
  );
  process.exit(0);
}

const moduleUrl = pathToFileURL(guidesDistPath).href;
const mod = await import(moduleUrl);

const { COMPONENT_GUIDES = {}, PATTERN_GUIDES = {} } = mod;

const componentNames = Object.keys(COMPONENT_GUIDES).sort();
const patternNames = Object.keys(PATTERN_GUIDES).sort();

const payload = {
  generatedAt: new Date().toISOString(),
  source: "packages/mcp/dist/guides.js",
  components: COMPONENT_GUIDES,
  patterns: PATTERN_GUIDES,
};

await fs.writeFile(outputPath, JSON.stringify(payload, null, 2) + "\n", "utf8");

console.log(
  `[generate-component-guides] ${componentNames.length} components · ${patternNames.length} patterns → metadata/componentGuides.json`,
);
