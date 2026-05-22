/**
 * Cashpobi Semantic Colors — Figma role-based 트리의 Partial override.
 *
 * SSOT: Figma 캐포비 Library / SemanticColorGuide (3222:458)
 *
 * Cashpobi(캐시워크 포 비지니스) 가 NudgeEAP base 와 다른 부분만 명시.
 * generate-css.js 가 이 트리를 `dist/cashpobi.css` 의 `--semantic-*` 변수로 emit.
 * CSS cascade 에 의해 NudgeEAP base 의 같은 변수를 덮어쓴다. 누락 키는 base 유지.
 *
 * 캐포비 가이드 특이점 (다른 브랜드 대비):
 *   1. **Input focus = Neutral/900 (검정)** — 다른 브랜드는 brand 색을 focus 에 쓰지만
 *      캐포비는 검정 outline 으로 강조 (가이드 명시).
 *   2. **ButtonBG/Disabled = Yellow/100** — neutral gray 가 아닌 노란 톤 disabled.
 *   3. **Brand/Logo 그룹 신규** — 캐시워크 로고용 Brown 톤 3종.
 *      types.ts 의 `brandLogo?` 슬롯 (캐포비 전용 확장).
 *   4. **Text/Link 그룹 신규** — Blue/500 (#007AFF). types.ts 의 `text.link?` 슬롯.
 *   5. ButtonBG/Secondary, ButtonBG/Outlined 슬롯은 가이드에 미정의 →
 *      Yellow subtle 톤으로 명시 (NudgeEAP base 의 blue cascade 회피).
 */

import {
  cashpobiBlue,
  cashpobiBrown,
  cashpobiCommon,
  cashpobiCoralRed,
  cashpobiGreen,
  cashpobiNeutral,
  cashpobiYellow,
} from "./cashpobi.palette.js";

export const cashpobiSemantic = {
  // ─── BG (7 tokens, 가이드 라벨 정확 매핑) ─────────────
  bg: {
    page: { default: cashpobiNeutral[50] }, // #FAFAFA — BG/Page/Default
    surface: {
      default: cashpobiCommon["00"], // #FFFFFF — BG/Surface/Default
      subtle: cashpobiNeutral[50], // #FAFAFA — BG/Surface/Subtle
    },
    section: { default: cashpobiNeutral[100] }, // #F5F5F5 — BG/Section/Default
    brand: {
      default: cashpobiYellow[500], // #FFD200 — BG/Brand/Default
      subtle: cashpobiYellow[100], // #FFFAE5 — BG/Brand/Subtle
    },
    inverse: { default: cashpobiNeutral[900] }, // #111111 — BG/Inverse/Default
    status: {
      success: cashpobiGreen[50], // #E5F8EE — BG/Status/Success
      error: cashpobiCoralRed[50], // #FFF5F5 — BG/Status/Error
      caution: cashpobiYellow[100], // #FFFAE5 — BG/Status/Caution
      info: cashpobiBlue[50], // #F5FAFF — BG/Status/Info
    },
    overlay: "rgba(0, 0, 0, 0.4)", // base NudgeEAP 와 동일
    disabled: cashpobiNeutral[200], // #EEEEEE — DS extension
  },

  // ─── Text (8 tokens, link 신규 슬롯 포함) ─────────────
  text: {
    strong: { default: cashpobiNeutral[900] }, // #111111 — Text/Strong
    normal: { default: cashpobiNeutral[800] }, // #333333 — Text/Normal
    subtle: { default: cashpobiNeutral[700] }, // #666666 — Text/Subtle
    muted: { default: cashpobiNeutral[500] }, // #BBBBBB — Text/Muted
    disabled: { default: cashpobiNeutral[400] }, // #DDDDDD — Text/Disabled
    inverse: { default: cashpobiCommon["00"] }, // #FFFFFF — Text/Inverse
    brand: {
      default: cashpobiYellow[800], // #FD9B02 — Text/Brand (가독성 위해 800)
      strong: cashpobiYellow[800], // #FD9B02 — Text/Brand/Strong (base alias)
    },
    link: { default: cashpobiBlue[500] }, // #007AFF — Text/Link/Default (캐포비 신규)
    status: {
      success: cashpobiGreen[600], // #00B350 — Text/Status/Success
      error: cashpobiCoralRed[500], // #FF4141 — Text/Status/Error
      caution: cashpobiYellow[800], // #FD9B02 — Text/Status/Caution
      info: cashpobiBlue[500], // #007AFF — Text/Status/Info
    },
  },

  // ─── Border (6 tokens) ───────────────────────────────
  border: {
    normal: { default: cashpobiNeutral[200] }, // #EEEEEE — Border/Normal
    strong: { default: cashpobiNeutral[400] }, // #DDDDDD — Border/Strong
    subtle: { default: cashpobiNeutral[100] }, // #F5F5F5 — Border/Subtle
    focus: { default: cashpobiYellow[500] }, // #FFD200 — Border/Focus (브랜드 정체성)
    brand: {
      default: cashpobiYellow[500], // #FFD200 — Border/Brand
      disabled: cashpobiNeutral[400], // #DDDDDD — base extension (가이드 미정의)
    },
    disabled: { default: cashpobiNeutral[200] }, // #EEEEEE — Border/Disabled
    status: {
      error: cashpobiCoralRed[500], // #FF4141 — base alias
      caution: cashpobiYellow[800], // #FD9B02 — text.status.caution 과 정합
    },
  },

  // ─── Icon (5 tokens) ─────────────────────────────────
  icon: {
    strong: { default: cashpobiNeutral[800] }, // #333333 — Icon/Strong
    normal: { default: cashpobiNeutral[700] }, // #666666 — Icon/Normal
    disabled: { default: cashpobiNeutral[400] }, // #DDDDDD — Icon/Disabled
    inverse: { default: cashpobiCommon["00"] }, // #FFFFFF — Icon/Inverse
    brand: { default: cashpobiYellow[700] }, // #FEAF01 — Icon/Brand (가이드 yellow/700)
    status: {
      success: cashpobiGreen[500], // #00CC5B
      error: cashpobiCoralRed[500], // #FF4141
      caution: cashpobiYellow[700], // #FEAF01 — 아이콘 가독성 위해 700
    },
  },

  // ─── Button (가이드 7 tokens · Outlined 단일 분기) ────
  buttonBg: {
    default: cashpobiYellow[500], // #FFD200 — ButtonBG/Default
    hover: cashpobiYellow[600], // #FFC400 — ButtonBG/Hover
    pressed: cashpobiYellow[700], // #FEAF01 — ButtonBG/Pressed
    disabled: cashpobiYellow[100], // #FFFAE5 — ButtonBG/Disabled (★ 노란 톤)
    // 가이드 미정의 — Yellow subtle 톤으로 base blue cascade 회피.
    secondary: {
      default: cashpobiYellow[50], // #FFFEF5
      hover: cashpobiYellow[100], // #FFFAE5
      disabled: cashpobiNeutral[200], // #EEEEEE
    },
    outlined: {
      default: cashpobiCommon["00"], // #FFFFFF
      hover: cashpobiYellow[50], // #FFFEF5
      disabled: cashpobiCommon["00"], // #FFFFFF
    },
  },
  buttonText: {
    default: cashpobiCommon[1000], // #000000 — ButtonText/Default (Black)
    brand: cashpobiYellow[700], // #FEAF01 — ButtonText/Outlined
    secondary: {
      default: cashpobiYellow[700], // #FEAF01 — 연한 노랑 bg 위 진한 노랑
      disabled: cashpobiNeutral[400], // #DDDDDD — buttonText.disabled 와 정합
    },
    disabled: cashpobiNeutral[400], // #DDDDDD — ButtonText/Disabled (★ 400)
  },
  buttonBorder: {
    outlined: {
      default: cashpobiYellow[500], // #FFD200 — Outlined border
      hover: cashpobiYellow[600], // #FFC400
      disabled: cashpobiNeutral[400], // #DDDDDD
    },
    assistive: {
      default: cashpobiNeutral[300], // #E7E7E7
      disabled: cashpobiNeutral[200], // #EEEEEE
    },
  },

  // ─── Fill — 가이드 미정의. brand 만 노랑 override, 나머지 base alias 명시 ───
  fill: {
    brand: {
      default: cashpobiYellow[500], // #FFD200
      hover: cashpobiYellow[600], // #FFC400
      pressed: cashpobiYellow[700], // #FEAF01
      disabled: cashpobiNeutral[300], // #E7E7E7
    },
    neutral: {
      default: cashpobiNeutral[800], // #333333
      subtle: cashpobiNeutral[100], // #F5F5F5
    },
    inverse: { default: cashpobiCommon["00"] },
    status: {
      error: cashpobiCoralRed[500],
      caution: cashpobiYellow[800], // text.status.caution 과 정합
    },
  },

  // ─── Input (7 tokens, focus = 검정 ★) ────────────────
  input: {
    bg: cashpobiCommon["00"], // #FFFFFF — Input/BG
    bgDisabled: cashpobiNeutral[50], // #FAFAFA — Input/BG/Disabled
    borderDefault: cashpobiNeutral[200], // #EEEEEE — Input/Border/Default
    borderHover: cashpobiNeutral[300], // #E7E7E7 — Input/Border/Hover
    borderFocus: cashpobiNeutral[900], // #111111 — Input/Border/Focus (★ 검정)
    borderError: cashpobiCoralRed[500], // #FF4141 — Input/Border/Error
    borderDisabled: cashpobiNeutral[200], // #EEEEEE — base alias
    placeholder: cashpobiNeutral[400], // #DDDDDD — Input/Placeholder
    // helpertext* — 가이드 미정의. text.* 슬롯과 정합되도록 명시.
    helpertextDefault: cashpobiNeutral[500], // #BBBBBB
    helpertextSuccess: cashpobiGreen[600], // #00B350
    helpertextError: cashpobiCoralRed[500], // #FF4141
    helpertextDisabled: cashpobiNeutral[400], // #DDDDDD
  },

  // ─── Brand/Logo (3 tokens, 캐시워크 로고용 — 캐포비 신규 그룹) ───
  brandLogo: {
    default: cashpobiBrown[500], // #5E5050 — Brand/Logo/Default
    subtle: cashpobiBrown[100], // #F2EAE8 — Brand/Logo/Subtle
    strong: cashpobiBrown[700], // #403535 — Brand/Logo/Strong
  },
} as const;

export type CashpobiSemanticTokens = typeof cashpobiSemantic;
