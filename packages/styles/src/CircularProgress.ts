/* Auto-generated from packages/react/src/CircularProgress.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, transition } from "@nudge-design/tokens";

const CP_CLASS = "nds-circular-progress";
const CP_SVG_CLASS = `${CP_CLASS}__svg`;
const CP_TRACK_CLASS = `${CP_CLASS}__track`;
const CP_FILL_CLASS = `${CP_CLASS}__fill`;
const CP_LABEL_CLASS = `${CP_CLASS}__label`;
const CP_VALUE_CLASS = `${CP_CLASS}__value`;
const CP_CAPTION_CLASS = `${CP_CLASS}__caption`;

export const cpStyles = `
  :where(.${CP_CLASS}) {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-family: ${fontFamily.web};
  }

  :where(.${CP_SVG_CLASS}) {
    transform: rotate(-90deg);
  }

  :where(.${CP_TRACK_CLASS}) {
    fill: none;
    stroke: var(--nds-cp-track, ${cv.surface.section});
  }

  :where(.${CP_FILL_CLASS}) {
    fill: none;
    stroke: var(--nds-cp-fill, ${cv.iconRole.brand});
    stroke-linecap: round;
    transition: stroke-dashoffset 480ms ease, stroke ${transition.default};
  }

  :where(.${CP_LABEL_CLASS}) {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }

  :where(.${CP_VALUE_CLASS}) {
    font-size: var(--nds-cp-value-size, 16px);
    line-height: 1;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    font-variant-numeric: tabular-nums;
  }

  :where(.${CP_CAPTION_CLASS}) {
    font-size: 11px;
    line-height: 1;
    color: ${cv.textRole.subtle};
  }
`;
