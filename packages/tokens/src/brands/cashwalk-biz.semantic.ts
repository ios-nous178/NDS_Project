/**
 * CashwalkBiz Semantic Colors — Figma role-based 트리의 Partial override.
 *
 * SSOT: Figma 캐포비 Library / SemanticColorGuide (3222:458)
 *
 * CashwalkBiz(캐시워크 포 비지니스) 가 NudgeEAP base 와 다른 부분만 명시.
 * generate-css.js 가 이 트리를 `dist/cashwalk-biz.css` 의 `--semantic-*` 변수로 emit.
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
  cashwalkBizBlue,
  cashwalkBizBrown,
  cashwalkBizCommon,
  cashwalkBizCoralRed,
  cashwalkBizGreen,
  cashwalkBizNeutral,
  cashwalkBizYellow,
} from "./cashwalk-biz.palette.js";

export const cashwalkBizSemantic = {
  // ─── BG (7 tokens, 가이드 라벨 정확 매핑) ─────────────
  bg: {
    page: { default: cashwalkBizNeutral[50] }, // #FAFAFA — BG/Page/Default
    surface: {
      default: cashwalkBizCommon["00"], // #FFFFFF — BG/Surface/Default
      subtle: cashwalkBizNeutral[50], // #FAFAFA — BG/Surface/Subtle
    },
    section: { default: cashwalkBizNeutral[100] }, // #F5F5F5 — BG/Section/Default
    brand: {
      default: cashwalkBizYellow[500], // #FFD200 — BG/Brand/Default
      subtle: cashwalkBizYellow[100], // #FFFAE5 — BG/Brand/Subtle
    },
    inverse: { default: cashwalkBizNeutral[900] }, // #111111 — BG/Inverse/Default
    status: {
      success: cashwalkBizGreen[50], // #E5F8EE — BG/Status/Success
      error: cashwalkBizCoralRed[50], // #FFF5F5 — BG/Status/Error
      caution: cashwalkBizYellow[100], // #FFFAE5 — BG/Status/Caution
      info: cashwalkBizYellow[100], // #FFFAE5 — BG/Status/Info (brand-subtle 와 동일 톤)
    },
    overlay: "rgba(0, 0, 0, 0.4)", // base NudgeEAP 와 동일
    disabled: cashwalkBizNeutral[200], // #EEEEEE — DS extension
  },

  // ─── Text (8 tokens, link 신규 슬롯 포함) ─────────────
  text: {
    strong: { default: cashwalkBizNeutral[900] }, // #111111 — Text/Strong
    normal: { default: cashwalkBizNeutral[800] }, // #333333 — Text/Normal
    subtle: { default: cashwalkBizNeutral[700] }, // #666666 — Text/Subtle
    muted: { default: cashwalkBizNeutral[500] }, // #BBBBBB — Text/Muted
    disabled: { default: cashwalkBizNeutral[500] }, // #BBBBBB — Text/Disabled (Figma 3222:458, muted 와 동일)
    inverse: { default: cashwalkBizCommon["00"] }, // #FFFFFF — Text/Inverse
    brand: {
      default: cashwalkBizYellow[800], // #FD9B02 — Text/Brand (가독성 위해 800)
      strong: cashwalkBizYellow[800], // #FD9B02 — Text/Brand/Strong (base alias)
    },
    link: { default: cashwalkBizBlue[500] }, // #007AFF — Text/Link/Default (캐포비 신규)
    status: {
      success: cashwalkBizGreen[600], // #00B350 — Text/Status/Success
      error: cashwalkBizCoralRed[500], // #FC3500 — Text/Status/Error
      caution: cashwalkBizYellow[800], // #FD9B02 — Text/Status/Caution
      info: cashwalkBizBlue[600], // #006FE6 — Text/Status/Info (Figma 3222:458)
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
    normal: { default: cashwalkBizNeutral[200] }, // #EEEEEE — Border/Normal
    strong: { default: cashwalkBizNeutral[400] }, // #DDDDDD — Border/Strong
    subtle: { default: cashwalkBizNeutral[100] }, // #F5F5F5 — Border/Subtle
    focus: { default: cashwalkBizYellow[500] }, // #FFD200 — Border/Focus (브랜드 정체성)
    brand: {
      default: cashwalkBizYellow[500], // #FFD200 — Border/Brand
      disabled: cashwalkBizNeutral[400], // #DDDDDD — assistive/solid bg 와 페어 (base extension)
    },
    disabled: { default: cashwalkBizNeutral[200] }, // #EEEEEE — Border/Disabled
    status: {
      error: cashwalkBizCoralRed[500], // #FC3500 — base alias
      caution: cashwalkBizYellow[800], // #FD9B02 — text.status.caution 과 정합
    },
  },

  // ─── Icon (5 tokens) ─────────────────────────────────
  icon: {
    strong: { default: cashwalkBizNeutral[800] }, // #333333 — Icon/Strong
    normal: { default: cashwalkBizNeutral[700] }, // #666666 — Icon/Normal
    disabled: { default: cashwalkBizNeutral[400] }, // #DDDDDD — Icon/Disabled
    inverse: { default: cashwalkBizCommon["00"] }, // #FFFFFF — Icon/Inverse
    brand: { default: cashwalkBizYellow[700] }, // #FEAF01 — Icon/Brand (가이드 yellow/700)
    status: {
      success: cashwalkBizGreen[500], // #00CC5B
      error: cashwalkBizCoralRed[500], // #FC3500
      caution: cashwalkBizYellow[700], // #FEAF01 — 아이콘 가독성 위해 700
    },
  },

  // ─── Button (Figma ButtonGuide 3098:1032 SSOT) ───────
  // Figma 캔버스 라벨은 "Neutral" 로 표기되지만 DS 네이밍은 "Secondary" — 동일 슬롯.
  // Solid/Primary 와 Solid/Secondary 의 disabled 페어는 동일:
  //   bg = Neutral/400 #DDDDDD + text = #FFFFFF (Figma 3098:1079 / 3098:1121).
  // Outlined disabled (Primary/Secondary 모두) 텍스트는 Neutral/500 #BBB,
  // 보더는 Neutral/300 #E7E7E7. → buttonBorder.*.disabled 슬롯에 반영.
  buttonBg: {
    default: cashwalkBizYellow[500], // #FFD200 — Solid/Primary Default
    hover: cashwalkBizYellow[600], // #FFC400 — Solid/Primary Hover
    pressed: cashwalkBizYellow[700], // #FEAF01 — Solid/Primary Pressed
    disabled: cashwalkBizNeutral[400], // #DDDDDD — Solid/Primary Disabled (Figma 3098:1079)
    // Solid/Secondary — 검정 fill + 흰 텍스트. Geniet dark inverse 와 동일 운용:
    // color=secondary, variant=solid 가 캐포비 시그니처 검정 버튼으로 렌더.
    secondary: {
      default: cashwalkBizNeutral[900], // #111 — Solid/Secondary(Neutral) Default (Figma 3098:1095: neutral/900, 순수 검정 아님)
      hover: cashwalkBizNeutral[800], // #333333 — Solid/Secondary Hover (살짝 옅은 톤)
      disabled: cashwalkBizNeutral[400], // #DDDDDD — Solid/Secondary Disabled (Figma 3098:1121)
    },
    outlined: {
      default: cashwalkBizCommon["00"], // #FFFFFF
      hover: cashwalkBizYellow[50], // #FFFEF5
      disabled: cashwalkBizCommon["00"], // #FFFFFF
    },
  },
  buttonText: {
    default: cashwalkBizCommon[1000], // #000000 — ButtonText/Default (Figma 3222:458, 노랑 위 검정)
    brand: cashwalkBizNeutral[900], // #111 — ButtonText/Outlined (Figma 3098:1179: Outlined/Primary 텍스트 = neutral/900 검정, 노랑 아님)
    // Solid/Secondary disabled = 흰 텍스트 (#FFFFFF) — Solid/Primary 와 같은 페어.
    secondary: {
      default: cashwalkBizCommon["00"], // #FFFFFF — 검정 bg 위 흰 텍스트
      disabled: cashwalkBizCommon["00"], // #FFFFFF — Solid/Secondary Disabled (#DDDDDD bg 위 흰)
    },
    // SemanticColorGuide 의 ButtonText/Disabled = #FFFFFF (Solid disabled, 회색 bg 위 흰 텍스트).
    // ※ Outlined disabled 텍스트는 컴포넌트가 cv.textRole.muted 로 직접 처리하므로 이 슬롯과 무관.
    disabled: cashwalkBizCommon["00"], // #FFFFFF — ButtonText/Disabled (Figma 3222:458)
  },
  buttonBorder: {
    outlined: {
      default: cashwalkBizNeutral[900], // #111 — Outlined/Primary default border (Figma 3098:1179: neutral/900 검정)
      hover: cashwalkBizNeutral[900], // #111 — Outlined/Primary hover border (Figma 3098:1190: 검정 유지, bg만 #FFFEF5 틴트)
      disabled: cashwalkBizNeutral[300], // #E7E7E7 — Outlined/Primary disabled border (Figma 3098:1205)
    },
    assistive: {
      default: cashwalkBizNeutral[300], // #E7E7E7 — Outlined/Secondary default border
      disabled: cashwalkBizNeutral[300], // #E7E7E7 — Outlined/Secondary disabled border
    },
  },

  // ─── Fill — 가이드 미정의. brand 만 노랑 override, 나머지 base alias 명시 ───
  fill: {
    brand: {
      default: cashwalkBizYellow[500], // #FFD200
      hover: cashwalkBizYellow[600], // #FFC400
      pressed: cashwalkBizYellow[700], // #FEAF01
      disabled: cashwalkBizNeutral[300], // #E7E7E7
    },
    neutral: {
      default: cashwalkBizNeutral[800], // #333333
      subtle: cashwalkBizNeutral[100], // #F5F5F5
    },
    inverse: { default: cashwalkBizCommon["00"] },
    status: {
      error: cashwalkBizCoralRed[500],
      caution: cashwalkBizYellow[800], // text.status.caution 과 정합
    },
  },

  // ─── Input (7 tokens, focus = 검정 ★) ────────────────
  input: {
    bg: cashwalkBizCommon["00"], // #FFFFFF — Input/BG
    bgDisabled: cashwalkBizNeutral[50], // #FAFAFA — Input/BG/Disabled
    borderDefault: cashwalkBizNeutral[200], // #EEEEEE — Input/Border/Default
    borderHover: cashwalkBizNeutral[300], // #E7E7E7 — Input/Border/Hover
    borderFocus: cashwalkBizNeutral[900], // #111111 — Input/Border/Focus (★ 검정)
    borderError: cashwalkBizCoralRed[500], // #FC3500 — Input/Border/Error
    borderDisabled: cashwalkBizNeutral[200], // #EEEEEE — base alias
    placeholder: cashwalkBizNeutral[400], // #DDDDDD — Input/Placeholder
    // helpertext* — 가이드 미정의. text.* 슬롯과 정합되도록 명시.
    helpertextDefault: cashwalkBizNeutral[500], // #BBBBBB
    helpertextSuccess: cashwalkBizGreen[600], // #00B350
    helpertextError: cashwalkBizCoralRed[500], // #FC3500
    helpertextDisabled: cashwalkBizNeutral[400], // #DDDDDD
  },

  // ─── Brand/Logo (3 tokens, 캐시워크 로고용 — 캐포비 신규 그룹) ───
  brandLogo: {
    default: cashwalkBizBrown[500], // #5E5050 — Brand/Logo/Default
    subtle: cashwalkBizBrown[100], // #F2EAE8 — Brand/Logo/Subtle
    strong: cashwalkBizBrown[700], // #403535 — Brand/Logo/Strong
  },
} as const;

export type CashwalkBizSemanticTokens = typeof cashwalkBizSemantic;
