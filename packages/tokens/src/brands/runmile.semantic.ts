/**
 * Runmile Semantic Colors — Figma role-based 트리의 Partial override.
 *
 * Runmile 가 NudgeEAP base(brands/nudge-eap.semantic.ts) 와 다른 부분만 명시.
 * generate-css.js 가 이 트리를 `dist/runmile.css` 의 `--semantic-*` 변수로 emit.
 * CSS cascade 에 의해 NudgeEAP base 의 같은 변수를 덮어쓴다.
 *
 * 누락된 키는 base 값이 그대로 유지된다.
 *
 * SSOT: Figma 런마일 library (60:1245)
 */

import {
  runmileBlue,
  runmileGray,
  runmileNeutral,
  runmileOrange,
  runmileRed,
} from "./runmile.palette.js";

export const runmileSemantic = {
  bg: {
    page: { default: runmileNeutral.white }, // #FFFFFF — 본문 페이지
    surface: {
      default: runmileNeutral.white, // #FFFFFF
      // Figma chip type=assetive2 / ghost neutral 등에서 사용하는 light gray fill 톤 — gray200 SSOT.
      subtle: runmileGray[200], // #F2F4F6
    },
    section: { default: runmileGray[200] }, // #F2F4F6 — 섹션 구분 bg
    brand: {
      default: runmileOrange[500], // #FF5B37
      subtle: runmileOrange[100], // #FFF7F5
    },
    inverse: { default: runmileNeutral.black }, // #221E1F
    status: {
      error: runmileRed[200], // #FFE9E9
      info: runmileOrange[100], // #FFF7F5 — brand info bg
    },
    overlay: "rgba(0, 0, 0, 0.5)",
    disabled: runmileGray[300], // #E5E8EB
  },
  text: {
    strong: { default: runmileNeutral.black }, // #221E1F
    normal: { default: runmileGray[900] }, // #333D4B
    subtle: { default: runmileGray[800] }, // #4E5968
    muted: { default: runmileGray[700] }, // #6B7684 — secondary 라벨
    disabled: { default: runmileGray[500] }, // #B0B8C1
    inverse: { default: runmileNeutral.white }, // #FFFFFF
    brand: {
      default: runmileOrange[500], // #FF5B37
      strong: runmileOrange[500], // #FF5B37
    },
    status: {
      error: runmileRed[500], // #FF2428
      info: runmileBlue[500], // #007AFF
    },
  },
  // Button — Figma 111:477 — 3 sematic × 2 style × 5 size × 3 state.
  //   Solid/Primary    : bg=orange500, text=white
  //   Solid/Secondary  : bg=black(#221E1F), text=white  ← dark inverse 패턴 (gray900 아님)
  //   Solid/Assistive  : bg=gray200, text=gray800
  //   Outlined/Primary : bg=white, text=orange500, border=orange500
  //   Outlined/Secondary: bg=white, text=black, border=black (base 의 secondary.outlined 패턴이 자동 적용)
  //   Outlined/Assistive: bg=white, text=gray800, border=gray400
  buttonBg: {
    default: runmileOrange[500], // #FF5B37 — Solid/Primary
    hover: runmileOrange[400], // #FF805C — Solid/Primary Hover (Figma SSOT: runmile/primary/orange/400)
    pressed: "#D33E20",
    disabled: runmileGray[300], // #E5E8EB
    secondary: {
      default: runmileNeutral.black, // #221E1F — Figma SSOT (gray900 아님)
      hover: runmileGray[900], // #333D4B
      disabled: runmileGray[300], // #E5E8EB
    },
    outlined: {
      default: runmileNeutral.white, // #FFFFFF
      hover: runmileOrange[100], // #FFF7F5
      disabled: runmileNeutral.white,
    },
    // Solid/Assistive — Figma SSOT (gray200 / gray300 / gray400 페어).
    assistive: {
      default: runmileGray[200], // #F2F4F6 — Solid/Assistive Default
      hover: runmileGray[300], // #E5E8EB — Solid/Assistive Hover
      disabled: runmileGray[400], // #D1D6DB — Solid/Assistive Disabled (Figma 111:615)
    },
  },
  buttonText: {
    default: runmileNeutral.white, // #FFFFFF
    brand: runmileOrange[500], // #FF5B37 — Outlined/Primary 텍스트
    secondary: {
      default: runmileNeutral.white, // #FFFFFF — dark bg 위
      disabled: runmileGray[500], // #B0B8C1
    },
    // Solid+Outlined Assistive enabled 텍스트 — Figma SSOT gray800.
    assistive: runmileGray[800], // #4E5968
    // Outlined Assistive disabled 텍스트 — Figma SSOT gray600. Solid Assistive disabled 텍스트는
    // base 가 cv.surface.default(white) 를 사용 → Figma 111:615 (white 텍스트) 자동 매칭.
    assistiveDisabled: runmileGray[600], // #919CAA
    disabled: runmileGray[500], // #B0B8C1
  },
  buttonBorder: {
    outlined: {
      default: runmileOrange[500], // #FF5B37
      // Outlined/Primary Hover — Figma SSOT border 만 orange400 으로 톤다운 (bg 변경 없음).
      hover: runmileOrange[400], // #FF805C
      disabled: runmileGray[300], // #E5E8EB
    },
    assistive: {
      default: runmileGray[400], // #D1D6DB — Figma Outlined/Assistive border
      // Outlined Assistive disabled border 도 동일 gray400 (Figma 111:711).
      disabled: runmileGray[400], // #D1D6DB
    },
  },
  // Icon — Figma 런마일 library (20:94) 의 5 컬러 슬롯 미러.
  //   color=black     → strong   (#221E1F)
  //   color=gray800   → normal   (#4E5968)
  //   color=gray600   → muted    (#919CAA) — BottomNav inactive · secondary 아이콘
  //   color=white     → inverse  (#FFFFFF)
  //   color=orange500 → brand    (#FF5B37)
  //   color=red500    → status.error (#FF2428)
  icon: {
    strong: { default: runmileNeutral.black }, // #221E1F
    normal: { default: runmileGray[800] }, // #4E5968
    muted: { default: runmileGray[600] }, // #919CAA
    disabled: { default: runmileGray[400] }, // #D1D6DB
    inverse: { default: runmileNeutral.white },
    brand: { default: runmileOrange[500] }, // #FF5B37
    status: {
      error: runmileRed[500], // #FF2428
    },
  },
  border: {
    // Figma SSOT — chip assetive1 outline, text-input default border-b, divider 등 default neutral 보더는 gray400.
    normal: { default: runmileGray[400] }, // #D1D6DB
    strong: { default: runmileGray[500] }, // #B0B8C1
    subtle: { default: runmileGray[300] }, // #E5E8EB
    focus: { default: runmileOrange[500] }, // #FF5B37
    brand: {
      default: runmileOrange[500],
      disabled: runmileGray[300],
    },
    disabled: { default: runmileGray[300] }, // #E5E8EB
    status: {
      error: runmileRed[500], // #FF2428
    },
  },
  fill: {
    brand: {
      default: runmileOrange[500], // #FF5B37
      hover: "#E84A28",
      pressed: "#D33E20",
      disabled: runmileGray[300],
    },
    neutral: {
      // Figma chip type=secondary fill 이 gray900 (#333D4B). NudgeEAP base 처럼
      // gray800 보다 한 단계 더 진한 톤이 SSOT.
      default: runmileGray[900], // #333D4B
      subtle: runmileGray[200], // #F2F4F6
    },
    inverse: { default: runmileNeutral.white },
    status: {
      error: runmileRed[500], // #FF2428
    },
  },
  input: {
    bg: runmileNeutral.white, // #FFFFFF
    bgDisabled: runmileGray[100], // #F9FAFB
    // Figma text-input (144:609) default border-b 가 gray400. typing 시 black.
    borderDefault: runmileGray[400], // #D1D6DB
    borderHover: runmileGray[500], // #B0B8C1
    borderFocus: runmileOrange[500], // #FF5B37
    borderError: runmileRed[500], // #FF2428
    borderDisabled: runmileGray[300], // #E5E8EB
    placeholder: runmileGray[500], // #B0B8C1
    helpertextDefault: runmileGray[700], // #6B7684
    helpertextSuccess: runmileOrange[500], // #FF5B37 — brand-as-success
    helpertextError: runmileRed[500], // #FF2428
    helpertextDisabled: runmileGray[400], // #D1D6DB
  },
} as const;

export type RunmileSemanticTokens = typeof runmileSemantic;
