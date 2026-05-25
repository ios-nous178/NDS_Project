import React from "react";

/* ─── Constants ─── */

const PH_CLASS = "nds-page-header";
const PH_TOP_CLASS = `${PH_CLASS}__top`;
const PH_BREADCRUMB_CLASS = `${PH_CLASS}__breadcrumb`;
const PH_BACK_CLASS = `${PH_CLASS}__back`;
const PH_MAIN_CLASS = `${PH_CLASS}__main`;
const PH_TITLE_AREA_CLASS = `${PH_CLASS}__title-area`;
const PH_TITLE_CLASS = `${PH_CLASS}__title`;
const PH_SUBTITLE_CLASS = `${PH_CLASS}__subtitle`;
const PH_ACTIONS_CLASS = `${PH_CLASS}__actions`;
const PH_TABS_CLASS = `${PH_CLASS}__tabs`;

/* ─── Types ─── */

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** 제목 */
  title: React.ReactNode;
  /** 서브타이틀 (제목 아래) */
  subtitle?: React.ReactNode;
  /** 좌측 뒤로가기 콜백 (지정 시 ← 버튼 노출) */
  onBack?: () => void;
  /** 좌측 상단 브레드크럼 (Breadcrumb 컴포넌트 등) */
  breadcrumb?: React.ReactNode;
  /** 우측 액션 (Button/IconButton 등) */
  actions?: React.ReactNode;
  /** 헤더 하단에 붙는 탭/필터 영역 */
  bottom?: React.ReactNode;
  /** 보더 표시 (스크롤 분리) */
  bordered?: boolean;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  (
    { title, subtitle, onBack, breadcrumb, actions, bottom, bordered = false, className, ...rest },
    ref,
  ) => {
    const showTop = !!(onBack || breadcrumb);

    return (
      <header
        ref={ref}
        data-slot="root"
        data-bordered={bordered ? "true" : "false"}
        className={cx(PH_CLASS, className)}
        {...rest}
      >
        {showTop && (
          <div className={PH_TOP_CLASS}>
            {onBack && (
              <button
                type="button"
                className={PH_BACK_CLASS}
                aria-label="뒤로 가기"
                onClick={onBack}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path
                    d="M12 5l-5 5 5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            {breadcrumb && <div className={PH_BREADCRUMB_CLASS}>{breadcrumb}</div>}
          </div>
        )}
        <div className={PH_MAIN_CLASS}>
          <div className={PH_TITLE_AREA_CLASS}>
            <h1 className={PH_TITLE_CLASS}>{title}</h1>
            {subtitle && <p className={PH_SUBTITLE_CLASS}>{subtitle}</p>}
          </div>
          {actions && <div className={PH_ACTIONS_CLASS}>{actions}</div>}
        </div>
        {bottom && <div className={PH_TABS_CLASS}>{bottom}</div>}
      </header>
    );
  },
);

PageHeader.displayName = "PageHeader";
