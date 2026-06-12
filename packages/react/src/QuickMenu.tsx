import React from "react";

/* ─── Constants ─── */

const QM_CLASS = "nds-quickmenu";
const QM_HEADER_CLASS = `${QM_CLASS}__header`;
const QM_HEADING_CLASS = `${QM_CLASS}__heading`;
const QM_DIVIDER_CLASS = `${QM_CLASS}__divider`;
const QM_ITEMS_CLASS = `${QM_CLASS}__items`;
const QM_ITEM_CLASS = `${QM_CLASS}__item`;
const QM_CIRCLE_CLASS = `${QM_CLASS}__circle`;
const QM_ICON_CLASS = `${QM_CLASS}__icon`;
const QM_LABEL_CLASS = `${QM_CLASS}__label`;
const QM_TOP_CLASS = `${QM_CLASS}__top`;
const QM_TOP_ICON_CLASS = `${QM_CLASS}__top-icon`;
const QM_TOP_LABEL_CLASS = `${QM_CLASS}__top-label`;

/** 기본 헤더 — "QUICK / MENU" 2줄. white-space: pre-line 으로 줄바꿈. */
const DEFAULT_HEADING = "QUICK\nMENU";

/** 기본 TOP 버튼 글리프 (chevron up 24). 토큰 색은 currentColor 로 상속. */
const ChevronUp = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
    <path
      d="M6 15l6-6 6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── Types ─── */

export interface QuickMenuItem {
  /** 고유 키 — 클릭 이벤트 식별자 */
  key: string;
  /** 아이템 라벨 (한글 8자 이내 권장 — 두 줄 wrap 방지) */
  label: React.ReactNode;
  /** 아이콘 (Icon Library 32px line style 권장) */
  icon: React.ReactNode;
  /** 클릭 콜백 */
  onClick?: () => void;
  /** 라벨 노출 여부 (기본 true). false 면 아이콘만 — 식별성 저하라 비권장 */
  showLabel?: boolean;
}

export interface QuickMenuProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** 액션 목록 — 전역 고빈도 액션 2~4개 (3개 권장) */
  items: QuickMenuItem[];
  /** 헤더 텍스트 (기본 "QUICK\nMENU") */
  heading?: React.ReactNode;
  /** TOP(맨 위로) 버튼 노출 여부 (기본 true) */
  showTop?: boolean;
  /** TOP 버튼 라벨 (기본 "TOP") */
  topLabel?: React.ReactNode;
  /** TOP 버튼 클릭 콜백 */
  onTopClick?: () => void;
  /**
   * PC 우측 고정 위치를 적용 (position:fixed · top 172 · right 40 · z 900 · <1024 숨김).
   * 오프셋은 `--nds-quickmenu-top/right/z` 로 override. 기본 false(in-flow).
   */
  fixed?: boolean;
}

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const QuickMenu = React.forwardRef<HTMLElement, QuickMenuProps>(
  (
    {
      items,
      heading = DEFAULT_HEADING,
      showTop = true,
      topLabel = "TOP",
      onTopClick,
      fixed = false,
      className,
      "aria-label": ariaLabel = "퀵메뉴",
      ...rest
    },
    ref,
  ) => {
    return (
      <nav
        ref={ref}
        data-slot="root"
        data-fixed={fixed ? "" : undefined}
        className={cx(QM_CLASS, className)}
        aria-label={ariaLabel}
        {...rest}
      >
        <div className={QM_HEADER_CLASS}>
          <span className={QM_HEADING_CLASS}>{heading}</span>
          <span className={QM_DIVIDER_CLASS} aria-hidden />
        </div>

        <ul className={QM_ITEMS_CLASS}>
          {items.map((item) => {
            const showLabel = item.showLabel !== false;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  className={QM_ITEM_CLASS}
                  data-key={item.key}
                  onClick={item.onClick}
                  aria-label={!showLabel && typeof item.label === "string" ? item.label : undefined}
                >
                  <span className={QM_CIRCLE_CLASS}>
                    <span className={QM_ICON_CLASS} aria-hidden>
                      {item.icon}
                    </span>
                  </span>
                  {showLabel && <span className={QM_LABEL_CLASS}>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {showTop && (
          <button type="button" className={QM_TOP_CLASS} onClick={onTopClick}>
            <span className={QM_TOP_ICON_CLASS} aria-hidden>
              {ChevronUp}
            </span>
            <span className={QM_TOP_LABEL_CLASS}>{topLabel}</span>
          </button>
        )}
      </nav>
    );
  },
);

QuickMenu.displayName = "QuickMenu";
