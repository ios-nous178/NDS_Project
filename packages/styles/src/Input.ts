/* Auto-generated from packages/react/src/Input.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  radius,
  sizing,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const INPUT_CLASS = "nds-input";
const INPUT_ROOT_CLASS = `${INPUT_CLASS}__root`;
const INPUT_WRAPPER_CLASS = `${INPUT_CLASS}__wrapper`;
const INPUT_LABEL_CLASS = `${INPUT_CLASS}__label`;
const INPUT_FIELD_CLASS = `${INPUT_CLASS}__field`;
const INPUT_PREFIX_CLASS = `${INPUT_CLASS}__prefix`;
const INPUT_SUFFIX_CLASS = `${INPUT_CLASS}__suffix`;
const INPUT_CLEAR_CLASS = `${INPUT_CLASS}__clear`;
const INPUT_PASSWORD_TOGGLE_CLASS = `${INPUT_CLASS}__password-toggle`;
const INPUT_HELPER_CLASS = `${INPUT_CLASS}__helper`;
const INPUT_HELPER_GROUP_CLASS = `${INPUT_CLASS}__helper-group`;
const INPUT_COUNT_CLASS = `${INPUT_CLASS}__count`;

export const inputStyles = `
  :where(.${INPUT_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    width: var(--nds-input-width, 100%);
    /* host 가 display:contents 라 이 root 가 부모 flex 의 실제 아이템 — flex-row 에서 full-width
       일 때 긴 값이 줄어들 수 있도록 min-width:0(아니면 콘텐츠 최소폭이 shrink 를 막아 넘침). */
    min-width: 0;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  /* label↔wrapper = gap-label(8), wrapper↔helper = helper-gap(8). 각 간격을 children margin 으로 직접 부여. */
  :where(.${INPUT_LABEL_CLASS}) + :where(.${INPUT_WRAPPER_CLASS}) {
    margin-top: var(--nds-input-label-gap, var(--semantic-gap-label));
  }
  :where(.${INPUT_WRAPPER_CLASS}) + :where(.${INPUT_HELPER_CLASS}),
  :where(.${INPUT_WRAPPER_CLASS}) + :where(.${INPUT_HELPER_GROUP_CLASS}) {
    margin-top: var(--nds-input-helper-gap, ${spacing[8]}px);
  }

  :where(.${INPUT_LABEL_CLASS}) {
    /* 입력 패밀리 라벨 — Input Typography 표준 label(13/18 · Medium) · Text/Strong(#111).
     * (Figma 4247:1964, 2026-06-15 합의 — 구 "입력 라벨 14px 통일" 을 13/18 로 환원).
     *  size+lineHeight 묶음(--semantic-input-typography-label) + weight 분리 토큰을 font shorthand 로 합성. */
    font: ${cv.inputTypography.label.font};
    color: ${cv.textRole.strong};
  }

  :where(.${INPUT_WRAPPER_CLASS}) {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    width: 100%;
    min-height: var(--nds-input-height, ${sizing.input.default}px);
    padding: 0 var(--nds-input-padding-x, var(--semantic-inset-card));
    border: 1px solid var(--nds-input-border-color, ${cv.input.borderDefault});
    border-radius: var(--nds-input-radius, ${radius.md}px);
    background: var(--nds-input-background, ${cv.input.bg});
    box-sizing: border-box;
    transition:
      border-color ${transition.default},
      background-color ${transition.default};
  }

  :where(.${INPUT_ROOT_CLASS}[data-disabled="true"]) {
    --nds-input-helper-gap: ${spacing[12]}px;
  }

  :where(.${INPUT_WRAPPER_CLASS}[data-focused="true"]) {
    border-color: ${cv.input.borderFocus};
  }

  :where(.${INPUT_WRAPPER_CLASS}[data-error="true"]) {
    border-color: ${cv.input.borderError};
  }

  :where(.${INPUT_WRAPPER_CLASS}[data-disabled="true"]) {
    background: ${cv.input.bgDisabled};
    cursor: default;
  }

  :where(.${INPUT_WRAPPER_CLASS}[data-readonly="true"]) {
    background: ${cv.surface.subtle};
  }

  :where(.${INPUT_FIELD_CLASS}) {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    /* Input Value — Input Typography 표준 value(15/22 · Regular). placeholder 도 같은 타이포
     * (색만 ::placeholder 에서 muted). size+lh 묶음 + weight 분리 토큰을 font shorthand 로 합성. */
    font: ${cv.inputTypography.value.font};
    /* Figma --color-label-normal = #111 (neutral/900) */
    color: ${cv.textRole.strong};
    padding: 0;
  }

  :where(.${INPUT_FIELD_CLASS}::placeholder) {
    color: ${cv.input.placeholder};
  }

  :where(.${INPUT_FIELD_CLASS}:disabled) {
    color: ${cv.textRole.muted};
    cursor: default;
  }

  :where(.${INPUT_PREFIX_CLASS}),
  :where(.${INPUT_SUFFIX_CLASS}) {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    line-height: 1;
    color: ${cv.iconRole.strong};
  }

  :where(.${INPUT_COUNT_CLASS}) {
    flex-shrink: 0;
    white-space: nowrap;
    /* 글자수 카운터 — helper 와 동일 Input Typography 13/18(caption1) 크기. 색만 muted. */
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: 1;
    color: ${cv.textRole.muted};
    font-variant-numeric: tabular-nums;
  }

  :where(.${INPUT_COUNT_CLASS}[data-over="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${INPUT_CLEAR_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    color: ${cv.iconRole.normal};
    line-height: 1;
  }

  :where(.${INPUT_CLEAR_CLASS} svg) {
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
  }

  :where(.${INPUT_PASSWORD_TOGGLE_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    color: ${cv.iconRole.normal};
    line-height: 1;
  }

  :where(.${INPUT_PASSWORD_TOGGLE_CLASS}:hover:not(:disabled)) {
    color: ${cv.iconRole.strong};
  }

  :where(.${INPUT_PASSWORD_TOGGLE_CLASS}:disabled) {
    cursor: default;
    color: ${cv.iconRole.disabled};
  }

  :where(.${INPUT_PASSWORD_TOGGLE_CLASS} svg) {
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
  }

  /* helper 폰트·색·아이콘(__icon)·캐포비 에러아이콘 ::before 는 공용 .nds-helper-text
   * (HelperText.ts) 가 소유한다 — helper element 에 nds-helper-text 클래스가 함께 붙는다.
   * 여기엔 Input 고유 규칙만 남긴다: 전체 입력 disabled 시 helper 회색 전파(variant 무관). */
  :where(.${INPUT_ROOT_CLASS}[data-disabled="true"]) :where(.${INPUT_HELPER_CLASS}) {
    color: ${cv.input.helpertextDisabled};
  }

  /* Figma 명세: HelpText 1 ↔ HelpText 2 row, 항목 간 gap 12.
   * 좁은 폭에서는 wrap. align-items: flex-start 로 아이콘이 첫 줄에 정렬. */
  :where(.${INPUT_HELPER_GROUP_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    column-gap: ${spacing[12]}px;
    row-gap: ${spacing[4]}px;
  }
`;
