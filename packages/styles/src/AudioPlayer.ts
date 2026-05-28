/* Auto-generated from packages/react/src/AudioPlayer.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const AP_CLASS = "nds-audio-player";
const AP_HEAD_CLASS = `${AP_CLASS}__head`;
const AP_TITLE_CLASS = `${AP_CLASS}__title`;
const AP_SUBTITLE_CLASS = `${AP_CLASS}__subtitle`;
const AP_TRACK_CLASS = `${AP_CLASS}__track`;
const AP_FILL_CLASS = `${AP_CLASS}__fill`;
const AP_INPUT_CLASS = `${AP_CLASS}__input`;
const AP_TIMES_CLASS = `${AP_CLASS}__times`;
const AP_TIME_CLASS = `${AP_CLASS}__time`;
const AP_CONTROLS_CLASS = `${AP_CLASS}__controls`;
const AP_BUTTON_CLASS = `${AP_CLASS}__button`;
const AP_PLAY_CLASS = `${AP_CLASS}__play`;

export const audioPlayerStyles = `
  :where(.${AP_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-comfortable);
    width: 100%;
    padding: var(--semantic-inset-card) var(--semantic-inset-card-large);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${AP_HEAD_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
  }

  :where(.${AP_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${AP_SUBTITLE_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${AP_TRACK_CLASS}) {
    position: relative;
    width: 100%;
    height: 16px;
    display: flex;
    align-items: center;
  }

  :where(.${AP_TRACK_CLASS})::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.disabled};
  }

  :where(.${AP_FILL_CLASS}) {
    position: absolute;
    left: 0;
    height: 4px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.brand};
    pointer-events: none;
    transition: width ${transition.default};
  }

  :where(.${AP_INPUT_CLASS}) {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    height: 16px;
    background: transparent;
    margin: 0;
    cursor: pointer;
    position: relative;
    z-index: 1;
  }

  :where(.${AP_INPUT_CLASS})::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.brand};
    border: none;
    cursor: pointer;
  }

  :where(.${AP_INPUT_CLASS})::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.brand};
    border: none;
    cursor: pointer;
  }

  :where(.${AP_TIMES_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :where(.${AP_TIME_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
    font-variant-numeric: tabular-nums;
  }

  :where(.${AP_CONTROLS_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--semantic-gap-loose);
  }

  :where(.${AP_BUTTON_CLASS}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: ${radius.pill}px;
    color: ${cv.iconRole.strong};
    cursor: pointer;
    transition: background-color ${transition.default};
  }

  :where(.${AP_BUTTON_CLASS}:hover) {
    background: ${cv.surface.page};
  }

  :where(.${AP_PLAY_CLASS}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
    cursor: pointer;
    transition: background-color ${transition.default};
  }

  :where(.${AP_PLAY_CLASS}:hover) {
    background: ${cv.fill.brandHover};
  }
`;
