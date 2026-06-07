/* Auto-generated from packages/react/src/Pagination.tsx during the @nudge-design/styles split. */
import {
  borderWidth,
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
    gap: var(--semantic-gap-tight);
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
    background: var(--nds-pagination-active-bg, ${cv.surface.brand});
    color: var(--nds-pagination-active-text, ${cv.textRole.inverse});
    font-weight: ${fontWeight.bold};
  }

  :where(.${PG_ITEM_CLASS}[data-active="true"]:hover) {
    background: var(--nds-pagination-active-bg-hover, ${cv.fill.brandHover});
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

  /* ============================================================
     CashwalkBiz(cashwalk-biz) admin — boxed pagination
     ------------------------------------------------------------
     Figma 3001:31314 (배너광고 리포트). 각 페이지/화살표가 개별 보더
     박스(white + Border/Normal #EEE, r8, 34h)로 렌더되고, 활성 페이지는
     캐포비 시그니처 검정 채움(Fill/Neutral #333 + 흰 텍스트)이 된다.
     markup/props 변경 없이 data-brand cascade 만 추가 — base(다른 브랜드)
     무영향. :where() 0-specificity 라 base 규칙 뒤에 와야 이긴다(현재 순서).
  ============================================================ */
  :where([data-brand="cashwalk-biz"] .${PG_CLASS}) {
    gap: ${spacing[6]}px;
  }

  :where([data-brand="cashwalk-biz"] .${PG_ITEM_CLASS}) {
    box-sizing: border-box;
    height: 34px;
    border: ${borderWidth.default}px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
  }

  :where([data-brand="cashwalk-biz"] .${PG_ITEM_CLASS}:hover:not(:disabled)) {
    background: ${cv.surface.subtle};
  }

  :where([data-brand="cashwalk-biz"] .${PG_ITEM_CLASS}[data-active="true"]),
  :where([data-brand="cashwalk-biz"] .${PG_ITEM_CLASS}[data-active="true"]:hover) {
    background: var(--nds-pagination-active-bg, ${cv.fill.neutral});
    border-color: var(--nds-pagination-active-bg, ${cv.fill.neutral});
    color: var(--nds-pagination-active-text, ${cv.textRole.inverse});
    font-weight: ${fontWeight.bold};
  }
`;
