/* Auto-generated from packages/react/src/Spinner.tsx during the @nudge-eap/styles split. */
import { cv } from "@nudge-eap/tokens";

const SP_CLASS = "nds-spinner";

export const spinnerStyles = `
  :where(.${SP_CLASS}) {
    display: inline-block;
    width: var(--nds-spinner-size, 24px);
    height: var(--nds-spinner-size, 24px);
    color: var(--nds-spinner-color, ${cv.textRole.brand});
    flex-shrink: 0;
  }

  :where(.${SP_CLASS}) svg {
    width: 100%;
    height: 100%;
    animation: nds-spinner-rotate 0.8s linear infinite;
  }

  :where(.${SP_CLASS}) circle {
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 60;
    stroke-dashoffset: 20;
    transform-origin: center;
  }

  @keyframes nds-spinner-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
