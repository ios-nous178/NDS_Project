import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  NudgeEAPAppBar,
  NudgeEAPWebHeader,
  GenietAppBar,
  TrostAppBar,
  TrostWebHeader,
  TrostEAPBanner,
  TrostUtilityHeader,
  TrostSearchForm,
  TrostLoginSection,
  TrostAppDownloadButton,
  TrostTabNavigation,
  RunmileAppBar,
  RunmileWebHeader,
  CashwalkBizWebHeader,
} from "@nudge-design/react";
import type { GenietAppBarAction, GenietAppBarCta } from "@nudge-design/react";
import {
  GenietCouponIcon,
  GenietMypageIcon,
  GenietLoginIcon,
  GenietCashreviewIcon,
  GenietConfettiIcon,
  RunmileCalendarIcon,
  RunmileSearchIcon,
  RunmileCloseIcon,
} from "@nudge-design/icons";
import { getBrandLogo, BRAND_LOGOS } from "@nudge-design/assets";
import { getBrandFixture } from "../brand-fixtures";
import { DesktopPreview } from "../desktop-preview";

/**
 * Brands/Header — 5개 브랜드의 헤더(웹/모바일/웹뷰)를 한 파일에 모은 카탈로그.
 * 브랜드마다 별도 컴포넌트(NudgeEAPWebHeader · GenietAppBar · TrostWebHeader …)라
 * 툴바 테마가 아니라 컴포넌트 자체가 다르다. 각 스토리가 `globals.brand` 로 테마를 건다.
 */

const bNudge = getBrandFixture("nudge-eap");
const bGeniet = getBrandFixture("geniet");
const bTrost = getBrandFixture("trost");
const bCashwalk = getBrandFixture("cashwalk-biz");

/* ─── Geniet: login_area action button 매핑 (auth.items key → icon) ─── */
const GENIET_ACTION_ICONS: Record<string, GenietAppBarAction["icon"]> = {
  coupon: <GenietCouponIcon size={28} />,
  mypage: <GenietMypageIcon size={28} />,
  login: <GenietLoginIcon size={28} />,
};

const genietActionButtons: GenietAppBarAction[] = bGeniet.header.auth.items.map((item, i) => ({
  key: item.key,
  label: item.label,
  icon: GENIET_ACTION_ICONS[item.key],
  /* 쿠폰상점 ↔ 마이페이지 사이에 divider — 그룹 시각 구분 */
  dividerBefore: i === 1,
  href: "#",
}));

const genietCtaButtons: GenietAppBarCta[] = [
  {
    key: "cashreview",
    label: "캐시리뷰",
    icon: <GenietCashreviewIcon size={14} />,
    tone: "outline",
    href: "#",
  },
  {
    key: "invite",
    label: "친구초대 이벤트",
    icon: <GenietConfettiIcon size={14} />,
    tone: "tinted",
    href: "#",
  },
];

/* ─── Trost: 로고 자산 + 탭 + 웹뷰 케이스 헬퍼 ─── */
// 브랜드 로고는 @nudge-design/assets SSOT 를 /assets/* 로 정적 마운트해 서빙한다
// (.storybook/main.ts staticDirs). 모듈 import 가 아니라 마운트 URL 로 참조.
const ASSET_BASE = `${import.meta.env.BASE_URL}assets/`;
const trostLogo = `${ASSET_BASE}${getBrandLogo("trost")?.filename ?? ""}`;
const nudgeEapSymbol = `${ASSET_BASE}${getBrandLogo("nudge-eap", "symbol")?.filename ?? ""}`;

const TROST_TABS = [
  { tabName: "홈", tabUrl: "/" },
  { tabName: "커뮤니티", tabUrl: "/community", isNew: true },
  { tabName: "오늘의 명언/성경", tabUrl: "/quotes" },
  { tabName: "전문 심리상담", tabUrl: "/counsel" },
  { tabName: "심리검사", tabUrl: "/test" },
  { tabName: "약물치료", tabUrl: "/medicine" },
];

const noop = () => undefined;
const WvRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ fontSize: 11, color: "#888", margin: "0 0 4px 4px" }}>{label}</div>
    <div style={{ width: 360, border: "1px solid #e5e5e5" }}>{children}</div>
  </div>
);

/* ─── Runmile: 로고 + GNB + 모바일 프레임 ─── */
const RUNMILE_LOGO = BRAND_LOGOS.runmile?.default?.dataUri ?? "";

const RUNMILE_GNB = [
  { key: "competition", label: "대회 정보", href: "/competitions" },
  { key: "community", label: "커뮤니티", href: "/community" },
];

function RunmileFrame({ children }: { children: React.ReactNode }) {
  // 다른 브랜드 모바일 스토리와 동일하게 단순 폭 제한만 둔다.
  return <div style={{ maxWidth: 360 }}>{children}</div>;
}

/* ─── CashwalkBiz ─── */
const cashwalkPlaceholderMenu = [
  { key: "channel", label: "채널", href: "/channel" },
  { key: "ad", label: "광고", href: "/ad" },
  { key: "case", label: "성공사례", href: "/case" },
  { key: "notice", label: "공지사항", href: "/notice" },
  { key: "guide", label: "이용방법", href: "/guide" },
];

const meta: Meta = {
  title: "Brands/Header",
  // 사이드바·docs 에서 숨김 — "Brands/<Brand>/개요" mdx 의 <Canvas> 로 본다.
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

/* ═══════════════════ NudgeEAP ═══════════════════ */

export const NudgeEAPWebHeaderDesktop: Story = {
  name: "NudgeEAP/Desktop",
  globals: { brand: "nudge-eap" },
  parameters: {
    docs: {
      description: {
        story:
          "Figma 39:5751 정합 — height 80, bg white, 1px #ECECEC bottom border, content max-width 1200. 로고는 698:87 (NudgeEAP Library) 의 KO+EN horizontal 대표 로고. 6탭 GNB(상담하기/심리검사/심리치료/주간레터/소식/마이페이지) + 우측 앱다운로드 + 로그인/로그아웃.",
      },
    },
  },
  render: () => (
    <DesktopPreview>
      <NudgeEAPWebHeader
        maxWidth={bNudge.header.pcMaxWidth}
        menuItems={bNudge.header.gnb.items}
        activeKey="counsel"
        showAppDownload
        appDownloadHref="#"
        authState="login"
        authHref="#"
      />
    </DesktopPreview>
  ),
};

export const NudgeEAPWebHeaderLoggedIn: Story = {
  name: "NudgeEAP/Desktop (로그인 후)",
  globals: { brand: "nudge-eap" },
  render: () => (
    <DesktopPreview>
      <NudgeEAPWebHeader
        maxWidth={bNudge.header.pcMaxWidth}
        menuItems={bNudge.header.gnb.items}
        activeKey="my"
        showAppDownload
        appDownloadHref="#"
        authState="logout"
        authHref="#"
      />
    </DesktopPreview>
  ),
};

export const NudgeEAPMobile: Story = {
  name: "NudgeEAP/Mobile",
  globals: { brand: "nudge-eap" },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <NudgeEAPAppBar
        variant="mobile"
        mobileHeight={bNudge.header.mobileHeight}
        authItems={bNudge.header.auth.items}
      />
    </div>
  ),
};

export const NudgeEAPWebview: Story = {
  name: "NudgeEAP/Webview",
  globals: { brand: "nudge-eap" },
  render: () => (
    <NudgeEAPAppBar
      variant="webview"
      webviewTitle={bNudge.header.webviewTitle}
      mobileHeight={bNudge.header.mobileHeight}
    />
  ),
};

/* ═══════════════════ Geniet ═══════════════════ */

export const GenietDesktop: Story = {
  name: "Geniet/Desktop",
  globals: { brand: "geniet" },
  parameters: {
    docs: {
      description: {
        story:
          "Geniet 데스크탑 웹 헤더. Figma 77:2 — 1920 × 172. Search Header(54h, logo + 검색 pill + NEW chip + 쿠폰상점·마이페이지·로그인 액션) + Menu Header(58h, 음식 카테고리 + GNB + 캐시리뷰/친구초대 CTA).",
      },
    },
  },
  render: () => (
    <DesktopPreview>
      <GenietAppBar
        variant="desktop"
        logo={{
          src: bGeniet.logo.headerPc.src,
          alt: "Geniet",
          href: "/",
          width: bGeniet.logo.headerPc.width,
          height: bGeniet.logo.headerPc.height,
        }}
        pcMaxWidth={bGeniet.header.pcMaxWidth}
        gnbItems={bGeniet.header.gnb.items}
        activeKey="home"
        actionButtons={genietActionButtons}
        searchPlaceholder={bGeniet.header.searchBar?.placeholder}
        searchWidth={bGeniet.header.searchBar?.width}
        trendingKeywords={bGeniet.header.trending}
        ctaButtons={genietCtaButtons}
      />
    </DesktopPreview>
  ),
};

export const GenietMobile: Story = {
  name: "Geniet/Mobile",
  globals: { brand: "geniet" },
  parameters: {
    docs: {
      description: {
        story:
          "Figma 77:2 (header/mo · 360 × 102). Row1(50h) logo + 포인트 chip + user icon · Row2(52h) hamburger + 검색 input. mobile 카피는 PC와 다름.",
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <GenietAppBar
        variant="mobile"
        logo={{
          src: bGeniet.logo.headerMobile.src,
          alt: "Geniet",
          href: "/",
          height: bGeniet.logo.headerMobile.height,
        }}
        mobileHeight={bGeniet.header.mobileHeight}
        mobileSearchPlaceholder="음식명, 칼로리, 영양성분, 음식 리뷰 검색"
        pointChip={{ amount: "34,300", href: "#" }}
      />
    </div>
  ),
};

export const GenietWebview: Story = {
  name: "Geniet/Webview",
  globals: { brand: "geniet" },
  render: () => (
    <GenietAppBar
      variant="webview"
      webviewTitle={bGeniet.header.webviewTitle}
      mobileHeight={bGeniet.header.mobileHeight}
    />
  ),
};

/* ═══════════════════ Trost ═══════════════════ */

export const TrostMobile: Story = {
  name: "Trost/Mobile",
  globals: { brand: "trost" },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <TrostAppBar
        variant="mobile"
        logo={{
          src: bTrost.logo.headerMobile.src,
          alt: "Trost",
          href: "/",
          height: bTrost.logo.headerMobile.height,
        }}
        mobileHeight={bTrost.header.mobileHeight}
        authItems={bTrost.header.auth.items}
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
export const TrostWebview: Story = {
  name: "Trost/Webview (앱바 케이스)",
  globals: { brand: "trost" },
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
  globals: { brand: "trost" },
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <TrostAppBar
        variant="mobile"
        logo={{
          src: bTrost.logo.headerMobile.src,
          alt: "Trost",
          href: "/",
          height: bTrost.logo.headerMobile.height,
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
  globals: { brand: "trost" },
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
                placeholder={bTrost.header.searchBar?.placeholder}
                onSearch={(keyword) => console.log("[trost search]", keyword)}
                width={bTrost.header.searchBar?.width}
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
  globals: { brand: "trost" },
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
                placeholder={bTrost.header.searchBar?.placeholder}
                onSearch={(keyword) => console.log("[trost search]", keyword)}
                width={bTrost.header.searchBar?.width}
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

/* ═══════════════════ Runmile ═══════════════════ */

export const RunmileTitleIcon: Story = {
  name: "Runmile/Mobile (title-icon)",
  globals: { brand: "runmile" },
  render: () => (
    <RunmileFrame>
      <RunmileAppBar variant="title-icon" title="텍스트" back={{ onClick: () => undefined }}>
        <RunmileCalendarIcon size={24} />
        <RunmileSearchIcon size={24} />
        <RunmileCloseIcon size={24} />
      </RunmileAppBar>
    </RunmileFrame>
  ),
};

export const RunmileLogo: Story = {
  name: "Runmile/Mobile (logo)",
  globals: { brand: "runmile" },
  render: () => (
    <RunmileFrame>
      <RunmileAppBar variant="logo" logo={{ src: RUNMILE_LOGO, width: 100, height: 23 }}>
        <RunmileSearchIcon size={24} />
        <RunmileCloseIcon size={24} />
      </RunmileAppBar>
    </RunmileFrame>
  ),
};

export const RunmileMenuTitle: Story = {
  name: "Runmile/Mobile (menu-title)",
  globals: { brand: "runmile" },
  render: () => (
    <RunmileFrame>
      <RunmileAppBar variant="menu-title" title="텍스트" back={{ onClick: () => undefined }}>
        <RunmileCalendarIcon size={24} />
        <RunmileSearchIcon size={24} />
        <RunmileCloseIcon size={24} />
      </RunmileAppBar>
    </RunmileFrame>
  ),
};

export const RunmileWebHeaderLoggedOut: Story = {
  name: "Runmile/Desktop",
  globals: { brand: "runmile" },
  parameters: {
    docs: {
      description: {
        story:
          "Figma 1058:13271 — 로그인 전 기본 상태. 로고 + 대회 정보/커뮤니티 GNB + 중앙 검색바 + 우측 채팅/로그인. 우측 액션은 28px 아이콘 위 14px 라벨 스택.",
      },
    },
  },
  render: () => (
    <DesktopPreview>
      <RunmileWebHeader
        logoSrc={RUNMILE_LOGO}
        menuItems={RUNMILE_GNB}
        activeKey="competition"
        loggedIn={false}
        loginHref="#"
        chatHref="#"
        onSearch={(k) => console.log("[runmile search]", k)}
      />
    </DesktopPreview>
  ),
};

export const RunmileWebHeaderLoggedIn: Story = {
  name: "Runmile/Desktop (로그인 후)",
  globals: { brand: "runmile" },
  parameters: {
    docs: {
      description: {
        story:
          "Figma 1058:13336 — 로그인 후. 채팅 아이콘 우상단 미읽음 개수 badge(coral) + 마이페이지(프로필 아바타). 미읽음 0/미지정이면 badge 숨김.",
      },
    },
  },
  render: () => (
    <DesktopPreview>
      <RunmileWebHeader
        logoSrc={RUNMILE_LOGO}
        menuItems={RUNMILE_GNB}
        activeKey="community"
        loggedIn
        chatUnreadCount={12}
        chatHref="#"
        myPageHref="#"
        onSearch={(k) => console.log("[runmile search]", k)}
      />
    </DesktopPreview>
  ),
};

/* ═══════════════════ CashwalkBiz ═══════════════════ */

export const CashwalkBizDesktop: Story = {
  name: "CashwalkBiz/Desktop",
  globals: { brand: "cashwalk-biz" },
  parameters: {
    docs: {
      description: {
        story:
          "Figma 98:1082 (한국 캐시워크 WEB Dev) — GNB 68h · cashwalk for business horizontal 로고(라이브러리 3154:550) · 메뉴 5개 (광고 활성) · 우측 노란 Pill CTA '광고 시작하기' (Yellow/500 #FFD200 + Gray/800).",
      },
    },
  },
  render: () => (
    <DesktopPreview width={1600}>
      <CashwalkBizWebHeader
        variant="desktop"
        logo={{
          src: bCashwalk.logo.headerPc.src,
          alt: "Cashwalk for Business",
          href: "/",
          width: bCashwalk.logo.headerPc.width,
          height: bCashwalk.logo.headerPc.height,
        }}
        maxWidth={bCashwalk.header.pcMaxWidth}
        menuItems={cashwalkPlaceholderMenu}
        activeKey="ad"
        primaryCta={{ label: "광고 시작하기", href: "#" }}
      />
    </DesktopPreview>
  ),
};

export const CashwalkBizMobile: Story = {
  name: "CashwalkBiz/Mobile",
  globals: { brand: "cashwalk-biz" },
  parameters: {
    docs: {
      description: { story: "Figma 380:1119 (한국 캐시워크 WEB Dev). 로고 + 햄버거." },
    },
  },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <CashwalkBizWebHeader
        variant="mobile"
        logo={{
          src: bCashwalk.logo.headerMobile.src,
          alt: "CashwalkBiz",
          href: "/",
          width: bCashwalk.logo.headerMobile.width,
          height: bCashwalk.logo.headerMobile.height,
        }}
        onMobileMenu={() => {}}
      />
    </div>
  ),
};
