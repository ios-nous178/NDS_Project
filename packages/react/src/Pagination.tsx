import React, { useCallback, useMemo } from "react";

/* ─── Constants ─── */

const PG_CLASS = "nds-pagination";
const PG_ITEM_CLASS = `${PG_CLASS}__item`;
const PG_ELLIPSIS_CLASS = `${PG_CLASS}__ellipsis`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/** 페이지 범위 생성 */
function getPageRange(current: number, total: number, siblings: number): (number | "ellipsis")[] {
  const totalNumbers = siblings * 2 + 5; // siblings + boundaries + current + 2 ellipsis
  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibIdx = Math.max(current - siblings, 1);
  const rightSibIdx = Math.min(current + siblings, total);

  const showLeftEllipsis = leftSibIdx > 2;
  const showRightEllipsis = rightSibIdx < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = siblings * 2 + 3;
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1);
    return [...leftRange, "ellipsis", total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = siblings * 2 + 3;
    const rightRange = Array.from({ length: rightCount }, (_, i) => total - rightCount + i + 1);
    return [1, "ellipsis", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibIdx - leftSibIdx + 1 },
    (_, i) => leftSibIdx + i,
  );
  return [1, "ellipsis", ...middleRange, "ellipsis", total];
}

/* ─── Arrow icons ─── */

const ChevronLeft = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 12L6 8L10 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 4L10 8L6 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── Component ─── */

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** 현재 페이지 (1부터 시작) */
  page: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 현재 페이지 좌우에 표시할 형제 페이지 수 */
  siblings?: number;
  /** 페이지 변경 콜백 */
  onPageChange: (page: number) => void;
  /** 이전/다음 화살표 표시 */
  showArrows?: boolean;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    { page, totalPages, siblings = 1, onPageChange, showArrows = true, className, ...rest },
    ref,
  ) => {
    const pages = useMemo(
      () => getPageRange(page, totalPages, siblings),
      [page, totalPages, siblings],
    );

    const handleClick = useCallback(
      (p: number) => {
        if (p >= 1 && p <= totalPages && p !== page) onPageChange(p);
      },
      [page, totalPages, onPageChange],
    );

    if (totalPages <= 0) return null;

    return (
      <nav
        ref={ref}
        data-slot="root"
        aria-label="페이지 네비게이션"
        className={cx(PG_CLASS, className)}
        {...rest}
      >
        {showArrows && (
          <button
            data-type="arrow"
            className={PG_ITEM_CLASS}
            disabled={page <= 1}
            onClick={() => handleClick(page - 1)}
            aria-label="이전 페이지"
          >
            <ChevronLeft />
          </button>
        )}

        {pages.map((item, idx) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className={PG_ELLIPSIS_CLASS} aria-hidden="true">
              ···
            </span>
          ) : (
            <button
              key={item}
              data-active={item === page ? "true" : undefined}
              className={PG_ITEM_CLASS}
              onClick={() => handleClick(item)}
              aria-current={item === page ? "page" : undefined}
              aria-label={`${item} 페이지`}
            >
              {item}
            </button>
          ),
        )}

        {showArrows && (
          <button
            data-type="arrow"
            className={PG_ITEM_CLASS}
            disabled={page >= totalPages}
            onClick={() => handleClick(page + 1)}
            aria-label="다음 페이지"
          >
            <ChevronRight />
          </button>
        )}
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";
