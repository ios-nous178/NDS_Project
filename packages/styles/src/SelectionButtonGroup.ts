/* Auto-generated from packages/react/src/SelectionButtonGroup.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const SBG_CLASS = "nds-selection-button-group";
const SBG_ROOT_CLASS = `${SBG_CLASS}__root`;
const SBG_ITEM_CLASS = `${SBG_CLASS}__item`;

export const selectionButtonGroupStyles = `
  :where(.${SBG_ROOT_CLASS}) {
    display: inline-flex;
    gap: var(--semantic-gap-default);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SBG_ROOT_CLASS}[data-fullwidth="true"]) {
    display: flex;
    width: 100%;
  }

  :where(.${SBG_ITEM_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${spacing[14]}px ${spacing[24]}px;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
    white-space: nowrap;
    transition: background-color ${transition.default}, border-color ${transition.default}, color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${SBG_ROOT_CLASS}[data-fullwidth="true"] .${SBG_ITEM_CLASS}) {
    flex: 1 1 0;
    min-width: 0;
  }

  :where(.${SBG_ITEM_CLASS}:hover:not(:disabled):not([data-selected="true"])) {
    border-color: ${cv.borderRole.strong};
    color: ${cv.textRole.normal};
  }

  :where(.${SBG_ITEM_CLASS}[data-selected="true"]) {
    background: ${cv.surface.brandSubtle};
    border-color: ${cv.borderRole.brand};
    color: ${cv.textRole.strong};
    font-weight: ${fontWeight.bold};
  }

  :where(.${SBG_ITEM_CLASS}:disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :where(.${SBG_ITEM_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }
`;
