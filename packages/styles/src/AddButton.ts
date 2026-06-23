/* Auto-generated from packages/react/src/AddButton.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const AB_CLASS = "nds-add-button";
const AB_ICON_CLASS = `${AB_CLASS}__icon`;
const AB_LABEL_CLASS = `${AB_CLASS}__label`;

export const addButtonStyles = `
  :where(.${AB_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[8]}px;
    box-sizing: border-box;
    min-height: ${sizing.button.lg}px;
    padding: 0 ${spacing[16]}px;
    background: ${cv.surface.subtle};
    border: var(--stroke-default) dashed ${cv.borderRole.strong};
    border-radius: ${radius[8]}px;
    color: ${cv.textRole.strong};
    font-family: ${fontFamily.web};
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    cursor: pointer;
    transition: border-color ${transition.default}, background-color ${transition.default}, color ${transition.default};
  }

  :where(.${AB_CLASS}[data-fullwidth="true"]) {
    display: flex;
    width: 100%;
  }

  :where(.${AB_CLASS}:hover:not(:disabled):not([data-error="true"])) {
    border-color: ${cv.borderRole.brand};
    color: ${cv.textRole.strong};
  }

  /* 에러: 점선 회색 → 빨간 실선 (Border/Status/Error) */
  :where(.${AB_CLASS}[data-error="true"]) {
    border-style: solid;
    border-color: ${cv.borderRole.statusError};
  }

  :where(.${AB_CLASS}:disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :where(.${AB_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${AB_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: ${cv.iconRole.strong};
  }

  :where(.${AB_LABEL_CLASS}) {
    display: inline-flex;
    align-items: center;
  }
`;
