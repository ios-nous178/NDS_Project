/**
 * Design Guide 확정 메타데이터
 *
 * Figma SemanticColorGuide(171:6675) 에 등재된 role-based 시멘틱 토큰 메타.
 * Storybook DesignGuideBadge 가 이 정보를 읽어 카탈로그·variant 카드 옆에
 * 가이드 출처(파일+노드)를 시각화한다.
 *
 * 키는 `cv` dotted path (예: "surface.brand", "iconRole.statusError").
 *
 * - `core`: Figma 가이드에 정식 등재된 토큰
 * - `experimental`: 코드에는 있으나 가이드에 미반영
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
 * 키는 `cv` dotted path (예: "surface.brand", "iconRole.brand").
 *
 * Figma 171:6675 SemanticColorGuide 의 9개 섹션(BG/Text/ButtonBG/ButtonText/
 * ButtonBorder/Input/Icon/Border/Fill) 전체가 core 다.
 */
export const semanticGuide: Record<string, GuideMeta> = {
  // ── BG (Section_BG 258:2) ──
  "surface.page": { status: "core", figmaNode: "258:2" },
  "surface.default": { status: "core", figmaNode: "258:2" },
  "surface.subtle": { status: "core", figmaNode: "258:2" },
  "surface.section": { status: "core", figmaNode: "258:2" },
  "surface.brand": { status: "core", figmaNode: "258:2" },
  "surface.brandSubtle": { status: "core", figmaNode: "258:2" },
  "surface.inverse": { status: "core", figmaNode: "258:2" },
  "surface.statusError": { status: "core", figmaNode: "258:2" },
  "surface.statusSuccess": { status: "core", figmaNode: "258:2" },
  "surface.statusInfo": { status: "core", figmaNode: "258:2" },
  "surface.statusCaution": { status: "core", figmaNode: "258:2" },
  "surface.overlay": { status: "core", figmaNode: "258:2" },
  "surface.disabled": {
    status: "experimental",
    note: "DS extension — Figma 미정의. 비활성 컨트롤 bg 용도.",
  },

  // ── Text (Section_Text 259:2) ──
  "textRole.strong": { status: "core", figmaNode: "259:2" },
  "textRole.normal": { status: "core", figmaNode: "259:2" },
  "textRole.subtle": { status: "core", figmaNode: "259:2" },
  "textRole.muted": { status: "core", figmaNode: "259:2" },
  "textRole.disabled": { status: "core", figmaNode: "259:2" },
  "textRole.inverse": { status: "core", figmaNode: "259:2" },
  "textRole.brand": { status: "core", figmaNode: "259:2" },
  "textRole.brandStrong": { status: "core", figmaNode: "259:2" },
  "textRole.statusSuccess": { status: "core", figmaNode: "259:2" },
  "textRole.statusError": { status: "core", figmaNode: "259:2" },
  "textRole.statusCaution": { status: "core", figmaNode: "259:2" },
  "textRole.statusInfo": { status: "core", figmaNode: "259:2" },

  // ── Icon (Section_Icon 227:2) ──
  "iconRole.strong": { status: "core", figmaNode: "227:2" },
  "iconRole.normal": { status: "core", figmaNode: "227:2" },
  "iconRole.disabled": { status: "core", figmaNode: "227:2" },
  "iconRole.inverse": { status: "core", figmaNode: "227:2" },
  "iconRole.brand": { status: "core", figmaNode: "227:2" },
  "iconRole.statusSuccess": { status: "core", figmaNode: "227:2" },
  "iconRole.statusError": { status: "core", figmaNode: "227:2" },
  "iconRole.statusCaution": { status: "core", figmaNode: "227:2" },

  // ── Border (Section_Border 227:86) ──
  "borderRole.normal": { status: "core", figmaNode: "227:86" },
  "borderRole.strong": { status: "core", figmaNode: "227:86" },
  "borderRole.subtle": { status: "core", figmaNode: "227:86" },
  "borderRole.focus": { status: "core", figmaNode: "227:86" },
  "borderRole.brand": { status: "core", figmaNode: "227:86" },
  "borderRole.brandDisabled": { status: "core", figmaNode: "227:86" },
  "borderRole.disabled": { status: "core", figmaNode: "227:86" },
  "borderRole.statusError": { status: "core", figmaNode: "227:86" },
  "borderRole.statusCaution": { status: "core", figmaNode: "227:86" },

  // ── Fill (Section_Fill 227:160) ──
  "fill.brand": { status: "core", figmaNode: "227:160" },
  "fill.brandHover": { status: "core", figmaNode: "227:160" },
  "fill.brandPressed": { status: "core", figmaNode: "227:160" },
  "fill.brandDisabled": { status: "core", figmaNode: "227:160" },
  "fill.neutral": { status: "core", figmaNode: "227:160" },
  "fill.neutralSubtle": { status: "core", figmaNode: "227:160" },
  "fill.inverse": { status: "core", figmaNode: "227:160" },
  "fill.statusError": { status: "core", figmaNode: "227:160" },
  "fill.statusCaution": { status: "core", figmaNode: "227:160" },

  // ── Button (Section_ButtonBG/Text/Border 231:2 / 231:46 / 261:32) ──
  "button.bgDefault": { status: "core", figmaNode: "231:2" },
  "button.bgHover": { status: "core", figmaNode: "231:2" },
  "button.bgPressed": { status: "core", figmaNode: "231:2" },
  "button.bgDisabled": { status: "core", figmaNode: "231:2" },
  "button.bgSecondary": { status: "core", figmaNode: "231:2" },
  "button.bgSecondaryHover": { status: "core", figmaNode: "231:2" },
  "button.bgSecondaryDisabled": { status: "core", figmaNode: "231:2" },
  "button.bgOutlined": { status: "core", figmaNode: "231:2" },
  "button.bgOutlinedHover": { status: "core", figmaNode: "231:2" },
  "button.bgOutlinedDisabled": { status: "core", figmaNode: "231:2" },
  "button.textDefault": { status: "core", figmaNode: "231:46" },
  "button.textBrand": { status: "core", figmaNode: "231:46" },
  "button.textDisabled": { status: "core", figmaNode: "231:46" },
  "button.borderOutlined": { status: "core", figmaNode: "261:32" },
  "button.borderOutlinedHover": { status: "core", figmaNode: "261:32" },
  "button.borderOutlinedDisabled": { status: "core", figmaNode: "261:32" },
  "button.borderAssistive": { status: "core", figmaNode: "261:32" },
  "button.borderAssistiveDisabled": { status: "core", figmaNode: "261:32" },

  // ── Input (Section_Input 294:12) ──
  "input.bg": { status: "core", figmaNode: "294:12" },
  "input.bgDisabled": { status: "core", figmaNode: "294:12" },
  "input.borderDefault": { status: "core", figmaNode: "294:12" },
  "input.borderHover": { status: "core", figmaNode: "294:12" },
  "input.borderFocus": { status: "core", figmaNode: "294:12" },
  "input.borderError": { status: "core", figmaNode: "294:12" },
  "input.borderDisabled": { status: "core", figmaNode: "294:12" },
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
