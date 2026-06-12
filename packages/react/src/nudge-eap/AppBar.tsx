import React from "react";
import { Header } from "../Header.js";
import type {
  HeaderMenuItemData as AppBarGNBItem,
  HeaderAuthMenuItem as AppBarAuthMenuItem,
} from "../Header.js";
import { NudgeEAPLogo } from "./Logo.js";

/**
 * NudgeEAP 상단 헤더.
 *
 * Figma SSOT (NudgeEAP Dev — mvecozaRQoGRePffskRgmh):
 *   - PC 웹 헤더: 39:5751
 *   - 앱 헤더(모바일): 20:3235
 *   - 앱 BottomNav 는 NudgeEAPBottomNav (Figma 20:3331)
 *   - 로고 가이드: 698:87 (NudgeEAP Library — MqR7O3uvBvH5tVngwzbqGH)
 *
 * 정합 작업 TODO: 위 4개 노드 기준으로 height / padding / 메뉴 폰트·간격 / 로고 사이즈
 * 실측 정합 필요. 현재는 base AppBar wrapper 형태 + 기본 height(80/52).
 */
const PC_HEIGHT_DEFAULT = 80;
const MOBILE_HEIGHT_DEFAULT = 52;

export type NudgeEAPAppBarVariant = "desktop" | "mobile" | "webview";

export interface NudgeEAPAppBarLogo {
  src: string;
  alt?: string;
  href?: string;
  width?: number;
  height?: number;
}

export interface NudgeEAPAppBarProps {
  variant?: NudgeEAPAppBarVariant;
  /** 로고 — desktop/mobile variant 에서 사용 (webview 는 불필요). */
  logo?: NudgeEAPAppBarLogo;
  pcMaxWidth?: number;
  /** 데스크톱 헤더 높이. 기본 80. */
  pcHeight?: number;
  mobileHeight?: number;
  gnbItems?: AppBarGNBItem[];
  activeKey?: string;
  authItems?: AppBarAuthMenuItem[];
  webviewTitle?: string;
  onBack?: () => void;
}

export const NudgeEAPAppBar = React.forwardRef<HTMLElement, NudgeEAPAppBarProps>((props, ref) => {
  const {
    variant = "desktop",
    logo,
    pcMaxWidth = 1200,
    pcHeight = PC_HEIGHT_DEFAULT,
    mobileHeight = MOBILE_HEIGHT_DEFAULT,
    gnbItems,
    activeKey,
    authItems,
    webviewTitle,
    onBack,
  } = props;

  if (variant === "webview") {
    return (
      <Header
        ref={ref}
        variant="webview"
        position="static"
        title={webviewTitle}
        leftSlot={<Header.BackButton onClick={onBack} />}
        style={{ "--nds-header-height": `${mobileHeight}px` } as React.CSSProperties}
      />
    );
  }

  if (variant === "mobile") {
    const mobileLogoHeight = logo?.height ?? 28;
    return (
      <Header
        ref={ref}
        variant="compact"
        position="static"
        style={{ "--nds-header-height": `${mobileHeight}px` } as React.CSSProperties}
      >
        <Header.MainBar>
          {logo?.src ? (
            <Header.Logo
              src={logo.src}
              alt={logo.alt ?? "NudgeEAP"}
              href={logo.href ?? "/"}
              style={{ height: mobileLogoHeight, width: "auto" }}
            />
          ) : (
            <Header.Logo href={logo?.href ?? "/"}>
              <NudgeEAPLogo variant="koen" size={mobileLogoHeight} alt={logo?.alt ?? "NudgeEAP"} />
            </Header.Logo>
          )}
          {authItems && authItems.length > 0 && (
            <Header.AuthMenu items={authItems} separator="none" />
          )}
        </Header.MainBar>
      </Header>
    );
  }

  /* desktop — 1단 헤더 (logo + GNB + auth)
   * Header variant="web" (3-col grid: 1fr | auto | 1fr) → 메뉴가 로고/우측 액션 너비와
   * 무관하게 항상 헤더 정중앙. 로고 미지정 시 vector NudgeEAPLogo 사용 (PNG 자산은
   * 자체 회색 배경이 있어 화이트 헤더 위에서 box artifact 가 보이는 문제 회피). */
  const logoNode = logo?.src ? (
    <Header.Logo
      src={logo.src}
      alt={logo.alt ?? "NudgeEAP"}
      href={logo.href ?? "/"}
      style={{ height: 40, width: "auto" }}
    />
  ) : (
    <Header.Logo href={logo?.href ?? "/"}>
      <NudgeEAPLogo variant="koen" size={40} alt={logo?.alt ?? "NudgeEAP"} />
    </Header.Logo>
  );
  return (
    <Header
      ref={ref}
      variant="web"
      position="static"
      maxWidth={pcMaxWidth}
      style={{ "--nds-header-height": `${pcHeight}px` } as React.CSSProperties}
    >
      {logoNode}
      {gnbItems && gnbItems.length > 0 && <Header.Menu items={gnbItems} activeKey={activeKey} />}
      {authItems && authItems.length > 0 && (
        <Header.Actions>
          <Header.AuthMenu items={authItems} separator="none" />
        </Header.Actions>
      )}
    </Header>
  );
});

NudgeEAPAppBar.displayName = "NudgeEAPAppBar";
