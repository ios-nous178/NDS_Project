import React from "react";
import { cv, fontWeight, shadow, sizing, spacing, typeScale, zIndex } from "@nudge-design/tokens";

/* ─────────────────────────────────────────────────────────────
 * Header — base 헤더
 *
 *  variant
 *    · compact     : flex 56px
 *    · webview     : flex 56px, title 절대중앙 + back left
 *    · transparent : flex 56px, 배경 투명
 *    · web         : grid 3열 80px, max-width 1200
 *
 *  className prefix : `nds-header`
 *  CSS variable prefix : `--nds-header-*`
 *
 *  Figma SSOT
 *    · web variant : Library 96:25923 (NudgeEAP Web Header)
 *    · flex variants : 브랜드별 AppBar Figma 노드
 * ───────────────────────────────────────────────────────────── */

/* ─── Class constants ─── */

const HEADER_CLASS = "nds-header";
const H_LEFT_CLASS = `${HEADER_CLASS}__left`;
const H_TITLE_CLASS = `${HEADER_CLASS}__title`;
const H_RIGHT_CLASS = `${HEADER_CLASS}__right`;
const H_MAIN_CLASS = `${HEADER_CLASS}__main-bar`;
const H_NAV_CLASS = `${HEADER_CLASS}__nav-bar`;
const H_LOGO_CLASS = `${HEADER_CLASS}__logo`;
const H_SEARCH_CLASS = `${HEADER_CLASS}__search`;
const H_MENU_CLASS = `${HEADER_CLASS}__menu`;
const H_MENU_ITEM_CLASS = `${HEADER_CLASS}__menu-item`;
const H_ACTIONS_CLASS = `${HEADER_CLASS}__actions`;
const H_AUTH_MENU_CLASS = `${HEADER_CLASS}__auth-menu`;
const H_AUTH_MENU_ITEM_CLASS = `${HEADER_CLASS}__auth-menu-item`;
const H_AUTH_BTN_CLASS = `${HEADER_CLASS}__auth-btn`;
const H_DOWNLOAD_BTN_CLASS = `${HEADER_CLASS}__download-btn`;
const H_BACK_CLASS = `${HEADER_CLASS}__back`;
const H_DIVIDER_CLASS = `${HEADER_CLASS}__divider`;
const H_INNER_CLASS = `${HEADER_CLASS}__inner`;
const H_SEARCH_ICON_CLASS = `${HEADER_CLASS}__search-icon`;
const H_AUTH_DIVIDER_CLASS = `${HEADER_CLASS}__auth-divider`;

/* ─── Types ─── */

export type HeaderVariant = "compact" | "webview" | "transparent" | "web";
export type HeaderPosition = "sticky" | "fixed" | "static";
/* ─── Variant config (flex variants) ─── */

interface VariantStyle {
  background: string;
  borderBottom: string;
  shadow: string;
  titleFontSize: number;
  titleLineHeight: number;
  titleFontWeight: number;
}

const flexVariantConfig: Record<"compact" | "webview" | "transparent", VariantStyle> = {
  compact: {
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

const cx = (...names: Array<string | undefined | false | null>) => names.filter(Boolean).join(" ");

/* ─── Root ─── */

export interface HeaderSlotProps {
  /** 좌측 영역(뒤로가기 등)을 감싸는 `<div>` 엘리먼트에 전달할 props. flex variant 전용. */
  left?: React.HTMLAttributes<HTMLDivElement>;
  /** 타이틀을 감싸는 `<h1>` 엘리먼트에 전달할 props. webview variant 전용. */
  title?: React.HTMLAttributes<HTMLHeadingElement>;
  /** 우측 영역(액션 버튼 등)을 감싸는 `<div>` 엘리먼트에 전달할 props. flex variant 전용. */
  right?: React.HTMLAttributes<HTMLDivElement>;
}

export interface HeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** 헤더 형태. 기본 'compact' */
  variant?: HeaderVariant;
  /** 포지션. flex variant 기본 'sticky', web 기본 'static' */
  position?: HeaderPosition;
  /** 타이틀 텍스트 (webview variant 에서 정중앙) */
  title?: React.ReactNode;
  /** 좌측 영역 (flex variant) */
  leftSlot?: React.ReactNode;
  /** 우측 영역 (flex variant) */
  rightSlot?: React.ReactNode;
  /** elevated(shadow) */
  elevated?: boolean;
  /** 콘텐츠 컨테이너 max-width (px). web variant 기본 1200. */
  maxWidth?: number;
  /** 내부 슬롯별 props 전달 (flex variant) */
  slotProps?: HeaderSlotProps;
}

const HeaderComponent = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      variant = "compact",
      position,
      title,
      leftSlot,
      rightSlot,
      elevated = false,
      maxWidth,
      className,
      style,
      children,
      slotProps,
      ...rest
    },
    ref,
  ) => {
    /* ─── web variant ─── */
    if (variant === "web") {
      const resolvedPosition = position ?? "static";
      return (
        <header
          ref={ref}
          data-slot="root"
          data-variant="web"
          className={cx(HEADER_CLASS, className)}
          style={
            {
              position: resolvedPosition,
              top: resolvedPosition !== "static" ? 0 : undefined,
              left: resolvedPosition === "fixed" ? 0 : undefined,
              right: resolvedPosition === "fixed" ? 0 : undefined,
              ...(maxWidth &&
                ({ "--nds-header-max-width": `${maxWidth}px` } as React.CSSProperties)),
              ...style,
            } as React.CSSProperties
          }
          {...rest}
        >
          <div className={H_INNER_CLASS} data-slot="inner">
            {children}
          </div>
        </header>
      );
    }

    /* ─── flex variants ─── */
    const variantStyle = flexVariantConfig[variant];
    const resolvedPosition = position ?? "sticky";

    return (
      <header
        ref={ref}
        data-slot="root"
        data-variant={variant}
        data-elevated={elevated || undefined}
        className={cx(HEADER_CLASS, className)}
        style={
          {
            position: resolvedPosition,
            top: resolvedPosition !== "static" ? 0 : undefined,
            left: resolvedPosition === "fixed" ? 0 : undefined,
            right: resolvedPosition === "fixed" ? 0 : undefined,
            "--nds-header-height": `${sizing.appBar.height}px`,
            "--nds-header-padding-x": `${spacing[16]}px`,
            "--nds-header-background": variantStyle.background,
            "--nds-header-border-bottom": variantStyle.borderBottom,
            "--nds-header-shadow": elevated ? shadow["1"] : variantStyle.shadow,
            "--nds-header-title-font-size": `${variantStyle.titleFontSize}px`,
            "--nds-header-title-line-height": `${variantStyle.titleLineHeight}px`,
            "--nds-header-title-font-weight": variantStyle.titleFontWeight,
            "--nds-header-z-index": zIndex.appBar,
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
                className={cx(H_LEFT_CLASS, slotProps?.left?.className)}
                style={slotProps?.left?.style}
              >
                {leftSlot}
              </div>
            )}
            {title != null && (
              <h1
                data-slot="title"
                className={cx(H_TITLE_CLASS, slotProps?.title?.className)}
                style={slotProps?.title?.style}
              >
                {title}
              </h1>
            )}
            {rightSlot && (
              <div
                data-slot="right"
                className={cx(H_RIGHT_CLASS, slotProps?.right?.className)}
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

HeaderComponent.displayName = "Header";

/* ─────────────────────────────────────────────────────────────
 * Subcomponents (compound pattern)
 * ───────────────────────────────────────────────────────────── */

export interface HeaderMainBarProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: number;
}

const HeaderMainBar = React.memo(
  React.forwardRef<HTMLDivElement, HeaderMainBarProps>(
    ({ maxWidth, className, style, children, ...rest }, ref) => (
      <div
        ref={ref}
        data-slot="main-bar"
        className={cx(H_MAIN_CLASS, className)}
        style={{
          ...(maxWidth &&
            ({ "--nds-header-main-max-width": `${maxWidth}px` } as React.CSSProperties)),
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    ),
  ),
);
HeaderMainBar.displayName = "Header.MainBar";

export interface HeaderNavBarProps extends React.HTMLAttributes<HTMLElement> {
  maxWidth?: number;
  height?: number;
}

const HeaderNavBar = React.memo(
  React.forwardRef<HTMLElement, HeaderNavBarProps>(
    ({ maxWidth, height, className, style, children, ...rest }, ref) => (
      <nav
        ref={ref}
        data-slot="nav-bar"
        className={cx(H_NAV_CLASS, className)}
        style={{
          ...(maxWidth &&
            ({ "--nds-header-nav-max-width": `${maxWidth}px` } as React.CSSProperties)),
          ...(height && ({ "--nds-header-nav-height": `${height}px` } as React.CSSProperties)),
          ...style,
        }}
        {...rest}
      >
        {children}
      </nav>
    ),
  ),
);
HeaderNavBar.displayName = "Header.NavBar";

export interface HeaderLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  href?: string;
  onLogoClick?: React.MouseEventHandler<HTMLAnchorElement>;
  /** 로고 노드 직접 제공 (SVG 컴포넌트 등). 미지정 시 src 기반 `<img>` 폴백. */
  children?: React.ReactNode;
}

const HeaderLogo = React.memo(
  React.forwardRef<HTMLImageElement, HeaderLogoProps>(
    ({ href, onLogoClick, className, alt = "", children, ...rest }, ref) => {
      const content = children ?? <img ref={ref} alt={alt} {...rest} />;
      return (
        <div data-slot="logo" className={cx(H_LOGO_CLASS, className)}>
          {href ? (
            <a href={href} onClick={onLogoClick}>
              {content}
            </a>
          ) : (
            content
          )}
        </div>
      );
    },
  ),
);
HeaderLogo.displayName = "Header.Logo";

export interface HeaderSearchBarProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  icon?: React.ReactNode;
}

const DefaultSearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const HeaderSearchBar = React.memo(
  React.forwardRef<HTMLDivElement, HeaderSearchBarProps>(
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
          className={cx(H_SEARCH_CLASS, className)}
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
            className={H_SEARCH_ICON_CLASS}
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
HeaderSearchBar.displayName = "Header.SearchBar";

export interface HeaderMenuItemData {
  key: string;
  label: string;
  href?: string;
}

export interface HeaderMenuProps extends React.HTMLAttributes<HTMLElement> {
  items?: HeaderMenuItemData[];
  activeKey?: string;
  onItemClick?: (item: HeaderMenuItemData, e: React.MouseEvent) => void;
  /** items 대신 children 으로 `<Header.MenuItem>` 직접 렌더 */
  children?: React.ReactNode;
  /** items 배열 모드에서 항목별 커스텀 렌더 */
  renderItem?: (
    item: HeaderMenuItemData,
    isActive: boolean,
    children: React.ReactNode,
  ) => React.ReactNode;
}

const HeaderMenu = React.memo(
  React.forwardRef<HTMLElement, HeaderMenuProps>(
    ({ items, activeKey, onItemClick, renderItem, className, children, ...rest }, ref) => (
      <nav ref={ref} data-slot="menu" className={cx(H_MENU_CLASS, className)} {...rest}>
        {children ??
          items?.map((item) => {
            const isActive = activeKey === item.key;
            if (renderItem) {
              return (
                <React.Fragment key={item.key}>
                  {renderItem(item, isActive, <>{item.label}</>)}
                </React.Fragment>
              );
            }
            return (
              <HeaderMenuItem
                key={item.key}
                href={item.href}
                active={isActive}
                onClick={
                  onItemClick
                    ? (e) => {
                        if (item.href) e.preventDefault();
                        onItemClick(item, e);
                      }
                    : undefined
                }
              >
                {item.label}
              </HeaderMenuItem>
            );
          })}
      </nav>
    ),
  ),
);
HeaderMenu.displayName = "Header.Menu";

export interface HeaderMenuItemProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  href?: string;
  active?: boolean;
}

const HeaderMenuItem = React.forwardRef<HTMLElement, HeaderMenuItemProps>(
  ({ href, active = false, className, children, ...rest }, ref) => {
    const Tag = href ? "a" : "button";
    const tagProps = href ? { href } : { type: "button" as const };
    return React.createElement(
      Tag,
      {
        ref: ref as never,
        "data-slot": "menu-item",
        "data-active": active || undefined,
        className: cx(H_MENU_ITEM_CLASS, className),
        ...tagProps,
        ...(rest as Record<string, unknown>),
      },
      children,
    );
  },
);
HeaderMenuItem.displayName = "Header.MenuItem";

export type HeaderActionsProps = React.HTMLAttributes<HTMLDivElement>;

const HeaderActions = React.memo(
  React.forwardRef<HTMLDivElement, HeaderActionsProps>(({ className, children, ...rest }, ref) => (
    <div ref={ref} data-slot="actions" className={cx(H_ACTIONS_CLASS, className)} {...rest}>
      {children}
    </div>
  )),
);
HeaderActions.displayName = "Header.Actions";

export interface HeaderAuthMenuItem {
  key: string;
  label: string;
}

export interface HeaderAuthMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  items: HeaderAuthMenuItem[];
  separator?: "divider" | "none";
  onItemClick?: (item: HeaderAuthMenuItem, e: React.MouseEvent) => void;
  /** 인증 메뉴 뒤 추가 요소 (앱 다운로드 버튼 등) */
  extra?: React.ReactNode;
}

const HeaderAuthMenu = React.memo(
  React.forwardRef<HTMLDivElement, HeaderAuthMenuProps>(
    (
      { items, separator = "none", onItemClick, extra, className, style, children, ...rest },
      ref,
    ) => (
      <div
        ref={ref}
        data-slot="auth"
        className={cx(H_AUTH_MENU_CLASS, className)}
        style={style}
        {...rest}
      >
        {children ??
          items.map((item, i) => (
            <React.Fragment key={item.key}>
              {i > 0 && separator === "divider" && <span className={H_AUTH_DIVIDER_CLASS} />}
              <button
                className={H_AUTH_MENU_ITEM_CLASS}
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
HeaderAuthMenu.displayName = "Header.AuthMenu";

export interface HeaderAuthButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  authState?: "login" | "logout";
  label?: string;
  href?: string;
}

const HeaderAuthButton = React.forwardRef<HTMLElement, HeaderAuthButtonProps>(
  (
    { authState = "logout", label, href, className, children, "aria-label": ariaLabel, ...rest },
    ref,
  ) => {
    const resolvedLabel = label ?? (authState === "login" ? "로그인" : "로그아웃");
    const Tag = href ? "a" : "button";
    const tagProps = href ? { href } : { type: "button" as const };
    return React.createElement(
      Tag,
      {
        ref: ref as never,
        "data-slot": "auth",
        "data-auth-state": authState,
        "aria-label": ariaLabel ?? resolvedLabel,
        className: cx(H_AUTH_BTN_CLASS, className),
        ...tagProps,
        ...(rest as Record<string, unknown>),
      },
      children ?? resolvedLabel,
    );
  },
);
HeaderAuthButton.displayName = "Header.AuthButton";

export interface HeaderAppDownloadButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  href?: string;
}

const HeaderAppDownloadButton = React.forwardRef<HTMLElement, HeaderAppDownloadButtonProps>(
  ({ href, className, children = "앱 다운로드", ...rest }, ref) => {
    const Tag = href ? "a" : "button";
    const tagProps = href ? { href } : { type: "button" as const };
    return React.createElement(
      Tag,
      {
        ref: ref as never,
        "data-slot": "download",
        className: cx(H_DOWNLOAD_BTN_CLASS, className),
        ...tagProps,
        ...(rest as Record<string, unknown>),
      },
      children,
    );
  },
);
HeaderAppDownloadButton.displayName = "Header.AppDownloadButton";

export type HeaderBackButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const HeaderBackButton = React.memo(
  React.forwardRef<HTMLButtonElement, HeaderBackButtonProps>(({ className, ...rest }, ref) => (
    <button
      ref={ref}
      data-slot="back"
      className={cx(H_BACK_CLASS, className)}
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
HeaderBackButton.displayName = "Header.BackButton";

const HeaderDivider = React.memo(({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="divider" className={cx(H_DIVIDER_CLASS, className)} {...rest} />
));
HeaderDivider.displayName = "Header.Divider";

export const Header = Object.assign(HeaderComponent, {
  MainBar: HeaderMainBar,
  NavBar: HeaderNavBar,
  Logo: HeaderLogo,
  SearchBar: HeaderSearchBar,
  Menu: HeaderMenu,
  MenuItem: HeaderMenuItem,
  Actions: HeaderActions,
  AuthMenu: HeaderAuthMenu,
  AuthButton: HeaderAuthButton,
  AppDownloadButton: HeaderAppDownloadButton,
  BackButton: HeaderBackButton,
  Divider: HeaderDivider,
});
