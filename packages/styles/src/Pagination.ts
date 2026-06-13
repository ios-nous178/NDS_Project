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
    gap: var(--nds-pagination-gap, var(--semantic-gap-tight));
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  /* 아이템 시각은 --nds-pagination-* 슬롯로 합성 — 브랜드(캐포비)는 boxed 룩을 토큰 맵에서 override.
   * base(다른 브랜드) = 테두리 없는 투명 버튼(슬롯 fallback). (CLAUDE.md 슬롯 합성 참조.) */
  :where(.${PG_ITEM_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-width: 32px;
    height: var(--nds-pagination-item-height, 32px);
    padding: 0 ${spacing[6]}px;
    border: var(--nds-pagination-item-border, none);
    border-radius: var(--nds-pagination-item-radius, ${radius.md}px);
    background: var(--nds-pagination-item-bg, transparent);
    color: var(--nds-pagination-item-color, ${cv.textRole.subtle});
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: var(--nds-pagination-item-weight, ${fontWeight.regular});
    line-height: ${typeScale.body3.lineHeight}px;
    cursor: pointer;
    transition:
      background-color ${transition.default},
      color ${transition.default},
      border-color ${transition.default};
    font-family: inherit;
  }

  :where(.${PG_ITEM_CLASS}:hover:not(:disabled)) {
    background: ${cv.surface.subtle};
  }

  :where(.${PG_ITEM_CLASS}[data-active="true"]) {
    background: var(--nds-pagination-active-bg, ${cv.surface.brand});
    border-color: var(--nds-pagination-active-bg, ${cv.surface.brand});
    color: var(--nds-pagination-active-text, ${cv.textRole.inverse});
    font-weight: var(--nds-pagination-active-weight, ${fontWeight.bold});
  }

  :where(.${PG_ITEM_CLASS}[data-active="true"]:hover) {
    background: var(--nds-pagination-active-bg-hover, ${cv.fill.brandHover});
    border-color: var(--nds-pagination-active-bg-hover, ${cv.fill.brandHover});
  }

  :where(.${PG_ITEM_CLASS}:disabled) {
    cursor: default;
    opacity: var(--nds-pagination-disabled-opacity, 0.4);
    background: var(--nds-pagination-disabled-bg, transparent);
    color: var(--nds-pagination-disabled-color, ${cv.textRole.subtle});
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
