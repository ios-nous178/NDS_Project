import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  typeScale,
  transition,
  shadow,
} from "@nudge-eap/tokens";

/* ─── Types ─── */

export type TrendingKeywordTrend = "new" | "up" | "down" | "same";

export interface TrendingKeywordItem {
  /** 순위 (1부터 시작) */
  rank: number;
  /** 순위 변동 트렌드 */
  trend: TrendingKeywordTrend;
  /** 검색어 텍스트 */
  keyword: string;
}

export interface TrendingKeywordsProps {
  /** 인기 검색어 목록 */
  items: TrendingKeywordItem[];
  /** 드롭다운 제목 (기본: "인기 검색어") */
  title?: string;
  /** 기준 시간 텍스트 (예: "09:00 기준") */
  timestamp?: string;
  /** 자동 슬라이드 간격 (ms, 기본: 2000) */
  autoplayDelay?: number;
  /** 키워드 클릭 시 콜백 */
  onKeywordClick?: (item: TrendingKeywordItem) => void;
  /** 추가 className */
  className?: string;
}

/* ─── Class names ─── */

const TK_ROOT_CLASS = "nds-trending-keywords";
const TK_SLIDER_CLASS = `${TK_ROOT_CLASS}__slider`;
const TK_SLIDE_ITEM_CLASS = `${TK_ROOT_CLASS}__slide-item`;
const TK_RANK_CLASS = `${TK_ROOT_CLASS}__rank`;
const TK_TREND_CLASS = `${TK_ROOT_CLASS}__trend`;
const TK_KEYWORD_CLASS = `${TK_ROOT_CLASS}__keyword`;
const TK_CHEVRON_CLASS = `${TK_ROOT_CLASS}__chevron`;
const TK_DROPDOWN_CLASS = `${TK_ROOT_CLASS}__dropdown`;
const TK_DROPDOWN_CLASS_HEADER_CLASS = `${TK_ROOT_CLASS}__dropdown-header`;
const TK_DROPDOWN_CLASS_TITLE_CLASS = `${TK_ROOT_CLASS}__dropdown-title`;
const TK_DROPDOWN_CLASS_TIME_CLASS = `${TK_ROOT_CLASS}__dropdown-time`;
const TK_DROPDOWN_CLASS_CLOSE_CLASS = `${TK_ROOT_CLASS}__dropdown-close`;
const TK_DROPDOWN_CLASS_LIST_CLASS = `${TK_ROOT_CLASS}__dropdown-list`;
const TK_DROPDOWN_CLASS_ITEM_CLASS = `${TK_ROOT_CLASS}__dropdown-item`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const trendingKeywordsStyles = `
  :where(.${TK_ROOT_CLASS}) {
    position: relative;
    display: inline-flex;
    font-family: ${fontFamily.web};
  }

  :where(.${TK_SLIDER_CLASS}) {
    display: grid;
    grid-template-columns: 1fr 20px;
    align-items: center;
    width: 200px;
    height: 30px;
    overflow: hidden;
    cursor: pointer;
    gap: ${spacing[4]}px;
  }

  :where(.${TK_SLIDE_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    height: 30px;
    animation: nds-tk-slide-up ${transition.slow} ease-out;
  }

  :where(.${TK_RANK_CLASS}) {
    flex-shrink: 0;
    width: 20px;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: 22px;
    color: ${cv.textRole.normal};
    text-align: center;
    margin-right: ${spacing[4]}px;
  }

  :where(.${TK_TREND_CLASS}) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 18px;
    margin-right: ${spacing[8]}px;
    font-size: 10px;
    font-weight: ${fontWeight.bold};
    line-height: 1;
    border-radius: 2px;
  }

  :where(.${TK_TREND_CLASS}[data-trend="new"]) {
    color: ${cv.textRole.statusError};
  }
  :where(.${TK_TREND_CLASS}[data-trend="up"]) {
    color: ${cv.textRole.statusError};
  }
  :where(.${TK_TREND_CLASS}[data-trend="down"]) {
    color: ${cv.textRole.brand};
  }
  :where(.${TK_TREND_CLASS}[data-trend="same"]) {
    color: ${cv.textRole.muted};
  }

  :where(.${TK_KEYWORD_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: 1.47;
    color: ${cv.textRole.normal};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${TK_CHEVRON_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.muted};
    transition: transform ${transition.default};
  }
  :where(.${TK_CHEVRON_CLASS}[data-open="true"]) {
    transform: rotate(180deg);
  }

  /* ─── Dropdown ─── */

  :where(.${TK_DROPDOWN_CLASS}) {
    position: absolute;
    top: -8px;
    right: -40px;
    width: 280px;
    padding: ${spacing[24]}px;
    background: ${cv.surface.default};
    border-radius: ${radius.lg}px;
    box-shadow: ${shadow["1"]};
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-4px);
    transition:
      opacity ${transition.default},
      visibility ${transition.default},
      transform ${transition.default};
  }
  :where(.${TK_DROPDOWN_CLASS}[data-open="true"]) {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  :where(.${TK_DROPDOWN_CLASS_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${spacing[24]}px;
    cursor: pointer;
  }

  :where(.${TK_DROPDOWN_CLASS_TITLE_CLASS}) {
    font-size: ${typeScale.headline5.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: 1.44;
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${TK_DROPDOWN_CLASS_TIME_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: 1.38;
    color: ${cv.textRole.muted};
    margin-left: ${spacing[6]}px;
  }

  :where(.${TK_DROPDOWN_CLASS_CLOSE_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    color: ${cv.textRole.normal};
  }

  :where(.${TK_DROPDOWN_CLASS_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[12]}px;
  }

  :where(.${TK_DROPDOWN_CLASS_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
    padding: ${spacing[2]}px 0;
    border-radius: ${radius.sm}px;
    transition: background-color ${transition.default};
  }
  :where(.${TK_DROPDOWN_CLASS_ITEM_CLASS}:hover) {
    background: ${cv.surface.subtle};
  }

  @keyframes nds-tk-slide-up {
    from { opacity: 0; transform: translateY(100%); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

/* ─── Trend indicator ─── */

function TrendIcon({ trend }: { trend: TrendingKeywordTrend }) {
  switch (trend) {
    case "new":
      return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.02em" }}>NEW</span>;
    case "up":
      return (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
          <path d="M5 0L10 8H0L5 0Z" />
        </svg>
      );
    case "down":
      return (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
          <path d="M5 8L0 0H10L5 8Z" />
        </svg>
      );
    case "same":
      return (
        <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
          <rect width="10" height="2" rx="1" />
        </svg>
      );
  }
}

/* ─── Chevron icon ─── */

function ChevronDown() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

/* ─── Component ─── */

export function TrendingKeywords({
  items,
  title = "인기 검색어",
  timestamp,
  autoplayDelay = 2000,
  onKeywordClick,
  className,
}: TrendingKeywordsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Auto-rotate slider
  useEffect(() => {
    if (isOpen || items.length <= 1) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, autoplayDelay);

    return () => clearInterval(timerRef.current);
  }, [isOpen, items.length, autoplayDelay]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleItemClick = useCallback(
    (item: TrendingKeywordItem) => {
      onKeywordClick?.(item);
    },
    [onKeywordClick],
  );

  if (!items.length) return null;

  const currentItem = items[activeIndex % items.length];

  return (
    <div ref={rootRef} className={`${TK_ROOT_CLASS}${className ? ` ${className}` : ""}`}>
      {/* Slider */}
      <div className={TK_SLIDER_CLASS} onClick={handleOpen}>
        <div key={activeIndex} className={TK_SLIDE_ITEM_CLASS}>
          <span className={TK_RANK_CLASS}>{currentItem.rank}</span>
          <span className={TK_TREND_CLASS} data-trend={currentItem.trend}>
            <TrendIcon trend={currentItem.trend} />
          </span>
          <span className={TK_KEYWORD_CLASS}>{currentItem.keyword}</span>
        </div>
        <span className={TK_CHEVRON_CLASS} data-open={isOpen}>
          <ChevronDown />
        </span>
      </div>

      {/* Dropdown */}
      <div className={TK_DROPDOWN_CLASS} data-open={isOpen}>
        <div className={TK_DROPDOWN_CLASS_HEADER_CLASS} onClick={handleClose}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className={TK_DROPDOWN_CLASS_TITLE_CLASS}>{title}</span>
            {timestamp && <span className={TK_DROPDOWN_CLASS_TIME_CLASS}>{timestamp}</span>}
          </div>
          <button className={TK_DROPDOWN_CLASS_CLOSE_CLASS} aria-label="닫기" type="button">
            <ChevronUp />
          </button>
        </div>

        <div className={TK_DROPDOWN_CLASS_LIST_CLASS}>
          {items.map((item) => (
            <div
              key={item.rank}
              className={TK_DROPDOWN_CLASS_ITEM_CLASS}
              role="button"
              tabIndex={0}
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => e.key === "Enter" && handleItemClick(item)}
            >
              <span className={TK_RANK_CLASS}>{item.rank}</span>
              <span className={TK_TREND_CLASS} data-trend={item.trend}>
                <TrendIcon trend={item.trend} />
              </span>
              <span className={TK_KEYWORD_CLASS}>{item.keyword}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
