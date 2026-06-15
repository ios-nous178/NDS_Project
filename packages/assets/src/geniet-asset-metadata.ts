/**
 * Geniet(지니어트) 브랜드 자산 메타데이터.
 *
 * 디자이너 Figma "🥗 지니어트 - Library" 의 native Export(PNG 1x/3x · SVG) 원본.
 * Figma 노드 트리가 아닌 Export zip 에서 편입돼 figmaNodeId 는 보유하지 않는다
 * (NudgeEAP `nudge-img-metadata` 와 달리 노드 sync 메타 없음).
 *
 * **해상도**: 1x(base) + 3x(`@3x`) PNG — NudgeEAP 컨벤션과 동일(2x 미보관).
 * raster PNG 라 dataUri 미제공 — 파일 호스팅 필수.
 * 외부 소비자는 `@nudge-design/assets/files/{filename}` 로 참조.
 *
 * 카테고리 (src 디렉토리와 1:1):
 *   - food-types       음식 종류 아이콘 (Figma variant `종류=*`)
 *   - category-heroes  카테고리 대표 이미지 (한식/중식/…)
 *   - empty-states     빈 상태 플레이스홀더 (`*-empty`)
 *   - misc             기타 일러스트 (alert/pill/cashlotto)
 *   - profiles         프로필 플레이스홀더 이미지
 *   - logos            워드마크/심볼 (브랜드-크롬 `*.webp` 로고는 별도 시스템이라 제외)
 */

export type GenietAssetCategory =
  | "food-types"
  | "category-heroes"
  | "empty-states"
  | "misc"
  | "profiles"
  | "logos";

export interface GenietAssetMeta {
  /** 카테고리 (src 디렉토리명과 1:1). */
  category: GenietAssetCategory;
  /** 카테고리 내 식별자 (kebab-case, 파일명 stem). */
  id: string;
  /** `files/{filename}` — base(1x, svg 는 단일) 호스팅 경로. */
  filename: string;
  /** `files/{...}@3x.png` — 3x (raster 만, svg 는 undefined). */
  filename3x?: string;
  mimeType: "image/png" | "image/svg+xml";
}

const DIR: Record<GenietAssetCategory, string> = {
  "food-types": "brand/geniet/images/food-types",
  "category-heroes": "brand/geniet/images/category-heroes",
  "empty-states": "brand/geniet/images/empty-states",
  misc: "brand/geniet/images/misc",
  profiles: "brand/geniet/profiles",
  logos: "brand/geniet/logos",
};

function meta(
  category: GenietAssetCategory,
  id: string,
  has3x: boolean,
  mimeType: GenietAssetMeta["mimeType"],
): GenietAssetMeta {
  const ext = mimeType === "image/svg+xml" ? "svg" : "png";
  const base = `${DIR[category]}/${id}.${ext}`;
  return {
    category,
    id,
    filename: base,
    ...(has3x ? { filename3x: `${DIR[category]}/${id}@3x.${ext}` } : {}),
    mimeType,
  };
}

export const GENIET_ASSET_METADATA: readonly GenietAssetMeta[] = [
  // ── food-types (99) ──
  meta("food-types", "alcohol", true, "image/png"),
  meta("food-types", "all", true, "image/png"),
  meta("food-types", "baby-formula", true, "image/png"),
  meta("food-types", "bakery", true, "image/png"),
  meta("food-types", "beef", true, "image/png"),
  meta("food-types", "bibimbap", true, "image/png"),
  meta("food-types", "braised-pigs-feet", true, "image/png"),
  meta("food-types", "bread", true, "image/png"),
  meta("food-types", "broth", true, "image/png"),
  meta("food-types", "burger", true, "image/png"),
  meta("food-types", "candy", true, "image/png"),
  meta("food-types", "canned-food", true, "image/png"),
  meta("food-types", "cheese", true, "image/png"),
  meta("food-types", "chicken-breast", true, "image/png"),
  meta("food-types", "chicken", true, "image/png"),
  meta("food-types", "coffee", true, "image/png"),
  meta("food-types", "cooking-oil", true, "image/png"),
  meta("food-types", "curry-indian", true, "image/png"),
  meta("food-types", "curry", true, "image/png"),
  meta("food-types", "diet", true, "image/png"),
  meta("food-types", "dim-sum", true, "image/png"),
  meta("food-types", "dried-seafood", true, "image/png"),
  meta("food-types", "duck", true, "image/png"),
  meta("food-types", "egg", true, "image/png"),
  meta("food-types", "enzyme", true, "image/png"),
  meta("food-types", "etc", true, "image/png"),
  meta("food-types", "fish-cake", true, "image/png"),
  meta("food-types", "fish", true, "image/png"),
  meta("food-types", "fried-chicken", true, "image/png"),
  meta("food-types", "fried-rice", true, "image/png"),
  meta("food-types", "fried", true, "image/png"),
  meta("food-types", "fritters", true, "image/png"),
  meta("food-types", "fruit", true, "image/png"),
  meta("food-types", "functional-health-food", true, "image/png"),
  meta("food-types", "gimbap", true, "image/png"),
  meta("food-types", "grain-shake", true, "image/png"),
  meta("food-types", "gratin", true, "image/png"),
  meta("food-types", "grilled", true, "image/png"),
  meta("food-types", "health-juice", true, "image/png"),
  meta("food-types", "health-snack", true, "image/png"),
  meta("food-types", "hot-dog", true, "image/png"),
  meta("food-types", "ice-cream", true, "image/png"),
  meta("food-types", "jjajangmyeon", true, "image/png"),
  meta("food-types", "jjamppong", true, "image/png"),
  meta("food-types", "juice", true, "image/png"),
  meta("food-types", "kimchi", true, "image/png"),
  meta("food-types", "korean-pancake", true, "image/png"),
  meta("food-types", "low-sugar-food", true, "image/png"),
  meta("food-types", "meal-plan", true, "image/png"),
  meta("food-types", "milk", true, "image/png"),
  meta("food-types", "multigrain", true, "image/png"),
  meta("food-types", "nasi-goreng", true, "image/png"),
  meta("food-types", "nuts", true, "image/png"),
  meta("food-types", "pad-thai", true, "image/png"),
  meta("food-types", "pasta", true, "image/png"),
  meta("food-types", "pizza", true, "image/png"),
  meta("food-types", "pork-cutlet", true, "image/png"),
  meta("food-types", "pork", true, "image/png"),
  meta("food-types", "pottage", true, "image/png"),
  meta("food-types", "powder", true, "image/png"),
  meta("food-types", "probiotics", true, "image/png"),
  meta("food-types", "processed-seafood", true, "image/png"),
  meta("food-types", "ramen", true, "image/png"),
  meta("food-types", "ramyeon", true, "image/png"),
  meta("food-types", "red-ginseng", true, "image/png"),
  meta("food-types", "rice-bowl", true, "image/png"),
  meta("food-types", "rice-cake", true, "image/png"),
  meta("food-types", "rice-grain", true, "image/png"),
  meta("food-types", "rice-noodle", true, "image/png"),
  meta("food-types", "rice", true, "image/png"),
  meta("food-types", "risotto", true, "image/png"),
  meta("food-types", "royal-jelly", true, "image/png"),
  meta("food-types", "salad", true, "image/png"),
  meta("food-types", "salted-seafood", true, "image/png"),
  meta("food-types", "sandwich", true, "image/png"),
  meta("food-types", "sashimi", true, "image/png"),
  meta("food-types", "sauce", true, "image/png"),
  meta("food-types", "seafood", true, "image/png"),
  meta("food-types", "seaweed", true, "image/png"),
  meta("food-types", "shake", true, "image/png"),
  meta("food-types", "side-dish", true, "image/png"),
  meta("food-types", "smoothie", true, "image/png"),
  meta("food-types", "snack", true, "image/png"),
  meta("food-types", "soda", true, "image/png"),
  meta("food-types", "soup", true, "image/png"),
  meta("food-types", "sports-drink", true, "image/png"),
  meta("food-types", "steamed", true, "image/png"),
  meta("food-types", "stir-fry", true, "image/png"),
  meta("food-types", "sundae-sausage", true, "image/png"),
  meta("food-types", "sweet-sour-pork", true, "image/png"),
  meta("food-types", "syrup", true, "image/png"),
  meta("food-types", "tea", true, "image/png"),
  meta("food-types", "tom-yum", true, "image/png"),
  meta("food-types", "tteokbokki", true, "image/png"),
  meta("food-types", "udon", true, "image/png"),
  meta("food-types", "vegetable", true, "image/png"),
  meta("food-types", "vitamin", true, "image/png"),
  meta("food-types", "water", true, "image/png"),
  meta("food-types", "yogurt", true, "image/png"),

  // ── category-heroes (16) ──
  meta("category-heroes", "asian", true, "image/png"),
  meta("category-heroes", "beverage", true, "image/png"),
  meta("category-heroes", "chinese", true, "image/png"),
  meta("category-heroes", "dairy-baby-food", true, "image/png"),
  meta("category-heroes", "diet", true, "image/png"),
  meta("category-heroes", "fast-food", true, "image/png"),
  meta("category-heroes", "health-food", true, "image/png"),
  meta("category-heroes", "japanese", true, "image/png"),
  meta("category-heroes", "korean", true, "image/png"),
  meta("category-heroes", "livestock", true, "image/png"),
  meta("category-heroes", "marine", true, "image/png"),
  meta("category-heroes", "noodle-can-oil-sauce", true, "image/png"),
  meta("category-heroes", "produce", true, "image/png"),
  meta("category-heroes", "rice-cake-bakery-snack", true, "image/png"),
  meta("category-heroes", "snack-food", true, "image/png"),
  meta("category-heroes", "western", true, "image/png"),

  // ── empty-states (7) ──
  meta("empty-states", "coupon-empty", true, "image/png"),
  meta("empty-states", "error-thumbnail", true, "image/png"),
  meta("empty-states", "food-empty", true, "image/png"),
  meta("empty-states", "food-thumbnail-empty", true, "image/png"),
  meta("empty-states", "heart-empty", true, "image/png"),
  meta("empty-states", "memo-empty", true, "image/png"),
  meta("empty-states", "pill-thumbnail-empty", true, "image/png"),

  // ── misc (3) ──
  meta("misc", "alert", true, "image/png"),
  meta("misc", "cashlotto", true, "image/png"),
  meta("misc", "pill", true, "image/png"),

  // ── profiles (13) ──
  meta("profiles", "profile-01", true, "image/png"),
  meta("profiles", "profile-02", true, "image/png"),
  meta("profiles", "profile-03", true, "image/png"),
  meta("profiles", "profile-04", true, "image/png"),
  meta("profiles", "profile-05", true, "image/png"),
  meta("profiles", "profile-06", true, "image/png"),
  meta("profiles", "profile-07", true, "image/png"),
  meta("profiles", "profile-08", true, "image/png"),
  meta("profiles", "profile-09", true, "image/png"),
  meta("profiles", "profile-10", true, "image/png"),
  meta("profiles", "profile-11", true, "image/png"),
  meta("profiles", "profile-12", true, "image/png"),
  meta("profiles", "profile-default", false, "image/svg+xml"),

  // ── logos (8) ──
  meta("logos", "symbol", false, "image/svg+xml"),
  meta("logos", "wordmark-alt", true, "image/png"),
  meta("logos", "wordmark-en-alt", true, "image/png"),
  meta("logos", "wordmark-en", true, "image/png"),
  meta("logos", "wordmark-ko", true, "image/png"),
  meta("logos", "wordmark-koen-alt", true, "image/png"),
  meta("logos", "wordmark-koen", true, "image/png"),
  meta("logos", "wordmark", true, "image/png"),
];

/** category 로 필터. */
export function genietAssetsByCategory(category: GenietAssetCategory): GenietAssetMeta[] {
  return GENIET_ASSET_METADATA.filter((m) => m.category === category);
}

/** (category, id) 단건 조회. */
export function genietAsset(
  category: GenietAssetCategory,
  id: string,
): GenietAssetMeta | undefined {
  return GENIET_ASSET_METADATA.find((m) => m.category === category && m.id === id);
}
