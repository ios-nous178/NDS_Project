/* Auto-generated from packages/react/src/TextButton.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-design/tokens";

const TEXT_BUTTON_CLASS = "nds-text-button";
const TEXT_BUTTON_LABEL_CLASS = `${TEXT_BUTTON_CLASS}__label`;
const TEXT_BUTTON_ICON_CLASS = `${TEXT_BUTTON_CLASS}__icon`;

export const textButtonStyles = `
  :where(.${TEXT_BUTTON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--nds-text-button-gap, ${spacing[2]}px);
    padding: ${spacing[4]}px;
    border: none;
    background: transparent;
    /* Figma node 171:8538/171:8550 — geniet/gray/700 = #777 (neutral/600) */
    color: var(--nds-text-button-color, ${cv.textRole.subtle});
    font-family: ${fontFamily.web};
    font-size: var(--nds-text-button-font-size, ${typeScale.body2.fontSize}px);
    line-height: var(--nds-text-button-line-height, ${typeScale.body2.lineHeight}px);
    font-weight: ${fontWeight.regular};
    white-space: nowrap;
    cursor: pointer;
    transition: color ${transition.default};
  }

  :where(.${TEXT_BUTTON_CLASS}:disabled) {
    cursor: default;
    color: ${cv.textRole.muted};
  }

  :where(.${TEXT_BUTTON_CLASS}:not(:disabled):hover) {
    color: var(--nds-text-button-hover-color, ${cv.textRole.brand});
  }

  :where(.${TEXT_BUTTON_LABEL_CLASS}) {
    display: inline-flex;
    align-items: center;
  }

  :where(.${TEXT_BUTTON_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: var(--nds-text-button-icon-size, 16px);
    line-height: 1;
  }

  :where(.${TEXT_BUTTON_ICON_CLASS} svg) {
    width: var(--nds-text-button-icon-size, 16px);
    height: var(--nds-text-button-icon-size, 16px);
  }
`;
