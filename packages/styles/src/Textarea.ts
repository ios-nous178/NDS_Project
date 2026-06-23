/* Auto-generated from packages/react/src/Textarea.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, radius, transition, typeScale } from "@nudge-design/tokens";

const TA_CLASS = "nds-textarea";
const TA_ROOT_CLASS = `${TA_CLASS}__root`;
const TA_LABEL_CLASS = `${TA_CLASS}__label`;
const TA_WRAPPER_CLASS = `${TA_CLASS}__wrapper`;
const TA_FIELD_CLASS = `${TA_CLASS}__field`;
const TA_HELPER_CLASS = `${TA_CLASS}__helper`;
const TA_COUNT_CLASS = `${TA_CLASS}__count`;
const TA_FOOTER_CLASS = `${TA_CLASS}__footer`;

export const textareaStyles = `
  :where(.${TA_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-label);
    width: var(--nds-textarea-width, 100%);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TA_LABEL_CLASS}) {
    /* Input Typography 표준 label(13/18 · Medium, Figma 4247:1964). */
    font: ${cv.inputTypography.label.font};
    color: ${cv.textRole.normal};
  }

  :where(.${TA_WRAPPER_CLASS}) {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: var(--semantic-inset-input) var(--nds-textarea-padding-x, var(--semantic-inset-card));
    border: var(--stroke-default) solid var(--nds-textarea-border-color, ${cv.input.borderDefault});
    border-radius: var(--nds-textarea-radius, ${radius[8]}px);
    background: var(--nds-textarea-background, ${cv.input.bg});
    box-sizing: border-box;
    transition:
      border-color ${transition.default},
      background-color ${transition.default};
  }

  :where(.${TA_WRAPPER_CLASS}[data-focused="true"]) {
    border-color: ${cv.input.borderFocus};
  }

  :where(.${TA_WRAPPER_CLASS}[data-error="true"]) {
    border-color: ${cv.input.borderError};
  }

  :where(.${TA_WRAPPER_CLASS}[data-disabled="true"]) {
    background: ${cv.input.bgDisabled};
    cursor: default;
  }

  :where(.${TA_WRAPPER_CLASS}[data-readonly="true"]) {
    background: ${cv.surface.subtle};
  }

  :where(.${TA_FIELD_CLASS}) {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    /* Input Value — Input Typography 표준 value(15/22 · Regular). placeholder 동일(색만 muted). */
    font: ${cv.inputTypography.value.font};
    color: ${cv.textRole.normal};
    padding: 0;
    resize: var(--nds-textarea-resize, vertical);
    min-height: var(--nds-textarea-min-height, 80px);
  }

  :where(.${TA_FIELD_CLASS}::placeholder) {
    color: ${cv.input.placeholder};
  }

  :where(.${TA_FIELD_CLASS}:disabled) {
    color: ${cv.textRole.muted};
    cursor: default;
    resize: none;
  }

  /* helper 폰트(→13/18 · Input Typography 표준)·색·에러색·캐포비 에러아이콘 ::before 는 공용 .nds-helper-text
   * (HelperText.ts) 소유 — element 에 nds-helper-text 클래스가 함께 붙는다.
   * 여기엔 footer 레이아웃 통합(아래 .${TA_FOOTER_CLASS} > .${TA_HELPER_CLASS})만 남긴다. */

  /* helper 와 같은 줄(footer)에 우측 정렬 — resize 그립(필드 우하단)과 상하로 겹치지 않게
     wrapper 밖으로 분리한다. helper 가 없어도 margin-left:auto 로 항상 우측. */
  :where(.${TA_FOOTER_CLASS}) {
    display: flex;
    align-items: flex-start;
    gap: var(--semantic-gap-default);
  }

  :where(.${TA_FOOTER_CLASS}) > .${TA_HELPER_CLASS} {
    flex: 1 1 auto;
    min-width: 0;
  }

  :where(.${TA_COUNT_CLASS}) {
    flex: 0 0 auto;
    margin-left: auto;
    /* 글자수 카운터 — 같은 footer 행 helper 와 동일 Input Typography 13/18(caption1). 색만 muted. */
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.muted};
  }

  :where(.${TA_COUNT_CLASS}[data-over="true"]) {
    color: ${cv.textRole.statusError};
  }
`;
