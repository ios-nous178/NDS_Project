/**
 * Trost(트로스트) 프로젝트 자산 메타데이터.
 *
 * 디자이너 Figma 의 native Export(PNG 1x/3x) 원본. Figma 노드 트리가 아닌
 * Export zip 에서 편입돼 figmaNodeId 는 보유하지 않는다 (Geniet 와 동일).
 *
 * **해상도**: 1x(base) + 3x(`@3x`) PNG — Geniet/NudgeEAP 컨벤션과 동일(2x 미보관).
 * raster PNG 라 dataUri 미제공 — 파일 호스팅 필수.
 * 외부 소비자는 `@nudge-design/assets/files/{filename}` 로 참조.
 *
 * 카테고리 (src 디렉토리와 1:1):
 *   - psych-tests   심리검사 카테고리 썸네일 아이콘 (Figma variant `Property 1=*`)
 *   - profiles      프로필 플레이스홀더 이미지
 *   - misc          기타 일러스트 (검사 완료 뱃지 등)
 */

export type TrostAssetCategory = "psych-tests" | "profiles" | "misc";

export interface TrostAssetMeta {
  /** 카테고리 (src 디렉토리명과 1:1). */
  category: TrostAssetCategory;
  /** 카테고리 내 식별자 (kebab-case, 파일명 stem). */
  id: string;
  /** `files/{filename}` — base(1x) 호스팅 경로. */
  filename: string;
  /** `files/{...}@3x.png` — 3x (raster 만). */
  filename3x?: string;
  mimeType: "image/png";
}

const DIR: Record<TrostAssetCategory, string> = {
  "psych-tests": "project/trost/images/psych-tests",
  profiles: "project/trost/images/profiles",
  misc: "project/trost/images/misc",
};

function meta(category: TrostAssetCategory, id: string, has3x: boolean): TrostAssetMeta {
  const base = `${DIR[category]}/${id}.png`;
  return {
    category,
    id,
    filename: base,
    ...(has3x ? { filename3x: `${DIR[category]}/${id}@3x.png` } : {}),
    mimeType: "image/png",
  };
}

export const TROST_ASSET_METADATA: readonly TrostAssetMeta[] = [
  // ── psych-tests (16) ──
  meta("psych-tests", "center", true),
  meta("psych-tests", "corona", true),
  meta("psych-tests", "d-type", true),
  meta("psych-tests", "depression", true),
  meta("psych-tests", "emotion", true),
  meta("psych-tests", "employment", true),
  meta("psych-tests", "event", true),
  meta("psych-tests", "job-stress", true),
  meta("psych-tests", "mbti", true),
  meta("psych-tests", "medicine", true),
  meta("psych-tests", "panic", true),
  meta("psych-tests", "personality", true),
  meta("psych-tests", "psych", true),
  meta("psych-tests", "routine", true),
  meta("psych-tests", "self-esteem", true),
  meta("psych-tests", "sound", true),

  // ── profiles (1) ──
  meta("profiles", "default-profile", true),

  // ── misc (1) ──
  meta("misc", "test-complete", true),
];

/** category 로 필터. */
export function trostAssetsByCategory(category: TrostAssetCategory): TrostAssetMeta[] {
  return TROST_ASSET_METADATA.filter((m) => m.category === category);
}

/** (category, id) 단건 조회. */
export function trostAsset(category: TrostAssetCategory, id: string): TrostAssetMeta | undefined {
  return TROST_ASSET_METADATA.find((m) => m.category === category && m.id === id);
}
