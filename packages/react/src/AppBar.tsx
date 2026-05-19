import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  shadow,
  sizing,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-eap/tokens";

/* ─── Constants ─── */

const APP_BAR_CLASS = "nds-app-bar";
const APP_BAR_LEFT_CLASS = `${APP_BAR_CLASS}__left`;
const APP_BAR_TITLE_CLASS = `${APP_BAR_CLASS}__title`;
const APP_BAR_RIGHT_CLASS = `${APP_BAR_CLASS}__right`;
const APP_BAR_MAIN_CLASS = `${APP_BAR_CLASS}__main-bar`;
const APP_BAR_NAV_CLASS = `${APP_BAR_CLASS}__nav-bar`;
const APP_BAR_LOGO_CLASS = `${APP_BAR_CLASS}__logo`;
const APP_BAR_SEARCH_CLASS = `${APP_BAR_CLASS}__search`;
const APP_BAR_GNB_CLASS = `${APP_BAR_CLASS}__gnb`;
const APP_BAR_GNB_ITEM_CLASS = `${APP_BAR_CLASS}__gnb-item`;
const APP_BAR_AUTH_CLASS = `${APP_BAR_CLASS}__auth`;
const APP_BAR_AUTH_ITEM_CLASS = `${APP_BAR_CLASS}__auth-item`;
const APP_BAR_DIVIDER_CLASS = `${APP_BAR_CLASS}__divider`;
const APP_BAR_BACK_CLASS = `${APP_BAR_CLASS}__back`;

/* ─── Variant: "default" | "webview" | "transparent" ─── */

export type AppBarVariant = "default" | "webview" | "transparent";
export type AppBarPosition = "sticky" | "fixed" | "static";

// eslint-disable-next-line unused-imports/no-unused-vars
const appBarStyles = `
  :where(.${APP_BAR_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: var(--nds-app-bar-height, ${sizing.appBar.height}px);
    padding: 0 var(--nds-app-bar-padding-x, var(--inset-card));
    background: var(--nds-app-bar-background, ${cv.surface.default});
    border-bottom: var(--nds-app-bar-border-bottom, 1px solid ${cv.borderRole.subtle});
    box-shadow: var(--nds-app-bar-shadow, none);
    font-family: var(--nds-app-bar-font-family, ${fontFamily.web});
    box-sizing: border-box;
    z-index: var(--nds-app-bar-z-index, ${zIndex.appBar});
    transition:
      background-color ${transition.default},
      box-shadow ${transition.default};
  }

  :where(.${APP_BAR_LEFT_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default);
    flex-shrink: 0;
  }

  :where(.${APP_BAR_TITLE_CLASS}) {
    font-size: var(--nds-app-bar-title-font-size, ${typeScale.body1.fontSize}px);
    line-height: var(--nds-app-bar-title-line-height, ${typeScale.body1.lineHeight}px);
    font-weight: var(--nds-app-bar-title-font-weight, ${fontWeight.bold});
    color: var(--nds-app-bar-title-color, ${cv.textRole.normal});
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${APP_BAR_CLASS}[data-variant="webview"]) .${APP_BAR_TITLE_CLASS} {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    max-width: 60%;
    text-align: center;
  }

  :where(.${APP_BAR_RIGHT_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default);
    flex-shrink: 0;
    margin-left: auto;
  }

  /* ─── Sub-components ─── */

  :where(.${APP_BAR_MAIN_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: var(--nds-app-bar-main-max-width, none);
    margin: 0 auto;
    padding: var(--nds-app-bar-main-py, 0) var(--inset-card);
    box-sizing: border-box;
  }

  :where(.${APP_BAR_NAV_CLASS}) {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: var(--nds-app-bar-nav-max-width, none);
    height: var(--nds-app-bar-nav-height, 56px);
    margin: 0 auto;
    padding: 0 var(--inset-card);
    box-sizing: border-box;
  }

  :where(.${APP_BAR_LOGO_CLASS}) {
    display: block;
    object-fit: contain;
    flex-shrink: 0;
    cursor: pointer;
  }

  :where(.${APP_BAR_SEARCH_CLASS}) {
    position: relative;
    display: flex;
    align-items: center;
    width: var(--nds-app-bar-search-width, 400px);
    height: var(--nds-app-bar-search-height, 48px);
    border: var(--nds-app-bar-search-border-width, 2px) solid var(--nds-app-bar-search-border-color, ${cv.borderRole.normal});
    border-radius: var(--nds-app-bar-search-radius, 24px);
    padding: 0 var(--nds-app-bar-search-pr, 36px) 0 var(--nds-app-bar-search-pl, var(--inset-card-large));
    font-size: var(--nds-app-bar-search-font-size, ${typeScale.body2.fontSize}px);
    color: ${cv.textRole.muted};
    box-sizing: border-box;
    flex-shrink: 0;
    font-family: inherit;
    background: ${cv.surface.default};
  }

  :where(.${APP_BAR_SEARCH_CLASS} input) {
    all: unset;
    width: 100%;
    font: inherit;
    color: ${cv.textRole.normal};
  }

  :where(.${APP_BAR_SEARCH_CLASS} input::placeholder) {
    color: ${cv.textRole.muted};
  }

  :where(.${APP_BAR_SEARCH_CLASS}) .${APP_BAR_CLASS}__search-icon {
    position: absolute;
    right: ${spacing[16]}px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
  }

  :where(.${APP_BAR_GNB_CLASS}) {
    display: flex;
    align-items: center;
    height: 100%;
    gap: var(--nds-app-bar-gnb-gap, var(--gap-wide));
  }

  :where(.${APP_BAR_GNB_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 var(--nds-app-bar-gnb-px, 0);
    font-size: var(--nds-app-bar-gnb-font-size, ${typeScale.headline5.fontSize}px);
    font-weight: var(--nds-app-bar-gnb-inactive-font-weight, ${fontWeight.bold});
    color: var(--nds-app-bar-gnb-inactive-color, ${cv.textRole.subtle});
    text-decoration: none;
    white-space: nowrap;
    border-bottom: var(--nds-app-bar-gnb-active-border-width, 3px) solid transparent;
    box-sizing: border-box;
    transition: color ${transition.default};
  }

  :where(.${APP_BAR_GNB_ITEM_CLASS}:hover) {
    color: var(--nds-app-bar-gnb-active-color, ${cv.textRole.normal});
  }

  :where(.${APP_BAR_GNB_ITEM_CLASS}[data-active="true"]) {
    font-weight: var(--nds-app-bar-gnb-active-font-weight, ${fontWeight.bold});
    color: var(--nds-app-bar-gnb-active-color, ${cv.textRole.normal});
    border-bottom-color: var(--nds-app-bar-gnb-active-color, ${cv.textRole.normal});
  }

  :where(.${APP_BAR_AUTH_CLASS}) {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  :where(.${APP_BAR_AUTH_ITEM_CLASS}) {
    all: unset;
    font-size: var(--nds-app-bar-auth-font-size, ${typeScale.body2.fontSize}px);
    font-weight: var(--nds-app-bar-auth-font-weight, ${fontWeight.bold});
    color: ${cv.textRole.normal};
    cursor: pointer;
    white-space: nowrap;
    font-family: inherit;
  }

  :where(.${APP_BAR_AUTH_CLASS}) .${APP_BAR_CLASS}__auth-divider {
    width: 1px;
    height: 13px;
    background: ${cv.borderRole.subtle};
    flex-shrink: 0;
  }

  :where(.${APP_BAR_DIVIDER_CLASS}) {
    width: 100%;
    height: 1px;
    background: ${cv.borderRole.subtle};
    flex-shrink: 0;
  }

  :where(.${APP_BAR_BACK_CLASS}) {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
    cursor: pointer;
    color: ${cv.iconRole.strong};
    flex-shrink: 0;
  }

  :where(.${APP_BAR_BACK_CLASS} svg) {
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
  }
`;

/* ─── Variant config ─── */

interface VariantStyle {
  background: string;
  borderBottom: string;
  shadow: string;
  titleFontSize: number;
  titleLineHeight: number;
  titleFontWeight: number;
}

const variantConfig: Record<AppBarVariant, VariantStyle> = {
  default: {
    background: cv.surface.default,
    borderBottom: `1px solid ${cv.borderRole.subtle}`,
    shadow: "none",
    titleFontSize: typeScale.body1.fontSize,
    titleLineHeight: typeScale.body1.lineHeight,
    titleFontWeight: fontWeight.bold,
  },
  webview: {
    background: cv.surface.default,
    borderBottom: "none",
    shadow: "none",
    titleFontSize: typeScale.body1.fontSize,
    titleLineHeight: typeScale.body1.lineHeight,
    titleFontWeight: fontWeight.bold,
  },
  transparent: {
    background: "transparent",
    borderBottom: "none",
    shadow: "none",
    titleFontSize: typeScale.body1.fontSize,
    titleLineHeight: typeScale.body1.lineHeight,
    titleFontWeight: fontWeight.bold,
  },
};

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface AppBarSlotProps {
  /** 좌측 영역(뒤로가기 등)을 감싸는 `<div>` 엘리먼트에 전달할 props */
  left?: React.HTMLAttributes<HTMLDivElement>;
  /** 타이틀을 감싸는 `<h1>` 엘리먼트에 전달할 props */
  title?: React.HTMLAttributes<HTMLHeadingElement>;
  /** 우측 영역(액션 버튼 등)을 감싸는 `<div>` 엘리먼트에 전달할 props */
  right?: React.HTMLAttributes<HTMLDivElement>;
}

export interface AppBarProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** AppBar 스타일 변형 */
  variant?: AppBarVariant;
  /** 포지션 설정 */
  position?: AppBarPosition;
  /** 타이틀 텍스트 */
  title?: React.ReactNode;
  /** 좌측 영역 (로고, 뒤로가기 버튼 등) */
  leftSlot?: React.ReactNode;
  /** 우측 영역 (액션 버튼, 메뉴 등) */
  rightSlot?: React.ReactNode;
  /** 그림자 표시 여부 */
  elevated?: boolean;
  /** 내부 슬롯별 props 전달 */
  slotProps?: AppBarSlotProps;
}

const AppBarComponent = React.forwardRef<HTMLElement, AppBarProps>(
  (
    {
      variant = "default",
      position = "sticky",
      title,
      leftSlot,
      rightSlot,
      elevated = false,
      className,
      style,
      children,
      slotProps,
      ...rest
    },
    ref,
  ) => {
    const variantStyle = variantConfig[variant];

    return (
      <header
        ref={ref}
        data-slot="root"
        data-variant={variant}
        data-elevated={elevated || undefined}
        className={cx(APP_BAR_CLASS, className)}
        style={
          {
            position,
            top: position !== "static" ? 0 : undefined,
            left: position === "fixed" ? 0 : undefined,
            right: position === "fixed" ? 0 : undefined,
            "--nds-app-bar-height": `${sizing.appBar.height}px`,
            "--nds-app-bar-padding-x": `${spacing[16]}px`,
            "--nds-app-bar-background": variantStyle.background,
            "--nds-app-bar-border-bottom": variantStyle.borderBottom,
            "--nds-app-bar-shadow": elevated ? shadow["1"] : variantStyle.shadow,
            "--nds-app-bar-title-font-size": `${variantStyle.titleFontSize}px`,
            "--nds-app-bar-title-line-height": `${variantStyle.titleLineHeight}px`,
            "--nds-app-bar-title-font-weight": variantStyle.titleFontWeight,
            "--nds-app-bar-z-index": zIndex.appBar,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {children ?? (
          <>
            {leftSlot && (
              <div
                data-slot="left"
                className={cx(APP_BAR_LEFT_CLASS, slotProps?.left?.className)}
                style={slotProps?.left?.style}
              >
                {leftSlot}
              </div>
            )}
            {title != null && (
              <h1
                data-slot="title"
                className={cx(APP_BAR_TITLE_CLASS, slotProps?.title?.className)}
                style={slotProps?.title?.style}
              >
                {title}
              </h1>
            )}
            {rightSlot && (
              <div
                data-slot="right"
                className={cx(APP_BAR_RIGHT_CLASS, slotProps?.right?.className)}
                style={slotProps?.right?.style}
              >
                {rightSlot}
              </div>
            )}
          </>
        )}
      </header>
    );
  },
);

AppBarComponent.displayName = "AppBar";

/* ────────────────────────────────────
   Sub-components (Compound pattern)
   ──────────────────────────────────── */

/* ─── MainBar ─── */

export interface AppBarMainBarProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: number;
}

const AppBarMainBar = React.memo(
  React.forwardRef<HTMLDivElement, AppBarMainBarProps>(
    ({ maxWidth, className, style, children, ...rest }, ref) => (
      <div
        ref={ref}
        data-slot="main-bar"
        className={cx(APP_BAR_MAIN_CLASS, className)}
        style={{
          ...(maxWidth &&
            ({ "--nds-app-bar-main-max-width": `${maxWidth}px` } as React.CSSProperties)),
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    ),
  ),
);
AppBarMainBar.displayName = "AppBar.MainBar";

/* ─── NavBar ─── */

export interface AppBarNavBarProps extends React.HTMLAttributes<HTMLElement> {
  maxWidth?: number;
  height?: number;
}

const AppBarNavBar = React.memo(
  React.forwardRef<HTMLElement, AppBarNavBarProps>(
    ({ maxWidth, height, className, style, children, ...rest }, ref) => (
      <nav
        ref={ref}
        data-slot="nav-bar"
        className={cx(APP_BAR_NAV_CLASS, className)}
        style={{
          ...(maxWidth &&
            ({ "--nds-app-bar-nav-max-width": `${maxWidth}px` } as React.CSSProperties)),
          ...(height && ({ "--nds-app-bar-nav-height": `${height}px` } as React.CSSProperties)),
          ...style,
        }}
        {...rest}
      >
        {children}
      </nav>
    ),
  ),
);
AppBarNavBar.displayName = "AppBar.NavBar";

/* ─── Logo ─── */

export interface AppBarLogoProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "onClick"
> {
  href?: string;
  onClick?: React.MouseEventHandler;
}

const AppBarLogo = React.memo(
  React.forwardRef<HTMLImageElement, AppBarLogoProps>(
    ({ href, onClick, className, ...rest }, ref) => {
      const img = (
        <img ref={ref} data-slot="logo" className={cx(APP_BAR_LOGO_CLASS, className)} {...rest} />
      );
      if (href) {
        return (
          <a
            href={href}
            onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
            style={{ display: "flex", flexShrink: 0 }}
          >
            {img}
          </a>
        );
      }
      return img;
    },
  ),
);
AppBarLogo.displayName = "AppBar.Logo";

/* ─── SearchBar ─── */

export interface AppBarSearchBarProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  /**
   * 검색 아이콘 슬롯. 미전달 시 기본 인라인 SVG 사용.
   * 브랜드 화면에서 brand prefix 아이콘(예: `<GenietSearchIcon />`)을 명시 전달 가능.
   */
  icon?: React.ReactNode;
}

const DefaultSearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const AppBarSearchBar = React.memo(
  React.forwardRef<HTMLDivElement, AppBarSearchBarProps>(
    ({ placeholder, value, onChange, onSearch, icon, className, style, ...rest }, ref) => {
      const [internal, setInternal] = React.useState("");
      const val = value ?? internal;

      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && onSearch) onSearch(val);
      };

      return (
        <div
          ref={ref}
          data-slot="search"
          className={cx(APP_BAR_SEARCH_CLASS, className)}
          style={style}
          {...rest}
        >
          <input
            type="text"
            placeholder={placeholder}
            value={val}
            onChange={(e) => {
              setInternal(e.target.value);
              onChange?.(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <span
            className={`${APP_BAR_CLASS}__search-icon`}
            onClick={() => onSearch?.(val)}
            role="button"
            aria-label="검색"
          >
            {icon ?? <DefaultSearchIcon />}
          </span>
        </div>
      );
    },
  ),
);
AppBarSearchBar.displayName = "AppBar.SearchBar";

/* ─── GNB ─── */

export interface AppBarGNBItem {
  key: string;
  label: string;
  href: string;
}

export interface AppBarGNBProps extends React.HTMLAttributes<HTMLElement> {
  items: AppBarGNBItem[];
  activeKey?: string;
  onItemClick?: (item: AppBarGNBItem, e: React.MouseEvent) => void;
  renderItem?: (
    item: AppBarGNBItem,
    isActive: boolean,
    children: React.ReactNode,
  ) => React.ReactNode;
}

const AppBarGNB = React.memo(
  React.forwardRef<HTMLElement, AppBarGNBProps>(
    ({ items, activeKey, onItemClick, renderItem, className, style, children, ...rest }, ref) => (
      <nav
        ref={ref}
        data-slot="gnb"
        className={cx(APP_BAR_GNB_CLASS, className)}
        style={style}
        {...rest}
      >
        {children ??
          items.map((item) => {
            const isActive = activeKey === item.key;
            const content = item.label;

            if (renderItem) {
              return (
                <React.Fragment key={item.key}>
                  {renderItem(item, isActive, <>{content}</>)}
                </React.Fragment>
              );
            }

            return (
              <a
                key={item.key}
                href={item.href}
                data-active={isActive || undefined}
                className={APP_BAR_GNB_ITEM_CLASS}
                onClick={
                  onItemClick
                    ? (e) => {
                        e.preventDefault();
                        onItemClick(item, e);
                      }
                    : undefined
                }
              >
                {content}
              </a>
            );
          })}
      </nav>
    ),
  ),
);
AppBarGNB.displayName = "AppBar.GNB";

/* ─── AuthMenu ─── */

export interface AppBarAuthMenuItem {
  key: string;
  label: string;
}

export interface AppBarAuthMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AppBarAuthMenuItem[];
  separator?: "divider" | "none";
  onItemClick?: (item: AppBarAuthMenuItem, e: React.MouseEvent) => void;
  /** 인증 메뉴 뒤 추가 요소 (앱 다운로드 버튼 등) */
  extra?: React.ReactNode;
}

const AppBarAuthMenu = React.memo(
  React.forwardRef<HTMLDivElement, AppBarAuthMenuProps>(
    (
      { items, separator = "none", onItemClick, extra, className, style, children, ...rest },
      ref,
    ) => (
      <div
        ref={ref}
        data-slot="auth"
        className={cx(APP_BAR_AUTH_CLASS, className)}
        style={style}
        {...rest}
      >
        {children ??
          items.map((item, i) => (
            <React.Fragment key={item.key}>
              {i > 0 && separator === "divider" && (
                <span className={`${APP_BAR_CLASS}__auth-divider`} />
              )}
              <button
                className={APP_BAR_AUTH_ITEM_CLASS}
                style={{
                  padding: separator === "divider" ? `0 var(--inset-chip)` : "0",
                  marginRight: separator !== "divider" && i < items.length - 1 ? spacing[20] : 0,
                }}
                onClick={onItemClick ? (e) => onItemClick(item, e) : undefined}
              >
                {item.label}
              </button>
            </React.Fragment>
          ))}
        {extra}
      </div>
    ),
  ),
);
AppBarAuthMenu.displayName = "AppBar.AuthMenu";

/* ─── BackButton ─── */

export type AppBarBackButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const AppBarBackButton = React.memo(
  React.forwardRef<HTMLButtonElement, AppBarBackButtonProps>(({ className, ...rest }, ref) => (
    <button
      ref={ref}
      data-slot="back"
      className={cx(APP_BAR_BACK_CLASS, className)}
      aria-label="뒤로가기"
      {...rest}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15 19L8 12L15 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )),
);
AppBarBackButton.displayName = "AppBar.BackButton";

/* ─── Divider ─── */

const AppBarDivider = React.memo(({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="divider" className={cx(APP_BAR_DIVIDER_CLASS, className)} {...rest} />
));
AppBarDivider.displayName = "AppBar.Divider";

/* ────────────────────────────────────
   Compound namespace export
   ──────────────────────────────────── */

export const AppBar = Object.assign(AppBarComponent, {
  MainBar: AppBarMainBar,
  NavBar: AppBarNavBar,
  Logo: AppBarLogo,
  SearchBar: AppBarSearchBar,
  GNB: AppBarGNB,
  AuthMenu: AppBarAuthMenu,
  BackButton: AppBarBackButton,
  Divider: AppBarDivider,
});
