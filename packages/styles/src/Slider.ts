/* Auto-generated from packages/react/src/Slider.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const SL_CLASS = "nds-slider";
const SL_ROOT_CLASS = `${SL_CLASS}__root`;
const SL_TRACK_CLASS = `${SL_CLASS}__track`;
const SL_FILL_CLASS = `${SL_CLASS}__fill`;
const SL_INPUT_CLASS = `${SL_CLASS}__input`;
const SL_LABELS_CLASS = `${SL_CLASS}__labels`;
const SL_LABEL_CLASS = `${SL_CLASS}__label`;
const SL_VALUE_CLASS = `${SL_CLASS}__value`;

export const sliderStyles = `
  :where(.${SL_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SL_ROOT_CLASS}[data-disabled="true"]) {
    opacity: 0.5;
    pointer-events: none;
  }

  :where(.${SL_TRACK_CLASS}) {
    position: relative;
    width: 100%;
    height: 24px;
    display: flex;
    align-items: center;
  }

  :where(.${SL_TRACK_CLASS})::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: ${radius.full}px;
    background: ${cv.surface.disabled};
  }

  :where(.${SL_FILL_CLASS}) {
    position: absolute;
    left: 0;
    height: 4px;
    border-radius: ${radius.full}px;
    background: ${cv.surface.brand};
    pointer-events: none;
    transition: width ${transition.default};
  }

  :where(.${SL_INPUT_CLASS}) {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    height: 24px;
    background: transparent;
    margin: 0;
    padding: 0;
    cursor: pointer;
    position: relative;
    z-index: 1;
  }

  :where(.${SL_INPUT_CLASS})::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    border-radius: ${radius.full}px;
    background: ${cv.surface.default};
    border: 2px solid ${cv.borderRole.brand};
    box-shadow: ${shadow["1"]};
    cursor: pointer;
    transition: transform ${transition.default};
  }

  :where(.${SL_INPUT_CLASS})::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: ${radius.full}px;
    background: ${cv.surface.default};
    border: 2px solid ${cv.borderRole.brand};
    box-shadow: ${shadow["1"]};
    cursor: pointer;
  }

  :where(.${SL_INPUT_CLASS}:active)::-webkit-slider-thumb {
    transform: scale(1.1);
  }

  :where(.${SL_INPUT_CLASS}:focus-visible)::-webkit-slider-thumb {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${SL_LABELS_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :where(.${SL_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    user-select: none;
  }

  :where(.${SL_VALUE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
    user-select: none;
  }
`;
