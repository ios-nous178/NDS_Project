/* Auto-generated from packages/react/src/ProgressBar.tsx during the @nudge-eap/styles split. */
import { cv, radius, transition } from "@nudge-eap/tokens";

const PB_CLASS = "nds-progress-bar";
const PB_TRACK_CLASS = `${PB_CLASS}__track`;
const PB_FILL_CLASS = `${PB_CLASS}__fill`;

export const progressBarStyles = `
  :where(.${PB_CLASS}) {
    width: 100%;
    box-sizing: border-box;
  }

  :where(.${PB_TRACK_CLASS}) {
    width: 100%;
    height: var(--nds-progress-height, 8px);
    border-radius: var(--nds-progress-radius, ${radius.pill}px);
    background: var(--nds-progress-track-bg, ${cv.surface.disabled});
    overflow: hidden;
  }

  :where(.${PB_FILL_CLASS}) {
    height: 100%;
    border-radius: inherit;
    background: var(--nds-progress-fill-bg, ${cv.surface.brand});
    transition: width ${transition.default};
  }
`;
