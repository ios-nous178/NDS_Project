/* Auto-generated from packages/react/src/PullToRefresh.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, spacing, transition, typeScale } from "@nudge-eap/tokens";

const PR_CLASS = "nds-pull-to-refresh";
const PR_INDICATOR_CLASS = `${PR_CLASS}__indicator`;
const PR_CONTENT_CLASS = `${PR_CLASS}__content`;
const PR_SPINNER_CLASS = `${PR_CLASS}__spinner`;
const PR_LABEL_CLASS = `${PR_CLASS}__label`;

export const prStyles = `
  :where(.${PR_CLASS}) {
    position: relative;
    overflow: hidden;
    overscroll-behavior-y: contain;
    font-family: ${fontFamily.web};
  }

  :where(.${PR_INDICATOR_CLASS}) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: var(--nds-ptr-pull, 0px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.caption1.fontSize}px;
    pointer-events: none;
    overflow: hidden;
  }

  :where(.${PR_CONTENT_CLASS}) {
    transform: translateY(var(--nds-ptr-pull, 0px));
    transition: transform var(--nds-ptr-anim, 0ms) ease;
  }

  :where(.${PR_SPINNER_CLASS}) {
    width: 18px;
    height: 18px;
    border: 2px solid ${cv.borderRole.normal};
    border-top-color: ${cv.borderRole.brand};
    border-radius: 9999px;
    animation: nds-ptr-spin 0.8s linear infinite;
    margin-right: ${spacing[8]}px;
  }

  @keyframes nds-ptr-spin {
    to { transform: rotate(360deg); }
  }

  :where(.${PR_LABEL_CLASS}) {
    transition: opacity ${transition.default};
  }
`;
