import React from "react";
import { Header } from "../Header";
import type { HeaderMenuItemData as WebHeaderMenuItem } from "../Header";
import { NudgeEAPLogo } from "./Logo";
import type { NudgeEAPLogoVariant } from "./Logo";

/**
 * NudgeEAP 웹 헤더 (PC) — Figma 39:5751 (NudgeEAP Dev) 정합.
 *
 * 사양:
 *   - height 80, bg white, border-bottom 1px #ECECEC (neutral/200)
 *   - max-width 1200 (1920 viewport 좌우 360 margin)
 *   - 로고: 내장 vector KO+EN lockup (기본 height 32, 124×28 비율 유지)
 *   - 메뉴: 6탭 (상담하기/심리검사/심리치료/주간레터/소식/마이페이지)
 *     · h79·px20·py18, Pretendard Bold 18/26, color #111, 활성 시 primary 색 + 3px bottom
 *   - 우측 액션: 앱 다운로드(bg #F5F5F5 · 16/24 bold primary) + 로그인/로그아웃(1px primary border)
 *
 * NudgeEAPAppBar 와 분리. AppBar 는 모바일/웹뷰 전용 (Figma 20:3235), WebHeader 는 데스크톱 전용.
 */

export type NudgeEAPWebHeaderAuthState = "login" | "logout";

export interface NudgeEAPWebHeaderLogo {
  src: string;
  alt?: string;
  href?: string;
  width?: number;
  height?: number;
}

export interface NudgeEAPWebHeaderProps {
  /**
   * 로고 자산을 직접 src 로 override. 미지정 시 DS 내장 SVG NudgeEAPLogo 가 자동 박힘 —
   * 외부 컨슈머는 자산 import 없이 그냥 호출 가능 (헤더 영역 height 32 기본).
   */
  logo?: NudgeEAPWebHeaderLogo;
  /**
   * 내장 로고 variant — `logo` prop 안 줬을 때만 사용. 기본 "koen" (Symbol + KO+EN 대표 로고).
   */
  logoVariant?: NudgeEAPLogoVariant;
  /** 로고 height (px). 기본 32. */
  logoHeight?: number;
  /** 로고 href. 기본 "/". */
  logoHref?: string;
  /** 콘텐츠 max-width. 기본 1200 (Figma 39:5751 정합). */
  maxWidth?: number;
  /** GNB 6탭 (상담하기/심리검사/심리치료/주간레터/소식/마이페이지). */
  menuItems?: WebHeaderMenuItem[];
  /** 현재 활성 menu key. */
  activeKey?: string;
  /** 메뉴 클릭 핸들러. */
  onMenuItemClick?: (item: WebHeaderMenuItem, e: React.MouseEvent) => void;
  /** 앱 다운로드 버튼 노출 여부. 기본 true. */
  showAppDownload?: boolean;
  /** 앱 다운로드 링크. */
  appDownloadHref?: string;
  /** 앱 다운로드 라벨. 기본 "앱 다운로드". */
  appDownloadLabel?: string;
  /** 인증 상태. login=로그인 / logout=로그아웃 라벨 자동. */
  authState?: NudgeEAPWebHeaderAuthState;
  /** 인증 버튼 클릭 핸들러. */
  onAuthClick?: () => void;
  /** 인증 버튼 href (있으면 <a>, 없으면 <button>). */
  authHref?: string;
}

export const NudgeEAPWebHeader = React.forwardRef<HTMLElement, NudgeEAPWebHeaderProps>(
  (props, ref) => {
    const {
      logo,
      logoVariant = "koen",
      logoHeight = 32,
      logoHref = "/",
      maxWidth = 1200,
      menuItems,
      activeKey,
      onMenuItemClick,
      showAppDownload = true,
      appDownloadHref,
      appDownloadLabel = "앱 다운로드",
      authState = "login",
      onAuthClick,
      authHref,
    } = props;

    /* 로고: logo.src 가 명시되면 <img>, 아니면 SVG-based NudgeEAPLogo (선명함 보장). */
    const logoNode = logo?.src ? (
      <Header.Logo
        href={logo.href ?? logoHref}
        src={logo.src}
        alt={logo.alt ?? "NudgeEAP"}
        width={logo.width}
        height={logo.height ?? logoHeight}
        style={{ width: "auto", height: `${logo.height ?? logoHeight}px` }}
      />
    ) : (
      <Header.Logo href={logoHref}>
        <NudgeEAPLogo variant={logoVariant} size={logoHeight} />
      </Header.Logo>
    );

    return (
      <Header ref={ref} variant="web" position="static" maxWidth={maxWidth}>
        {logoNode}
        {menuItems && menuItems.length > 0 && (
          <Header.Menu
            items={menuItems}
            activeKey={activeKey}
            onItemClick={onMenuItemClick}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        )}
        <Header.Actions>
          {showAppDownload && (
            <Header.AppDownloadButton href={appDownloadHref}>
              {appDownloadLabel}
            </Header.AppDownloadButton>
          )}
          <Header.AuthButton authState={authState} href={authHref} onClick={onAuthClick} />
        </Header.Actions>
      </Header>
    );
  },
);

NudgeEAPWebHeader.displayName = "NudgeEAPWebHeader";
