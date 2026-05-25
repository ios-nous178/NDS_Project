/* Auto-generated from packages/react/src/ActionChip.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, radius, spacing, typeScale } from "@nudge-eap/tokens";

const AC_ROOT_CLASS = "nds-action-chip";
const AC_ICON_CLASS = `${AC_ROOT_CLASS}__icon`;
const AC_LABEL_CLASS = `${AC_ROOT_CLASS}__label`;

export const actionChipStyles = `
  :where(.${AC_ROOT_CLASS}) {
    appearance: none;
    border: 0;
    display: inline-flex;
    align-items: center;
    gap: ${spacing[2]}px;
    padding: ${spacing[2]}px ${spacing[6]}px;
    border-radius: ${radius.sm}px;
    background: ${cv.fill.neutralSubtle};
    color: ${cv.textRole.subtle};
    font-family: ${fontFamily.web};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.12s ease;
    white-space: nowrap;
  }

  :where(.${AC_ROOT_CLASS}:hover) {
    background: ${cv.surface.section};
  }

  :where(.${AC_ROOT_CLASS}:disabled) {
    cursor: not-allowed;
    opacity: 0.6;
  }

  :where(.${AC_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    color: ${cv.iconRole.normal};
  }

  :where(.${AC_LABEL_CLASS}) {
    display: inline-block;
  }
`;
