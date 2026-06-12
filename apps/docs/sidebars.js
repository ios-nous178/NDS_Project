// 개별 컴포넌트 목록은 metadata/componentInventory.json 의 figmaSynced 필드를 기준으로
// "Figma 정합" / "Figma 미정합" 두 섹션으로 자동 분리한다. 새 컴포넌트 추가 시
// inventory 만 갱신하면 사이드바도 자동 반영됨.

const fs = require("node:fs");
const path = require("node:path");

const inventory = require("../../metadata/componentInventory.json");
const docsRoot = path.join(__dirname, "..", "..", "docs");

function docExists(slug) {
  return (
    fs.existsSync(path.join(docsRoot, "components", `${slug}.md`)) ||
    fs.existsSync(path.join(docsRoot, "components", `${slug}.mdx`))
  );
}

const seen = new Set();
const synced = [];
const unsynced = [];
for (const entry of inventory) {
  if (!entry.docsPath || !entry.docsPath.startsWith("/components/")) continue;
  const slug = entry.docsPath.replace("/components/", "");
  if (seen.has(slug)) continue;
  seen.add(slug);
  if (!docExists(slug)) continue;
  const id = `components/${slug}`;
  (entry.figmaSynced ? synced : unsynced).push(id);
}
synced.sort();
unsynced.sort();

module.exports = {
  docs: [
    "intro",
    "getting-started",
    {
      type: "category",
      label: "컴포넌트",
      collapsed: false,
      items: [
        "components/overview",
        "components/gallery",
        "components/brand-coverage",
        "components/icons",
        {
          type: "category",
          label: `Figma 정합 (${synced.length})`,
          collapsed: false,
          items: synced,
        },
        {
          type: "category",
          label: `Figma 미정합 (${unsynced.length})`,
          collapsed: true,
          items: unsynced,
        },
      ],
    },
    {
      type: "category",
      label: "디자인 토큰",
      collapsed: false,
      items: [
        "tokens/colors",
        "tokens/typography",
        "tokens/spacing",
        "tokens/elevation",
        "semantic-tokens",
      ],
    },
    {
      type: "category",
      label: "가이드",
      collapsed: false,
      items: [
        "guide/design-principles",
        "guide/ux-writing",
        "guide/dark-patterns",
        "guide/visual-antipatterns",
        "guide/design-token-principles",
        "guide/token-review-checklist",
        "guide/page-migration-priority",
        "guide/migration-debug-tools",
        "guide/styling",
        "NUDGE_DS_MCP_USAGE",
        "guide/mcp-tools-reference",
      ],
    },
    {
      type: "category",
      label: "참고 자료",
      collapsed: false,
      items: ["reference/design-md-spec"],
    },
    {
      type: "category",
      label: "내부 문서",
      collapsed: true,
      // TOKENS(수기 토큰 정의서)는 자동 생성되는 semantic-tokens + 토큰 카탈로그로 대체돼 삭제.
      // COMPONENT_DOC_TEMPLATE 은 가이드 작성용 템플릿 — 독자용 사이트에 게시하지 않는다.
      items: ["FIGMA_TO_REACT_WORKFLOW", "STYLING_STRUCTURE_GUIDE"],
    },
  ],
};
