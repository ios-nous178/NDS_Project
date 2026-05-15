import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  grid,
  radius,
  sizing,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-eap/tokens";

/* ─── Constants (Figma Library node 96:25923 — NudgeEAP Web Header) ───
 *   Header height: 80 (콘텐츠 79 + 하단 보더 1)
 *   콘텐츠 max-width 1200 — 1920 뷰포트에서 좌우 360px 마진
 *     · 1200 이상 viewport: inner padding 0, 콘텐츠가 max-width 1200 경계에 직접 붙음
 *     · 1199 이하 viewport: grid.desktop.minMargin (40px) 좌우 padding 자동 적용
 *   Logo: width 200 / height 60 (image), 헤더 안에서 vertical center
 *   Menu item: h 79 / px 20, font headline-5(18/26) Bold, color #111 (neutral/900)
 *     · padding-y 두지 않고 height + align-items center 로 정렬 (Button 패턴과 동일)
 *   Action: gap 16, 우측 정렬
 *     · 앱 다운로드: bg neutral/100 (#F5F5F5), px 14, height sizing.button.sm (42),
 *       radius 8, body-1(16/24) Bold primary
 *     · 로그인/로그아웃: white bg, 1px primary border, px 18, height sizing.button.md (44),
 *       radius 8, body-1 Bold primary
 *   브랜드별 색은 tokens.css 의 --semantic-primary-* / --semantic-text-* 가
 *   자동으로 끌어와짐. 클라이언트 로고는 per-tenant 이미지라 prop 으로 주입한다.
 */

const WH_CLASS = "nds-web-header";
const WH_INNER_CLASS = `${WH_CLASS}__inner`;
const WH_LOGO_CLASS = `${WH_CLASS}__logo`;
const WH_MENU_CLASS = `${WH_CLASS}__menu`;
const WH_MENU_ITEM_CLASS = `${WH_CLASS}__menu-item`;
const WH_ACTIONS_CLASS = `${WH_CLASS}__actions`;
const WH_DOWNLOAD_CLASS = `${WH_CLASS}__download-btn`;
const WH_AUTH_CLASS = `${WH_CLASS}__auth-btn`;

const HEADER_HEIGHT = 80;
const CONTENT_MAX_WIDTH = 1200;

export type WebHeaderPosition = "sticky" | "fixed" | "static";

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const webHeaderStyles = `
  :where(.${WH_CLASS}) {
    display: block;
    width: 100%;
    height: var(--nds-web-header-height, 80px);
    background: ${cv.bg.white};
    border-bottom: 1px solid ${cv.border.light};
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    z-index: var(--nds-web-header-z-index, ${zIndex.appBar});
  }

  :where(.${WH_INNER_CLASS}) {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: var(--nds-web-header-max-width, ${grid.desktop.contentWidth}px);
    height: 100%;
    margin: 0 auto;
    padding: 0 var(--nds-web-header-padding-x, 0);
    box-sizing: border-box;
    gap: ${spacing[40]}px;
  }

  /* DESIGN.md grid.desktop: 1200 미만 뷰포트는 좌우 minMargin(40px) 적용. */
  @media (max-width: ${grid.desktop.contentWidth - 1}px) {
    :where(.${WH_INNER_CLASS}) {
      --nds-web-header-padding-x: ${grid.desktop.minMargin}px;
    }
  }

  :where(.${WH_LOGO_CLASS}) {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 100%;
  }

  :where(.${WH_LOGO_CLASS} img) {
    display: block;
    height: var(--nds-web-header-logo-height, 60px);
    width: auto;
    max-width: var(--nds-web-header-logo-max-width, 200px);
    object-fit: contain;
  }

  :where(.${WH_LOGO_CLASS} a) {
    display: flex;
    align-items: center;
  }

  /* Menu (GNB) — items 사이 gap 없이 각자 px-20 으로 간격 형성 */
  :where(.${WH_MENU_CLASS}) {
    display: flex;
    align-items: center;
    height: 100%;
    flex: 1;
    min-width: 0;
  }

  :where(.${WH_MENU_ITEM_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 ${spacing[20]}px;
    font-size: ${typeScale.headline5.fontSize}px;
    line-height: ${typeScale.headline5.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.text.normal};
    text-decoration: none;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    box-sizing: border-box;
    white-space: nowrap;
    transition:
      color ${transition.default},
      border-color ${transition.default};
  }

  :where(.${WH_MENU_ITEM_CLASS}:hover) {
    color: ${cv.primary.main};
  }

  :where(.${WH_MENU_ITEM_CLASS}[data-active="true"]) {
    color: ${cv.primary.main};
    border-bottom-color: ${cv.primary.main};
  }

  /* Actions — 우측 정렬, 항목 간 16px gap */
  :where(.${WH_ACTIONS_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[16]}px;
    margin-left: auto;
    flex-shrink: 0;
  }

  /* 앱 다운로드 (회색 배경 + primary 텍스트)
     Figma 실측 height 42 (sizing.button.sm). height + align-items center 로 정렬. */
  :where(.${WH_DOWNLOAD_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: ${sizing.button.sm}px;
    padding: 0 ${spacing[14]}px;
    background: ${cv.bg.light};
    color: ${cv.primary.main};
    font-family: inherit;
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    border: 0;
    border-radius: ${radius.md}px;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    box-sizing: border-box;
    transition: background-color ${transition.default};
  }

  :where(.${WH_DOWNLOAD_CLASS}:hover) {
    background: ${cv.bg.disabled};
  }

  /* 로그인 / 로그아웃 — white bg + primary border
     Figma 실측 height 44 (sizing.button.md). height + align-items center 로 정렬. */
  :where(.${WH_AUTH_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: ${sizing.button.md}px;
    padding: 0 ${spacing[18]}px;
    background: ${cv.bg.white};
    color: ${cv.primary.main};
    font-family: inherit;
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    border: 1px solid ${cv.primary.main};
    border-radius: ${radius.md}px;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    box-sizing: border-box;
    transition:
      background-color ${transition.default},
      color ${transition.default};
  }

  :where(.${WH_AUTH_CLASS}:hover) {
    background: ${cv.primary.bgLighter};
  }
`;

/* ─── Utils ─── */

const cx = (...names: Array<string | undefined | false | null>) => names.filter(Boolean).join(" ");

/* ─── Root ─── */

export interface WebHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** position 모드. 기본 'static' (사용자 페이지에서 흐름 따라감) */
  position?: WebHeaderPosition;
  /** 콘텐츠 컨테이너 max-width (px). 기본 1200 */
  maxWidth?: number;
}

const WebHeaderComponent = React.forwardRef<HTMLElement, WebHeaderProps>(
  ({ position = "static", maxWidth, className, style, children, ...rest }, ref) => (
    <header
      ref={ref}
      data-slot="root"
      className={cx(WH_CLASS, className)}
      style={
        {
          position,
          top: position !== "static" ? 0 : undefined,
          left: position === "fixed" ? 0 : undefined,
          right: position === "fixed" ? 0 : undefined,
          ...(maxWidth &&
            ({ "--nds-web-header-max-width": `${maxWidth}px` } as React.CSSProperties)),
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      <div className={WH_INNER_CLASS} data-slot="inner">
        {children}
      </div>
    </header>
  ),
);
WebHeaderComponent.displayName = "WebHeader";

/* ─── Logo ─── */

export interface WebHeaderLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** 클릭 시 이동할 경로. 지정 시 <a> 로 감싸짐 */
  href?: string;
  /** 클릭 핸들러 (href 와 함께 쓰면 anchor 클릭) */
  onLogoClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const WebHeaderLogo = React.memo(
  React.forwardRef<HTMLImageElement, WebHeaderLogoProps>(
    ({ href, onLogoClick, className, alt = "", ...rest }, ref) => {
      const img = <img ref={ref} alt={alt} {...rest} />;
      return (
        <div data-slot="logo" className={cx(WH_LOGO_CLASS, className)}>
          {href ? (
            <a href={href} onClick={onLogoClick}>
              {img}
            </a>
          ) : (
            img
          )}
        </div>
      );
    },
  ),
);
WebHeaderLogo.displayName = "WebHeader.Logo";

/* ─── Menu (GNB) ─── */

export interface WebHeaderMenuItem {
  key: string;
  label: string;
  href?: string;
}

export interface WebHeaderMenuProps extends React.HTMLAttributes<HTMLElement> {
  items?: WebHeaderMenuItem[];
  /** 현재 활성 메뉴의 key */
  activeKey?: string;
  /** 메뉴 클릭 — 지정 시 default anchor 동작 막고 호출 */
  onItemClick?: (item: WebHeaderMenuItem, e: React.MouseEvent) => void;
  /** items 대신 직접 children 으로 <WebHeader.MenuItem> 렌더 */
  children?: React.ReactNode;
}

const WebHeaderMenu = React.memo(
  React.forwardRef<HTMLElement, WebHeaderMenuProps>(
    ({ items, activeKey, onItemClick, className, children, ...rest }, ref) => (
      <nav ref={ref} data-slot="menu" className={cx(WH_MENU_CLASS, className)} {...rest}>
        {children ??
          items?.map((item) => (
            <WebHeaderMenuItem
              key={item.key}
              href={item.href}
              active={activeKey === item.key}
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
            </WebHeaderMenuItem>
          ))}
      </nav>
    ),
  ),
);
WebHeaderMenu.displayName = "WebHeader.Menu";

/* ─── MenuItem ─── */

export interface WebHeaderMenuItemProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  href?: string;
  active?: boolean;
}

const WebHeaderMenuItem = React.forwardRef<HTMLElement, WebHeaderMenuItemProps>(
  ({ href, active = false, className, children, ...rest }, ref) => {
    const Tag = href ? "a" : "button";
    const tagProps = href ? { href } : { type: "button" as const };
    return React.createElement(
      Tag,
      {
        ref: ref as never,
        "data-slot": "menu-item",
        "data-active": active || undefined,
        className: cx(WH_MENU_ITEM_CLASS, className),
        ...tagProps,
        ...(rest as Record<string, unknown>),
      },
      children,
    );
  },
);
WebHeaderMenuItem.displayName = "WebHeader.MenuItem";

/* ─── Actions ─── */

export type WebHeaderActionsProps = React.HTMLAttributes<HTMLDivElement>;

const WebHeaderActions = React.memo(
  React.forwardRef<HTMLDivElement, WebHeaderActionsProps>(
    ({ className, children, ...rest }, ref) => (
      <div ref={ref} data-slot="actions" className={cx(WH_ACTIONS_CLASS, className)} {...rest}>
        {children}
      </div>
    ),
  ),
);
WebHeaderActions.displayName = "WebHeader.Actions";

/* ─── AppDownloadButton ─── */

export interface WebHeaderAppDownloadButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  /** 지정 시 <a> 로 렌더 */
  href?: string;
}

const WebHeaderAppDownloadButton = React.forwardRef<HTMLElement, WebHeaderAppDownloadButtonProps>(
  ({ href, className, children = "앱 다운로드", ...rest }, ref) => {
    const Tag = href ? "a" : "button";
    const tagProps = href ? { href } : { type: "button" as const };
    return React.createElement(
      Tag,
      {
        ref: ref as never,
        "data-slot": "download",
        className: cx(WH_DOWNLOAD_CLASS, className),
        ...tagProps,
        ...(rest as Record<string, unknown>),
      },
      children,
    );
  },
);
WebHeaderAppDownloadButton.displayName = "WebHeader.AppDownloadButton";

/* ─── AuthButton (로그인/로그아웃) ─── */

export interface WebHeaderAuthButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  /** 로그인 / 로그아웃 라벨을 결정. 기본 'logout' (로그아웃) */
  authState?: "login" | "logout";
  /** 라벨 직접 지정 (authState 무시) */
  label?: string;
  /** 지정 시 <a> 로 렌더 */
  href?: string;
}

const WebHeaderAuthButton = React.forwardRef<HTMLElement, WebHeaderAuthButtonProps>(
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
        className: cx(WH_AUTH_CLASS, className),
        ...tagProps,
        ...(rest as Record<string, unknown>),
      },
      children ?? resolvedLabel,
    );
  },
);
WebHeaderAuthButton.displayName = "WebHeader.AuthButton";

/* ─── Compound export ─── */

export const WebHeader = Object.assign(WebHeaderComponent, {
  Logo: WebHeaderLogo,
  Menu: WebHeaderMenu,
  MenuItem: WebHeaderMenuItem,
  Actions: WebHeaderActions,
  AppDownloadButton: WebHeaderAppDownloadButton,
  AuthButton: WebHeaderAuthButton,
});
