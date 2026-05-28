/* Auto-generated from packages/react/src/CountdownTimer.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, typeScale } from "@nudge-design/tokens";

const CT_CLASS = "nds-countdown-timer";
const CT_TIME_CLASS = `${CT_CLASS}__time`;
const CT_LABEL_CLASS = `${CT_CLASS}__label`;

export const ctStyles = `
  :where(.${CT_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    font-family: ${fontFamily.web};
    color: ${cv.textRole.normal};
  }

  :where(.${CT_CLASS}[data-urgent="true"]) {
    color: var(--semantic-text-status-error);
  }

  :where(.${CT_CLASS}[data-expired="true"]) {
    color: ${cv.textRole.subtle};
  }

  :where(.${CT_TIME_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    font-variant-numeric: tabular-nums;
  }

  :where(.${CT_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }
`;
