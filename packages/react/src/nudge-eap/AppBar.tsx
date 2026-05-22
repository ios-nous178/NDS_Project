import React from "react";
import { AppBar } from "../AppBar";
import type { AppBarGNBItem, AppBarAuthMenuItem } from "../AppBar";
import { koenLogoData } from "./assets/nudge-eap";

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
      <AppBar
        ref={ref}
        variant="webview"
        position="static"
        title={webviewTitle}
        leftSlot={<AppBar.BackButton onClick={onBack} />}
        style={{ "--nds-app-bar-height": `${mobileHeight}px` } as React.CSSProperties}
      />
    );
  }

  if (variant === "mobile") {
    const mobileLogo = logo ?? { src: koenLogoData, alt: "NudgeEAP", href: "/", height: 28 };
    return (
      <AppBar
        ref={ref}
        position="static"
        style={{ "--nds-app-bar-height": `${mobileHeight}px` } as React.CSSProperties}
      >
        <AppBar.MainBar>
          <AppBar.Logo
            src={mobileLogo.src}
            alt={mobileLogo.alt ?? "NudgeEAP"}
            href={mobileLogo.href ?? "/"}
            style={{ height: mobileLogo.height ?? 28, width: "auto" }}
          />
          {authItems && authItems.length > 0 && (
            <AppBar.AuthMenu items={authItems} separator="none" />
          )}
        </AppBar.MainBar>
      </AppBar>
    );
  }

  /* desktop — 1단 헤더 (logo + GNB + auth) */
  const desktopLogo = logo ?? { src: koenLogoData, alt: "NudgeEAP", href: "/" };
  return (
    <AppBar
      ref={ref}
      position="static"
      style={
        {
          "--nds-app-bar-height": `${pcHeight}px`,
          "--nds-app-bar-border-bottom": "none",
        } as React.CSSProperties
      }
    >
      <AppBar.MainBar maxWidth={pcMaxWidth}>
        <AppBar.Logo
          src={desktopLogo.src}
          alt={desktopLogo.alt ?? "NudgeEAP"}
          href={desktopLogo.href ?? "/"}
          style={{ height: 40, width: "auto" }}
        />
        {gnbItems && gnbItems.length > 0 && <AppBar.GNB items={gnbItems} activeKey={activeKey} />}
        {authItems && authItems.length > 0 && (
          <AppBar.AuthMenu items={authItems} separator="none" />
        )}
      </AppBar.MainBar>
    </AppBar>
  );
});

NudgeEAPAppBar.displayName = "NudgeEAPAppBar";
