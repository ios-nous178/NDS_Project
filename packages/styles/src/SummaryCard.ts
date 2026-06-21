/* Auto-generated from packages/react/src/SummaryCard.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-design/tokens";

const OS_CLASS = "nds-summary-card";
const OS_HEADER_CLASS = `${OS_CLASS}__header`;
const OS_TITLE_CLASS = `${OS_CLASS}__title`;
const OS_LIST_CLASS = `${OS_CLASS}__list`;
const OS_ROW_CLASS = `${OS_CLASS}__row`;
const OS_LABEL_CLASS = `${OS_CLASS}__label`;
const OS_VALUE_CLASS = `${OS_CLASS}__value`;
const OS_DIVIDER_CLASS = `${OS_CLASS}__divider`;
const OS_TOTAL_CLASS = `${OS_CLASS}__total`;
const OS_TOTAL_VALUE_CLASS = `${OS_CLASS}__total-value`;

export const osStyles = `
  :where(.${OS_CLASS}) {
    display: flex;
    flex-direction: column;
    padding: var(--semantic-inset-card-large);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius[12]}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${OS_HEADER_CLASS}) {
    margin-bottom: ${spacing[16]}px;
  }

  :where(.${OS_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${OS_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
  }

  :where(.${OS_ROW_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--semantic-gap-comfortable);
  }

  :where(.${OS_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${OS_VALUE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.textRole.normal};
    font-variant-numeric: tabular-nums;
    text-align: right;
  }

  :where(.${OS_VALUE_CLASS}[data-emphasis="discount"]) {
    color: var(--semantic-text-status-error);
    font-weight: ${fontWeight.semibold};
  }

  :where(.${OS_VALUE_CLASS}[data-emphasis="info"]) {
    color: ${cv.textRole.brand};
  }

  :where(.${OS_DIVIDER_CLASS}) {
    height: 1px;
    background: ${cv.borderRole.subtle};
    margin: ${spacing[16]}px 0;
  }

  :where(.${OS_TOTAL_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--semantic-gap-comfortable);
  }

  :where(.${OS_TOTAL_CLASS}) > span:first-child {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.normal};
  }

  :where(.${OS_TOTAL_VALUE_CLASS}) {
    font-size: 22px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    font-variant-numeric: tabular-nums;
  }
`;
