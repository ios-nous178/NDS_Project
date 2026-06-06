import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  TrostAppBar,
  TrostWebHeader,
  TrostEAPBanner,
  TrostUtilityHeader,
  TrostSearchForm,
  TrostLoginSection,
  TrostAppDownloadButton,
  TrostTabNavigation,
} from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";
import { DesktopPreview } from "../desktop-preview";

const b = getBrandFixture("trost");

// 브랜드 로고는 @nudge-design/assets SSOT 를 /brand-logos/* 로 정적 마운트해 서빙한다
// (.storybook/main.ts staticDirs). 모듈 import 가 아니라 마운트 URL 로 참조.
const trostLogo = `${import.meta.env.BASE_URL}brand-logos/trost-logo.svg`;
const nudgeEapSymbol = `${import.meta.env.BASE_URL}brand-logos/nudge-eap/nudge-eap-symbol.svg`;

const meta: Meta = {
  title: "Brands/Trost/Header",
  parameters: { layout: "fullscreen" },
  globals: { brand: "trost" },
};
export default meta;
type Story = StoryObj;

const TROST_TABS = [
  { tabName: "홈", tabUrl: "/" },
  { tabName: "커뮤니티", tabUrl: "/community", isNew: true },
  { tabName: "오늘의 명언/성경", tabUrl: "/quotes" },
  { tabName: "전문 심리상담", tabUrl: "/counsel" },
  { tabName: "심리검사", tabUrl: "/test" },
  { tabName: "약물치료", tabUrl: "/medicine" },
];

/* ─── 앱 / 모바일 (TrostAppBar) ─── */

export const TrostMobile: Story = {
  name: "Trost/Mobile",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <TrostAppBar
        variant="mobile"
        logo={{
          src: b.logo.headerMobile.src,
          alt: "Trost",
          href: "/",
          height: b.logo.headerMobile.height,
        }}
        mobileHeight={b.header.mobileHeight}
        authItems={b.header.auth.items}
      />
    </div>
  ),
};

/**
 * 앱 인-웹뷰 헤더 — 트로스트는 앱이 2종(트로스트 앱 / (캐시워크)트로스트 앱)이라
 * 케이스가 다양합니다 (Figma 5:1169 App bar).
 *
 *  · main (h56): 좌측 타이틀 20px + [설정/검색] + 알림. 홈은 로고 + 포인트 + 알림.
 *  · sub  (h44): back + 중앙 타이틀 16px + [설정/검색/텍스트/알림] 조합.
 *  · app='trost' → 쉐브론(<) back, app='cashwalk-trost' → 화살표(←) back.
 */
const noop = () => undefined;
const WvRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ fontSize: 11, color: "#888", margin: "0 0 4px 4px" }}>{label}</div>
    <div style={{ width: 360, border: "1px solid #e5e5e5" }}>{children}</div>
  </div>
);

export const TrostWebview: Story = {
  name: "Trost/Webview (앱바 케이스)",
  render: () => (
    <div style={{ padding: 16, background: "#f4f4f4" }}>
      <WvRow label="트로스트 앱 · main — 타이틀 + 설정 + 알림 (h56)">
        <TrostAppBar
          variant="webview"
          webviewLevel="main"
          webviewTitle="타이틀"
          onSettingClick={noop}
          onNotificationClick={noop}
          hasNotification
        />
      </WvRow>
      <WvRow label="트로스트 앱 · main 홈 — 로고 + 포인트 + 알림 (h56)">
        <TrostAppBar
          variant="webview"
          webviewLevel="main"
          logo={{ src: trostLogo, alt: "Trost", height: 22 }}
          pointChip={{ amount: "123,990", href: "/point" }}
          onNotificationClick={noop}
          hasNotification
        />
      </WvRow>
      <WvRow label="트로스트 앱 · main — 심리상담 + 검색 + 알림 (h56)">
        <TrostAppBar
          variant="webview"
          webviewLevel="main"
          webviewTitle="심리상담"
          onSearchClick={noop}
          onNotificationClick={noop}
        />
      </WvRow>
      <WvRow label="트로스트 앱 · sub — 뒤로(쉐브론) + 타이틀 + 설정 + 알림 (h44)">
        <TrostAppBar
          variant="webview"
          app="trost"
          webviewTitle="타이틀"
          onBack={noop}
          onSettingClick={noop}
          onNotificationClick={noop}
        />
      </WvRow>
      <WvRow label="트로스트 앱 · sub — 뒤로 + 타이틀 + 알림 (h44)">
        <TrostAppBar
          variant="webview"
          webviewTitle="타이틀"
          onBack={noop}
          onNotificationClick={noop}
        />
      </WvRow>
      <WvRow label="트로스트 앱 · sub — 뒤로 + 타이틀 (액션 없음, h44)">
        <TrostAppBar variant="webview" webviewTitle="타이틀" onBack={noop} />
      </WvRow>
      <WvRow label="트로스트 앱 · sub/text — 뒤로 + 타이틀 + 텍스트 액션 (h44)">
        <TrostAppBar
          variant="webview"
          webviewTitle="타이틀"
          onBack={noop}
          webviewActionText="완료"
          onWebviewActionText={noop}
        />
      </WvRow>
      <WvRow label="(캐시워크)트로스트 앱 · sub — 뒤로(화살표) + 타이틀 + 설정 + 알림 (h44)">
        <TrostAppBar
          variant="webview"
          app="cashwalk-trost"
          webviewTitle="타이틀"
          onBack={noop}
          onSettingClick={noop}
          onNotificationClick={noop}
        />
      </WvRow>
    </div>
  ),
};

/**
 * 홈 화면 헤더 — 2단 (로고/포인트/벨 + 검색). **앱 인-웹뷰 홈.**
 *
 * Row1: 로고 / 포인트 chip(에너지 코인 + 잔액 + P) / 알림 bell
 * Row2: 풀-width 검색 input (placeholder 카피는 Trost 홈 실측)
 */
export const TrostWebviewHome: Story = {
  name: "Trost/Webview (홈 2단)",
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <TrostAppBar
        variant="mobile"
        logo={{
          src: b.logo.headerMobile.src,
          alt: "Trost",
          href: "/",
          height: b.logo.headerMobile.height,
        }}
        pointChip={{
          amount: "123,990",
          href: "/point",
        }}
        showNotificationBell
        onNotificationClick={() => {
          /* noop */
        }}
        mobileSearchPlaceholder="심리검사, 상담, 마음챙김을 검색해보세요."
      />
    </div>
  ),
};

/* ─── 데스크톱 웹 (TrostWebHeader · 3단 컴파운드) ───
 *
 * Zeplin zpl.io/Dp775xl 정합:
 *   • Rectangle 2613 → TrostEAPBanner (상단 50px 띠, "기업 전용 멘탈케어" + "넛지EAP 이용해 보기" CTA)
 *   • Path           → TrostUtilityHeader 의 로고 슬롯 (Trost. 워드마크)
 *   • Rectangle 2522 → TrostSearchForm 의 input 배경 (yellow border, radius 9999)
 *   • TabNavigation  → 홈/커뮤니티/오늘의 명언·성경/전문 심리상담/심리검사/약물치료
 *
 * 레퍼런스 스크린샷: packages/mcp/references/trost-web-home.png
 *   (MCP 외부 노출 — get_guide({ topic: 'component:TrostWebHeader' }).references)
 */

export const TrostWebHeaderDesktop: Story = {
  name: "Trost/Desktop",
  parameters: {
    docs: {
      description: {
        story:
          "Trost 웹 데스크톱 홈 헤더. 상단 EAP 배너(Rectangle 2613) + 유틸리티 헤더(로고 Path · 검색바 Rectangle 2522 · 로그인 · 앱 다운로드) + 탭 네비게이션 3단 컴파운드. width >= 1024 에서만 노출.",
      },
    },
  },
  render: () => (
    <DesktopPreview>
      <TrostWebHeader
        banner={<TrostEAPBanner eapLogoSrc={nudgeEapSymbol} />}
        utility={
          <TrostUtilityHeader
            logoHref="/"
            logoSrc={trostLogo}
            searchSlot={
              <TrostSearchForm
                placeholder={b.header.searchBar?.placeholder}
                onSearch={(keyword) => console.log("[trost search]", keyword)}
                width={b.header.searchBar?.width}
              />
            }
            loginSlot={
              <TrostLoginSection
                user={null}
                onLoginClick={() => console.log("[trost login]")}
                onPartnerSignupClick={() => console.log("[trost partner signup]")}
                logoutHref="/logout"
              />
            }
            appDownloadSlot={<TrostAppDownloadButton />}
          />
        }
        tabs={<TrostTabNavigation tabs={TROST_TABS} currentPath="/" />}
      />
    </DesktopPreview>
  ),
};

export const TrostWebHeaderLoggedIn: Story = {
  name: "Trost/Desktop (로그인 후)",
  render: () => (
    <DesktopPreview>
      <TrostWebHeader
        banner={<TrostEAPBanner eapLogoSrc={nudgeEapSymbol} />}
        utility={
          <TrostUtilityHeader
            logoHref="/"
            logoSrc={trostLogo}
            searchSlot={
              <TrostSearchForm
                placeholder={b.header.searchBar?.placeholder}
                onSearch={(keyword) => console.log("[trost search]", keyword)}
                width={b.header.searchBar?.width}
              />
            }
            loginSlot={
              <TrostLoginSection
                user={{ name: "정민" }}
                onLoginClick={() => undefined}
                onPartnerSignupClick={() => undefined}
                logoutHref="/logout"
              />
            }
            appDownloadSlot={<TrostAppDownloadButton />}
          />
        }
        tabs={<TrostTabNavigation tabs={TROST_TABS} currentPath="/community" />}
      />
    </DesktopPreview>
  ),
};
