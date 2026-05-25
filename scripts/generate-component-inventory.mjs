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

function groupByCategory(entries) {
  return entries.reduce((acc, entry) => {
    const category = entry.category || "기타";
    acc[category] ??= [];
    acc[category].push(entry);
    return acc;
  }, {});
}

const syncedEntries = inventory.filter((e) => e.figmaSynced === true);
const pendingEntries = inventory.filter((e) => e.figmaSynced !== true);

const lines = [
  "---",
  "sidebar_position: 1",
  "title: 컴포넌트 인벤토리",
  "---",
  "",
  "<!-- AUTO-GENERATED FILE. Run `pnpm generate:component-inventory` after updating metadata/componentInventory.json. -->",
  "<!-- markdownlint-disable MD024 -->",
  "",
  "# 컴포넌트 인벤토리",
  "",
  "이 문서는 `metadata/componentInventory.json`을 기준으로 자동 생성됩니다.",
  "기획자, 디자이너, 개발자가 같은 기준으로 Figma, Storybook, 구현 상태를 확인할 수 있도록 만든 연결표입니다.",
  "",
  "Figma 라이브러리와 정합 완료된 컴포넌트를 상단에, 아직 정합되지 않은 컴포넌트를 하단에 분리해서 노출합니다.",
  "정합 여부는 `metadata/componentInventory.json` 의 `figmaSynced` 필드를 단일 진리원천으로 사용합니다.",
  "",
];

// MDX 가 메모 안 raw HTML 토큰 (<input type=file>) 이나 expression placeholder
// ({Brand}Footer 같은 문구) 를 JSX 로 해석하지 않도록 안전한 텍스트로 escape.
function escapeMdx(value) {
  if (!value) return value;
  return String(value)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}");
}

// 테이블 셀 안에서는 `|` 가 컬럼 구분자라 추가 escape 필요.
function escapeCell(value) {
  if (!value) return value;
  return escapeMdx(value).replace(/\|/g, "\\|");
}

function renderSection(headline, entries) {
  lines.push(`## ${headline} (${entries.length})`, "");

  if (entries.length === 0) {
    lines.push("_없음_", "");
    return;
  }

  const grouped = groupByCategory(entries);
  for (const [category, rows] of Object.entries(grouped)) {
    lines.push(`### ${category}`, "");
    lines.push("| 컴포넌트 | 설명 | 상태 | Figma | Storybook | Docs | 활용 범위 |");
    lines.push("|---|---|---|---|---|---|---|");

    for (const entry of rows) {
      lines.push(
        `| **${entry.name}** | ${escapeCell(entry.description)} | ${getStatusMark(entry.status)} ${getStatusLabel(entry.status)} | ${getFigmaCell(entry)} | [열기](${getStorybookUrl(entry)}) | [열기](${getDocsUrl(entry)}) | ${escapeCell(entry.usageSummary)} |`,
      );
    }

    lines.push("");

    for (const entry of rows) {
      if (!entry.notes) continue;
      lines.push(`- **${entry.name}**: ${escapeMdx(entry.notes)}`);
    }

    lines.push("");
  }
}

renderSection("Figma 정합 완료", syncedEntries);
renderSection("Figma 미정합", pendingEntries);

await fs.writeFile(outputPath, `${lines.join("\n").trimEnd()}\n`, "utf8");
console.log(`Generated ${path.relative(rootDir, outputPath)}`);
