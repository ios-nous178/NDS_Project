/* Auto-generated from packages/react/src/CallControlBar.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-design/tokens";

const CB_CLASS = "nds-call-control-bar";
const CB_TIMER_CLASS = `${CB_CLASS}__timer`;
const CB_BUTTONS_CLASS = `${CB_CLASS}__buttons`;
const CB_BTN_CLASS = `${CB_CLASS}__btn`;
const CB_END_CLASS = `${CB_CLASS}__end`;
const CB_LABEL_CLASS = `${CB_CLASS}__label`;

export const cbStyles = `
  :where(.${CB_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-loose);
    padding: var(--semantic-inset-card-large);
    background: var(--nds-call-bar-bg, rgba(0, 0, 0, 0.85));
    color: #fff;
    border-radius: var(--nds-call-bar-radius, ${radius.lg}px);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${CB_TIMER_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    opacity: 0.85;
    font-variant-numeric: tabular-nums;
  }

  :where(.${CB_BUTTONS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-loose);
  }

  :where(.${CB_BTN_CLASS}) {
    width: 56px;
    height: 56px;
    border-radius: 9999px;
    border: none;
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color ${transition.default}, color ${transition.default};
    flex-shrink: 0;
  }

  :where(.${CB_BTN_CLASS}:hover) { background: rgba(255, 255, 255, 0.28); }

  :where(.${CB_BTN_CLASS}[data-active="true"]) {
    background: ${cv.surface.default};
    color: ${cv.textRole.strong};
  }

  :where(.${CB_BTN_CLASS}:focus-visible) {
    outline: 3px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${CB_END_CLASS}) {
    background: var(--semantic-fill-status-error);
  }

  :where(.${CB_END_CLASS}:hover) { background: var(--semantic-text-status-error); }

  :where(.${CB_LABEL_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-tight);
    font-size: ${typeScale.caption2.fontSize}px;
    color: rgba(255, 255, 255, 0.7);
  }

  :where(.${CB_BTN_CLASS}) [data-icon-wrap] {
    position: relative;
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${CB_BTN_CLASS}) [data-icon-slash] {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
`;
