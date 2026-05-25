/* Auto-generated from packages/react/src/ScoreGauge.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, spacing, typeScale } from "@nudge-eap/tokens";

const SG_CLASS = "nds-score-gauge";
const SG_TRACK_CLASS = `${SG_CLASS}__track`;
const SG_NEEDLE_CLASS = `${SG_CLASS}__needle`;
const SG_VALUE_CLASS = `${SG_CLASS}__value`;
const SG_VALUE_NUMBER_CLASS = `${SG_CLASS}__value-number`;
const SG_VALUE_MAX_CLASS = `${SG_CLASS}__value-max`;
const SG_LABEL_CLASS = `${SG_CLASS}__label`;
const SG_LEGEND_CLASS = `${SG_CLASS}__legend`;
const SG_LEGEND_ITEM_CLASS = `${SG_CLASS}__legend-item`;

export const scoreGaugeStyles = `
  :where(.${SG_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-comfortable);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SG_TRACK_CLASS}) {
    position: relative;
    width: 100%;
    max-width: 240px;
    aspect-ratio: 2 / 1;
  }

  :where(.${SG_TRACK_CLASS}) svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }

  :where(.${SG_NEEDLE_CLASS}) {
    transition: transform 0.5s ease-out;
    transform-origin: 100px 100px;
  }

  :where(.${SG_VALUE_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing[2]}px;
  }

  :where(.${SG_VALUE_NUMBER_CLASS}) {
    font-size: ${typeScale.headline2.fontSize}px;
    line-height: ${typeScale.headline2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
  }

  :where(.${SG_VALUE_MAX_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${SG_LABEL_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
  }

  :where(.${SG_LABEL_CLASS}[data-level="normal"]) { color: ${cv.iconRole.statusSuccess}; }
  :where(.${SG_LABEL_CLASS}[data-level="mild"]) { color: ${cv.textRole.statusCaution}; }
  :where(.${SG_LABEL_CLASS}[data-level="moderate"]) { color: ${cv.textRole.statusCaution}; }
  :where(.${SG_LABEL_CLASS}[data-level="severe"]) { color: ${cv.textRole.statusError}; }

  :where(.${SG_LEGEND_CLASS}) {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--gap-comfortable);
  }

  :where(.${SG_LEGEND_ITEM_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${SG_LEGEND_ITEM_CLASS})::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--nds-gauge-legend-color, currentColor);
  }
`;
