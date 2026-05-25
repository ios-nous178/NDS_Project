/* Auto-generated from packages/react/src/NumberStepper.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-eap/tokens";

const NS_CLASS = "nds-number-stepper";
const NS_BTN_CLASS = `${NS_CLASS}__btn`;
const NS_VALUE_CLASS = `${NS_CLASS}__value`;
const NS_INPUT_CLASS = `${NS_CLASS}__input`;

export const numberStepperStyles = `
  :where(.${NS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${NS_BTN_CLASS}) {
    width: var(--nds-stepper-btn, 36px);
    height: var(--nds-stepper-btn, 36px);
    border-radius: ${radius.md}px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color ${transition.default}, border-color ${transition.default};
    flex-shrink: 0;
    padding: 0;
  }

  :where(.${NS_BTN_CLASS}:hover:not([disabled])) {
    background: ${cv.surface.section};
  }

  :where(.${NS_BTN_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${NS_BTN_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${NS_VALUE_CLASS}) {
    min-width: var(--nds-stepper-value-w, 48px);
    text-align: center;
    font-size: var(--nds-stepper-font, 15px);
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.normal};
    line-height: ${typeScale.body2.lineHeight}px;
    user-select: none;
  }

  :where(.${NS_INPUT_CLASS}) {
    width: var(--nds-stepper-value-w, 48px);
    height: var(--nds-stepper-btn, 36px);
    text-align: center;
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: var(--nds-stepper-font, 15px);
    font-weight: ${fontWeight.semibold};
    padding: 0;
    appearance: textfield;
    -moz-appearance: textfield;
  }

  :where(.${NS_INPUT_CLASS}::-webkit-outer-spin-button),
  :where(.${NS_INPUT_CLASS}::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }

  :where(.${NS_INPUT_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 0;
    border-color: ${cv.borderRole.brand};
  }
`;
