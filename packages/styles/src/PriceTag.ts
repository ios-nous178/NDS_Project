/* Auto-generated from packages/react/src/PriceTag.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight } from "@nudge-design/tokens";

const PT_CLASS = "nds-price-tag";
const PT_DISCOUNT_CLASS = `${PT_CLASS}__discount`;
const PT_AMOUNT_CLASS = `${PT_CLASS}__amount`;
const PT_ORIGINAL_CLASS = `${PT_CLASS}__original`;
const PT_UNIT_CLASS = `${PT_CLASS}__unit`;

export const ptStyles = `
  :where(.${PT_CLASS}) {
    display: inline-flex;
    align-items: baseline;
    gap: var(--nds-price-gap, 6px);
    font-family: ${fontFamily.web};
    color: ${cv.textRole.normal};
  }

  :where(.${PT_DISCOUNT_CLASS}) {
    color: var(--semantic-text-status-error);
    font-size: var(--nds-price-amount-size, 18px);
    font-weight: ${fontWeight.bold};
  }

  :where(.${PT_AMOUNT_CLASS}) {
    font-size: var(--nds-price-amount-size, 18px);
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    font-variant-numeric: tabular-nums;
  }

  :where(.${PT_AMOUNT_CLASS}[data-free="true"]) {
    color: var(--semantic-text-status-success);
  }

  :where(.${PT_UNIT_CLASS}) {
    font-size: var(--nds-price-amount-size, 18px);
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${PT_ORIGINAL_CLASS}) {
    font-size: var(--nds-price-original-size, 13px);
    color: ${cv.textRole.subtle};
    text-decoration: line-through;
    font-weight: ${fontWeight.medium};
    font-variant-numeric: tabular-nums;
  }
`;
