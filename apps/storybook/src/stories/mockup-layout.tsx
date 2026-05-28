/**
 * 목업 공통 레이아웃 헬퍼 — 브랜드 공통
 *
 * brand-fixtures의 데이터를 기반으로 어떤 브랜드든 동일한 API로
 * 헤더/푸터/StickyBar를 렌더링합니다.
 *
 * Usage:
 *   import { MockupLayout, useIsMobile } from "./mockup-layout";
 *
 *   <MockupLayout brand="trost" activeGnbKey="medicine" disclaimer="고지">
 *     {내용}
 *   </MockupLayout>
 */
import React, { useState } from "react";
import { Header, Footer, Button, TrendingKeywords } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

/* ═══════════════════════════════════════
   유틸
   ═══════════════════════════════════════ */

export function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false,
  );
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, [breakpoint]);
  return isMobile;
}

/* ═══════════════════════════════════════
   MockupHeader — 브랜드 공통 반응형 헤더
   single: NudgeEAP (1단 헤더)
   double: Trost, Geniet (2단 헤더 — MainBar + NavBar)
   ═══════════════════════════════════════ */

export interface MockupHeaderProps {
  brand: string;
  activeGnbKey?: string;
  /** 모바일 웹뷰 모드 */
  webview?: boolean;
  webviewTitle?: string;
  onSearch?: (value: string) => void;
}

export function MockupHeader({
  brand,
  activeGnbKey = "home",
  webview,
  webviewTitle,
  onSearch,
}: MockupHeaderProps) {
  const isMobile = useIsMobile();
  const b = getBrandFixture(brand);

  // 모바일 웹뷰
  if (isMobile && webview) {
    return (
      <Header
        variant="webview"
        position="sticky"
        title={webviewTitle || b.header.webviewTitle}
        leftSlot={<Header.BackButton onClick={() => console.log("back")} />}
        style={{ "--nds-header-height": `${b.header.mobileHeight}px` } as React.CSSProperties}
      />
    );
  }

  // 모바일 기본
  if (isMobile) {
    return (
      <Header
        variant="compact"
        position="sticky"
        style={{ "--nds-header-height": `${b.header.mobileHeight}px` } as React.CSSProperties}
      >
        <Header.MainBar>
          <Header.Logo
            src={b.logo.headerMobile.src}
            alt={brand}
            href="/"
            style={{ height: b.logo.headerMobile.height, width: "auto" }}
          />
          <Header.AuthMenu items={[b.header.auth.items[0]]} separator="none" />
        </Header.MainBar>
      </Header>
    );
  }

  // 데스크탑 — single (1단)
  if (b.header.layout === "single") {
    return (
      <Header position="sticky">
        <Header.MainBar maxWidth={b.header.pcMaxWidth}>
          <Header.Logo
            src={b.logo.headerPc.src}
            alt={brand}
            href="/"
            width={b.logo.headerPc.width}
            height={b.logo.headerPc.height}
          />
          <Header.Menu items={b.header.gnb.items} activeKey={activeGnbKey} />
          <Header.AuthMenu items={b.header.auth.items} separator={b.header.auth.separator} />
        </Header.MainBar>
      </Header>
    );
  }

  // 데스크탑 — double (2단)
  return (
    <Header
      position="sticky"
      style={
        {
          "--nds-header-height": "auto",
          "--nds-header-padding-x": "0",
          "--nds-header-border-bottom": "none",
          flexDirection: "column",
        } as React.CSSProperties
      }
    >
      <Header.MainBar
        maxWidth={b.header.pcMaxWidth}
        style={{ padding: b.header.mainBarPaddingY + " 16px" }}
      >
        <Header.Logo
          src={b.logo.headerPc.src}
          alt={brand}
          href="/"
          width={b.logo.headerPc.width}
          height={b.logo.headerPc.height}
        />
        {b.header.searchBar && (
          <Header.SearchBar
            placeholder={b.header.searchBar.placeholder}
            onSearch={onSearch}
            style={
              {
                "--nds-header-search-width": `${b.header.searchBar.width}px`,
                "--nds-header-search-height": `${b.header.searchBar.height}px`,
              } as React.CSSProperties
            }
          />
        )}
        <Header.AuthMenu
          items={b.header.auth.items}
          separator={b.header.auth.separator}
          extra={
            b.header.auth.hasAppDownload ? (
              <Button size="sm" variant="outlined-sub" style={{ marginLeft: 16 }}>
                앱 다운로드
              </Button>
            ) : undefined
          }
        />
      </Header.MainBar>
      <Header.Divider />
      <Header.NavBar
        maxWidth={b.header.pcMaxWidth}
        height={b.header.gnb.navHeight}
        style={{ justifyContent: "space-between" }}
      >
        <Header.Menu items={b.header.gnb.items} activeKey={activeGnbKey} />
        {b.header.trending && <TrendingKeywords items={b.header.trending} timestamp="09:00 기준" />}
      </Header.NavBar>
      <Header.Divider />
    </Header>
  );
}

/* ═══════════════════════════════════════
   MockupFooter — 브랜드 공통 푸터
   darkBg: true → 다크 배경 (Trost)
   darkBg: false/undefined → 기본 라이트 배경
   ═══════════════════════════════════════ */

export interface MockupFooterProps {
  brand: string;
  disclaimer?: string;
}

export function MockupFooter({ brand, disclaimer }: MockupFooterProps) {
  const isMobile = useIsMobile();
  const b = getBrandFixture(brand);
  const dark = b.footer.darkBg;

  return (
    <Footer.Info
      style={
        {
          "--nds-footer-background": dark ? "#333" : undefined,
          color: dark ? "#fff" : undefined,
          padding: isMobile ? "32px 0 28px" : "52px 0 45px",
        } as React.CSSProperties
      }
    >
      <div style={{ maxWidth: b.header.pcMaxWidth, margin: "0 auto", padding: "0 16px" }}>
        <div
          style={{
            borderBottom: `1px solid ${dark ? "#555" : "#E5E5E5"}`,
            paddingBottom: isMobile ? 16 : 24,
            marginBottom: isMobile ? 16 : 20,
          }}
        >
          <Footer.Links links={b.footer.links} />
        </div>
        <div>
          {b.footer.extra && <Footer.Extra>{b.footer.extra}</Footer.Extra>}
          <Footer.CompanyInfo
            data={b.footer.company}
            logoSrc={isMobile ? undefined : b.logo.footer.src}
            logoWidth={b.logo.footer.width}
            logoHeight={b.logo.footer.height}
          />
        </div>
        {disclaimer && (
          <Footer.Extra>
            <p
              style={{
                marginTop: isMobile ? 12 : 20,
                lineHeight: 1.6,
                color: dark ? "#888" : "#999",
                fontSize: isMobile ? 11 : undefined,
              }}
            >
              {disclaimer}
            </p>
          </Footer.Extra>
        )}
      </div>
    </Footer.Info>
  );
}

/* ═══════════════════════════════════════
   StickyBottomBar
   ═══════════════════════════════════════ */

export function StickyBottomBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#fff",
        borderTop: "1px solid #E5E5E5",
        padding: "var(--semantic-inset-input) var(--semantic-inset-card)",
        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        zIndex: 50,
        boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 768,
          margin: "0 auto",
          display: "flex",
          gap: "var(--semantic-gap-default)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Accordion — DS에 없음, 임시 구현
   ═══════════════════════════════════════ */

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-default)" }}>
      {items.map((item, i) => (
        <div key={i} style={{ border: "1px solid #E5E5E5", borderRadius: 12, overflow: "hidden" }}>
          <button
            style={{
              width: "100%",
              textAlign: "left",
              padding: "var(--semantic-inset-card) var(--semantic-inset-card-large)",
              fontWeight: 600,
              fontSize: 15,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: open === i ? "#F4F5F7" : "#fff",
              border: "none",
              cursor: "pointer",
              color: "#333",
              fontFamily: "inherit",
              transition: "background 0.2s",
            }}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{item.question}</span>
            <span
              style={{
                color: "#999",
                fontSize: 18,
                transform: open === i ? "rotate(45deg)" : "none",
                transition: "transform 0.2s",
              }}
            >
              +
            </span>
          </button>
          {open === i && (
            <div
              style={{
                padding: "0 var(--semantic-inset-card-large) var(--semantic-inset-card)",
                color: "#606060",
                fontSize: 14,
                lineHeight: 1.7,
                background: "#F4F5F7",
              }}
            >
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   MockupLayout — 전체 페이지 래퍼
   ═══════════════════════════════════════ */

export interface MockupLayoutProps {
  children: React.ReactNode;
  /** 브랜드 키 ("trost" | "geniet" | "nudge-eap") */
  brand: string;
  /** GNB 활성 키 */
  activeGnbKey?: string;
  /** 모바일 웹뷰 모드 */
  webview?: boolean;
  webviewTitle?: string;
  /** AppBar 검색 콜백 */
  onSearch?: (value: string) => void;
  /** 푸터 면책 고지 */
  disclaimer?: string;
  /** 하단 고정 CTA */
  stickyBottom?: React.ReactNode;
}

export function MockupLayout({
  children,
  brand,
  activeGnbKey = "home",
  webview,
  webviewTitle,
  onSearch,
  disclaimer,
  stickyBottom,
}: MockupLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily:
          "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, sans-serif",
        paddingBottom: stickyBottom ? 80 : 0,
      }}
    >
      <MockupHeader
        brand={brand}
        activeGnbKey={activeGnbKey}
        webview={webview}
        webviewTitle={webviewTitle}
        onSearch={onSearch}
      />
      {children}
      <MockupFooter brand={brand} disclaimer={disclaimer} />
      {stickyBottom && <StickyBottomBar>{stickyBottom}</StickyBottomBar>}
    </div>
  );
}
