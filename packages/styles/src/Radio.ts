/* Auto-generated from packages/react/src/Radio.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-eap/tokens";

const RADIO_CLASS = "nds-radio";
const RADIO_ROOT_CLASS = `${RADIO_CLASS}__root`;
const RADIO_INPUT_CLASS = `${RADIO_CLASS}__input`;
const RADIO_INDICATOR_CLASS = `${RADIO_CLASS}__indicator`;
const RADIO_LABEL_CLASS = `${RADIO_CLASS}__label`;
const RADIO_HELPER_CLASS = `${RADIO_CLASS}__helper`;
const RADIO_GROUP_CLASS = `${RADIO_CLASS}-group`;

export const radioStyles = `
  :where(.${RADIO_ROOT_CLASS}) {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    gap: var(--gap-comfortable);
    cursor: pointer;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${RADIO_ROOT_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
  }

  :where(.${RADIO_INPUT_CLASS}) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  :where(.${RADIO_INPUT_CLASS}:focus-visible + .${RADIO_INDICATOR_CLASS}) {
    box-shadow: 0 0 0 2px ${cv.surface.default}, 0 0 0 4px ${cv.borderRole.focus};
  }

  :where(.${RADIO_INDICATOR_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 1px;
    border: 2px solid ${cv.borderRole.normal};
    border-radius: ${radius.pill}px;
    background: ${cv.surface.default};
    transition: border-color ${transition.default}, background-color ${transition.default};
  }

  :where(.${RADIO_INDICATOR_CLASS}[data-checked="true"]) {
    border-color: ${cv.fill.brand};
  }

  :where(.${RADIO_ROOT_CLASS}[data-disabled="true"] .${RADIO_INDICATOR_CLASS}) {
    border-color: ${cv.borderRole.disabled};
    background: ${cv.surface.disabled};
  }

  :where(.${RADIO_ROOT_CLASS}[data-disabled="true"] .${RADIO_INDICATOR_CLASS}[data-checked="true"]) {
    border-color: ${cv.borderRole.disabled};
  }

  :where(.${RADIO_CLASS}__dot) {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: ${radius.pill}px;
    background: ${cv.fill.brand};
    opacity: 0;
    transform: scale(0);
    transition: opacity ${transition.default}, transform ${transition.default},
      background-color ${transition.default};
  }

  :where(.${RADIO_INDICATOR_CLASS}[data-checked="true"] .${RADIO_CLASS}__dot) {
    opacity: 1;
    transform: scale(1);
  }

  :where(.${RADIO_ROOT_CLASS}[data-disabled="true"] .${RADIO_CLASS}__dot) {
    background: ${cv.borderRole.disabled};
  }

  :where(.${RADIO_LABEL_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    user-select: none;
  }

  :where(.${RADIO_ROOT_CLASS}[data-disabled="true"] .${RADIO_LABEL_CLASS}) {
    color: ${cv.textRole.disabled};
  }

  :where(.${RADIO_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.muted};
    margin-left: 32px;
  }

  :where(.${RADIO_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${RADIO_GROUP_CLASS}) {
    display: flex;
    flex-direction: var(--nds-radio-group-direction, column);
    gap: var(--nds-radio-group-gap, var(--nds-choice-group-gap, var(--gap-comfortable)));
    font-family: ${fontFamily.web};
  }

  :where(.${RADIO_GROUP_CLASS}[data-layout="horizontal"]) {
    --nds-radio-group-direction: row;
  }
`;
