/**
 * Role-based semantic tokens — 1:1 mirror of Figma SemanticColorGuide
 * (171:6675: BG · Text · Button{BG,Text,Border} · Input · Icon · Border · Fill).
 *
 * 9 groups (8 Figma roles + `bg.disabled` DS extension) · ~80 tokens.
 * Atomic palette(colors.ts) 만 참조한다. CSS emit 시
 * `--semantic-{group}-{role}-{variant}` namespace 로 노출.
 *
 * JS 측 참조는 `cv` (cssVar.ts) 에서 일원화. 외부 코드는 이 파일을 직접
 * import 하지 않는다 — 빌드 파이프라인(generate-css.js) 전용.
 */

import { neutral, coolGray, blue, yellow, red, green } from "../colors.js";

export const nudgeEapSemantic = {
  bg: {
    page: { default: coolGray[50] }, // #F8F9FB
    surface: {
      default: neutral["00"], // #FFFFFF
      subtle: neutral[50], // #FAFAFA
    },
    section: { default: coolGray[100] }, // #F3F4F6
    brand: {
      default: blue[500], // #2B96ED
      subtle: blue[50], // #F1F8FD — Figma `--bg-brand-subtle`
    },
    inverse: { default: neutral[900] }, // #111111
    status: {
      error: red[50], // #FEE9E6
      success: green[50], // #E5F7F4
      info: blue[100], // #E3F2FC — Figma `--bg-status-info`
      caution: yellow[50], // #FFFAE8
    },
    // Figma `--bg-overlay` (flat, no /default suffix) — emits `--semantic-bg-overlay`
    overlay: "rgba(0,0,0,0.4)",
    // DS extension — Figma has no `bg-disabled` role; used by disabled controls
    // (Audio/Date/Slider/Stepper/Checkbox 등). Value = Neutral · 200.
    disabled: neutral[200], // #ECECEC
  },
  text: {
    strong: { default: neutral[900] }, // #111111  ← Figma `--text-strong-default`
    normal: { default: neutral[800] }, // #383838
    subtle: { default: neutral[700] }, // #666666
    muted: { default: neutral[500] }, // #999999
    disabled: { default: neutral[400] }, // #C7C7C7
    inverse: { default: neutral["00"] }, // #FFFFFF
    brand: {
      default: blue[500], // #2B96ED
      strong: blue[800], // #1B65BA — Figma `--text-brand-strong`
    },
    status: {
      success: green[400], // #00A07C
      error: red[500], // #F13F00
      caution: yellow[600], // #FFA100 — Figma `--text-status-caution`
      info: blue[600], // #017EE4 — Figma `--text-status-info`
    },
  },
  buttonBg: {
    default: blue[500], // #2B96ED
    hover: blue[600], // #017EE4
    pressed: blue[700], // #0E71CF
    // Figma 실 Button 컴포넌트 (171:8410) 가 cool-gray/400 (#9CA2AE) 사용 — 이게 SSOT.
    // Figma SemanticColorGuide(222:2) 의 ButtonBG/Disabled 가 #D8D8D8 로 잘못 그려져 있어
    // 디자이너가 가이드 쪽 값을 #9CA2AE 로 정정해야 함 (코드는 변경 없음).
    disabled: coolGray[400], // #9CA2AE
    secondary: {
      default: blue[50], // #F1F8FD
      hover: blue[100], // #E3F2FC
      disabled: coolGray[200], // #E6E7EB
    },
    outlined: {
      default: neutral["00"], // #FFFFFF
      hover: blue[50], // #F1F8FD
      disabled: neutral["00"], // #FFFFFF
    },
    // Solid/Neutral — DS extension (Figma SSOT 미정의, NudgeEAP base 는 cool-gray fill 유지).
    // Runmile 등 brand 가 light gray filled 톤으로 override.
    neutral: {
      default: coolGray[400], // #9CA2AE (기존 cv.borderRole.brandDisabled 매핑과 동일 톤 — 시각 보존)
      hover: "#7E8593", // 한 단계 어두운 cool-gray (기존 인라인 값 유지)
      disabled: neutral[100], // #F5F5F5 (기존 cv.borderRole.subtle 매핑과 동일)
    },
  },
  buttonText: {
    default: neutral["00"], // #FFFFFF
    brand: blue[500], // #2B96ED
    // Solid/Secondary 텍스트 — 옅은 blue 배경 위에 brand blue 텍스트 (가독성 OK).
    secondary: {
      default: blue[500], // #2B96ED
      disabled: coolGray[400], // #9CA2AE
    },
    // Outlined/Weak Neutral enabled 텍스트 — 흰/투명 배경 위 → 어두운 톤(가독성).
    // (이전엔 neutral["00"]=#FFFFFF 로 흰배경+흰글자=안 보임 버그. 가이드 SSOT=#383838)
    neutral: neutral[800], // #383838
    // Solid Neutral 텍스트 — cool-gray(#9CA2AE) fill 위 흰.
    neutralSolid: neutral["00"], // #FFFFFF
    // Outlined Neutral disabled 텍스트 — 기존 cv.textRole.muted (#999) 매핑 유지.
    neutralDisabled: neutral[500], // #999999
    // Figma 실 Button (171:8480) 이 cool-gray/400 (#9CA2AE) 사용 — 이게 SSOT.
    // SemanticColorGuide 의 "Neutral 400" 라벨과 어긋나지만 실 컴포넌트 우선.
    disabled: coolGray[400], // #9CA2AE
  },
  buttonBorder: {
    outlined: {
      default: blue[500], // #2B96ED
      hover: blue[500], // #2B96ED
      disabled: coolGray[400], // #9CA2AE
    },
    neutral: {
      default: neutral[300], // #D8D8D8
      disabled: neutral[200], // #ECECEC
    },
  },
  /**
   * Figma `Section_Icon` (227:2). 8 roles · 단일 variant(default).
   * 단독 배치된 아이콘 컬러는 hex 직접 지정 대신 본 토큰(`--semantic-icon-*`)을 사용한다.
   */
  icon: {
    strong: { default: neutral[800] }, // #383838 ← Neutral · 800
    normal: { default: neutral[700] }, // #666666 ← Figma Neutral · 600
    disabled: { default: neutral[400] }, // #C7C7C7 ← Figma Neutral · 200
    inverse: { default: neutral["00"] }, // #FFFFFF ← Neutral · 00 (white)
    brand: { default: blue[500] }, // #2B96ED ← Atomic/Bright Blue · 500
    status: {
      success: green[300], // #13BFA2 ← Atomic/Green · 500
      error: red[500], // #F13F00 ← Atomic/Orange Red · 500
      caution: yellow[500], // #FFC303 ← Golden Yellow · 500
    },
  },
  border: {
    normal: { default: neutral[200] }, // #ECECEC
    strong: { default: neutral[500] }, // #999999
    subtle: { default: neutral[100] }, // #F5F5F5
    focus: { default: blue[500] }, // #2B96ED
    brand: {
      default: blue[500], // #2B96ED
      disabled: coolGray[400], // #9CA2AE
    },
    disabled: { default: neutral[200] }, // #ECECEC
    status: {
      error: red[500], // #F13F00
      caution: yellow[500], // #FFC303
    },
  },
  fill: {
    brand: {
      default: blue[500], // #2B96ED
      hover: blue[600], // #017EE4
      pressed: blue[700], // #0E71CF
      disabled: neutral[300], // #D8D8D8
    },
    neutral: {
      default: neutral[800], // #383838
      subtle: neutral[100], // #F5F5F5
    },
    inverse: { default: neutral["00"] }, // #FFFFFF
    status: {
      error: red[500], // #F13F00
      caution: yellow[500], // #FFC303
    },
  },
  /**
   * Figma `Section_Input` (294:12).
   * `--semantic-input-bg`/`--semantic-input-placeholder`는 suffix 없이 emit되도록
   * 다른 그룹과 달리 flat camelCase 구조 사용.
   * `helpertext*`는 Figma CSS 변수 표기(`--semantic-input-helpertext-*`)에 맞춰
   * 한 단어로 유지.
   */
  input: {
    bg: neutral["00"], // #FFFFFF — --semantic-input-bg
    bgDisabled: neutral[50], // #FAFAFA — --semantic-input-bg-disabled
    borderDefault: neutral[300], // #D8D8D8
    borderHover: neutral[400], // #C7C7C7
    borderFocus: blue[500], // #2B96ED
    borderError: red[500], // #F13F00
    borderDisabled: neutral[300], // #D8D8D8
    placeholder: neutral[500], // #999999
    helpertextDefault: neutral[500], // #999999 ← Text/Muted/Default
    helpertextSuccess: blue[500], // #2B96ED ← Text/Brand/Default
    helpertextError: red[500], // #F13F00 ← Text/Status/Error
    helpertextDisabled: neutral[400], // #C7C7C7 ← Text/Disabled/Default
  },

  /**
   * 모달/팝업 confirm(주 액션) 버튼 — base 는 brand 토큰을 var() 로 참조한다.
   * 브랜드 :root 가 `--semantic-bg-brand-default` 등을 자기 색으로 덮으므로, confirmCta 를
   * 따로 정의 안 한 브랜드(Trost/Geniet/Runmile)는 자동으로 자기 brand 색 confirm 버튼이 된다.
   * 캐포비만 cashwalk-biz.semantic.ts 에서 neutral 검정으로 override.
   */
  confirmCta: {
    bg: "var(--semantic-bg-brand-default)",
    hover: "var(--semantic-fill-brand-hover)",
    active: "var(--semantic-text-brand-strong)",
    // Popup confirm 의 텍스트색(Modal 은 text-inverse 직접 사용). base 는 button-text-default 참조 —
    // 브랜드별 자기 값(Trost=검정, 나머지=흰). 캐포비만 검정 fill 위 흰으로 override.
    text: "var(--semantic-button-text-default)",
  },
} as const;

export type NudgeEapSemanticTokens = typeof nudgeEapSemantic;
