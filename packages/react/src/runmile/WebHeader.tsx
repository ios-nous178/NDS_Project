import React from "react";
import {
  RunmileChattingIcon,
  RunmileLoginIcon,
  RunmileAccountActiveIcon,
  RunmileSearchIcon,
} from "@nudge-design/icons";
import { RUNMILE_LOGO_DATA_URI } from "../brand-logo-defaults";

/**
 * Runmile PC 메인 헤더 (Figma 1058:13271 / 1058:13336 / 1059:13975).
 *
 * 사양 (Figma 실측):
 *   - height 80 (콘텐츠 52 + 상하 14), bg white, border-bottom 1px gray300 #E5E8EB
 *   - 로고 142×32 (coral) → 좌측 메뉴(대회 정보 / 커뮤니티, Bold 18/24 #221E1F, gap 36)
 *   - 중앙 검색바 430×48 — 2px coral border, rounded 100, placeholder gray600,
 *     우측 24px coral 검색 아이콘
 *   - 우측 액션(아이콘 28 위 + 라벨 14/20 #333D4B, gap 4):
 *       · 로그인 전  : 채팅 / 로그인
 *       · 로그인 후  : 채팅(미읽음 badge coral) / 마이페이지(프로필 아바타)
 *
 * 색은 전부 `data-brand="runmile"` cascade 의 --semantic-* 토큰 (컴포넌트가 hex 박지 않음,
 * fallback 만 명시). 모바일/웹뷰는 RunmileAppBar 사용 — 본 컴포넌트는 데스크톱 전용.
 */

const C_BLACK = "var(--semantic-icon-strong-default, #221E1F)";
const C_CORAL_FILL = "var(--semantic-fill-brand-default, #FF5B37)";
const C_CORAL_TEXT = "var(--semantic-text-brand-default, #FF5B37)";
const C_CORAL_ICON = "var(--semantic-icon-brand-default, #FF5B37)";
const C_LABEL = "var(--semantic-text-normal-default, #333D4B)";
const C_ICON_GRAY = "var(--semantic-icon-normal-default, #4E5968)";
const C_PLACEHOLDER = "var(--semantic-text-muted-default, #919CAA)";
const C_BORDER = "var(--semantic-border-subtle-default, #E5E8EB)";
const C_WHITE = "var(--semantic-bg-surface-default, #FFFFFF)";
const FONT =
  "var(--font-web, 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, sans-serif)";

export interface RunmileWebHeaderMenuItem {
  key: string;
  label: string;
  href?: string;
}

export interface RunmileWebHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** 로고 이미지 src (coral 워드마크 142×32). 미지정 시 base64 내장 Runmile 로고 — 파일 호스팅 불필요. */
  logoSrc?: string;
  logoAlt?: string;
  /** 로고 링크. 기본 "/". */
  logoHref?: string;
  logoWidth?: number;
  logoHeight?: number;
  /** GNB 메뉴 (대회 정보 / 커뮤니티). */
  menuItems?: RunmileWebHeaderMenuItem[];
  /** 현재 활성 menu key. */
  activeKey?: string;
  onMenuItemClick?: (item: RunmileWebHeaderMenuItem, e: React.MouseEvent) => void;
  /** 검색 placeholder. 기본 "궁금한 대회정보를 검색해 보세요". */
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  /** 로그인 상태 — true 면 우측에 채팅(+badge)/마이페이지, false 면 채팅/로그인. */
  loggedIn?: boolean;
  /** 채팅 미읽음 개수 (loggedIn 일 때만 badge 노출, 0/미지정이면 숨김). */
  chatUnreadCount?: number;
  chatHref?: string;
  onChatClick?: (e: React.MouseEvent) => void;
  loginHref?: string;
  onLoginClick?: (e: React.MouseEvent) => void;
  myPageHref?: string;
  onMyPageClick?: (e: React.MouseEvent) => void;
  /** 마이페이지 프로필 아바타 src. 미지정 시 기본 원형 인물 아이콘. */
  profileSrc?: string;
  /** 콘텐츠 max-width. 기본 1440 (Figma frame 폭). */
  maxWidth?: number;
}

interface ActionItemProps {
  label: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  badge?: number;
}

function ActionItem({ label, href, onClick, children, badge }: ActionItemProps) {
  const inner = (
    <>
      <span style={{ position: "relative", width: 28, height: 28, lineHeight: 0 }}>
        {children}
        {badge != null && badge > 0 && (
          <span
            style={{
              position: "absolute",
              top: -6,
              left: 18,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 18,
              height: 18,
              padding: "0 4px",
              borderRadius: 100,
              background: C_CORAL_FILL,
              color: "#FFFFFF",
              fontSize: 13,
              lineHeight: "18px",
              fontWeight: 700,
              boxSizing: "border-box",
            }}
          >
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span style={{ fontSize: 14, lineHeight: "20px", fontWeight: 500, color: C_LABEL }}>
        {label}
      </span>
    </>
  );
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    minWidth: 61,
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textDecoration: "none",
    fontFamily: "inherit",
  };
  return href ? (
    <a href={href} onClick={onClick} style={baseStyle} aria-label={label}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} style={baseStyle} aria-label={label}>
      {inner}
    </button>
  );
}

export const RunmileWebHeader = React.forwardRef<HTMLElement, RunmileWebHeaderProps>(
  (
    {
      logoSrc = RUNMILE_LOGO_DATA_URI,
      logoAlt = "Runmile",
      logoHref = "/",
      logoWidth = 142,
      logoHeight = 32,
      menuItems = [],
      activeKey,
      onMenuItemClick,
      searchPlaceholder = "궁금한 대회정보를 검색해 보세요",
      searchValue,
      onSearchChange,
      onSearch,
      loggedIn = false,
      chatUnreadCount,
      chatHref,
      onChatClick,
      loginHref,
      onLoginClick,
      myPageHref,
      onMyPageClick,
      profileSrc,
      maxWidth = 1440,
      style,
      ...rest
    },
    ref,
  ) => {
    const [internalSearch, setInternalSearch] = React.useState("");
    const searchVal = searchValue ?? internalSearch;

    return (
      <header
        ref={ref}
        style={{
          width: "100%",
          height: 80,
          background: C_WHITE,
          borderBottom: `1px solid ${C_BORDER}`,
          fontFamily: FONT,
          boxSizing: "border-box",
          ...style,
        }}
        {...rest}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 36,
            width: "100%",
            maxWidth,
            height: "100%",
            margin: "0 auto",
            padding: "0 80px",
            boxSizing: "border-box",
          }}
        >
          {/* 로고 */}
          <a href={logoHref} style={{ flexShrink: 0, lineHeight: 0, display: "inline-flex" }}>
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={logoAlt}
                width={logoWidth}
                height={logoHeight}
                style={{ display: "block", height: logoHeight, width: "auto" }}
              />
            ) : (
              <span style={{ fontSize: 22, fontWeight: 800, color: C_CORAL_TEXT }}>Runmile</span>
            )}
          </a>

          {/* 좌측 GNB */}
          {menuItems.length > 0 && (
            <nav style={{ display: "flex", alignItems: "center", gap: 36, flexShrink: 0 }}>
              {menuItems.map((item) => {
                const isActive = activeKey === item.key;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={
                      onMenuItemClick
                        ? (e) => {
                            if (item.href) e.preventDefault();
                            onMenuItemClick(item, e);
                          }
                        : undefined
                    }
                    style={{
                      fontSize: 18,
                      lineHeight: "24px",
                      fontWeight: 700,
                      color: isActive ? C_CORAL_TEXT : C_BLACK,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          )}

          {/* 중앙 검색바 */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              width: 430,
              height: 48,
              border: `2px solid ${C_CORAL_FILL}`,
              borderRadius: 100,
              boxSizing: "border-box",
              padding: "0 14px 0 18px",
              background: C_WHITE,
            }}
          >
            <input
              type="text"
              className="nds-runmile-webheader-input"
              value={searchVal}
              placeholder={searchPlaceholder}
              onChange={(e) => {
                setInternalSearch(e.target.value);
                onSearchChange?.(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch?.(searchVal);
              }}
              autoComplete="off"
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                background: "transparent",
                fontFamily: "inherit",
                fontSize: 15,
                lineHeight: "22px",
                color: C_BLACK,
              }}
            />
            <style>{`.nds-runmile-webheader-input::placeholder{color:${C_PLACEHOLDER};}`}</style>
            <button
              type="button"
              onClick={() => onSearch?.(searchVal)}
              aria-label="검색"
              style={{
                flexShrink: 0,
                width: 24,
                height: 24,
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: C_CORAL_ICON,
                lineHeight: 0,
                marginLeft: 8,
              }}
            >
              <RunmileSearchIcon size={24} />
            </button>
          </div>

          {/* 우측 액션 */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <ActionItem
              label="채팅"
              href={chatHref}
              onClick={onChatClick}
              badge={loggedIn ? chatUnreadCount : undefined}
            >
              <span style={{ color: C_ICON_GRAY, lineHeight: 0 }}>
                <RunmileChattingIcon size={28} />
              </span>
            </ActionItem>

            {loggedIn ? (
              <ActionItem label="마이페이지" href={myPageHref} onClick={onMyPageClick}>
                {profileSrc ? (
                  <img
                    src={profileSrc}
                    alt=""
                    width={28}
                    height={28}
                    style={{
                      display: "block",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ color: C_ICON_GRAY, lineHeight: 0 }}>
                    <RunmileAccountActiveIcon size={28} />
                  </span>
                )}
              </ActionItem>
            ) : (
              <ActionItem label="로그인" href={loginHref} onClick={onLoginClick}>
                <span style={{ color: C_ICON_GRAY, lineHeight: 0 }}>
                  <RunmileLoginIcon size={28} />
                </span>
              </ActionItem>
            )}
          </div>
        </div>
      </header>
    );
  },
);

RunmileWebHeader.displayName = "RunmileWebHeader";
