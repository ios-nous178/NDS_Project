import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Types ─── */

export interface PopularPostsTab {
  /** 탭 고유 키 */
  key: string;
  /** 탭 라벨 */
  label: React.ReactNode;
}

export interface PopularPostsItem {
  /** 글 ID (key 용) */
  id: string | number;
  /** 글 제목 */
  title: React.ReactNode;
  /** 댓글 수. 0 도 표시되며 999 초과는 자동 "+999" 로 캡 */
  count: number;
}

export interface PopularPostsProps {
  /** 모듈 제목 (기본: "커뮤니티 BEST 인기글") */
  title?: React.ReactNode;
  /** "더보기" 클릭 콜백. 지정 시에만 더보기 영역 노출 */
  onMoreClick?: () => void;
  /** "더보기" 라벨 (기본: "더보기") */
  moreLabel?: React.ReactNode;
  /** 탭 목록 (5개 권장). 비우면 탭 영역 숨김 */
  tabs?: PopularPostsTab[];
  /** 활성 탭 키 */
  activeTabKey?: string;
  /** 탭 변경 콜백 */
  onTabChange?: (key: string) => void;
  /** 인기글 목록 (최대 10개 권장 — 초과분은 시각적으로 잘리지 않지만 가이드는 10개) */
  items: PopularPostsItem[];
  /** 행 클릭 콜백 */
  onItemClick?: (item: PopularPostsItem, rank: number) => void;
  /** 추가 className */
  className?: string;
  /** 추가 style */
  style?: React.CSSProperties;
}

/* ─── Class names ─── */

const PP_ROOT_CLASS = "nds-popular-posts";
const PP_HEADER_CLASS = `${PP_ROOT_CLASS}__header`;
const PP_TITLE_CLASS = `${PP_ROOT_CLASS}__title`;
const PP_MORE_CLASS = `${PP_ROOT_CLASS}__more`;
const PP_MORE_ICON_CLASS = `${PP_ROOT_CLASS}__more-icon`;
const PP_TABS_CLASS = `${PP_ROOT_CLASS}__tabs`;
const PP_TAB_CLASS = `${PP_ROOT_CLASS}__tab`;
const PP_LIST_CLASS = `${PP_ROOT_CLASS}__list`;
const PP_ROW_CLASS = `${PP_ROOT_CLASS}__row`;
const PP_RANK_CLASS = `${PP_ROOT_CLASS}__rank`;
const PP_ROW_TITLE_CLASS = `${PP_ROOT_CLASS}__row-title`;
const PP_COUNT_CLASS = `${PP_ROOT_CLASS}__count`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const popularPostsStyles = `
  :where(.${PP_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-loose);
    width: 100%;
    box-sizing: border-box;
    padding: ${spacing[20]}px;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    font-family: ${fontFamily.web};
  }

  /* ─── Header ─── */

  :where(.${PP_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[8]}px;
    min-height: 26px;
  }

  :where(.${PP_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.headline5.fontSize}px;
    line-height: ${typeScale.headline5.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${PP_MORE_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[2]}px;
    padding: ${spacing[2]}px ${spacing[4]}px;
    border: none;
    background: transparent;
    color: ${cv.textRole.subtle};
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    cursor: pointer;
    transition: color ${transition.default};
    flex-shrink: 0;
  }

  :where(.${PP_MORE_CLASS}:hover) {
    color: ${cv.textRole.strong};
  }

  :where(.${PP_MORE_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: currentColor;
  }

  /* ─── Tabs ─── */

  :where(.${PP_TABS_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[8]}px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  :where(.${PP_TABS_CLASS})::-webkit-scrollbar {
    display: none;
  }

  :where(.${PP_TAB_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: ${spacing[6]}px ${spacing[12]}px;
    border: none;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.section};
    color: ${cv.textRole.subtle};
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    white-space: nowrap;
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color ${transition.default}, color ${transition.default};
  }

  @media (hover: hover) {
    :where(.${PP_TAB_CLASS}:not([data-active="true"]):hover) {
      background: ${cv.surface.subtle};
      color: ${cv.textRole.strong};
    }
  }

  :where(.${PP_TAB_CLASS}[data-active="true"]) {
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.brand};
    font-weight: ${fontWeight.bold};
  }

  /* ─── List ─── */

  :where(.${PP_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  :where(.${PP_ROW_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[4]}px;
    width: 100%;
    min-height: 32px;
    padding: ${spacing[6]}px 0;
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: inherit;
    text-align: left;
  }

  :where(button.${PP_ROW_CLASS}) {
    cursor: pointer;
    transition: opacity ${transition.default};
  }

  @media (hover: hover) {
    :where(button.${PP_ROW_CLASS}:hover) {
      opacity: 0.7;
    }
  }

  :where(.${PP_RANK_CLASS}) {
    flex-shrink: 0;
    width: 21px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
    font-variant-numeric: tabular-nums;
  }

  :where(.${PP_ROW_TITLE_CLASS}) {
    flex: 1 1 0;
    min-width: 0;
    color: ${cv.textRole.strong};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${PP_COUNT_CLASS}) {
    flex-shrink: 0;
    color: ${cv.textRole.statusError};
    font-weight: ${fontWeight.medium};
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const formatRank = (rank: number) => rank.toString().padStart(2, "0");

const formatCount = (count: number) => {
  if (count > 999) return "[+999]";
  return `[${count}]`;
};

/* ─── Icon ─── */

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 4 10 8 6 12" />
    </svg>
  );
}

/* ─── Component ─── */

export function PopularPosts({
  title = "커뮤니티 BEST 인기글",
  onMoreClick,
  moreLabel = "더보기",
  tabs,
  activeTabKey,
  onTabChange,
  items,
  onItemClick,
  className,
  style,
}: PopularPostsProps) {
  return (
    <section className={cx(PP_ROOT_CLASS, className)} style={style}>
      <header className={PP_HEADER_CLASS}>
        <h3 className={PP_TITLE_CLASS}>{title}</h3>
        {onMoreClick && (
          <button type="button" className={PP_MORE_CLASS} onClick={onMoreClick}>
            <span>{moreLabel}</span>
            <span className={PP_MORE_ICON_CLASS} aria-hidden="true">
              <ChevronRightIcon />
            </span>
          </button>
        )}
      </header>

      {tabs && tabs.length > 0 && (
        <div className={PP_TABS_CLASS} role="tablist">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTabKey;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-active={isActive ? "true" : "false"}
                className={PP_TAB_CLASS}
                onClick={() => onTabChange?.(tab.key)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      <ol className={PP_LIST_CLASS}>
        {items.map((item, idx) => {
          const rank = idx + 1;
          const interactive = !!onItemClick;
          const rowProps = {
            className: PP_ROW_CLASS,
            children: (
              <>
                <span className={PP_RANK_CLASS}>{formatRank(rank)}</span>
                <span className={PP_ROW_TITLE_CLASS}>{item.title}</span>
                <span className={PP_COUNT_CLASS}>{formatCount(item.count)}</span>
              </>
            ),
          };
          return (
            <li key={item.id}>
              {interactive ? (
                <button type="button" {...rowProps} onClick={() => onItemClick?.(item, rank)} />
              ) : (
                <div {...rowProps} />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
