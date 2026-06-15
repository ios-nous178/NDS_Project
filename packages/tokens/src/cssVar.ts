// Semantic color CSS variable references.
//
// Single `--semantic-*` namespace, 1:1 mirroring Figma SemanticColorGuide
// (171:6675 / 222:2 + 227:2 + 227:86 + 227:160 + 231:2 + 231:46 + 261:32 + 294:12).
//
// 8 role groups + bg extension. Legacy palette aliases (cv.primary/secondary/
// error/caution/success/text/bg/border/icon/status) have been removed —
// migrate to the corresponding role group below.

const v = (name: string) => `var(${name})`;

export const cv = {
  // ── BG (Figma `Section_BG` 258:2) ─────────────────────────
  surface: {
    page: v("--semantic-bg-page-default"),
    default: v("--semantic-bg-surface-default"),
    subtle: v("--semantic-bg-surface-subtle"),
    section: v("--semantic-bg-section-default"),
    brand: v("--semantic-bg-brand-default"),
    brandSubtle: v("--semantic-bg-brand-subtle"),
    inverse: v("--semantic-bg-inverse-default"),
    statusError: v("--semantic-bg-status-error"),
    statusSuccess: v("--semantic-bg-status-success"),
    statusInfo: v("--semantic-bg-status-info"),
    statusCaution: v("--semantic-bg-status-caution"),
    overlay: v("--semantic-bg-overlay"),
    // DS extension — Figma has no `bg-disabled` role; needed for disabled controls.
    disabled: v("--semantic-bg-disabled"),
  },
  // ── Text (Figma `Section_Text` 259:2) ─────────────────────
  textRole: {
    strong: v("--semantic-text-strong-default"),
    normal: v("--semantic-text-normal-default"),
    subtle: v("--semantic-text-subtle-default"),
    muted: v("--semantic-text-muted-default"),
    disabled: v("--semantic-text-disabled-default"),
    inverse: v("--semantic-text-inverse-default"),
    brand: v("--semantic-text-brand-default"),
    brandStrong: v("--semantic-text-brand-strong"),
    statusSuccess: v("--semantic-text-status-success"),
    statusError: v("--semantic-text-status-error"),
    statusCaution: v("--semantic-text-status-caution"),
    statusInfo: v("--semantic-text-status-info"),
  },
  // ── Icon (Figma `Section_Icon` 227:2) ─────────────────────
  iconRole: {
    strong: v("--semantic-icon-strong-default"),
    normal: v("--semantic-icon-normal-default"),
    disabled: v("--semantic-icon-disabled-default"),
    inverse: v("--semantic-icon-inverse-default"),
    brand: v("--semantic-icon-brand-default"),
    statusSuccess: v("--semantic-icon-status-success"),
    statusError: v("--semantic-icon-status-error"),
    statusCaution: v("--semantic-icon-status-caution"),
  },
  // ── Border (Figma `Section_Border` 227:86) ────────────────
  borderRole: {
    normal: v("--semantic-border-normal-default"),
    strong: v("--semantic-border-strong-default"),
    subtle: v("--semantic-border-subtle-default"),
    focus: v("--semantic-border-focus-default"),
    brand: v("--semantic-border-brand-default"),
    brandDisabled: v("--semantic-border-brand-disabled"),
    disabled: v("--semantic-border-disabled-default"),
    statusError: v("--semantic-border-status-error"),
    statusCaution: v("--semantic-border-status-caution"),
  },
  // ── Button (Figma `Section_Button{BG,Text,Border}` 231:2 / 231:46 / 261:32) ─
  button: {
    bgDefault: v("--semantic-button-bg-default"),
    bgHover: v("--semantic-button-bg-hover"),
    bgPressed: v("--semantic-button-bg-pressed"),
    bgDisabled: v("--semantic-button-bg-disabled"),
    bgSecondary: v("--semantic-button-bg-secondary-default"),
    bgSecondaryHover: v("--semantic-button-bg-secondary-hover"),
    bgSecondaryDisabled: v("--semantic-button-bg-secondary-disabled"),
    bgOutlined: v("--semantic-button-bg-outlined-default"),
    bgOutlinedHover: v("--semantic-button-bg-outlined-hover"),
    bgOutlinedDisabled: v("--semantic-button-bg-outlined-disabled"),
    // Solid/Neutral — neutral filled (light gray fill + neutral text). 브랜드별 톤은
    // buttonBg.neutral / buttonText.neutral 슬롯에서 override.
    bgNeutral: v("--semantic-button-bg-neutral-default"),
    bgNeutralHover: v("--semantic-button-bg-neutral-hover"),
    bgNeutralDisabled: v("--semantic-button-bg-neutral-disabled"),
    textDefault: v("--semantic-button-text-default"),
    textBrand: v("--semantic-button-text-brand"),
    // Solid/Secondary 텍스트 — 브랜드별 의도가 갈리는 슬롯 (Geniet=white on dark, 다른 브랜드=brand on tint).
    textSecondary: v("--semantic-button-text-secondary-default"),
    textSecondaryDisabled: v("--semantic-button-text-secondary-disabled"),
    // Outlined/Weak Neutral 의 enabled 텍스트(흰/투명 bg 위 → 어두운 톤). Outlined disabled 는 textNeutralDisabled.
    textNeutral: v("--semantic-button-text-neutral"),
    textNeutralDisabled: v("--semantic-button-text-neutral-disabled"),
    // Solid Neutral 의 텍스트 — fill 명도 대비용(어두운 fill=흰글자[cashpobi/nudge], 밝은 fill=어두운글자[geniet/runmile]).
    // textNeutral(outlined)과 분리 — cashpobi 는 solid=흰 / outlined=#111 로 다름.
    textNeutralSolid: v("--semantic-button-text-neutral-solid"),
    textDisabled: v("--semantic-button-text-disabled"),
    borderOutlined: v("--semantic-button-border-outlined-default"),
    borderOutlinedHover: v("--semantic-button-border-outlined-hover"),
    borderOutlinedDisabled: v("--semantic-button-border-outlined-disabled"),
    borderNeutral: v("--semantic-button-border-neutral-default"),
    borderNeutralDisabled: v("--semantic-button-border-neutral-disabled"),
  },
  // ── Confirm CTA (모달/팝업 주 액션 버튼 — base=brand 참조, 캐포비=neutral 검정) ──
  confirmCta: {
    bg: v("--semantic-confirm-cta-bg"),
    hover: v("--semantic-confirm-cta-hover"),
    active: v("--semantic-confirm-cta-active"),
    text: v("--semantic-confirm-cta-text"),
  },
  // ── Fill (Figma `Section_Fill` 227:160) ───────────────────
  fill: {
    brand: v("--semantic-fill-brand-default"),
    brandHover: v("--semantic-fill-brand-hover"),
    brandPressed: v("--semantic-fill-brand-pressed"),
    brandDisabled: v("--semantic-fill-brand-disabled"),
    neutral: v("--semantic-fill-neutral-default"),
    neutralSubtle: v("--semantic-fill-neutral-subtle"),
    inverse: v("--semantic-fill-inverse-default"),
    statusError: v("--semantic-fill-status-error"),
    statusCaution: v("--semantic-fill-status-caution"),
  },
  // ── Input (Figma `Section_Input` 294:12) ──────────────────
  input: {
    bg: v("--semantic-input-bg"),
    bgDisabled: v("--semantic-input-bg-disabled"),
    borderDefault: v("--semantic-input-border-default"),
    borderHover: v("--semantic-input-border-hover"),
    borderFocus: v("--semantic-input-border-focus"),
    borderError: v("--semantic-input-border-error"),
    borderDisabled: v("--semantic-input-border-disabled"),
    placeholder: v("--semantic-input-placeholder"),
    helpertextDefault: v("--semantic-input-helpertext-default"),
    helpertextSuccess: v("--semantic-input-helpertext-success"),
    helpertextError: v("--semantic-input-helpertext-error"),
    helpertextDisabled: v("--semantic-input-helpertext-disabled"),
  },
  // ── Input Typography (Figma 4247:1964 · 브랜드 무관) ───────
  // 입력 패밀리(Input·Textarea·Select·FormField·TagInput·Phone·DatePicker…)의 라벨/값/
  // 헬퍼 타이포를 통일하는 시멘틱 토큰. size+lineHeight 는 한 토큰으로 묶고, weight 는 분리.
  //   · `.font`  — `font` shorthand 한 줄(weight + size/lh + family)을 합성. 라벨/값/헬퍼의
  //                size·lineHeight·weight·family 를 longhand 3~4개 대신 한 번에 박는다.
  //   · `.sizeLineHeight` / `.weight` — weight 를 따로 갈아끼우거나 size/lh 만 필요할 때.
  // 역할: label(13/18·Medium) · value(15/22·Regular, placeholder 동일·색만 muted) ·
  //       helper(13/18·Regular, error 동일·색만 status-error).
  inputTypography: {
    label: {
      font: `var(--semantic-input-typography-label-weight) var(--semantic-input-typography-label) var(--font-family-default)`,
      sizeLineHeight: v("--semantic-input-typography-label"),
      weight: v("--semantic-input-typography-label-weight"),
    },
    value: {
      font: `var(--semantic-input-typography-value-weight) var(--semantic-input-typography-value) var(--font-family-default)`,
      sizeLineHeight: v("--semantic-input-typography-value"),
      weight: v("--semantic-input-typography-value-weight"),
    },
    helper: {
      font: `var(--semantic-input-typography-helper-weight) var(--semantic-input-typography-helper) var(--font-family-default)`,
      sizeLineHeight: v("--semantic-input-typography-helper"),
      weight: v("--semantic-input-typography-helper-weight"),
    },
  },
} as const;

export type CssVarRef = typeof cv;
