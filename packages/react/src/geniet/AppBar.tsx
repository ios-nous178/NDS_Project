import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-design/tokens";
import { Header } from "../Header";
import type { HeaderMenuItemData as AppBarGNBItem } from "../Header";
import { TrendingKeywords } from "../TrendingKeywords";
import type { TrendingKeywordItem } from "../TrendingKeywords";
import { GenietMenuIcon, GenietSearchIcon, GenietGpointIcon } from "@nudge-design/icons";
import { GENIET_LOGO_PC_DATA_URI, GENIET_LOGO_MOBILE_DATA_URI } from "../brand-logo-defaults";

/* ─── Constants (Figma 77:2 — Geniet_TopHeader_Guide) ───
 *   Desktop: 1920 × 172 (pad-top 40 + Search Header 54 + gap 20 + Menu Header 58)
 *     · Search Header (54h, white): logo 165×54 + search frame (pill 500 + NEW chip ≈164, gap 24)
 *       + login_area (header action buttons · icon 28 + label 11)
 *     · Menu Header (58h, white, top+bottom 1px border): 음식 카테고리 160×58 + GNB(홈/커뮤니티/
 *       헬시딜/음식 리뷰/기록, Pretendard Bold 17, gap 20) + 우측 CTA pills (캐시리뷰·친구초대)
 *   Mobile : 360 × 102 (Row1 50h + Row2 52h, pad-x 16)
 *     · Row1: logo 97×32 + point chip(gpoint icon + amount, outlined #DDD pill) + user icon 28
 *     · Row2: hamburger 24 + search input 292×38 (radius 8, bg #F5F5F5)
 */

const PC_MAX_WIDTH_DEFAULT = 1280;
const PC_TOP_PAD_DEFAULT = 40;
const PC_SEARCH_HEIGHT_DEFAULT = 54;
const PC_MENU_HEIGHT_DEFAULT = 58;
const PC_GAP_DEFAULT = 20;
const PC_SEARCH_INPUT_WIDTH = 500;
const MO_HEIGHT_DEFAULT = 102;
const MO_ROW1_HEIGHT = 50;
const MO_ROW2_HEIGHT = 52;
const MO_SEARCH_HEIGHT = 38;
const MO_SEARCH_WIDTH = 292;

const ROOT = "nds-geniet-app-bar";
const DESKTOP = `${ROOT}--desktop`;
const MOBILE = `${ROOT}--mobile`;
const SEARCH_HEADER = `${ROOT}__search-header`;
/* MENU_HEADER 는 inner row (1280 max-width); MENU_HEADER_RAIL 은 viewport 전체 폭을
 * 차지하는 outer wrapper 로 위/아래 1px border 를 화면 끝까지 긋는다. (디자인 요청) */
const MENU_HEADER_RAIL = `${ROOT}__menu-header-rail`;
const MENU_HEADER = `${ROOT}__menu-header`;
const SEARCH_FRAME = `${ROOT}__search-frame`;
const SEARCH_INPUT = `${ROOT}__search-input`;
const LOGIN_AREA = `${ROOT}__login-area`;
const ACTION_BTN = `${ROOT}__action-btn`;
const ACTION_DIVIDER = `${ROOT}__action-divider`;
const CATEGORY = `${ROOT}__category`;
const GNB = `${ROOT}__gnb`;
const GNB_ITEM = `${ROOT}__gnb-item`;
const CTA_GROUP = `${ROOT}__cta-group`;
const CTA_PILL = `${ROOT}__cta-pill`;
const MO_ROW1 = `${ROOT}__mo-row1`;
const MO_ROW2 = `${ROOT}__mo-row2`;
const MO_POINT_CHIP = `${ROOT}__point-chip`;
const MO_USER_BTN = `${ROOT}__user-btn`;
const MO_SEARCH_INPUT_CLASS = `${ROOT}__mo-search`;

/* ─── Styles ───
 *   서브디렉토리(geniet/) 파일은 extract-styles 스크립트의 스캔 범위 밖이라
 *   styles.css 로 추출되지 않는다. desktop/mobile variant 안에서 <style> 태그로
 *   직접 inject. (옛 categoryStyles 와 동일 패턴)
 */

const genietAppBarStyles = `
  :where(.${ROOT}) {
    display: block;
    width: 100%;
    background: ${cv.surface.default};
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    z-index: var(--nds-geniet-app-bar-z-index, ${zIndex.appBar});
  }

  /* ─── Desktop ─── */

  :where(.${DESKTOP}) {
    padding-top: var(--nds-geniet-app-bar-pad-top, ${PC_TOP_PAD_DEFAULT}px);
  }

  :where(.${SEARCH_HEADER}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: var(--nds-geniet-app-bar-max-width, ${PC_MAX_WIDTH_DEFAULT}px);
    height: var(--nds-geniet-app-bar-search-height, ${PC_SEARCH_HEIGHT_DEFAULT}px);
    margin: 0 auto;
    padding: 0 ${spacing[16]}px;
    box-sizing: border-box;
    gap: ${spacing[24]}px;
  }

  /* Rail: 100% viewport width — 위/아래 border 가 화면 끝까지 그어지도록 outer wrap.
   * border 가 콘텐츠 max-width(1280) 안쪽에서만 끊기지 않게 분리한다. */
  :where(.${MENU_HEADER_RAIL}) {
    width: 100%;
    margin-top: var(--nds-geniet-app-bar-gap, ${PC_GAP_DEFAULT}px);
    border-top: 1px solid ${cv.borderRole.subtle};
    border-bottom: 1px solid ${cv.borderRole.subtle};
    background: ${cv.surface.default};
    box-sizing: border-box;
  }

  :where(.${MENU_HEADER}) {
    display: flex;
    align-items: stretch;
    width: 100%;
    max-width: var(--nds-geniet-app-bar-max-width, ${PC_MAX_WIDTH_DEFAULT}px);
    height: var(--nds-geniet-app-bar-menu-height, ${PC_MENU_HEIGHT_DEFAULT}px);
    margin: 0 auto;
    padding: 0 ${spacing[16]}px;
    box-sizing: border-box;
  }

  /* Search frame: input(500) + trending chip(~164), gap 24 */
  :where(.${SEARCH_FRAME}) {
    display: flex;
    align-items: center;
    gap: ${spacing[24]}px;
    flex-shrink: 0;
  }

  :where(.${SEARCH_INPUT}) {
    position: relative;
    display: flex;
    align-items: center;
    width: var(--nds-geniet-app-bar-search-width, ${PC_SEARCH_INPUT_WIDTH}px);
    height: ${PC_SEARCH_HEIGHT_DEFAULT}px;
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: 999px;
    padding: 0 ${spacing[48]}px 0 ${spacing[20]}px;
    background: ${cv.surface.default};
    box-sizing: border-box;
    font-family: inherit;
  }

  :where(.${SEARCH_INPUT} input) {
    all: unset;
    width: 100%;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${SEARCH_INPUT} input::placeholder) {
    color: ${cv.textRole.muted};
  }

  :where(.${SEARCH_INPUT} .${ROOT}__search-icon) {
    position: absolute;
    right: ${spacing[16]}px;
    top: 50%;
    transform: translateY(-50%);
    color: ${cv.iconRole.strong};
    cursor: pointer;
    display: flex;
  }

  /* Login area: header action buttons (icon 28 + label Pretendard 11), 52×46 each, optional divider */
  :where(.${LOGIN_AREA}) {
    display: flex;
    align-items: center;
    gap: ${spacing[12]}px;
    flex-shrink: 0;
  }

  :where(.${ACTION_BTN}) {
    all: unset;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${spacing[2]}px;
    width: 52px;
    height: 46px;
    cursor: pointer;
    color: ${cv.textRole.subtle};
    text-align: center;
    transition: color ${transition.default};
  }

  :where(.${ACTION_BTN}:hover) {
    color: ${cv.textRole.normal};
  }

  :where(.${ACTION_BTN}__icon) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
  }

  :where(.${ACTION_BTN}__label) {
    font-size: 11px;
    line-height: 14px;
    font-weight: ${fontWeight.medium};
    white-space: nowrap;
  }

  :where(.${ACTION_DIVIDER}) {
    width: 1px;
    height: 24px;
    background: ${cv.borderRole.subtle};
    flex-shrink: 0;
  }

  /* 음식 카테고리 box: 160×58, click-to-expand */
  :where(.${CATEGORY}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[10]}px;
    height: 100%;
    min-width: 160px;
    padding: 0 15px;
    border-right: 1px solid ${cv.borderRole.subtle};
    box-sizing: border-box;
    color: ${cv.textRole.strong};
    text-decoration: none;
    font-size: ${typeScale.headline5.fontSize}px;
    line-height: ${typeScale.headline5.lineHeight}px;
    font-weight: ${fontWeight.bold};
    cursor: pointer;
  }

  /* GNB nav: 5 items, gap 20, Pretendard Bold 17 */
  :where(.${GNB}) {
    display: flex;
    align-items: center;
    gap: ${spacing[20]}px;
    height: 100%;
    margin-left: ${spacing[20]}px;
    flex: 1;
    min-width: 0;
  }

  :where(.${GNB_ITEM}) {
    display: inline-flex;
    align-items: center;
    height: 100%;
    padding: 0 ${spacing[10]}px;
    font-size: ${typeScale.headline5.fontSize}px;
    line-height: ${typeScale.headline5.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
    text-decoration: none;
    white-space: nowrap;
    border-bottom: 3px solid transparent;
    box-sizing: border-box;
    transition: color ${transition.default}, border-color ${transition.default};
  }

  :where(.${GNB_ITEM}:hover) {
    color: ${cv.textRole.brand};
  }

  :where(.${GNB_ITEM}[data-active="true"]) {
    color: ${cv.textRole.brand};
    border-bottom-color: ${cv.borderRole.brand};
  }

  /* Right CTA pills (캐시리뷰 outline · 친구초대 mint-tinted) */
  :where(.${CTA_GROUP}) {
    display: flex;
    align-items: center;
    gap: ${spacing[8]}px;
    margin-left: auto;
    flex-shrink: 0;
  }

  :where(.${CTA_PILL}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    height: 36px;
    padding: 0 ${spacing[13]}px;
    border-radius: 999px;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    white-space: nowrap;
    cursor: pointer;
    box-sizing: border-box;
    transition: background-color ${transition.default};
  }

  /* 캐시리뷰 — 흰 배경 + 연한 파란 보더 + 토스 블루 아이콘/텍스트 (Geniet 디자인 스펙).
   * 토큰화하지 않고 hex literal 로 못박은 이유: 이 두 pill 은 브랜드 mint 와 분리된
   * accent 컬러(토스 블루 #1677ff / #0093f1) 라 시멘틱 토큰의 brand 슬롯과 충돌. */
  :where(.${CTA_PILL}[data-tone="outline"]) {
    background: ${cv.surface.default};
    border: 1px solid #dce9ff;
    color: #1677ff;
  }

  /* 친구초대 이벤트 — 연한 하늘 배경 + 파란 텍스트. 위와 동일하게 hex 고정. */
  :where(.${CTA_PILL}[data-tone="tinted"]) {
    background: #e9f7ff;
    color: #0093f1;
  }

  :where(.${CTA_PILL}[data-tone="filled"]) {
    background: ${cv.fill.brand};
    color: ${cv.textRole.inverse};
  }

  /* ─── Mobile ─── */

  :where(.${MOBILE}) {
    height: var(--nds-geniet-app-bar-mobile-height, ${MO_HEIGHT_DEFAULT}px);
    display: flex;
    flex-direction: column;
  }

  :where(.${MO_ROW1}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: ${MO_ROW1_HEIGHT}px;
    padding: 0 ${spacing[16]}px;
    flex-shrink: 0;
  }

  :where(.${MO_ROW2}) {
    display: flex;
    align-items: center;
    gap: ${spacing[12]}px;
    height: ${MO_ROW2_HEIGHT}px;
    padding: 0 ${spacing[16]}px;
    flex-shrink: 0;
  }

  :where(.${MO_POINT_CHIP}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[2]}px;
    height: 30px;
    padding: 5px ${spacing[8]}px;
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: 20px;
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.medium};
    text-decoration: none;
    cursor: pointer;
    box-sizing: border-box;
  }

  :where(.${MO_USER_BTN}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: ${cv.iconRole.strong};
    cursor: pointer;
  }

  :where(.${MO_SEARCH_INPUT_CLASS}) {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
    width: var(--nds-geniet-app-bar-mo-search-width, ${MO_SEARCH_WIDTH}px);
    height: ${MO_SEARCH_HEIGHT}px;
    border-radius: ${radius.md}px;
    background: ${cv.surface.subtle};
    padding: 0 ${spacing[40]}px 0 ${spacing[12]}px;
    box-sizing: border-box;
  }

  :where(.${MO_SEARCH_INPUT_CLASS} input) {
    all: unset;
    width: 100%;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${MO_SEARCH_INPUT_CLASS} input::placeholder) {
    color: ${cv.textRole.muted};
  }

  :where(.${MO_SEARCH_INPUT_CLASS} .${ROOT}__search-icon) {
    position: absolute;
    right: ${spacing[12]}px;
    top: 50%;
    transform: translateY(-50%);
    color: ${cv.iconRole.strong};
    display: flex;
    cursor: pointer;
  }
`;

/* ─── Types ─── */

export type GenietAppBarVariant = "desktop" | "mobile" | "webview";

export interface GenietAppBarLogo {
  src: string;
  alt?: string;
  href?: string;
  width?: number;
  height?: number;
}

export interface GenietAppBarCategory {
  label: string;
  href: string;
}

/** Search Header 우측 액션 버튼 (vertical icon 28 + label 11px).
 *  e.g. 쿠폰상점 / 마이페이지 / 로그인. dividerBefore 로 앞 그룹과 시각 구분. */
export interface GenietAppBarAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler;
  /** 이 항목 앞에 1px divider 노출 (그룹 시각 구분). */
  dividerBefore?: boolean;
  /** aria-label override (기본은 label). */
  ariaLabel?: string;
}

/** Menu Header 우측 CTA pill (캐시리뷰·친구초대 등).
 *  tone: outline(흰 배경 + 보더, 캐시리뷰) / tinted(브랜드 톤 배경, 친구초대) / filled(솔리드). */
export interface GenietAppBarCta {
  key: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler;
  tone?: "outline" | "tinted" | "filled";
}

/** Mobile Row1 우측 — 포인트 잔액 chip (gpoint icon + amount). */
export interface GenietAppBarPointChip {
  /** 잔액 표시 텍스트 (예: "34,300"). */
  amount: string;
  /** 아이콘 override. 미지정 시 GenietGpointIcon. */
  icon?: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler;
}

export interface GenietAppBarProps {
  /** 레이아웃 모드. 기본 "desktop". */
  variant?: GenietAppBarVariant;
  /** 로고 자산 — desktop/mobile variant 에서 사용. webview 는 불필요. */
  logo?: GenietAppBarLogo;
  /** PC 콘텐츠 max-width. 기본 1280. */
  pcMaxWidth?: number;
  /** Search Header 상단 padding. 기본 40. */
  pcTopPadding?: number;
  /** Search Header / Menu Header 사이 gap. 기본 20. */
  pcGap?: number;
  /** Search Header 높이. 기본 54. */
  pcSearchHeight?: number;
  /** Menu Header 높이. 기본 58. */
  pcMenuHeight?: number;
  /** 모바일 헤더 전체 높이 (Row1 50 + Row2 52). 기본 102. */
  mobileHeight?: number;
  /** GNB 항목 (desktop variant). */
  gnbItems?: AppBarGNBItem[];
  /** 현재 활성 GNB key. */
  activeKey?: string;
  /** Search Header 우측 액션 버튼 (icon + label) — desktop variant. */
  actionButtons?: GenietAppBarAction[];
  /** 검색 입력 placeholder — desktop variant. 미지정 시 검색 입력 숨김. */
  searchPlaceholder?: string;
  /** PC 검색 input width. 기본 500. */
  searchWidth?: number;
  /** 인기검색어 — desktop search frame 우측. */
  trendingKeywords?: TrendingKeywordItem[];
  /** 인기검색어 타임스탬프. */
  trendingTimestamp?: string;
  /** 카테고리 박스 — desktop menu header 좌측. false 면 미노출. */
  category?: GenietAppBarCategory | false;
  /** Menu Header 우측 CTA pill 그룹 — desktop variant. */
  ctaButtons?: GenietAppBarCta[];
  /** Mobile 검색 placeholder (PC와 카피 다름). 미지정 시 검색 row 숨김. */
  mobileSearchPlaceholder?: string;
  /** Mobile Row1 우측 포인트 chip. */
  pointChip?: GenietAppBarPointChip;
  /** Mobile Row1 사용자 아이콘 노출 (기본 true). */
  showUserIcon?: boolean;
  /** Mobile 사용자 아이콘 클릭. */
  onUserClick?: React.MouseEventHandler;
  /** Mobile 사용자 아이콘 override. 미지정 시 기본 user fill svg. */
  userIcon?: React.ReactNode;
  /** Mobile 햄버거 클릭 (음식 카테고리 dropdown). */
  onMobileMenuClick?: React.MouseEventHandler;
  /** Webview 타이틀. */
  webviewTitle?: string;
  /** Webview 뒤로가기 핸들러. */
  onBack?: () => void;
}

/* ─── Sub-components ─── */

function ActionButton({ action }: { action: GenietAppBarAction }) {
  const Tag = action.href ? "a" : "button";
  const tagProps: Record<string, unknown> = action.href
    ? { href: action.href }
    : { type: "button" };
  return React.createElement(
    Tag,
    {
      className: ACTION_BTN,
      "aria-label": action.ariaLabel ?? action.label,
      onClick: action.onClick,
      ...tagProps,
    },
    <>
      <span className={`${ACTION_BTN}__icon`}>{action.icon}</span>
      <span className={`${ACTION_BTN}__label`}>{action.label}</span>
    </>,
  );
}

function CtaPill({ cta }: { cta: GenietAppBarCta }) {
  const Tag = cta.href ? "a" : "button";
  const tagProps: Record<string, unknown> = cta.href ? { href: cta.href } : { type: "button" };
  return React.createElement(
    Tag,
    {
      className: CTA_PILL,
      "data-tone": cta.tone ?? "outline",
      onClick: cta.onClick,
      ...tagProps,
    },
    <>
      {cta.icon && <span style={{ display: "inline-flex" }}>{cta.icon}</span>}
      <span>{cta.label}</span>
    </>,
  );
}

function CategoryBox({ label, href }: GenietAppBarCategory) {
  return (
    <a href={href} className={CATEGORY}>
      <GenietMenuIcon size={24} />
      {label}
    </a>
  );
}

function DefaultUserIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 12.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 1.5c-3.5 0-8.5 1.75-8.5 5v1.25h17V19c0-3.25-5-5-8.5-5Z" />
    </svg>
  );
}

function PointChip({ chip }: { chip: GenietAppBarPointChip }) {
  const Tag = chip.href ? "a" : "button";
  const tagProps: Record<string, unknown> = chip.href ? { href: chip.href } : { type: "button" };
  return React.createElement(
    Tag,
    {
      className: MO_POINT_CHIP,
      "aria-label": `포인트 ${chip.amount}`,
      onClick: chip.onClick,
      ...tagProps,
    },
    <>
      {/* gpoint 자체는 Geniet 시그니처 mint — point chip 의 텍스트 컬러(검정)와
       * 분리하기 위해 아이콘 컨테이너만 색 override. */}
      <span style={{ display: "inline-flex", color: cv.iconRole.brand }}>
        {chip.icon ?? <GenietGpointIcon size={20} />}
      </span>
      <span>{chip.amount}</span>
    </>,
  );
}

/* ─── Component ─── */

export const GenietAppBar = React.forwardRef<HTMLElement, GenietAppBarProps>((props, ref) => {
  const {
    variant = "desktop",
    logo: logoProp,
    pcMaxWidth = PC_MAX_WIDTH_DEFAULT,
    pcTopPadding = PC_TOP_PAD_DEFAULT,
    pcGap = PC_GAP_DEFAULT,
    pcSearchHeight = PC_SEARCH_HEIGHT_DEFAULT,
    pcMenuHeight = PC_MENU_HEIGHT_DEFAULT,
    mobileHeight = MO_HEIGHT_DEFAULT,
    gnbItems,
    activeKey,
    actionButtons,
    searchPlaceholder,
    searchWidth = PC_SEARCH_INPUT_WIDTH,
    trendingKeywords,
    trendingTimestamp = "09:00 기준",
    category = { label: "음식 카테고리", href: "/category" },
    ctaButtons,
    mobileSearchPlaceholder,
    pointChip,
    showUserIcon = true,
    onUserClick,
    userIcon,
    onMobileMenuClick,
    webviewTitle,
    onBack,
  } = props;

  /* 외부 소비자가 logo prop 을 안 줘도, npm 으로 받은 그 자리에서 깨지지 않고
   * Geniet 로고가 렌더되어야 한다 — base64 data URI 로 self-contained 기본값 제공.
   * 호스트가 자체 자산을 쓰고 싶으면 logo prop 으로 override. */
  const logo: GenietAppBarLogo =
    logoProp ??
    (variant === "mobile"
      ? { src: GENIET_LOGO_MOBILE_DATA_URI, alt: "Geniet", width: 97, height: 32 }
      : { src: GENIET_LOGO_PC_DATA_URI, alt: "Geniet", width: 165, height: 54 });

  if (variant === "webview") {
    return (
      <Header
        ref={ref}
        variant="webview"
        position="static"
        title={webviewTitle}
        leftSlot={<Header.BackButton onClick={onBack} />}
        style={{ "--nds-header-height": `${MO_ROW1_HEIGHT}px` } as React.CSSProperties}
      />
    );
  }

  if (variant === "mobile") {
    return (
      <header
        ref={ref}
        data-slot="root"
        className={`${ROOT} ${MOBILE}`}
        style={
          {
            "--nds-geniet-app-bar-mobile-height": `${mobileHeight}px`,
            borderBottom: `1px solid ${cv.borderRole.subtle}`,
          } as React.CSSProperties
        }
      >
        <style>{genietAppBarStyles}</style>
        <div className={MO_ROW1}>
          {logo ? (
            <a href={logo.href ?? "/"} style={{ display: "inline-flex", flexShrink: 0 }}>
              <img
                src={logo.src}
                alt={logo.alt ?? "Geniet"}
                width={logo.width}
                height={logo.height ?? 32}
                style={{ display: "block", height: logo.height ?? 32, width: "auto" }}
              />
            </a>
          ) : (
            <span />
          )}
          <div style={{ display: "inline-flex", alignItems: "center", gap: spacing[14] }}>
            {pointChip && <PointChip chip={pointChip} />}
            {showUserIcon && (
              <button
                type="button"
                aria-label="사용자"
                className={MO_USER_BTN}
                /* Figma 77:2 — icon/user/fill/gray600. 햄버거(검정)와 분리하기 위해
                 * 같은 base class 위에 color override. */
                style={{ color: cv.iconRole.normal }}
                onClick={onUserClick}
              >
                {userIcon ?? <DefaultUserIcon />}
              </button>
            )}
          </div>
        </div>
        {mobileSearchPlaceholder && (
          <div className={MO_ROW2}>
            <button
              type="button"
              aria-label="음식 카테고리"
              className={MO_USER_BTN}
              onClick={onMobileMenuClick}
            >
              <GenietMenuIcon size={24} />
            </button>
            <div className={MO_SEARCH_INPUT_CLASS}>
              <input type="text" placeholder={mobileSearchPlaceholder} autoComplete="off" />
              <span className={`${ROOT}__search-icon`} role="button" aria-label="검색">
                <GenietSearchIcon size={20} />
              </span>
            </div>
          </div>
        )}
      </header>
    );
  }

  /* ─── Desktop variant ─── */
  return (
    <header
      ref={ref}
      data-slot="root"
      className={`${ROOT} ${DESKTOP}`}
      style={
        {
          "--nds-geniet-app-bar-max-width": `${pcMaxWidth}px`,
          "--nds-geniet-app-bar-pad-top": `${pcTopPadding}px`,
          "--nds-geniet-app-bar-gap": `${pcGap}px`,
          "--nds-geniet-app-bar-search-height": `${pcSearchHeight}px`,
          "--nds-geniet-app-bar-menu-height": `${pcMenuHeight}px`,
          "--nds-geniet-app-bar-search-width": `${searchWidth}px`,
        } as React.CSSProperties
      }
    >
      <style>{genietAppBarStyles}</style>
      {/* Row 1 — Search Header (54h) */}
      <div className={SEARCH_HEADER} data-slot="search-header">
        {logo && (
          <a href={logo.href ?? "/"} style={{ display: "inline-flex", flexShrink: 0 }}>
            <img
              src={logo.src}
              alt={logo.alt ?? "Geniet"}
              width={logo.width}
              height={logo.height}
              style={{ display: "block", objectFit: "contain" }}
            />
          </a>
        )}

        {searchPlaceholder && (
          <div className={SEARCH_FRAME} data-slot="search-frame">
            <div className={SEARCH_INPUT}>
              <input type="text" placeholder={searchPlaceholder} autoComplete="off" />
              <span className={`${ROOT}__search-icon`} role="button" aria-label="검색">
                <GenietSearchIcon size={24} />
              </span>
            </div>
            {trendingKeywords && trendingKeywords.length > 0 && (
              <TrendingKeywords items={trendingKeywords} timestamp={trendingTimestamp} />
            )}
          </div>
        )}

        {actionButtons && actionButtons.length > 0 && (
          <div className={LOGIN_AREA} data-slot="login-area">
            {actionButtons.map((action) => (
              <React.Fragment key={action.key}>
                {action.dividerBefore && <span className={ACTION_DIVIDER} aria-hidden="true" />}
                <ActionButton action={action} />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Row 2 — Menu Header (58h). 외부 rail 이 viewport 전체 폭을 차지하며
       * 위/아래 border 를 화면 끝까지 긋는다. 내부 <nav> 는 max-width 유지. */}
      <div className={MENU_HEADER_RAIL} data-slot="menu-header-rail">
        <nav className={MENU_HEADER} data-slot="menu-header">
          {category && <CategoryBox label={category.label} href={category.href} />}
          {gnbItems && gnbItems.length > 0 && (
            <div className={GNB} data-slot="gnb">
              {gnbItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  data-active={activeKey === item.key || undefined}
                  className={GNB_ITEM}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
          {ctaButtons && ctaButtons.length > 0 && (
            <div className={CTA_GROUP} data-slot="cta-group">
              {ctaButtons.map((cta) => (
                <CtaPill key={cta.key} cta={cta} />
              ))}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
});

GenietAppBar.displayName = "GenietAppBar";
