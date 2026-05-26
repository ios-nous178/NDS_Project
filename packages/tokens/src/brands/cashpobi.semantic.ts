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
 *   2. **ButtonBG/Disabled = atomic Neutral/400 (#DDDDDD)** — Solid/Primary 와
 *      Solid/Secondary 모두 같은 회색 disabled bg 위에 흰 텍스트를 올린다
 *      (Figma ButtonGuide 3098:1032 Default → Disabled 행 SSOT). 노란 톤이 아니다.
 *   3. **Brand/Logo 그룹 신규** — 캐시워크 로고용 Brown 톤 3종.
 *      types.ts 의 `brandLogo?` 슬롯 (캐포비 전용 확장).
 *   4. **Text/Link 그룹 신규** — Blue/500 (#007AFF). types.ts 의 `text.link?` 슬롯.
 *   5. **ButtonBG/Secondary = 검정 (#000000)** — Figma ButtonGuide 의 "Solid/Secondary"
 *      슬롯 (3098:1032). Geniet 의 dark inverse 와 동일한 슬롯 운용:
 *      color=secondary, variant=solid 가 캐포비 시그니처 검정 버튼으로 렌더.
 *      ButtonBG/Outlined 슬롯은 Figma 미정의 → 흰 배경 유지.
 *      (※ Figma 캔버스 라벨은 "Neutral" 로 표기되지만 DS 네이밍은 "Secondary".)
 *   6. **Button/Outlined disabled = Neutral/300 (#E7E7E7) + text Neutral/500 (#BBB)** —
 *      Outlined/Secondary default·disabled border, Outlined/Primary disabled border 모두
 *      같은 #E7E7E7 사용. `buttonBorder.*.disabled` 슬롯과 `buttonText.disabled` 에 반영.
 *      (Border/Normal 자체는 카드/Input 광역 사용이라 #EEEEEE 유지 — 충돌 없음.)
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
    // 주의: Border/Normal 은 Card/Input/Modal 등 광범위하게 쓰임.
    // Figma ButtonGuide 의 Outlined/Secondary border (#E7E7E7) 와는 1-step 차이가 있지만,
    // SemanticColorGuide 의 Border/Normal 정의(#EEEEEE) 를 따른다.
    // Outlined/Secondary 만 따로 진한 보더가 필요하면 `buttonBorder.assistive.default`
    // (#E7E7E7) 슬롯을 컴포넌트 레벨에서 채택하는 방식으로 처리.
    // (Figma 캔버스 라벨 "Neutral" = DS 네이밍 "Secondary".)
    normal: { default: cashpobiNeutral[200] }, // #EEEEEE — Border/Normal
    strong: { default: cashpobiNeutral[400] }, // #DDDDDD — Border/Strong
    subtle: { default: cashpobiNeutral[100] }, // #F5F5F5 — Border/Subtle
    focus: { default: cashpobiYellow[500] }, // #FFD200 — Border/Focus (브랜드 정체성)
    brand: {
      default: cashpobiYellow[500], // #FFD200 — Border/Brand
      disabled: cashpobiNeutral[400], // #DDDDDD — assistive/solid bg 와 페어 (base extension)
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

  // ─── Button (Figma ButtonGuide 3098:1032 SSOT) ───────
  // Figma 캔버스 라벨은 "Neutral" 로 표기되지만 DS 네이밍은 "Secondary" — 동일 슬롯.
  // Solid/Primary 와 Solid/Secondary 의 disabled 페어는 동일:
  //   bg = Neutral/400 #DDDDDD + text = #FFFFFF (Figma 3098:1079 / 3098:1121).
  // Outlined disabled (Primary/Secondary 모두) 텍스트는 Neutral/500 #BBB,
  // 보더는 Neutral/300 #E7E7E7. → buttonBorder.*.disabled 슬롯에 반영.
  buttonBg: {
    default: cashpobiYellow[500], // #FFD200 — Solid/Primary Default
    hover: cashpobiYellow[600], // #FFC400 — Solid/Primary Hover
    pressed: cashpobiYellow[700], // #FEAF01 — Solid/Primary Pressed
    disabled: cashpobiNeutral[400], // #DDDDDD — Solid/Primary Disabled (Figma 3098:1079)
    // Solid/Secondary — 검정 fill + 흰 텍스트. Geniet dark inverse 와 동일 운용:
    // color=secondary, variant=solid 가 캐포비 시그니처 검정 버튼으로 렌더.
    secondary: {
      default: cashpobiCommon[1000], // #000000 — Solid/Secondary Default
      hover: cashpobiNeutral[800], // #333333 — Solid/Secondary Hover (살짝 옅은 톤)
      disabled: cashpobiNeutral[400], // #DDDDDD — Solid/Secondary Disabled (Figma 3098:1121)
    },
    outlined: {
      default: cashpobiCommon["00"], // #FFFFFF
      hover: cashpobiYellow[50], // #FFFEF5
      disabled: cashpobiCommon["00"], // #FFFFFF
    },
  },
  buttonText: {
    default: cashpobiNeutral[800], // #333333 — ButtonText/Default (Gray 800 on Yellow)
    brand: cashpobiYellow[700], // #FEAF01 — ButtonText/Outlined
    // Solid/Secondary disabled = 흰 텍스트 (#FFFFFF) — Solid/Primary 와 같은 페어.
    secondary: {
      default: cashpobiCommon["00"], // #FFFFFF — 검정 bg 위 흰 텍스트
      disabled: cashpobiCommon["00"], // #FFFFFF — Solid/Secondary Disabled (#DDDDDD bg 위 흰)
    },
    // Outlined Primary/Secondary disabled 텍스트: Neutral/500 #BBB (Figma 3098:1205 등).
    disabled: cashpobiNeutral[500], // #BBBBBB — Outlined disabled text
  },
  buttonBorder: {
    outlined: {
      default: cashpobiYellow[500], // #FFD200 — Outlined/Primary default border
      hover: cashpobiYellow[600], // #FFC400 — Outlined/Primary hover border
      disabled: cashpobiNeutral[300], // #E7E7E7 — Outlined/Primary disabled border (Figma 3098:1205)
    },
    assistive: {
      default: cashpobiNeutral[300], // #E7E7E7 — Outlined/Secondary default border
      disabled: cashpobiNeutral[300], // #E7E7E7 — Outlined/Secondary disabled border
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
