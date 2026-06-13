/**
 * Component inventory 그룹/정렬 SSOT — docs `ComponentGallery` 와 storybook `AllComponents` 가 공유.
 *
 * 두 카탈로그가 동일한 (1) 카테고리 그룹 **표시 순서** 와 (2) 그룹 내 **이름 A-Z** 정렬을
 * 쓰도록 한 곳에서 정의한다. 이전에는 둘 다 `metadata/componentInventory.json` 의 행 순서를
 * 그대로 노출해 inventory 재정렬에 따라 표시 순서가 흔들렸다.
 *
 * 순수 데이터 함수(React 비의존) — Docusaurus(webpack/R18) · Storybook(vite/R19) 양쪽에서 안전.
 */

/**
 * 카테고리 그룹 표시 순서 (inventory.category 값 기준).
 * 기반(general) → 구조(input/layout) → 탐색/오버레이 → 피드백 → 데이터 표시 → 데이터 시각화 → 도메인 순.
 * 목록에 없는 카테고리는 맨 뒤에 한국어 가나다순으로 붙는다.
 */
export const COMPONENT_CATEGORY_ORDER = [
  "일반",
  "입력",
  "레이아웃",
  "내비게이션",
  "오버레이",
  "피드백",
  "데이터 표시",
  "데이터 시각화",
  "도메인",
] as const;

export interface InventoryLike {
  name: string;
  category: string;
}

function categoryRank(cat: string): number {
  const i = (COMPONENT_CATEGORY_ORDER as readonly string[]).indexOf(cat);
  return i === -1 ? COMPONENT_CATEGORY_ORDER.length : i;
}

function sortByCategoryOrder(cats: readonly string[]): string[] {
  return [...cats].sort((a, b) => categoryRank(a) - categoryRank(b) || a.localeCompare(b, "ko"));
}

/** 표시 순서대로 정렬된 distinct 카테고리 목록 (필터 칩 행에 사용). */
export function orderedCategories<T extends InventoryLike>(entries: readonly T[]): string[] {
  return sortByCategoryOrder(Array.from(new Set(entries.map((e) => e.category))));
}

/**
 * 카테고리 그룹(표시 순서) + 그룹 내 `name` A-Z 로 정렬해 `[category, entries[]]` 튜플 배열 반환.
 * 입력 배열은 변형하지 않는다.
 */
export function groupByCategorySorted<T extends InventoryLike>(
  entries: readonly T[],
): Array<[string, T[]]> {
  const map = new Map<string, T[]>();
  for (const e of entries) {
    const list = map.get(e.category) ?? [];
    list.push(e);
    map.set(e.category, list);
  }
  return sortByCategoryOrder([...map.keys()]).map((cat) => [
    cat,
    [...map.get(cat)!].sort((a, b) => a.name.localeCompare(b.name, "en")),
  ]);
}
