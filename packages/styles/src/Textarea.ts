/* Auto-generated from packages/react/src/Textarea.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const TA_CLASS = "nds-textarea";
const TA_ROOT_CLASS = `${TA_CLASS}__root`;
const TA_LABEL_CLASS = `${TA_CLASS}__label`;
const TA_WRAPPER_CLASS = `${TA_CLASS}__wrapper`;
const TA_FIELD_CLASS = `${TA_CLASS}__field`;
const TA_HELPER_CLASS = `${TA_CLASS}__helper`;
const TA_COUNT_CLASS = `${TA_CLASS}__count`;

export const textareaStyles = `
  :where(.${TA_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-comfortable);
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
    padding: var(--inset-input) var(--inset-card);
    border: 1px solid var(--nds-textarea-border-color, ${cv.borderRole.normal});
    border-radius: var(--nds-textarea-radius, ${radius.md}px);
    background: var(--nds-textarea-background, ${cv.surface.default});
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
    background: ${cv.surface.subtle};
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
    color: ${cv.textRole.muted};
  }

  :where(.${TA_FIELD_CLASS}:disabled) {
    color: ${cv.textRole.muted};
    cursor: default;
    resize: none;
  }

  :where(.${TA_HELPER_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[6]}px;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: var(--nds-textarea-helper-color, ${cv.textRole.subtle});
  }

  :where(.${TA_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${TA_COUNT_CLASS}) {
    text-align: right;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.muted};
    margin-top: ${spacing[4]}px;
  }

  :where(.${TA_COUNT_CLASS}[data-over="true"]) {
    color: ${cv.textRole.statusError};
  }
`;
