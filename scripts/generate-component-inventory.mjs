import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const metadataPath = path.join(rootDir, "metadata", "componentInventory.json");
const outputPath = path.join(rootDir, "docs", "components", "inventory.md");

const inventory = JSON.parse(await fs.readFile(metadataPath, "utf8"));

const docsBaseUrl = "http://localhost:3001";
const storybookBaseUrl = "http://localhost:6006";

function toStoryId(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getStatusLabel(status) {
  if (status === "implemented") return "구현됨";
  if (status === "planned") return "예정";
  if (status === "draft") return "초안";
  return status;
}

function getStatusMark(status) {
  if (status === "implemented") return "✅";
  if (status === "planned") return "🟡";
  if (status === "draft") return "📝";
  return "•";
}

function getFigmaCell(entry) {
  if (!entry.figmaUrl) return "연결 필요";
  const nodeSuffix = entry.figmaNodeId ? ` (${entry.figmaNodeId})` : "";
  return `[열기](${entry.figmaUrl})${nodeSuffix}`;
}

function getStorybookUrl(entry) {
  return `${storybookBaseUrl}/?path=/docs/${toStoryId(entry.storybookTitle)}--docs`;
}

function getDocsUrl(entry) {
  return `${docsBaseUrl}${entry.docsPath}`;
}

const groupedEntries = inventory.reduce((acc, entry) => {
  const category = entry.category || "기타";
  acc[category] ??= [];
  acc[category].push(entry);
  return acc;
}, {});

const lines = [
  "---",
  "sidebar_position: 1",
  "title: 컴포넌트 인벤토리",
  "---",
  "",
  "<!-- AUTO-GENERATED FILE. Run `pnpm generate:component-inventory` after updating metadata/componentInventory.json. -->",
  "",
  "# 컴포넌트 인벤토리",
  "",
  "이 문서는 `metadata/componentInventory.json`을 기준으로 자동 생성됩니다.",
  "기획자, 디자이너, 개발자가 같은 기준으로 Figma, Storybook, 구현 상태를 확인할 수 있도록 만든 연결표입니다.",
  "",
  "메타데이터에 Figma 링크를 넣으면 이 문서와 Storybook Docs에 함께 반영됩니다.",
  "",
];

for (const [category, entries] of Object.entries(groupedEntries)) {
  lines.push(`## ${category}`, "");
  lines.push("| 컴포넌트 | 설명 | 상태 | Figma | Storybook | Docs | 활용 범위 |");
  lines.push("|---|---|---|---|---|---|---|");

  for (const entry of entries) {
    lines.push(
      `| **${entry.name}** | ${entry.description} | ${getStatusMark(entry.status)} ${getStatusLabel(entry.status)} | ${getFigmaCell(entry)} | [열기](${getStorybookUrl(entry)}) | [열기](${getDocsUrl(entry)}) | ${entry.usageSummary} |`,
    );
  }

  lines.push("");

  for (const entry of entries) {
    if (!entry.notes) continue;
    lines.push(`- **${entry.name}**: ${entry.notes}`);
  }

  lines.push("");
}

await fs.writeFile(outputPath, `${lines.join("\n").trimEnd()}\n`, "utf8");
console.log(`Generated ${path.relative(rootDir, outputPath)}`);
