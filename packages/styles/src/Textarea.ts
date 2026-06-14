/* Auto-generated from packages/react/src/Textarea.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-design/tokens";

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
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${TA_WRAPPER_CLASS}) {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: var(--semantic-inset-input) var(--nds-textarea-padding-x, var(--semantic-inset-card));
    border: 1px solid var(--nds-textarea-border-color, ${cv.input.borderDefault});
    border-radius: var(--nds-textarea-radius, ${radius.md}px);
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
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
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

  /* helper 폰트(→12px)·색·에러색·캐포비 에러아이콘 ::before 는 공용 .nds-helper-text
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
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.muted};
  }

  :where(.${TA_COUNT_CLASS}[data-over="true"]) {
    color: ${cv.textRole.statusError};
  }
`;
