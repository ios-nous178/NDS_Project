import inventory from "../../../metadata/componentInventory.json";

type InventoryEntry = (typeof inventory)[number];

const DOCS_BASE_URL = "http://localhost:3001";
const STORYBOOK_BASE_URL = "http://localhost:6006";

function toStoryId(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findEntry(componentName: string): InventoryEntry | undefined {
  return inventory.find((entry) => entry.name === componentName);
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

  const storybookUrl = `${STORYBOOK_BASE_URL}/?path=/docs/${toStoryId(entry.storybookTitle)}--docs`;
  const docsUrl = `${DOCS_BASE_URL}${entry.docsPath}`;
  const figmaLine = entry.figmaUrl
    ? `- Figma: [열기](${entry.figmaUrl})${entry.figmaNodeId ? ` (${entry.figmaNodeId})` : ""}`
    : "- Figma: 연결 필요";

  return [
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
    .join("\n");
}
