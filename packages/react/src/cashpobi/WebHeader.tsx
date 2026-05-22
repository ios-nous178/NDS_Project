import React from "react";
import { WebHeader } from "../WebHeader";
import type { WebHeaderMenuItem } from "../WebHeader";

/**
 * Cashpobi (캐포비 · 캐시워크 for Business) 웹 헤더.
 *
 * Figma:
 *   - PC: 380:1739 (한국 캐시워크 WEB Dev)
 *   - Mobile: 380:1119
 *   - Logo guide: 3154:550 (캐포비 Library)
 *
 * 캐포비는 *웹 전용* 브랜드 (앱 없음) — 그래서 brand chrome 슬롯 중 WebHeader / WebFooter
 * 두 개만 제공. AppBar / BottomNav 는 없다.
 *
 * 시그니처: Yellow/200 솔리드 + Neutral/900 텍스트.
 * 토큰은 brand=cashpobi 컨텍스트에서 `--semantic-primary-*` 가 자동 노란색으로 cascade.
 */

export type CashpobiWebHeaderVariant = "desktop" | "mobile";

export interface CashpobiWebHeaderLogo {
  src: string;
  alt?: string;
  href?: string;
  width?: number;
  height?: number;
}

export interface CashpobiWebHeaderActionItem {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

/**
 * 우측 노란 Pill CTA (Figma 98:1082 의 '광고 시작하기').
 * bg yellow/500 (#FFD200) · text gray/800 (#333) · Pretendard Bold 14 / 20 · 36h · radius 8.
 */
export interface CashpobiWebHeaderPrimaryCta {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface CashpobiWebHeaderProps {
  variant?: CashpobiWebHeaderVariant;
  logo: CashpobiWebHeaderLogo;
  /** 콘텐츠 max-width. 기본 1600 (캐포비 Layout/MaxContent). */
  maxWidth?: number;
  /**
   * 좌우 패딩 (px). variant 기본값:
   *   desktop = 60 (Figma 98:1082 PC GNB padding-x 60)
   *   mobile  = 16 (Figma 380:1121 Mobile GNB padding-x 16)
   * 명시하면 그 값으로 덮어씀.
   */
  paddingX?: number;
  /** GNB / 메뉴 항목. */
  menuItems?: WebHeaderMenuItem[];
  /** 현재 활성 menu key. */
  activeKey?: string;
  /** 우측 텍스트 액션 (로그인 / 가입 / 앱 다운로드 등). primaryCta 와 함께 사용 가능. */
  actions?: CashpobiWebHeaderActionItem[];
  /** 우측 노란 Pill CTA. Figma 캐포비 admin GNB(98:1082) 의 표준 우측 CTA. */
  primaryCta?: CashpobiWebHeaderPrimaryCta;
  /** 모바일 햄버거 핸들러 (mobile variant). 미지정 시 햄버거 미노출. */
  onMobileMenu?: () => void;
}

export const CashpobiWebHeader = React.forwardRef<HTMLElement, CashpobiWebHeaderProps>(
  (props, ref) => {
    const {
      variant = "desktop",
      logo,
      maxWidth = 1600,
      paddingX,
      menuItems,
      activeKey,
      actions,
      primaryCta,
      onMobileMenu,
    } = props;

    const resolvedPaddingX = paddingX ?? (variant === "mobile" ? 16 : 60);
    const containerStyle = {
      "--nds-web-header-padding-x": `${resolvedPaddingX}px`,
    } as React.CSSProperties;

    const primaryCtaStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: 36,
      padding: "0 12px",
      background: "var(--semantic-primary-default, #FFD200)",
      color: "var(--semantic-text-strong-default, #333)",
      fontFamily: "inherit",
      fontWeight: 700,
      fontSize: 14,
      lineHeight: "20px",
      borderRadius: 8,
      border: 0,
      cursor: "pointer",
      textDecoration: "none",
      whiteSpace: "nowrap",
      boxSizing: "border-box",
    };

    const renderPrimaryCta = (cta: CashpobiWebHeaderPrimaryCta) =>
      cta.href ? (
        <a href={cta.href} style={primaryCtaStyle} onClick={cta.onClick}>
          {cta.label}
        </a>
      ) : (
        <button type="button" style={primaryCtaStyle} onClick={cta.onClick}>
          {cta.label}
        </button>
      );

    if (variant === "mobile") {
      return (
        <WebHeader ref={ref} position="static" maxWidth={maxWidth} style={containerStyle}>
          <WebHeader.Logo
            href={logo.href ?? "/"}
            src={logo.src}
            alt={logo.alt ?? "Cashpobi"}
            width={logo.width}
            height={logo.height}
          />
          {onMobileMenu && (
            <WebHeader.Actions>
              <button
                type="button"
                aria-label="메뉴"
                onClick={onMobileMenu}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 8,
                  cursor: "pointer",
                  color: "var(--semantic-icon-strong-default, #111)",
                  display: "inline-flex",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6h18M3 12h18M3 18h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </WebHeader.Actions>
          )}
        </WebHeader>
      );
    }

    /* desktop */
    return (
      <WebHeader ref={ref} position="static" maxWidth={maxWidth} style={containerStyle}>
        <WebHeader.Logo
          href={logo.href ?? "/"}
          src={logo.src}
          alt={logo.alt ?? "Cashpobi"}
          width={logo.width}
          height={logo.height}
        />
        {menuItems && menuItems.length > 0 && (
          <WebHeader.Menu items={menuItems} activeKey={activeKey} />
        )}
        {((actions && actions.length > 0) || primaryCta) && (
          <WebHeader.Actions>
            {actions?.map((a) =>
              a.href ? (
                <WebHeader.AuthButton key={a.key} href={a.href} label={a.label} />
              ) : (
                <WebHeader.AuthButton key={a.key} label={a.label} onClick={a.onClick} />
              ),
            )}
            {primaryCta && renderPrimaryCta(primaryCta)}
          </WebHeader.Actions>
        )}
      </WebHeader>
    );
  },
);

CashpobiWebHeader.displayName = "CashpobiWebHeader";
