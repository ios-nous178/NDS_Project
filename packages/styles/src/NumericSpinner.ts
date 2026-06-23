/* Auto-generated from packages/react/src/NumericSpinner.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, radius, sizing, spacing, transition } from "@nudge-design/tokens";

const NS_CLASS = "nds-numeric-spinner";
const NS_BUTTON_CLASS = `${NS_CLASS}__button`;
const NS_INPUT_CLASS = `${NS_CLASS}__input`;

export const numericSpinnerStyles = `
  :where(.${NS_CLASS}) {
    display: inline-flex;
    align-items: stretch;
    box-sizing: border-box;
    height: var(--nds-numeric-spinner-height, ${sizing.input.default}px);
    border: var(--stroke-default) solid ${cv.input.borderDefault};
    border-radius: var(--nds-input-radius, ${radius[8]}px);
    background: ${cv.input.bg};
    font-family: ${fontFamily.web};
    overflow: hidden;
    transition: border-color ${transition.default};
  }
  :where(.${NS_CLASS}[data-size="small"]) { --nds-numeric-spinner-height: ${sizing.input.compact}px; }
  :where(.${NS_CLASS}:focus-within) { border-color: ${cv.input.borderFocus}; }
  :where(.${NS_CLASS}[data-disabled="true"]) {
    background: ${cv.input.bgDisabled};
    border-color: ${cv.input.borderDisabled};
  }

  :where(.${NS_BUTTON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--nds-numeric-spinner-height, ${sizing.input.default}px);
    padding: 0;
    border: none;
    background: transparent;
    color: ${cv.iconRole.strong};
    cursor: pointer;
    transition: background-color ${transition.default}, color ${transition.default};
  }
  :where(.${NS_BUTTON_CLASS}:hover:not(:disabled)) { background: ${cv.surface.section}; }
  :where(.${NS_BUTTON_CLASS}:disabled) {
    color: ${cv.iconRole.disabled};
    cursor: not-allowed;
  }
  :where(.${NS_BUTTON_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: -2px;
  }

  :where(.${NS_INPUT_CLASS}) {
    width: var(--nds-numeric-spinner-input-width, ${spacing[48]}px);
    min-width: 0;
    border: none;
    border-left: var(--stroke-default) solid ${cv.input.borderDefault};
    border-right: var(--stroke-default) solid ${cv.input.borderDefault};
    background: transparent;
    outline: none;
    text-align: center;
    /* Input Value — Input Typography 표준 value(15/22 · Regular). */
    font: ${cv.inputTypography.value.font};
    color: ${cv.textRole.strong};
    font-variant-numeric: tabular-nums;
    -moz-appearance: textfield;
    appearance: textfield;
  }
  :where(.${NS_INPUT_CLASS}:disabled) { color: ${cv.textRole.disabled}; -webkit-text-fill-color: ${cv.textRole.disabled}; }
`;
