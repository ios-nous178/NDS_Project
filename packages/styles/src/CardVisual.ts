/* Auto-generated from packages/react/src/CardVisual.tsx during the @nudge-design/styles split. */
import { fontFamily, fontWeight, radius, shadow, spacing, typeScale } from "@nudge-design/tokens";

const CV_CLASS = "nds-card-visual";
const CV_BRAND_CLASS = `${CV_CLASS}__brand`;
const CV_NUMBER_CLASS = `${CV_CLASS}__number`;
const CV_BOTTOM_CLASS = `${CV_CLASS}__bottom`;
const CV_HOLDER_CLASS = `${CV_CLASS}__holder`;
const CV_EXPIRY_CLASS = `${CV_CLASS}__expiry`;

export const cvStyles = `
  :where(.${CV_CLASS}) {
    position: relative;
    width: 320px;
    aspect-ratio: 1.586;
    padding: var(--inset-card-large);
    border-radius: ${radius.lg}px;
    color: var(--nds-card-fg, #fff);
    font-family: ${fontFamily.web};
    background: var(--nds-card-bg, linear-gradient(135deg, #1A1A1A 0%, #444 100%));
    box-shadow: ${shadow["3"]};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    overflow: hidden;
  }

  :where(.${CV_CLASS}[data-disabled="true"]) {
    filter: grayscale(0.6);
    opacity: 0.7;
  }

  :where(.${CV_BRAND_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  :where(.${CV_BRAND_CLASS}) > strong {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  :where(.${CV_NUMBER_CLASS}) {
    font-size: 20px;
    font-weight: ${fontWeight.semibold};
    letter-spacing: 0.16em;
    font-variant-numeric: tabular-nums;
  }

  :where(.${CV_BOTTOM_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: var(--gap-comfortable);
  }

  :where(.${CV_HOLDER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.85;
  }

  :where(.${CV_EXPIRY_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-variant-numeric: tabular-nums;
    opacity: 0.85;
  }

  :where(.${CV_CLASS}__chip) {
    width: 36px;
    height: 26px;
    border-radius: 4px;
    background: linear-gradient(135deg, #C8B870 0%, #E5D690 100%);
    margin-top: ${spacing[8]}px;
    border: 1px solid rgba(0,0,0,0.12);
  }

  :where(.${CV_CLASS}__label) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }
`;
