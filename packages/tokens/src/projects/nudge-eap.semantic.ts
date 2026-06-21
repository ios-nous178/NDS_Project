/**
 * Role-based semantic tokens — 1:1 mirror of Figma SemanticColorGuide
 * (171:6675: BG · Text · Button{BG,Text,Border} · Input · Icon · Border · Fill).
 *
 * 9 groups (8 Figma roles + `bg.disabled` DS extension) · ~80 tokens.
 * Atomic palette(colors.ts) 만 참조한다 — **reference-carrying**: `ref("color.{family}.{stop}")`
 * 로 primitive 를 *가리킨다*(값을 베끼지 않음). emitter 가 ref 를 분기해 기존 CSS 는 hex 로,
 * dist/next 는 `var(--color-…)`/DTCG/Figma alias 로 emit. (메커니즘: ../ref.ts)
 * hex/rgba 리터럴·`var(--semantic-…)` self-ref 는 그대로 둔다.
 *
 * JS 측 참조는 `cv` (cssVar.ts) 에서 일원화. 외부 코드는 이 파일을 직접
 * import 하지 않는다 — 빌드 파이프라인(generate-css.js) 전용.
 */

import { ref } from "../ref.js";

export const nudgeEapSemantic = {
  bg: {
    page: { default: ref("color.coolGray.50") }, // #F8F9FB
    surface: {
      default: ref("color.common.white"), // #FFFFFF
      subtle: ref("color.gray.50"), // #FAFAFA
    },
    section: { default: ref("color.coolGray.100") }, // #F3F4F6
    brand: {
      default: ref("color.blue.500"), // #2B96ED
      subtle: ref("color.blue.50"), // #F1F8FD — Figma `--bg-brand-subtle`
    },
    inverse: { default: ref("color.gray.900") }, // #111111
    status: {
      error: ref("color.red.50"), // #FEE9E6
      success: ref("color.green.50"), // #E5F7F4
      info: ref("color.blue.100"), // #E3F2FC — Figma `--bg-status-info`
      caution: ref("color.yellow.50"), // #FFFAE8
    },
    // Figma `--bg-overlay` (flat, no /default suffix) — emits `--semantic-bg-overlay`
    overlay: "rgba(0,0,0,0.4)",
    // DS extension — Figma has no `bg-disabled` role; used by disabled controls
    // (Audio/Date/Slider/Stepper/Checkbox 등). Value = Neutral · 200.
    disabled: ref("color.gray.200"), // #ECECEC
  },
  text: {
    strong: { default: ref("color.gray.900") }, // #111111  ← Figma `--text-strong-default`
    normal: { default: ref("color.gray.800") }, // #383838
    subtle: { default: ref("color.gray.700") }, // #666666
    muted: { default: ref("color.gray.500") }, // #999999
    disabled: { default: ref("color.gray.400") }, // #C7C7C7
    inverse: { default: ref("color.common.white") }, // #FFFFFF
    brand: {
      default: ref("color.blue.500"), // #2B96ED
      strong: ref("color.blue.800"), // #1B65BA — Figma `--text-brand-strong`
    },
    status: {
      success: ref("color.green.400"), // #00A07C
      error: ref("color.red.500"), // #F13F00
      caution: ref("color.yellow.600"), // #FFA100 — Figma `--text-status-caution`
      info: ref("color.blue.600"), // #017EE4 — Figma `--text-status-info`
    },
  },
  buttonBg: {
    default: ref("color.blue.500"), // #2B96ED
    hover: ref("color.blue.600"), // #017EE4
    pressed: ref("color.blue.700"), // #0E71CF
    // Figma 실 Button 컴포넌트 (171:8410) 가 cool-gray/400 (#9CA2AE) 사용 — 이게 SSOT.
    // Figma SemanticColorGuide(222:2) 의 ButtonBG/Disabled 가 #D8D8D8 로 잘못 그려져 있어
    // 디자이너가 가이드 쪽 값을 #9CA2AE 로 정정해야 함 (코드는 변경 없음).
    disabled: ref("color.coolGray.400"), // #9CA2AE
    secondary: {
      default: ref("color.blue.50"), // #F1F8FD
      hover: ref("color.blue.100"), // #E3F2FC
      disabled: ref("color.coolGray.200"), // #E6E7EB
    },
    outlined: {
      default: ref("color.common.white"), // #FFFFFF
      hover: ref("color.blue.50"), // #F1F8FD
      disabled: ref("color.common.white"), // #FFFFFF
    },
    // Solid/Neutral — DS extension (Figma SSOT 미정의, NudgeEAP base 는 cool-gray fill 유지).
    // Runmile 등 brand 가 light gray filled 톤으로 override.
    neutral: {
      default: ref("color.coolGray.400"), // #9CA2AE (기존 cv.borderRole.brandDisabled 매핑과 동일 톤 — 시각 보존)
      hover: "#7E8593", // 한 단계 어두운 cool-gray (팔레트 stop 부재 — 리터럴 유지)
      disabled: ref("color.gray.100"), // #F5F5F5 (기존 cv.borderRole.subtle 매핑과 동일)
    },
  },
  buttonText: {
    default: ref("color.common.white"), // #FFFFFF
    brand: ref("color.blue.500"), // #2B96ED
    // Solid/Secondary 텍스트 — 옅은 blue 배경 위에 brand blue 텍스트 (가독성 OK).
    secondary: {
      default: ref("color.blue.500"), // #2B96ED
      disabled: ref("color.coolGray.400"), // #9CA2AE
    },
    // Outlined/Weak Neutral enabled 텍스트 — 흰/투명 배경 위 → 어두운 톤(가독성).
    // (이전엔 neutral["00"]=#FFFFFF 로 흰배경+흰글자=안 보임 버그. 가이드 SSOT=#383838)
    neutral: ref("color.gray.800"), // #383838
    // Solid Neutral 텍스트 — cool-gray(#9CA2AE) fill 위 흰.
    neutralSolid: ref("color.common.white"), // #FFFFFF
    // Outlined Neutral disabled 텍스트 — 기존 cv.textRole.muted (#999) 매핑 유지.
    neutralDisabled: ref("color.gray.500"), // #999999
    // Figma 실 Button (171:8480) 이 cool-gray/400 (#9CA2AE) 사용 — 이게 SSOT.
    // SemanticColorGuide 의 "Neutral 400" 라벨과 어긋나지만 실 컴포넌트 우선.
    disabled: ref("color.coolGray.400"), // #9CA2AE
  },
  buttonBorder: {
    outlined: {
      default: ref("color.blue.500"), // #2B96ED
      hover: ref("color.blue.500"), // #2B96ED
      disabled: ref("color.coolGray.400"), // #9CA2AE
    },
    neutral: {
      default: ref("color.gray.300"), // #D8D8D8
      disabled: ref("color.gray.200"), // #ECECEC
    },
  },
  /**
   * Figma `Section_Icon` (227:2). 8 roles · 단일 variant(default).
   * 단독 배치된 아이콘 컬러는 hex 직접 지정 대신 본 토큰(`--semantic-icon-*`)을 사용한다.
   */
  icon: {
    strong: { default: ref("color.gray.800") }, // #383838 ← Neutral · 800
    normal: { default: ref("color.gray.700") }, // #666666 ← Figma Neutral · 600
    disabled: { default: ref("color.gray.400") }, // #C7C7C7 ← Figma Neutral · 200
    inverse: { default: ref("color.common.white") }, // #FFFFFF ← Neutral · 00 (white)
    brand: { default: ref("color.blue.500") }, // #2B96ED ← Atomic/Bright Blue · 500
    status: {
      success: ref("color.green.300"), // #13BFA2 ← Atomic/Green · 500
      error: ref("color.red.500"), // #F13F00 ← Atomic/Orange Red · 500
      caution: ref("color.yellow.500"), // #FFC303 ← Golden Yellow · 500
    },
  },
  border: {
    normal: { default: ref("color.gray.200") }, // #ECECEC
    strong: { default: ref("color.gray.500") }, // #999999
    subtle: { default: ref("color.gray.100") }, // #F5F5F5
    focus: { default: ref("color.blue.500") }, // #2B96ED
    brand: {
      default: ref("color.blue.500"), // #2B96ED
      disabled: ref("color.coolGray.400"), // #9CA2AE
    },
    disabled: { default: ref("color.gray.200") }, // #ECECEC
    status: {
      error: ref("color.red.500"), // #F13F00
      caution: ref("color.yellow.500"), // #FFC303
    },
  },
  fill: {
    brand: {
      default: ref("color.blue.500"), // #2B96ED
      hover: ref("color.blue.600"), // #017EE4
      pressed: ref("color.blue.700"), // #0E71CF
      disabled: ref("color.gray.300"), // #D8D8D8
    },
    neutral: {
      default: ref("color.gray.800"), // #383838
      subtle: ref("color.gray.100"), // #F5F5F5
    },
    inverse: { default: ref("color.common.white") }, // #FFFFFF
    status: {
      error: ref("color.red.500"), // #F13F00
      caution: ref("color.yellow.500"), // #FFC303
    },
    // 선택 컨트롤(checkbox·radio) on 채움 — base 는 fill-brand 를 추종(프로젝트별 자기 brand 색).
    controlOn: "var(--semantic-fill-brand-default)",
  },
  /**
   * Figma `Section_Input` (294:12).
   * `--semantic-input-bg`/`--semantic-input-placeholder`는 suffix 없이 emit되도록
   * 다른 그룹과 달리 flat camelCase 구조 사용.
   * `helpertext*`는 Figma CSS 변수 표기(`--semantic-input-helpertext-*`)에 맞춰
   * 한 단어로 유지.
   */
  input: {
    bg: ref("color.common.white"), // #FFFFFF — --semantic-input-bg
    bgDisabled: ref("color.gray.50"), // #FAFAFA — --semantic-input-bg-disabled
    borderDefault: ref("color.gray.300"), // #D8D8D8
    borderHover: ref("color.gray.400"), // #C7C7C7
    borderFocus: ref("color.blue.500"), // #2B96ED
    borderError: ref("color.red.500"), // #F13F00
    borderDisabled: ref("color.gray.300"), // #D8D8D8
    placeholder: ref("color.gray.500"), // #999999
    helpertextDefault: ref("color.gray.500"), // #999999 ← Text/Muted/Default
    helpertextSuccess: ref("color.blue.500"), // #2B96ED ← Text/Brand/Default
    helpertextError: ref("color.red.500"), // #F13F00 ← Text/Status/Error
    helpertextDisabled: ref("color.gray.400"), // #C7C7C7 ← Text/Disabled/Default
  },

  /**
   * 모달/팝업 confirm(주 액션) 버튼 — base 는 brand 토큰을 var() 로 참조한다.
   * 프로젝트 :root 가 `--semantic-bg-brand-default` 등을 자기 색으로 덮으므로, confirmCta 를
   * 따로 정의 안 한 프로젝트(Trost/Geniet/Runmile)는 자동으로 자기 brand 색 confirm 버튼이 된다.
   * 캐포비만 cashwalk-biz.semantic.ts 에서 neutral 검정으로 override.
   */
  confirmCta: {
    bg: "var(--semantic-bg-brand-default)",
    hover: "var(--semantic-fill-brand-hover)",
    active: "var(--semantic-text-brand-strong)",
    // Popup confirm 의 텍스트색(Modal 은 text-inverse 직접 사용). base 는 button-text-default 참조 —
    // 프로젝트별 자기 값(Trost=검정, 나머지=흰). 캐포비만 검정 fill 위 흰으로 override.
    text: "var(--semantic-button-text-default)",
  },
} as const;

export type NudgeEapSemanticTokens = typeof nudgeEapSemantic;
