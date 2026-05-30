import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  trostCobalt,
  typeScale,
  zIndex,
} from "@nudge-design/tokens";
import { Header } from "../Header";
import type {
  HeaderMenuItemData as AppBarGNBItem,
  HeaderAuthMenuItem as AppBarAuthMenuItem,
} from "../Header";
import { Button } from "../Button";
import { TrendingKeywords } from "../TrendingKeywords";
import type { TrendingKeywordItem } from "../TrendingKeywords";
import {
  TrostEnergyCoinIcon,
  ChevronLeftIcon,
  ArrowBackIcon,
  SearchIcon,
  SettingIcon,
} from "@nudge-design/icons";
import { TROST_LOGO_DATA_URI, TROST_LOGO_MOBILE_DATA_URI } from "../brand-logo-defaults";

/* ─── Constants (Trost 웹사이트 실측 스펙 + 모바일 홈 헤더 2단 가이드) ─── */

const PC_MAX_WIDTH_DEFAULT = 1080;
const MAIN_BAR_PADDING_Y_DEFAULT = "20px";
const NAV_HEIGHT_DEFAULT = 70;
const MOBILE_HEIGHT_DEFAULT = 108; // Row1 56 + Row2 52
const MOBILE_ROW1_HEIGHT = 56;
const MOBILE_ROW2_HEIGHT = 52;
const MOBILE_SEARCH_HEIGHT = 44;
const SEARCH_WIDTH_DEFAULT = 530;
const SEARCH_HEIGHT_DEFAULT = 48;

const ROOT = "nds-trost-app-bar";
const MOBILE = `${ROOT}--mobile`;
const MO_ROW1 = `${ROOT}__mo-row1`;
const MO_ROW2 = `${ROOT}__mo-row2`;
const MO_RIGHT = `${ROOT}__mo-right`;
const MO_POINT_CHIP = `${ROOT}__point-chip`;
const MO_BELL_BTN = `${ROOT}__bell-btn`;
const MO_SEARCH = `${ROOT}__mo-search`;

/* webview(앱 인-웹뷰 헤더) 전용 */
const WV = `${ROOT}__wv`;
const WV_BACK = `${ROOT}__wv-back`;
const WV_LOGO = `${ROOT}__wv-logo`;
const WV_TITLE = `${ROOT}__wv-title`;
const WV_RIGHT = `${ROOT}__wv-right`;
const WV_ACTION = `${ROOT}__wv-action`;
const WV_TEXT = `${ROOT}__wv-text`;
const WV_DIVIDER = `${ROOT}__wv-divider`;

/* ─── Styles (서브디렉토리 — extract-styles 스캔 범위 밖이라 <style> 로 inject) ─── */

const trostAppBarStyles = `
  :where(.${ROOT}) {
    display: block;
    width: 100%;
    background: ${cv.surface.default};
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    z-index: var(--nds-trost-app-bar-z-index, ${zIndex.appBar});
  }

  :where(.${MOBILE}) {
    height: var(--nds-trost-app-bar-mobile-height, ${MOBILE_HEIGHT_DEFAULT}px);
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${MO_ROW1}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: ${MOBILE_ROW1_HEIGHT}px;
    padding: 0 ${spacing[16]}px;
    flex-shrink: 0;
  }

  :where(.${MO_ROW2}) {
    display: flex;
    align-items: center;
    height: ${MOBILE_ROW2_HEIGHT}px;
    padding: 0 ${spacing[16]}px ${spacing[8]}px;
    flex-shrink: 0;
  }

  :where(.${MO_RIGHT}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[10]}px;
    flex-shrink: 0;
  }

  /* Point chip: TrostEnergyCoin + 잔액 + "P". 배경/보더 없는 inline text chip. */
  :where(.${MO_POINT_CHIP}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    color: ${cv.textRole.strong};
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    cursor: pointer;
    box-sizing: border-box;
    font-family: inherit;
  }

  :where(.${MO_BELL_BTN}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: ${cv.iconRole.strong};
    cursor: pointer;
    flex-shrink: 0;
    position: relative;
  }

  :where(.${MO_BELL_BTN}[data-has-badge="true"])::after {
    content: "";
    position: absolute;
    top: 4px;
    right: 4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${cv.fill.brand};
    box-shadow: 0 0 0 2px ${cv.surface.default};
  }

  /* Search input: full-width 라운드, 우측 아이콘 in-line. */
  :where(.${MO_SEARCH}) {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: ${MOBILE_SEARCH_HEIGHT}px;
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    padding: 0 ${spacing[40]}px 0 ${spacing[16]}px;
    background: ${cv.surface.default};
    box-sizing: border-box;
    transition: border-color ${transition.default};
  }

  :where(.${MO_SEARCH}:focus-within) {
    border-color: ${cv.borderRole.normal};
  }

  :where(.${MO_SEARCH} input) {
    all: unset;
    width: 100%;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    font-family: inherit;
  }

  :where(.${MO_SEARCH} input::placeholder) {
    color: ${cv.textRole.muted};
  }

  :where(.${MO_SEARCH} .${ROOT}__search-icon) {
    position: absolute;
    right: ${spacing[12]}px;
    top: 50%;
    transform: translateY(-50%);
    color: ${cv.iconRole.strong};
    display: flex;
    cursor: pointer;
  }

  /* ── webview(앱 인-웹뷰) 헤더 ── */
  :where(.${WV}) {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: var(--nds-trost-app-bar-webview-height, 44px);
    padding: 0 ${spacing[16]}px;
    background: ${cv.surface.default};
    border-bottom: 1px solid ${cv.borderRole.subtle};
    box-sizing: border-box;
  }

  :where(.${WV_BACK}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: ${spacing[8]}px;
    color: ${cv.iconRole.strong};
    cursor: pointer;
    flex-shrink: 0;
  }

  :where(.${WV_LOGO}) {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  :where(.${WV_TITLE}) {
    margin: 0;
    color: ${cv.textRole.strong};
    font-weight: ${fontWeight.bold};
    font-family: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* main: 좌측 정렬 20/28 */
  :where(.${WV}[data-level="main"]) .${WV_TITLE} {
    flex: 1;
    min-width: 0;
    font-size: ${typeScale.headline4.fontSize}px;
    line-height: ${typeScale.headline4.lineHeight}px;
  }

  /* sub: 절대 중앙 16/24 */
  :where(.${WV}[data-level="sub"]) .${WV_TITLE} {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    max-width: 56%;
    text-align: center;
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
  }

  :where(.${WV_RIGHT}) {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: ${spacing[16]}px;
    flex-shrink: 0;
  }

  :where(.${WV_ACTION}) {
    all: unset;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: ${cv.iconRole.strong};
    cursor: pointer;
    flex-shrink: 0;
  }

  :where(.${WV_ACTION}[data-has-badge="true"])::after {
    content: "";
    position: absolute;
    top: 2px;
    right: 2px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${cv.fill.brand};
    box-shadow: 0 0 0 2px ${cv.surface.default};
  }

  :where(.${WV_TEXT}) {
    all: unset;
    color: ${trostCobalt[500]};
    font-weight: ${fontWeight.bold};
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    cursor: pointer;
    font-family: inherit;
    flex-shrink: 0;
  }

  :where(.${WV_DIVIDER}) {
    width: 1px;
    height: 14px;
    background: ${cv.borderRole.normal};
    flex-shrink: 0;
  }
`;

/* ─── Types ─── */

export type TrostAppBarVariant = "desktop" | "mobile" | "webview";

export interface TrostAppBarLogo {
  src: string;
  alt?: string;
  href?: string;
  width?: number;
  height?: number;
}

/** 모바일 Row1 우측 — 포인트(에너지 코인) chip. icon + amount + 단위 P. */
export interface TrostAppBarPointChip {
  /** 잔액 표시 텍스트 (예: "123,990"). */
  amount: string;
  /** 단위 라벨. 기본 "P". */
  unit?: string;
  /** 아이콘 override. 미지정 시 TrostEnergyCoinIcon. */
  icon?: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler;
  /** aria-label override. */
  ariaLabel?: string;
}

export interface TrostAppBarProps {
  variant?: TrostAppBarVariant;
  /** 로고 — desktop/mobile variant 에서 사용 (webview 는 불필요). */
  logo?: TrostAppBarLogo;
  pcMaxWidth?: number;
  mainBarPaddingY?: string;
  navHeight?: number;
  mobileHeight?: number;
  gnbItems?: AppBarGNBItem[];
  activeKey?: string;
  authItems?: AppBarAuthMenuItem[];
  /** 앱 다운로드 버튼 노출 여부 (desktop variant). 기본 true. */
  showAppDownload?: boolean;
  /** 앱 다운로드 버튼 라벨. 기본 "앱 다운로드". */
  appDownloadLabel?: string;
  /** 앱 다운로드 클릭 핸들러. */
  onAppDownload?: () => void;
  searchPlaceholder?: string;
  searchWidth?: number;
  searchHeight?: number;
  trendingKeywords?: TrendingKeywordItem[];
  trendingTimestamp?: string;
  webviewTitle?: string;
  onBack?: () => void;
  /* ─── Webview(앱 인-웹뷰) 헤더 전용 ─── */
  /** 앱 종류 — back 아이콘 분기. 'trost'=쉐브론(<), 'cashwalk-trost'=화살표(←). 기본 'trost'. */
  app?: "trost" | "cashwalk-trost";
  /** 웹뷰 헤더 레벨. 'main'=좌측 타이틀 20px·높이 56·back 없음, 'sub'=중앙 타이틀 16px·높이 44·back. 기본 'sub'. */
  webviewLevel?: "main" | "sub";
  /** 우측 검색 액션 — 지정 시 검색 아이콘 노출(심리상담/멘탈케어 메인). */
  onSearchClick?: () => void;
  /** 우측 설정 액션 — 지정 시 설정(기어) 아이콘 노출. */
  onSettingClick?: () => void;
  /** 우측 텍스트 액션 (sub/text 케이스, cobalt 컬러). */
  webviewActionText?: string;
  onWebviewActionText?: () => void;
  /* ─── Mobile 전용 (2단 홈 헤더) ─── */
  /** Row1 우측 포인트 chip — 미지정 시 미노출. */
  pointChip?: TrostAppBarPointChip;
  /** Row1 우측 알림 bell 노출 여부. 기본 true. */
  showNotificationBell?: boolean;
  /** Bell 옆 미확인 알림 점 표시 (단순 boolean — 카운트가 필요해지면 별도 props 로 확장). */
  hasNotification?: boolean;
  /** Bell 클릭 핸들러. */
  onNotificationClick?: React.MouseEventHandler;
  /** Bell 아이콘 override. 미지정 시 기본 inline bell svg. */
  notificationIcon?: React.ReactNode;
  /** Row2 검색 input placeholder. 미지정 시 Row2 미노출 (단단 헤더로 fallback). */
  mobileSearchPlaceholder?: string;
  /** Row2 검색 input value (controlled). */
  mobileSearchValue?: string;
  onMobileSearchChange?: (value: string) => void;
  onMobileSearch?: (value: string) => void;
}

/* ─── Inline SVGs ─── */

function DefaultBellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3.5a6 6 0 0 0-6 6v3.4l-1.6 2.6a.8.8 0 0 0 .68 1.2h13.84a.8.8 0 0 0 .68-1.2L18 12.9V9.5a6 6 0 0 0-6-6Zm0 17a2.5 2.5 0 0 1-2.45-2h4.9A2.5 2.5 0 0 1 12 20.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DefaultSearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Sub-components ─── */

function PointChip({ chip }: { chip: TrostAppBarPointChip }) {
  const unit = chip.unit ?? "P";
  const Tag = chip.href ? "a" : "button";
  const tagProps: Record<string, unknown> = chip.href ? { href: chip.href } : { type: "button" };
  return React.createElement(
    Tag,
    {
      className: MO_POINT_CHIP,
      "aria-label": chip.ariaLabel ?? `포인트 ${chip.amount}${unit}`,
      onClick: chip.onClick,
      ...tagProps,
    },
    <>
      <span style={{ display: "inline-flex" }}>
        {chip.icon ?? <TrostEnergyCoinIcon size={20} />}
      </span>
      <span>
        {chip.amount}
        {unit ? ` ${unit}` : ""}
      </span>
    </>,
  );
}

/* ─── Component ─── */

export const TrostAppBar = React.forwardRef<HTMLElement, TrostAppBarProps>((props, ref) => {
  const {
    variant = "desktop",
    logo: logoProp,
    pcMaxWidth = PC_MAX_WIDTH_DEFAULT,
    mainBarPaddingY = MAIN_BAR_PADDING_Y_DEFAULT,
    navHeight = NAV_HEIGHT_DEFAULT,
    mobileHeight,
    gnbItems,
    activeKey,
    authItems,
    showAppDownload = true,
    appDownloadLabel = "앱 다운로드",
    onAppDownload,
    searchPlaceholder,
    searchWidth = SEARCH_WIDTH_DEFAULT,
    searchHeight = SEARCH_HEIGHT_DEFAULT,
    trendingKeywords,
    trendingTimestamp = "09:00 기준",
    webviewTitle,
    onBack,
    app,
    webviewLevel,
    onSearchClick,
    onSettingClick,
    webviewActionText,
    onWebviewActionText,
    pointChip,
    showNotificationBell = true,
    hasNotification,
    onNotificationClick,
    notificationIcon,
    mobileSearchPlaceholder,
    mobileSearchValue,
    onMobileSearchChange,
    onMobileSearch,
  } = props;

  /* logo prop 미지정 시 self-contained 기본 로고. 외부 소비자가 자산 hosting 없이도
   * 어떤 환경에서든 깨지지 않고 렌더. 호스트가 자체 자산을 쓰면 prop 으로 override. */
  const logo: TrostAppBarLogo =
    logoProp ??
    (variant === "mobile"
      ? { src: TROST_LOGO_MOBILE_DATA_URI, alt: "Trost", width: 80, height: 28 }
      : { src: TROST_LOGO_DATA_URI, alt: "Trost", width: 90, height: 36 });

  if (variant === "webview") {
    /* 트로스트는 앱이 2종 → 웹뷰 헤더도 케이스가 다양 (Figma 5:1169 App bar).
     *   level='main' (h56): 좌측 타이틀 20px + [설정|검색] + 알림 / 홈은 로고+포인트+알림
     *   level='sub'  (h44): back + 중앙 타이틀 16px + [설정/검색/텍스트/알림] 조합
     *   app='trost'→쉐브론 back, app='cashwalk-trost'→화살표 back ((캐시워크)트로스트). */
    const level = webviewLevel ?? "sub";
    const resolvedHeight = mobileHeight ?? (level === "main" ? 56 : 44);
    const BackIcon = app === "cashwalk-trost" ? ArrowBackIcon : ChevronLeftIcon;
    const isHome = level === "main" && pointChip != null && webviewTitle == null;
    const hasRight =
      isHome ||
      Boolean(onSearchClick) ||
      Boolean(onSettingClick) ||
      webviewActionText != null ||
      Boolean(onNotificationClick);

    return (
      <header
        ref={ref}
        data-slot="root"
        className={`${ROOT} ${WV}`}
        data-level={level}
        data-app={app ?? "trost"}
        style={
          { "--nds-trost-app-bar-webview-height": `${resolvedHeight}px` } as React.CSSProperties
        }
      >
        <style>{trostAppBarStyles}</style>
        {level === "sub" && (
          <button type="button" className={WV_BACK} aria-label="뒤로" onClick={onBack}>
            <BackIcon size={24} />
          </button>
        )}
        {isHome ? (
          <a className={WV_LOGO} href={logo.href ?? "/"}>
            <img
              src={logo.src}
              alt={logo.alt ?? "Trost"}
              height={logo.height}
              style={{ display: "block", height: logo.height, width: "auto" }}
            />
          </a>
        ) : (
          webviewTitle != null && <h1 className={WV_TITLE}>{webviewTitle}</h1>
        )}
        {hasRight && (
          <div className={WV_RIGHT}>
            {isHome && pointChip && <PointChip chip={pointChip} />}
            {isHome && pointChip && onNotificationClick && <span className={WV_DIVIDER} />}
            {onSearchClick && (
              <button type="button" className={WV_ACTION} aria-label="검색" onClick={onSearchClick}>
                <SearchIcon size={24} />
              </button>
            )}
            {onSettingClick && (
              <button
                type="button"
                className={WV_ACTION}
                aria-label="설정"
                onClick={onSettingClick}
              >
                <SettingIcon size={24} />
              </button>
            )}
            {webviewActionText != null && (
              <button type="button" className={WV_TEXT} onClick={onWebviewActionText}>
                {webviewActionText}
              </button>
            )}
            {onNotificationClick && (
              <button
                type="button"
                className={WV_ACTION}
                aria-label="알림"
                data-has-badge={hasNotification ? "true" : undefined}
                onClick={onNotificationClick}
              >
                {notificationIcon ?? <DefaultBellIcon />}
              </button>
            )}
          </div>
        )}
      </header>
    );
  }

  if (variant === "mobile") {
    /* Rich 2단(포인트/검색) 레이아웃은 pointChip 이나 mobileSearchPlaceholder 가 있을 때만.
     * 외부 호출자가 단순 logo+auth 만 쓰던 케이스(기존 TrostMobile 스토리)는 그대로 보존. */
    const isRichMobile = Boolean(pointChip || mobileSearchPlaceholder);
    if (!isRichMobile) {
      return (
        <Header
          ref={ref}
          variant="compact"
          position="static"
          style={{ "--nds-header-height": `${mobileHeight ?? 56}px` } as React.CSSProperties}
        >
          <Header.MainBar>
            {logo && (
              <Header.Logo
                src={logo.src}
                alt={logo.alt ?? "Trost"}
                href={logo.href ?? "/"}
                style={{ height: logo.height, width: "auto" }}
              />
            )}
            {authItems && authItems.length > 0 && (
              <Header.AuthMenu items={[authItems[0]]} separator="none" />
            )}
          </Header.MainBar>
        </Header>
      );
    }

    const resolvedHeight =
      mobileHeight ?? (mobileSearchPlaceholder ? MOBILE_HEIGHT_DEFAULT : MOBILE_ROW1_HEIGHT);

    return (
      <header
        ref={ref}
        data-slot="root"
        className={`${ROOT} ${MOBILE}`}
        style={
          { "--nds-trost-app-bar-mobile-height": `${resolvedHeight}px` } as React.CSSProperties
        }
      >
        <style>{trostAppBarStyles}</style>
        <div className={MO_ROW1}>
          {logo ? (
            <a href={logo.href ?? "/"} style={{ display: "inline-flex", flexShrink: 0 }}>
              <img
                src={logo.src}
                alt={logo.alt ?? "Trost"}
                width={logo.width}
                height={logo.height}
                style={{ display: "block", height: logo.height, width: "auto" }}
              />
            </a>
          ) : (
            <span />
          )}
          <div className={MO_RIGHT}>
            {pointChip && <PointChip chip={pointChip} />}
            {showNotificationBell && (
              <button
                type="button"
                aria-label="알림"
                className={MO_BELL_BTN}
                data-has-badge={hasNotification ? "true" : undefined}
                onClick={onNotificationClick}
              >
                {notificationIcon ?? <DefaultBellIcon />}
              </button>
            )}
          </div>
        </div>
        {mobileSearchPlaceholder && (
          <div className={MO_ROW2}>
            <div className={MO_SEARCH}>
              <input
                type="text"
                placeholder={mobileSearchPlaceholder}
                value={mobileSearchValue}
                onChange={(e) => onMobileSearchChange?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && onMobileSearch) {
                    onMobileSearch((e.target as HTMLInputElement).value);
                  }
                }}
                autoComplete="off"
              />
              <span
                className={`${ROOT}__search-icon`}
                role="button"
                aria-label="검색"
                onClick={() => onMobileSearch?.(mobileSearchValue ?? "")}
              >
                <DefaultSearchIcon />
              </span>
            </div>
          </div>
        )}
      </header>
    );
  }

  /* desktop */
  return (
    <Header
      ref={ref}
      variant="compact"
      position="static"
      style={
        {
          "--nds-header-height": "auto",
          "--nds-header-padding-x": "0",
          "--nds-header-border-bottom": "none",
          flexDirection: "column",
        } as React.CSSProperties
      }
    >
      <Header.MainBar maxWidth={pcMaxWidth} style={{ padding: `${mainBarPaddingY} 16px` }}>
        {logo && (
          <Header.Logo
            src={logo.src}
            alt={logo.alt ?? "Trost"}
            href={logo.href ?? "/"}
            width={logo.width}
            height={logo.height}
          />
        )}
        {searchPlaceholder && (
          <Header.SearchBar
            placeholder={searchPlaceholder}
            style={
              {
                "--nds-header-search-width": `${searchWidth}px`,
                "--nds-header-search-height": `${searchHeight}px`,
              } as React.CSSProperties
            }
          />
        )}
        {authItems && authItems.length > 0 && (
          <Header.AuthMenu
            items={authItems}
            separator="none"
            extra={
              showAppDownload && (
                <Button
                  size="sm"
                  variant="outlined-sub"
                  style={{ marginLeft: 16 }}
                  onClick={onAppDownload}
                >
                  {appDownloadLabel}
                </Button>
              )
            }
          />
        )}
      </Header.MainBar>
      <Header.Divider />
      <Header.NavBar
        maxWidth={pcMaxWidth}
        height={navHeight}
        style={{ justifyContent: "space-between" }}
      >
        {gnbItems && gnbItems.length > 0 && <Header.Menu items={gnbItems} activeKey={activeKey} />}
        {trendingKeywords && trendingKeywords.length > 0 && (
          <TrendingKeywords items={trendingKeywords} timestamp={trendingTimestamp} />
        )}
      </Header.NavBar>
      <Header.Divider />
    </Header>
  );
});

TrostAppBar.displayName = "TrostAppBar";
