/**
 * Cashwalk Semantic Colors — Figma role-based 트리의 Partial override.
 *
 * SSOT: Figma 캐시워크 SemanticColorGuide (676:3643)
 *
 * Cashwalk(캐시워크 · 소비자앱) 가 NudgeEAP base 와 다른 부분만 명시.
 * generate-css.js 가 이 트리를 `dist/cashwalk.css` 의 `--semantic-*` 변수로 emit.
 * CSS cascade 에 의해 NudgeEAP base 의 같은 변수를 덮어쓴다. 누락 키는 base 유지.
 *
 * 캐시워크 가이드 특이점 (다른 프로젝트 대비):
 *   1. **Input focus = Neutral/900 (검정)** — 다른 프로젝트는 brand 색을 focus 에 쓰지만
 *      캐시워크는 검정 outline 으로 강조 (가이드 명시).
 *   2. **ButtonBG/Disabled = atomic Neutral/400 (#DDDDDD)** — Solid/Primary 와
 *      Solid/Secondary 모두 같은 회색 disabled bg 위에 흰 텍스트를 올린다
 *      (Figma ButtonGuide Default → Disabled 행 SSOT). 노란 톤이 아니다.
 *   3. **Brand/Logo 그룹 신규** — 캐시워크 로고용 Brown 톤 3종.
 *      types.ts 의 `brandLogo?` 슬롯 (캐시워크 전용 확장).
 *   4. **Text/Link 그룹 신규** — Blue/500 (#007AFF). types.ts 의 `text.link?` 슬롯.
 *   5. **ButtonBG/Secondary = 검정 (#000000)** — Figma ButtonGuide 의 "Solid/Secondary"
 *      슬롯. Geniet 의 dark inverse 와 동일한 슬롯 운용:
 *      color=secondary, variant=solid 가 캐시워크 시그니처 검정 버튼으로 렌더.
 *      ButtonBG/Outlined 슬롯은 Figma 미정의 → 흰 배경 유지.
 *      (※ Figma 캔버스 라벨은 "Neutral" 로 표기되지만 DS 네이밍은 "Secondary".)
 *   6. **Button/Outlined disabled = Neutral/300 (#E7E7E7) + text Neutral/500 (#BBB)** —
 *      Outlined/Secondary default·disabled border, Outlined/Primary disabled border 모두
 *      같은 #E7E7E7 사용. `buttonBorder.*.disabled` 슬롯과 `buttonText.disabled` 에 반영.
 *      (Border/Normal 자체는 카드/Input 광역 사용이라 #EEEEEE 유지 — 충돌 없음.)
 */

import { ref } from "../ref.js";

export const cashwalkSemantic = {
  // ─── BG (7 tokens, 가이드 라벨 정확 매핑) ─────────────
  bg: {
    page: { default: ref("color.gray.50") }, // #FAFAFA — BG/Page/Default
    surface: {
      default: ref("color.common.white"), // #FFFFFF — BG/Surface/Default
      subtle: ref("color.gray.50"), // #FAFAFA — BG/Surface/Subtle
    },
    section: { default: ref("color.gray.100") }, // #F5F5F5 — BG/Section/Default
    brand: {
      default: ref("color.yellow.500"), // #FFD200 — BG/Brand/Default
      subtle: ref("color.yellow.100"), // #FFFAE5 — BG/Brand/Subtle
    },
    inverse: { default: ref("color.gray.900") }, // #111111 — BG/Inverse/Default
    status: {
      success: ref("color.green.50"), // #E5F8EE — BG/Status/Success
      error: ref("color.red.50"), // #FFF5F5 — BG/Status/Error
      caution: ref("color.yellow.100"), // #FFFAE5 — BG/Status/Caution
      info: ref("color.yellow.100"), // #FFFAE5 — BG/Status/Info (brand-subtle 와 동일 톤)
    },
    overlay: "rgba(0, 0, 0, 0.4)", // base NudgeEAP 와 동일
    disabled: ref("color.gray.200"), // #EEEEEE — DS extension
  },

  // ─── Text (8 tokens, link 신규 슬롯 포함) ─────────────
  text: {
    strong: { default: ref("color.gray.900") }, // #111111 — Text/Strong
    normal: { default: ref("color.gray.800") }, // #333333 — Text/Normal
    subtle: { default: ref("color.gray.700") }, // #666666 — Text/Subtle
    muted: { default: ref("color.gray.500") }, // #BBBBBB — Text/Muted
    disabled: { default: ref("color.gray.500") }, // #BBBBBB — Text/Disabled (muted 와 동일)
    inverse: { default: ref("color.common.white") }, // #FFFFFF — Text/Inverse
    brand: {
      default: ref("color.yellow.800"), // #FD9B02 — Text/Brand (가독성 위해 800)
      strong: ref("color.yellow.800"), // #FD9B02 — Text/Brand/Strong (base alias)
    },
    link: { default: ref("color.blue.500") }, // #007AFF — Text/Link/Default (캐시워크 신규)
    status: {
      success: ref("color.green.600"), // #00B350 — Text/Status/Success
      error: ref("color.red.500"), // #FF4141 — Text/Status/Error
      caution: ref("color.yellow.800"), // #FD9B02 — Text/Status/Caution
      info: ref("color.blue.600"), // #006FE6 — Text/Status/Info
    },
  },

  // ─── Border (6 tokens) ───────────────────────────────
  border: {
    // 주의: Border/Normal 은 Card/Input/Modal 등 광범위하게 쓰임.
    // Figma ButtonGuide 의 Outlined/Secondary border (#E7E7E7) 와는 1-step 차이가 있지만,
    // SemanticColorGuide 의 Border/Normal 정의(#EEEEEE) 를 따른다.
    // Outlined/Secondary 만 따로 진한 보더가 필요하면 `buttonBorder.neutral.default`
    // (#E7E7E7) 슬롯을 컴포넌트 레벨에서 채택하는 방식으로 처리.
    // (Figma 캔버스 라벨 "Neutral" = DS 네이밍 "Secondary".)
    normal: { default: ref("color.gray.200") }, // #EEEEEE — Border/Normal
    strong: { default: ref("color.gray.400") }, // #DDDDDD — Border/Strong
    subtle: { default: ref("color.gray.100") }, // #F5F5F5 — Border/Subtle
    focus: { default: ref("color.yellow.500") }, // #FFD200 — Border/Focus (프로젝트 정체성)
    brand: {
      default: ref("color.yellow.500"), // #FFD200 — Border/Brand
      disabled: ref("color.gray.400"), // #DDDDDD — neutral/solid bg 와 페어 (base extension)
    },
    disabled: { default: ref("color.gray.200") }, // #EEEEEE — Border/Disabled
    status: {
      error: ref("color.red.500"), // #FF4141 — base alias
      caution: ref("color.yellow.800"), // #FD9B02 — text.status.caution 과 정합
    },
  },

  // ─── Icon (5 tokens) ─────────────────────────────────
  icon: {
    strong: { default: ref("color.gray.800") }, // #333333 — Icon/Strong
    normal: { default: ref("color.gray.700") }, // #666666 — Icon/Normal
    disabled: { default: ref("color.gray.400") }, // #DDDDDD — Icon/Disabled
    inverse: { default: ref("color.common.white") }, // #FFFFFF — Icon/Inverse
    brand: { default: ref("color.yellow.700") }, // #FEAF01 — Icon/Brand (가이드 yellow/700)
    status: {
      success: ref("color.green.500"), // #00CC5B
      error: ref("color.red.500"), // #FF4141
      caution: ref("color.yellow.700"), // #FEAF01 — 아이콘 가독성 위해 700
    },
  },

  // ─── Button (Figma ButtonGuide SSOT) ─────────────────
  // Figma 캐시워크 tone = Primary + "Neutral" 둘뿐. **Figma "Neutral" = DS `neutral` tone** 으로 매핑.
  //   · Solid/Neutral(#111 검정 CTA) = color=neutral, variant=solid
  //   · Weak/Neutral(#F5F5F5 회색)   = color=neutral, variant=soft
  //   · Outlined/Neutral(#E7E7E7)    = color=neutral, variant=outlined
  // secondary tone 은 Figma 미정의 → 하위호환용 검정값만 유지(옵션). 신규는 neutral 사용.
  // Solid disabled 페어: bg #DDDDDD + text #FFFFFF. Outlined disabled: text #BBB / border #E7E7E7.
  buttonBg: {
    default: ref("color.yellow.500"), // #FFD200 — Solid/Primary Default
    hover: ref("color.yellow.600"), // #FFC400 — Solid/Primary Hover
    pressed: ref("color.yellow.700"), // #FEAF01 — Solid/Primary Pressed
    disabled: ref("color.gray.400"), // #DDDDDD — Solid/Primary Disabled
    // Solid/Neutral — Figma "Neutral" tone. 캐시워크 검정 CTA = color=neutral.
    neutral: {
      default: ref("color.gray.900"), // #111 — Solid/Neutral Default
      hover: ref("color.gray.800"), // #333 — Solid/Neutral Hover
      disabled: ref("color.gray.400"), // #DDD — Solid/Neutral Disabled
    },
    // Solid/Secondary — (옵션) Figma 캐시워크엔 Secondary tone 없음. 검정 CTA 는 neutral 로 이관.
    // 하위호환용 검정값 유지 — 신규는 color=neutral 사용.
    secondary: {
      default: ref("color.gray.900"), // #111
      hover: ref("color.gray.800"), // #333
      disabled: ref("color.gray.400"), // #DDD
    },
    outlined: {
      default: ref("color.common.white"), // #FFFFFF
      hover: ref("color.yellow.50"), // #FFFEF5
      disabled: ref("color.common.white"), // #FFFFFF
    },
  },
  buttonText: {
    default: ref("color.common.black"), // #000000 — ButtonText/Default (노랑 위 검정)
    brand: ref("color.gray.900"), // #111 — ButtonText/Outlined (Outlined/Primary 텍스트 = neutral/900 검정, 노랑 아님)
    // Solid/Secondary disabled = 흰 텍스트 (#FFFFFF) — Solid/Primary 와 같은 페어.
    secondary: {
      default: ref("color.common.white"), // #FFFFFF — 검정 bg 위 흰 텍스트
      disabled: ref("color.common.white"), // #FFFFFF — Solid/Secondary Disabled (#DDDDDD bg 위 흰)
    },
    // Neutral tone — Solid 은 흰 텍스트(styleMap surface.default). Weak/Outlined enabled 는 #111.
    neutral: ref("color.gray.900"), // #111 — Weak/Outlined Neutral enabled 텍스트
    neutralSolid: ref("color.common.white"), // #FFFFFF — Solid Neutral 텍스트 (#111 검정 fill 위 흰)
    neutralDisabled: ref("color.gray.500"), // #BBB — Neutral disabled 텍스트
    // SemanticColorGuide 의 ButtonText/Disabled = #FFFFFF (Solid disabled, 회색 bg 위 흰 텍스트).
    // ※ Outlined disabled 텍스트는 컴포넌트가 cv.textRole.muted 로 직접 처리하므로 이 슬롯과 무관.
    disabled: ref("color.common.white"), // #FFFFFF — ButtonText/Disabled
  },
  buttonBorder: {
    outlined: {
      default: ref("color.gray.900"), // #111 — Outlined/Primary default border (neutral/900 검정)
      hover: ref("color.gray.900"), // #111 — Outlined/Primary hover border (검정 유지, bg만 #FFFEF5 틴트)
      disabled: ref("color.gray.300"), // #E7E7E7 — Outlined/Primary disabled border
    },
    neutral: {
      default: ref("color.gray.300"), // #E7E7E7 — Outlined/Secondary default border
      disabled: ref("color.gray.300"), // #E7E7E7 — Outlined/Secondary disabled border
    },
  },

  // ─── Fill — 가이드 미정의. brand 만 노랑 override, 나머지 base alias 명시 ───
  fill: {
    brand: {
      default: ref("color.yellow.500"), // #FFD200
      hover: ref("color.yellow.600"), // #FFC400
      pressed: ref("color.yellow.700"), // #FEAF01
      disabled: ref("color.gray.300"), // #E7E7E7
    },
    neutral: {
      default: ref("color.gray.800"), // #333333
      subtle: ref("color.gray.100"), // #F5F5F5
    },
    inverse: { default: ref("color.common.white") },
    status: {
      error: ref("color.red.500"),
      caution: ref("color.yellow.800"), // text.status.caution 과 정합
    },
  },

  // ─── Input (7 tokens, focus = 검정 ★) ────────────────
  input: {
    bg: ref("color.common.white"), // #FFFFFF — Input/BG
    bgDisabled: ref("color.gray.50"), // #FAFAFA — Input/BG/Disabled
    borderDefault: ref("color.gray.200"), // #EEEEEE — Input/Border/Default
    borderHover: ref("color.gray.300"), // #E7E7E7 — Input/Border/Hover
    borderFocus: ref("color.gray.900"), // #111111 — Input/Border/Focus (★ 검정)
    borderError: ref("color.red.500"), // #FF4141 — Input/Border/Error
    borderDisabled: ref("color.gray.200"), // #EEEEEE — base alias
    placeholder: ref("color.gray.500"), // #BBBBBB — Input/Placeholder
    // helpertext* — default = text.subtle(#666). (success/error/disabled 는 상태색 유지.)
    helpertextDefault: ref("color.gray.700"), // #666666 — = text.subtle.default
    helpertextSuccess: ref("color.green.600"), // #00B350
    helpertextError: ref("color.red.500"), // #FF4141
    helpertextDisabled: ref("color.gray.400"), // #DDDDDD
  },

  // ─── Confirm CTA (모달/팝업 주 액션 버튼) ─────────────
  // 캐시워크 ButtonGuide tone = Primary + Neutral 뿐. 모달/팝업 confirm 은 검정 Neutral CTA.
  // base 는 var(--semantic-bg-brand-default)=노랑을 참조하므로, 캐시워크는 neutral 검정으로 override.
  confirmCta: {
    bg: ref("color.gray.900"), // #111111 — Solid/Neutral
    hover: ref("color.gray.800"), // #333333
    active: ref("color.gray.800"), // #333333 — press
    text: ref("color.common.white"), // #FFFFFF — 검정 fill 위 흰 텍스트
  },
} as const;

export type CashwalkSemanticTokens = typeof cashwalkSemantic;
