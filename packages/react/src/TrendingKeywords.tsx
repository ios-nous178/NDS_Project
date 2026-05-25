import React, { useCallback, useEffect, useRef, useState } from "react";

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
