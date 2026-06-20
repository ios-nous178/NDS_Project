/**
 * Trost Semantic Colors — Figma role-based 트리의 Partial override.
 *
 * Figma 시멘틱 컬러 가이드(5021:318) 1:1 미러. Key Pair 3색:
 *   · Brand = Yellow(#FFF42E) — 면적 큰 채움(button/banner bg). 텍스트로는 가독성상 안 씀.
 *   · Action = Black(neutral 900/800) — 다크 액션/inverse 표면.
 *   · Point  = Cobalt(#4968FF) — brand 와 별개의 2차 액센트(focus·강조).
 *
 * Trost 가 NudgeEAP base(projects/nudge-eap.semantic.ts) 와 다른 부분만 명시.
 * generate-css.js 가 이 트리를 `dist/trost.css` 의 `--semantic-*` 변수로 emit.
 * CSS cascade 에 의해 NudgeEAP base 의 같은 변수를 덮어쓴다.
 *
 * 누락된 키는 base 값이 그대로 유지된다 (예: text.muted 가 없으면 NudgeEAP 의
 * `--semantic-text-muted-default` 가 그대로 적용).
 */

import {
  trostBlue,
  trostCobalt,
  trostGreen,
  trostNeutral,
  trostRed,
  trostYellow,
} from "./trost.palette.js";

export const trostSemantic = {
  bg: {
    // 페이지/서피스 bg 는 흰색 (가이드 BG/Page·Surface = #fff).
    page: { default: trostNeutral["00"] },
    surface: { default: trostNeutral["00"], subtle: trostNeutral[50] }, // subtle #FAFAFA
    section: { default: trostNeutral["cool-100"] }, // #F4F5F7
    brand: { default: trostYellow[500], subtle: trostYellow[100] }, // subtle Yellow/100 #FFFDD9
    inverse: { default: trostNeutral[900] }, // #1A1A1A (가이드 BG/Inverse)
    status: {
      error: trostRed[50], // #FFF1EC
      success: trostGreen[50], // #E5F9F1
      info: trostBlue[50], // #ECF5FF — info 는 blue (point 코발트와 분리)
      caution: "#FFF8E6", // 가이드 미수록 — 기존 유지
    },
    // Bible 카드 등 실측 overlay 는 60% (`bg-black/60`). NudgeEAP base 는 40%.
    overlay: "rgba(0, 0, 0, 0.6)",
    disabled: trostNeutral[200],
    // Point(액센트) 서피스 — 코발트. brand(노랑)와 별개의 2차 강조.
    point: {
      default: trostCobalt[500], // #4968FF
      subtle: trostCobalt[100], // #EDF0FF
      surface: trostCobalt[50], // #F6F7FF
    },
  },
  text: {
    strong: { default: trostNeutral[800] }, // #333333 (가이드 Text/Strong)
    normal: { default: trostNeutral[700] }, // #606060
    subtle: { default: trostNeutral[500] }, // #979797
    muted: { default: trostNeutral[400] }, // #C7C7C7
    disabled: { default: trostNeutral[400] }, // #C7C7C7
    inverse: { default: trostNeutral["00"] }, // #FFFFFF
    onBrand: { default: trostNeutral[800] }, // #333333 — 노랑 채움 위 텍스트
    // 트로스트의 brand-as-text(활성 카테고리·인용/댓글 멘션·활성 sub-tab·EAP 강조 등)는
    // 모두 orange(#FF9D00) — 가이드 Text/Brand/Default 가 이를 확정. 노랑 primary 는
    // 면적 큰 button bg 용이지 텍스트로는 가독성 때문에 안 쓴다.
    brand: { default: trostYellow.text, strong: trostYellow.text },
    status: {
      success: trostGreen[600], // #00A06A
      error: trostRed[500], // #FF4111
      caution: trostYellow.text, // orange — 가이드 미수록, 기존 유지
      info: trostBlue[600], // #1A78E5
    },
    // Point(액센트) 텍스트 — 코발트.
    point: { default: trostCobalt[500], strong: trostCobalt[600] }, // #4968FF / #3050E5
  },
  buttonBg: {
    default: trostYellow[500], // #FFF42E
    hover: trostYellow[600], // #E5D820 (가이드 Fill/Brand/Hover)
    pressed: trostYellow[700], // #B8AC15 (가이드 Fill/Brand/Pressed)
    disabled: trostNeutral[300], // #D8D8D8 — 가이드 Fill/Action/Primary/Disabled (구 #E5E5E5)
    // Solid/Secondary — 가이드 "옅은 블루" = BG/Point/Subtle(cobalt-100 #EDF0FF) + cobalt 텍스트.
    // (구: default=cobalt-50 #F6F7FF 로 가이드보다 한 stop 옅었음 — #EDF0FF 는 hover 에 있었다.)
    secondary: {
      default: trostCobalt[100], // #EDF0FF (가이드 BG/Point/Subtle)
      hover: trostCobalt[200], // #C9D3FF (한 stop 진한 틴트)
      disabled: trostNeutral[200],
    },
    // Solid/Neutral — 가이드 "Primary(검정 Solid)" 메인 CTA. 트로스트 primary=노랑(brand)이라
    // 검정 메인 액션은 color="neutral" 로 매핑한다(캐포비 검정 CTA=neutral 선례와 동일).
    neutral: {
      default: trostNeutral[900], // #1A1A1A (가이드 Fill/Action/Primary/Default)
      hover: trostNeutral[800], // #333333
      disabled: trostNeutral[300], // #D8D8D8
    },
    outlined: {
      default: trostNeutral["00"],
      hover: trostYellow[100], // 옅은 노랑 틴트 (Fill/Brand/Subtle)
      disabled: trostNeutral["00"],
    },
  },
  buttonText: {
    // 노란 배경 → 어두운 텍스트 (가이드 Text/OnBrand = #333). 면적 큰 노랑 위 가독성.
    default: trostNeutral[800], // #333333
    // text.brand / icon.brand 와 동일한 brand-as-text 의미 — orange.
    brand: trostYellow.text,
    // Solid/Secondary 텍스트 — cobalt 틴트 배경 위에 cobalt 텍스트.
    secondary: {
      default: trostCobalt[500],
      disabled: trostNeutral[500],
    },
    // Neutral — Solid/Neutral(검정 CTA) 텍스트=흰(neutralSolid), Outlined/Neutral enabled=#333(neutral).
    neutral: trostNeutral[800], // #333333 — Outlined/Neutral enabled (가이드 Outlined 텍스트 Text/Strong)
    neutralSolid: trostNeutral["00"], // #FFFFFF — Solid/Neutral (검정 #1A1A1A fill 위 흰 텍스트)
    neutralDisabled: trostNeutral[500], // #979797 — Outlined/Neutral disabled
    disabled: trostNeutral[500],
  },
  buttonBorder: {
    outlined: {
      default: trostYellow[500], // #FFF42E (가이드 Border/Brand = Yellow/500)
      hover: trostYellow[500],
      disabled: trostNeutral[300],
    },
    neutral: { default: trostNeutral[200], disabled: trostNeutral[200] },
  },
  icon: {
    strong: { default: trostNeutral[800] }, // #333333
    normal: { default: trostNeutral[700] }, // #606060
    subtle: { default: trostNeutral[500] }, // #979797 (가이드 Icon/Subtle)
    disabled: { default: trostNeutral[400] }, // #C7C7C7
    inverse: { default: trostNeutral["00"] },
    onBrand: { default: trostNeutral[800] }, // #333333 — 노랑 채움 위 아이콘
    // text.brand 와 동일하게 brand-as-icon 도 orange (가이드엔 Icon/Brand 없음 — 트로스트 정체성 유지).
    brand: { default: trostYellow.text },
    status: {
      success: trostGreen[600], // #00A06A
      error: trostRed[500], // #FF4111
      caution: trostYellow.text, // orange — 가이드 미수록, 기존 유지
    },
    // Point(액센트) 아이콘 — 코발트.
    point: { default: trostCobalt[500] }, // #4968FF
  },
  border: {
    normal: { default: trostNeutral[200] }, // #E5E5E5
    strong: { default: trostNeutral[400] }, // #C7C7C7 (가이드 Border/Strong)
    subtle: { default: trostNeutral[150] }, // #F2F2F2
    focus: { default: trostCobalt[500] }, // Trost focus = cobalt (= Point)
    brand: { default: trostYellow[500], disabled: trostNeutral[300] }, // #FFF42E (Border/Brand)
    disabled: { default: trostNeutral[150] }, // #F2F2F2 (가이드 Border/Disabled)
    status: {
      error: trostRed[500],
      success: trostGreen[500], // #00BC78 (가이드 Border/Status/Success)
      caution: trostYellow.text,
    },
    // Point(액센트) 보더 — 코발트.
    point: { default: trostCobalt[500] }, // #4968FF
  },
  fill: {
    brand: {
      default: trostYellow[500], // #FFF42E
      hover: trostYellow[600], // #E5D820
      pressed: trostYellow[700], // #B8AC15
      disabled: trostNeutral[300],
      subtle: trostYellow[100], // #FFFDD9 (Fill/Brand/Subtle)
    },
    neutral: { default: trostNeutral[800], subtle: trostNeutral[100] },
    // 예외 — DS 의 `fill.inverse` = "역상(어두운) 표면 **위에 얹는** 채움 = 흰색"으로 base 와 정합.
    // 가이드의 Fill/Inverse(#1A1A1A, 어두운 inverting 채움)는 DS 에서 bg.inverse / fill.neutral 이 담당.
    inverse: { default: trostNeutral["00"] }, // #FFFFFF
    status: {
      error: trostRed[500], // #FF4111
      success: trostGreen[500], // #00BC78
      info: trostBlue[500], // #2C91FF
      caution: trostYellow.text,
    },
    // Point(액센트) 채움 — 코발트.
    point: {
      default: trostCobalt[500], // #4968FF
      hover: trostCobalt[600], // #3050E5
      pressed: trostCobalt[700], // #2138B8
      subtle: trostCobalt[100], // #EDF0FF
    },
  },
  input: {
    bg: trostNeutral["00"],
    bgDisabled: trostNeutral[100],
    borderDefault: trostNeutral[200],
    borderHover: trostNeutral[400],
    borderFocus: trostCobalt[500],
    borderError: trostRed[500],
    borderDisabled: trostNeutral[200],
    placeholder: trostNeutral[500],
    helpertextDefault: trostNeutral[500],
    helpertextSuccess: trostCobalt[500],
    helpertextError: trostRed[500],
    helpertextDisabled: trostNeutral[400],
  },
} as const;

export type TrostSemanticTokens = typeof trostSemantic;
