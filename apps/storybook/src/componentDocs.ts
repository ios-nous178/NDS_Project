import inventory from "../../../metadata/componentInventory.json";

type InventoryEntry = (typeof inventory)[number] & {
  /** Figma 디자인과 코드가 정합 검증된 컴포넌트일 때 true. */
  figmaSynced?: boolean;
  /** Figma sync 검증 일자 (YYYY-MM-DD). */
  figmaSyncedAt?: string;
  /** Storybook meta id override. docs URL 생성 시 title 대신 사용. */
  storybookId?: string;
};

const DOCS_BASE_URL = "";

function toStoryId(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findEntry(componentName: string): InventoryEntry | undefined {
  return inventory.find((entry) => entry.name === componentName) as InventoryEntry | undefined;
}

function getStorybookDocsUrl(entry: InventoryEntry) {
  return `/storybook/?path=/docs/${toStoryId(entry.storybookId ?? entry.storybookTitle)}--docs`;
}

export function isFigmaSynced(componentName: string): boolean {
  return Boolean(findEntry(componentName)?.figmaSynced);
}

export function getComponentDocsDescription(componentName: string) {
  const entry = findEntry(componentName);

  if (!entry) {
    return [
      "메타데이터가 아직 연결되지 않았습니다.",
      "",
      "- Figma: 연결 필요",
      "- Component Inventory: 메타데이터 등록 필요",
    ].join("\n");
  }

  const storybookUrl = getStorybookDocsUrl(entry);
  const docsUrl = entry.docsPath ? `${DOCS_BASE_URL}${entry.docsPath}` : storybookUrl;
  const figmaLine = entry.figmaUrl
    ? `- Figma: [열기](${entry.figmaUrl})${entry.figmaNodeId ? ` (${entry.figmaNodeId})` : ""}`
    : "- Figma: 연결 필요";

  const syncBadge = entry.figmaSynced
    ? `> ✅ **Figma 가이드 정합 완료**${entry.figmaSyncedAt ? ` · 검증일 ${entry.figmaSyncedAt}` : ""} · 사이즈/토큰/variant가 Figma 컴포넌트 세트와 일치합니다.\n\n`
    : "";

  return (
    syncBadge +
    [
      entry.description,
      "",
      `- 상태: ${entry.status}`,
      figmaLine,
      `- Storybook Docs: [열기](${storybookUrl})`,
      `- Docs: [열기](${docsUrl})`,
      `- 활용 범위: ${entry.usageSummary}`,
      entry.notes ? `- 메모: ${entry.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n")
  );
}
