/* Auto-generated from packages/react/src/StarRating.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, spacing, typeScale } from "@nudge-eap/tokens";

const SR_CLASS = "nds-star-rating";
const SR_STAR_CLASS = `${SR_CLASS}__star`;
const SR_VALUE_CLASS = `${SR_CLASS}__value`;

export const starRatingStyles = `
  :where(.${SR_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--nds-star-gap, 2px);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SR_STAR_CLASS}) {
    flex-shrink: 0;
    display: inline-flex;
  }

  :where(.${SR_CLASS}[data-interactive="true"]) .${SR_STAR_CLASS} {
    cursor: pointer;
  }

  :where(.${SR_CLASS}[data-interactive="true"]) .${SR_STAR_CLASS}:hover {
    transform: scale(1.15);
  }

  :where(.${SR_VALUE_CLASS}) {
    margin-left: ${spacing[4]}px;
    font-size: var(--nds-star-value-font-size, ${typeScale.body3.fontSize}px);
    font-weight: ${fontWeight.bold};
    line-height: 1;
    color: ${cv.textRole.normal};
  }
`;
