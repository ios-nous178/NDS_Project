/**
 * MCP guide SSOT(packages/mcp/src/guides.ts) → docs 마크다운 페이지로 동기화.
 *
 * 외부 mockup 프로젝트의 Claude 는 MCP 도구로 가이드를 받고,
 * 사람(디자이너 / PM / QA) 은 docs 사이트에서 같은 본문을 본다.
 * 본문 변경 시 packages/mcp/src/guides.ts 만 고치고 이 스크립트를 다시 돌리면 둘 다 갱신.
 *
 * 입력: packages/mcp/dist/guides.js — pnpm build --filter @nudge-eap/mcp 가 선행되어야 함.
 * 출력:
 *   - docs/guide/ux-writing.md     (UX_WRITING_GUIDE)
 *   - docs/guide/dark-patterns.md  (PATTERN_GUIDES['dark-patterns'])
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const mcpDist = path.join(rootDir, "packages/mcp/dist/guides.js");
const outDir = path.join(rootDir, "docs/guide");

try {
  await fs.access(mcpDist);
} catch {
  console.error(
    `[generate-guide-docs] ${path.relative(rootDir, mcpDist)} 가 없습니다. ` +
      `먼저 'pnpm build --filter @nudge-eap/mcp' 로 빌드하세요.`,
  );
  process.exit(1);
}

const { UX_WRITING_GUIDE, PATTERN_GUIDES } = await import(mcpDist);

function renderUxWriting() {
  const g = UX_WRITING_GUIDE;
  const lines = [
    "---",
    "sidebar_position: 10",
    "title: UX 라이팅",
    "---",
    "",
    "<!-- AUTO-GENERATED FILE. SSOT: packages/mcp/src/guides.ts (UX_WRITING_GUIDE). Run `pnpm generate:guide-docs` after editing the source. -->",
    "<!-- markdownlint-disable MD024 MD036 -->",
    "",
    "# UX 라이팅",
    "",
    "사용자에게 노출되는 모든 텍스트(버튼·라벨·placeholder·empty state·에러 메시지·다이얼로그)에 적용되는 보이스톤 / 문장 규칙입니다.",
    '외부 mockup 프로젝트에서는 `get_guide({ topic: "ux-writing" })` MCP 호출로 동일 본문을 받습니다.',
    "",
    "## 보이스톤",
    "",
    g.voiceTone,
    "",
    "## 문장 원칙",
    "",
  ];
  for (const p of g.principles) {
    lines.push(`### ${p.name}`, "", p.summary, "");
    lines.push("**Do**", "");
    for (const x of p.do) lines.push(`- ${x}`);
    lines.push("", "**Don't**", "");
    for (const x of p.dont) lines.push(`- ${x}`);
    lines.push("");
  }
  lines.push("## 마이크로카피", "");
  for (const m of g.microcopy) {
    lines.push(`### ${m.context}`, "", m.rule, "");
    if (m.example) {
      lines.push("```", m.example, "```", "");
    }
  }
  lines.push("## EAP 멘탈케어 도메인 룰", "");
  for (const r of g.eapDomain) lines.push(`- ${r}`);
  lines.push("");
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderDarkPatterns() {
  const g = PATTERN_GUIDES["dark-patterns"];
  if (!g) throw new Error("PATTERN_GUIDES['dark-patterns'] 가 비어 있습니다.");
  const lines = [
    "---",
    "sidebar_position: 11",
    "title: 다크패턴",
    "---",
    "",
    "<!-- AUTO-GENERATED FILE. SSOT: packages/mcp/src/guides.ts (PATTERN_GUIDES['dark-patterns']). Run `pnpm generate:guide-docs` after editing the source. -->",
    "",
    "# 다크패턴",
    "",
    '사용성을 해치는 5 가지 다크패턴. 외부 mockup 프로젝트에서는 `get_guide({ topic: "pattern:dark-patterns" })` MCP 호출로 동일 본문을 받습니다.',
    "시각 안티패턴(`visual-antipatterns`) 이 색·강조·반복 같은 스타일을 다룬다면, 이 문서는 진입·뒤로가기·CTA 라벨 같은 **플로우·사용성** 차원의 안티패턴을 다룹니다.",
    "",
    "## 요약",
    "",
    g.summary,
    "",
    "## 규칙",
    "",
  ];
  for (const r of g.rules) lines.push(`- ${r}`);
  lines.push("", "## 피해야 할 패턴", "");
  for (const a of g.avoid) lines.push(`- ${a}`);
  if (g.metrics && Object.keys(g.metrics).length > 0) {
    lines.push("", "## Metrics", "");
    lines.push("| Key | Value |", "|---|---|");
    for (const [k, v] of Object.entries(g.metrics)) {
      lines.push(`| \`${k}\` | ${v} |`);
    }
  }
  lines.push("");
  return `${lines.join("\n").trimEnd()}\n`;
}

await fs.mkdir(outDir, { recursive: true });

const uxOut = path.join(outDir, "ux-writing.md");
await fs.writeFile(uxOut, renderUxWriting(), "utf8");
console.log(`Generated ${path.relative(rootDir, uxOut)}`);

const dpOut = path.join(outDir, "dark-patterns.md");
await fs.writeFile(dpOut, renderDarkPatterns(), "utf8");
console.log(`Generated ${path.relative(rootDir, dpOut)}`);
