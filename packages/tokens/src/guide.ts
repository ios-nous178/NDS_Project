/**
 * Design Guide 확정 메타데이터
 *
 * 시멘틱 토큰·컴포넌트 variant 중 "디자인 가이드로 명시적으로 확정된" 것을
 * 별도 표기하기 위한 메타. Storybook DesignGuideBadge 가 이 정보를 읽어
 * 카탈로그·variant 카드 옆에 가이드 출처(파일+노드)를 시각화한다.
 *
 * - `core`: 가이드 문서에 정식 등재된 토큰/조합
 * - `experimental`: 코드에는 있으나 가이드에 미반영(추후 합의 대상)
 *
 * 등록되지 않은 토큰/variant 는 미분류 — 자유롭게 사용 가능하나, 가이드
 * 진입 후보로 검토 필요.
 */

export type GuideStatus = "core" | "experimental";

export interface GuideMeta {
  status: GuideStatus;
  /** Figma node ID, 예: "171:10856" */
  figmaNode?: string;
  /** 부가 메모 (가이드 합의 일자, 결정 사유 등) */
  note?: string;
}

/**
 * 시멘틱 토큰 키 → GuideMeta.
 * 키는 `cv`/`--semantic-*` 의 dotted path (예: "primary.main", "surface.brand").
 *
 * 가이드 확정 토큰만 등록한다. role-based 그룹(surface/iconRole/...)은
 * Figma SemanticColorGuide 222:2 에서 1차 확정되었으므로 core 로 표기.
 */
export const semanticGuide: Record<string, GuideMeta> = {
  // ── Palette semantic (legacy cv) ──
  "primary.main": { status: "core", figmaNode: "222:2" },
  "primary.hover": { status: "core", figmaNode: "222:2" },
  "primary.pressed": { status: "core", figmaNode: "222:2" },
  "primary.bg": { status: "core", figmaNode: "222:2" },
  "primary.bgLighter": { status: "core", figmaNode: "222:2" },
  "secondary.sub": { status: "core", figmaNode: "222:2" },
  "error.main": { status: "core", figmaNode: "222:2" },
  "error.bg": { status: "core", figmaNode: "222:2" },
  "caution.main": { status: "core", figmaNode: "222:2" },
  "caution.bg": { status: "core", figmaNode: "222:2" },
  "success.main": { status: "core", figmaNode: "222:2" },
  "success.bg": { status: "core", figmaNode: "222:2" },

  // ── Role-based (merged from --eap-*) ──
  "surface.page": { status: "core", figmaNode: "222:2" },
  "surface.default": { status: "core", figmaNode: "222:2" },
  "surface.brand": { status: "core", figmaNode: "222:2" },
  "surface.brandSubtle": { status: "core", figmaNode: "222:2" },
  "textRole.strong": { status: "core", figmaNode: "222:2" },
  "textRole.normal": { status: "core", figmaNode: "222:2" },
  "textRole.subtle": { status: "core", figmaNode: "222:2" },
  "textRole.muted": { status: "core", figmaNode: "222:2" },
  "textRole.brand": { status: "core", figmaNode: "222:2" },
  "iconRole.strong": { status: "core", figmaNode: "227:2" },
  "iconRole.normal": { status: "core", figmaNode: "227:2" },
  "iconRole.brand": { status: "core", figmaNode: "227:2" },
  "iconRole.disabled": { status: "core", figmaNode: "227:2" },
  "iconRole.inverse": { status: "core", figmaNode: "227:2" },
  "borderRole.normal": { status: "core", figmaNode: "222:2" },
  "borderRole.focus": { status: "core", figmaNode: "222:2" },
  "input.bg": { status: "core", figmaNode: "294:12" },
  "input.borderFocus": { status: "core", figmaNode: "294:12" },
  "input.borderError": { status: "core", figmaNode: "294:12" },
  "input.placeholder": { status: "core", figmaNode: "294:12" },
  "input.helpertextDefault": { status: "core", figmaNode: "294:12" },
  "input.helpertextSuccess": { status: "core", figmaNode: "294:12" },
  "input.helpertextError": { status: "core", figmaNode: "294:12" },
  "input.helpertextDisabled": { status: "core", figmaNode: "294:12" },
};

/** dotted path 로 GuideMeta 조회 (미등록은 undefined) */
export function getSemanticGuide(path: string): GuideMeta | undefined {
  return semanticGuide[path];
}
