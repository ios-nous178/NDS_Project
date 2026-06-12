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
     Figma 캐포비 Library / PaginationGuide (4118:1186). 각 페이지/화살표가
     개별 보더 박스(white + Border/Normal, radius 4, 34h)로 렌더되고, 활성
     페이지는 캐포비 시그니처 검정 채움(Fill/Neutral + 흰 텍스트)이 된다.
     끝 도달한 Prev/Next 는 흐림(opacity)이 아니라 boxed disabled(옅은 회색
     배경 + 회색 텍스트)로 표시.
     가이드는 raw hex(#212121/#d4d4d4/#8c8c8c)를 직접 찍었으나 DS 는 가장
     가까운 시멘틱 토큰(fill.neutral/borderRole.normal/textRole.disabled)로
     스냅 — 토큰-퍼스트. markup/props 변경 없이 data-brand cascade 만 추가 —
     base(다른 브랜드) 무영향. :where() 0-specificity 라 base 규칙 뒤에 와야
     이긴다(현재 순서).
  ============================================================ */
  :where([data-brand="cashwalk-biz"] .${PG_CLASS}) {
    gap: ${spacing[6]}px;
  }

  :where([data-brand="cashwalk-biz"] .${PG_ITEM_CLASS}) {
    box-sizing: border-box;
    height: 34px;
    border: ${borderWidth.default}px solid ${cv.borderRole.normal};
    border-radius: ${radius.sm}px;
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
    font-weight: ${fontWeight.medium};
  }

  /* boxed disabled — base 의 opacity:0.4(흐림) 를 끄고 옅은 회색 박스로 */
  :where([data-brand="cashwalk-biz"] .${PG_ITEM_CLASS}:disabled) {
    opacity: 1;
    background: ${cv.surface.subtle};
    border-color: ${cv.borderRole.normal};
    color: ${cv.textRole.disabled};
  }
`;
