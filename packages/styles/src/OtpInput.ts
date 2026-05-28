/* Auto-generated from packages/react/src/OtpInput.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-design/tokens";

const OTP_CLASS = "nds-otp";
const OTP_ROOT_CLASS = `${OTP_CLASS}__root`;
const OTP_CELL_CLASS = `${OTP_CLASS}__cell`;
const OTP_INPUT_CLASS = `${OTP_CLASS}__input`;

export const otpStyles = `
  :where(.${OTP_ROOT_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${OTP_ROOT_CLASS}[data-disabled="true"]) {
    opacity: 0.5;
    pointer-events: none;
  }

  :where(.${OTP_CELL_CLASS}) {
    position: relative;
    width: 44px;
    height: 52px;
  }

  :where(.${OTP_INPUT_CLASS}) {
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: ${typeScale.headline5.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: ${typeScale.headline5.lineHeight}px;
    color: ${cv.textRole.normal};
    background: ${cv.surface.default};
    border: 1.5px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    outline: none;
    box-sizing: border-box;
    font-family: inherit;
    transition: border-color ${transition.default}, background-color ${transition.default};
    -moz-appearance: textfield;
  }

  :where(.${OTP_INPUT_CLASS})::-webkit-outer-spin-button,
  :where(.${OTP_INPUT_CLASS})::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  :where(.${OTP_INPUT_CLASS}:focus) {
    border-color: ${cv.borderRole.brand};
    background: ${cv.surface.brandSubtle};
  }

  :where(.${OTP_ROOT_CLASS}[data-error="true"]) .${OTP_INPUT_CLASS} {
    border-color: ${cv.borderRole.statusError};
  }
`;
