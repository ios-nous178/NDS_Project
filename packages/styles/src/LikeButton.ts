/* Auto-generated from packages/react/src/LikeButton.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, transition } from "@nudge-design/tokens";

const LB_CLASS = "nds-like-button";
const LB_ICON_CLASS = `${LB_CLASS}__icon`;
const LB_COUNT_CLASS = `${LB_CLASS}__count`;

export const lbStyles = `
  :where(.${LB_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--nds-like-gap, 6px);
    padding: 0;
    border: none;
    background: transparent;
    color: ${cv.textRole.subtle};
    cursor: pointer;
    font-family: ${fontFamily.web};
    font-weight: ${fontWeight.semibold};
    font-size: var(--nds-like-count-size, 13px);
    transition: color ${transition.default};
  }

  :where(.${LB_CLASS}[data-liked="true"]) {
    color: var(--nds-like-color, var(--semantic-text-status-error));
  }

  :where(.${LB_CLASS}:hover) {
    color: var(--nds-like-color, var(--semantic-text-status-error));
  }

  :where(.${LB_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
    border-radius: 4px;
  }

  :where(.${LB_ICON_CLASS}) {
    width: var(--nds-like-icon, 20px);
    height: var(--nds-like-icon, 20px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform ${transition.default};
  }

  :where(.${LB_CLASS}[data-liked="true"]) .${LB_ICON_CLASS} {
    animation: nds-like-pop 320ms ease-out;
  }

  @keyframes nds-like-pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }

  :where(.${LB_COUNT_CLASS}) {
    font-variant-numeric: tabular-nums;
  }
`;
