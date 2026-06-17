/**
 * Runmile Semantic Colors — Figma role-based 트리의 Partial override.
 *
 * Runmile 가 NudgeEAP base(brands/nudge-eap.semantic.ts) 와 다른 부분만 명시.
 * generate-css.js 가 이 트리를 `dist/runmile.css` 의 `--semantic-*` 변수로 emit.
 * CSS cascade 에 의해 NudgeEAP base 의 같은 변수를 덮어쓴다.
 *
 * 누락된 키는 base 값이 그대로 유지된다.
 *
 * SSOT: Figma 런마일 Library — SemanticColorGuide (5009:2)
 *   https://www.figma.com/design/MssCIDnDdAjStQXHclPNIc/런마일---Library?node-id=5009-2
 *
 * Figma role → 본 트리 매핑 (text/icon 은 base 컨벤션과 동일하게 단조 darkening):
 *   strong = Strong(#221E1F) · normal = Title(gray900) · subtle = Normal(gray800) ·
 *   muted  = Subtle(gray700) · disabled = Disabled(gray500). Placeholder(gray600)=input.placeholder.
 */

import {
  runmileBlue,
  runmileGray,
  runmileGreen,
  runmileNeutral,
  runmileOrange,
  runmileRed,
  runmileYellow,
} from "./runmile.palette.js";

export const runmileSemantic = {
  bg: {
    page: { default: runmileNeutral.white }, // #FFFFFF — 본문 페이지
    surface: {
      default: runmileNeutral.white, // #FFFFFF — BG/Surface/Default
      // BG/Surface/Subtle = gray100 (구 gray200 에서 갱신).
      subtle: runmileGray[100], // #F9FAFB
    },
    section: { default: runmileGray[200] }, // #F2F4F6 — BG/Surface/Section
    brand: {
      default: runmileOrange[500], // #FF5B37 — BG/Brand/Default
      subtle: runmileOrange[100], // #FFF0ED — BG/Brand/Subtle
    },
    inverse: { default: runmileNeutral.black }, // #221E1F
    status: {
      error: runmileRed[100], // #FFE4E4 — BG/Error
      info: runmileBlue[100], // #8DD0FF — BG/Info (구 brand-orange tint 에서 blue 로 갱신)
      caution: runmileYellow[100], // #FFF3CC — BG/Warning
      success: runmileGreen[100], // #C0EDCD — BG/Success
    },
    overlay: "rgba(0, 0, 0, 0.5)",
    // BG/Disabled = gray200 (구 gray300 에서 갱신).
    disabled: runmileGray[200], // #F2F4F6
  },
  text: {
    strong: { default: runmileNeutral.black }, // #221E1F — Text/Strong
    normal: { default: runmileGray[900] }, // #333D4B — Text/Title (primary body)
    subtle: { default: runmileGray[800] }, // #4E5968 — Text/Normal
    muted: { default: runmileGray[700] }, // #6B7684 — Text/Subtle
    disabled: { default: runmileGray[500] }, // #B0B8C1 — Text/Disabled
    inverse: { default: runmileNeutral.white }, // #FFFFFF
    onBrand: { default: runmileNeutral.white }, // #FFFFFF — Text/OnBrand
    link: { default: runmileBlue[500] }, // #007AFF — Text/Link
    brand: {
      default: runmileOrange[500], // #FF5B37 — Text/Brand
      strong: runmileOrange[500], // #FF5B37
    },
    status: {
      error: runmileRed[500], // #FF2428 — Text/Error
      info: runmileBlue[500], // #007AFF — Text/Info
      caution: runmileYellow.text, // #F39E00 — Text/Warning
      success: runmileGreen[500], // #00C255 — Text/Success
    },
  },
  // Button — Figma 런마일 ButtonGuide (5124:390, "어드민 기준").
  //   tone = Primary / Neutral 둘뿐 (Secondary 없음 — 검정 솔리드는 Neutral 이다).
  //   style = Solid / Soft / Outlined · 5 size (Mini40/S44/M48/L52/XL56) · 3 state.
  //   Solid/Primary    : bg=orange500, text=white
  //   Solid/Neutral    : bg=black(#221E1F), text=white     ← 검정 솔리드 · 강한 위계 (캐포비와 동일 패턴)
  //   Soft/Neutral     : bg=gray200(surface.section), text=black  ← 회색 옅은 BG · 가벼운 보조 (styleMap soft 가 처리)
  //   Outlined/Primary : bg=white, text=orange500, border=orange500
  //   Outlined/Neutral : bg=white, text=gray800, border=gray400
  buttonBg: {
    default: runmileOrange[500], // #FF5B37 — Solid/Primary
    hover: runmileOrange[400], // #FF805C — Solid/Primary Hover
    pressed: "#D33E20",
    disabled: runmileGray[300], // #E5E8EB
    // @deprecated tone — 신규 가이드엔 Secondary 없음. 검정 CTA 는 color="neutral" 사용.
    // 하위호환용 검정값만 유지 (캐포비와 동일 운용 · Button BRAND_TONE_DENYLIST 가 경고).
    secondary: {
      default: runmileNeutral.black, // #221E1F
      hover: runmileGray[900], // #333D4B
      disabled: runmileGray[300], // #E5E8EB
    },
    outlined: {
      default: runmileNeutral.white, // #FFFFFF
      hover: runmileOrange[100], // #FFF0ED
      disabled: runmileNeutral.white,
    },
    // Solid/Neutral — 검정 솔리드 CTA (Figma "Solid Neutral = 검정 솔리드"). 흰 텍스트 페어.
    //   default=black / hover=gray900 / disabled=gray300 (Solid/Primary disabled 와 동일 회색).
    neutral: {
      default: runmileNeutral.black, // #221E1F — Solid/Neutral Default (검정)
      hover: runmileGray[900], // #333D4B — Solid/Neutral Hover
      disabled: runmileGray[300], // #E5E8EB — Solid/Neutral Disabled
    },
  },
  buttonText: {
    default: runmileNeutral.white, // #FFFFFF
    brand: runmileOrange[500], // #FF5B37 — Outlined/Primary 텍스트
    secondary: {
      default: runmileNeutral.white, // #FFFFFF — dark bg 위
      disabled: runmileGray[500], // #B0B8C1
    },
    // Outlined/Weak Neutral enabled 텍스트 — Figma SSOT gray800.
    neutral: runmileGray[800], // #4E5968
    // Solid Neutral 텍스트 — 검정(#221E1F) fill 위 흰 글자 (Solid Neutral = 검정 솔리드).
    neutralSolid: runmileNeutral.white, // #FFFFFF
    // Outlined Neutral disabled 텍스트 — Figma SSOT gray600.
    neutralDisabled: runmileGray[600], // #8B95A1
    disabled: runmileGray[500], // #B0B8C1
  },
  buttonBorder: {
    outlined: {
      default: runmileOrange[500], // #FF5B37
      // Outlined/Primary Hover — border 만 orange400 으로 톤다운 (bg 변경 없음).
      hover: runmileOrange[400], // #FF805C
      disabled: runmileGray[300], // #E5E8EB
    },
    neutral: {
      default: runmileGray[400], // #D1D6DB — Figma Outlined/Neutral border
      disabled: runmileGray[400], // #D1D6DB
    },
  },
  // Icon — Figma 런마일 Library SemanticColorGuide (5009:2) 의 아이콘 슬롯 미러.
  //   Icon/Strong   → strong   (#221E1F)
  //   Icon/Normal   → normal   (#4E5968 / gray800)
  //   Icon/Subtle   → subtle   (#6B7684 / gray700)
  //   gray600       → muted    (#8B95A1) — BottomNav inactive · secondary 아이콘 (footer 슬롯이 참조)
  //   Icon/Disabled → disabled (#B0B8C1 / gray500)
  //   Icon/OnBrand  → inverse / onBrand (#FFFFFF)
  //   Icon/Brand    → brand    (#FF5B37)
  icon: {
    strong: { default: runmileNeutral.black }, // #221E1F
    normal: { default: runmileGray[800] }, // #4E5968
    subtle: { default: runmileGray[700] }, // #6B7684 — Icon/Subtle
    muted: { default: runmileGray[600] }, // #8B95A1 — BottomNav inactive
    disabled: { default: runmileGray[500] }, // #B0B8C1 — Icon/Disabled
    inverse: { default: runmileNeutral.white }, // #FFFFFF
    onBrand: { default: runmileNeutral.white }, // #FFFFFF — Icon/OnBrand
    brand: { default: runmileOrange[500] }, // #FF5B37
    status: {
      error: runmileRed[500], // #FF2428 — Icon/Error
      caution: runmileYellow.text, // #F39E00 — Icon/Warning
      success: runmileGreen[500], // #00C255 — Icon/Success
    },
  },
  border: {
    normal: { default: runmileGray[300] }, // #E5E8EB — Border/Default
    strong: { default: runmileGray[800] }, // #4E5968 — Border/Strong
    subtle: { default: runmileGray[200] }, // #F2F4F6 — Border/Subtle
    focus: { default: runmileBlue[500] }, // #007AFF — Border/Focus (구 orange 에서 blue 로 갱신)
    brand: {
      default: runmileOrange[500], // #FF5B37 — Border/Brand
      disabled: runmileGray[300],
    },
    disabled: { default: runmileGray[300] }, // #E5E8EB
    status: {
      error: runmileRed[500], // #FF2428 — Border/Error
      success: runmileGreen[500], // #00C255 — Border/Success
      caution: runmileYellow[500], // #FFC400
    },
  },
  fill: {
    brand: {
      default: runmileOrange[500], // #FF5B37 — Fill/Brand
      hover: "#E84A28",
      pressed: "#D33E20",
      subtle: runmileOrange[100], // #FFF0ED — Fill/Brand-Subtle
      disabled: runmileGray[300],
    },
    neutral: {
      // Figma chip type=secondary fill 이 gray900 (#333D4B).
      default: runmileGray[900], // #333D4B
      subtle: runmileGray[200], // #F2F4F6
    },
    inverse: { default: runmileNeutral.white },
    status: {
      error: runmileRed[500], // #FF2428
      caution: runmileYellow[500], // #FFC400
    },
  },
  input: {
    bg: runmileNeutral.white, // #FFFFFF
    bgDisabled: runmileGray[100], // #F9FAFB
    // Figma text-input default border-b 가 gray400. typing 시 black.
    borderDefault: runmileGray[400], // #D1D6DB
    borderHover: runmileGray[500], // #B0B8C1
    // Figma 런마일 Text Input (5095:200): typing(포커스) 하단 라인 = 검정(#221E1F).
    // 일반 Border/Focus(=blue #007AFF, border.focus)와 분리된 input 전용 토큰 — 캐포비와 동일 패턴.
    borderFocus: runmileNeutral.black, // #221E1F
    borderError: runmileRed[500], // #FF2428
    borderDisabled: runmileGray[300], // #E5E8EB
    placeholder: runmileGray[600], // #8B95A1 — Text/Placeholder
    helpertextDefault: runmileGray[700], // #6B7684
    helpertextSuccess: runmileGreen[500], // #00C255 — Text/Success
    helpertextError: runmileRed[500], // #FF2428
    helpertextDisabled: runmileGray[400], // #D1D6DB
  },
} as const;

export type RunmileSemanticTokens = typeof runmileSemantic;
