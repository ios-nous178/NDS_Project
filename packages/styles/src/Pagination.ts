/* Auto-generated from packages/react/src/Pagination.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const PG_CLASS = "nds-pagination";
const PG_ITEM_CLASS = `${PG_CLASS}__item`;
const PG_ELLIPSIS_CLASS = `${PG_CLASS}__ellipsis`;

export const paginationStyles = `
  :where(.${PG_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-tight);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${PG_ITEM_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 ${spacing[6]}px;
    border: none;
    border-radius: ${radius.md}px;
    background: transparent;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body3.lineHeight}px;
    cursor: pointer;
    transition:
      background-color ${transition.default},
      color ${transition.default};
    font-family: inherit;
  }

  :where(.${PG_ITEM_CLASS}:hover:not(:disabled)) {
    background: ${cv.surface.subtle};
  }

  :where(.${PG_ITEM_CLASS}[data-active="true"]) {
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
    font-weight: ${fontWeight.bold};
  }

  :where(.${PG_ITEM_CLASS}[data-active="true"]:hover) {
    background: ${cv.fill.brandHover};
  }

  :where(.${PG_ITEM_CLASS}:disabled) {
    cursor: default;
    opacity: 0.4;
  }

  :where(.${PG_ELLIPSIS_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.body3.fontSize}px;
    user-select: none;
  }

  :where(.${PG_ITEM_CLASS}[data-type="arrow"]) {
    font-size: 0;
  }

  :where(.${PG_ITEM_CLASS}[data-type="arrow"] svg) {
    width: 16px;
    height: 16px;
  }
`;
