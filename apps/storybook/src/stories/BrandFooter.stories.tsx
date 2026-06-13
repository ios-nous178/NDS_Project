import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  NudgeEAPFooter,
  GenietFooter,
  TrostFooter,
  RunmileFooter,
  CashwalkBizFooter,
} from "@nudge-design/react";
import { BRAND_LOGOS } from "@nudge-design/assets";
import { getBrandFixture } from "../brand-fixtures";

/**
 * Brands/Footer — 5개 브랜드의 푸터(웹/앱·데스크톱/모바일)를 한 파일에 모은 카탈로그.
 * 브랜드마다 별도 컴포넌트(NudgeEAPFooter · GenietFooter …). 각 스토리가 `globals.brand` 로 테마를 건다.
 */

const bNudge = getBrandFixture("nudge-eap");
const bGeniet = getBrandFixture("geniet");
const bTrost = getBrandFixture("trost");

/* ─── NudgeEAP: 앱 다운로드 아이콘 (24×24, monochrome white) ─── */
function GooglePlayIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M.5 1.5C.5 1 .8.5 1.3.2L11 11 1.3 21.8C.8 21.5.5 21 .5 20.5v-19zM12 12l3.4 3.4-12.6 7.3c-.3.2-.6.2-.9.1L12 12zm0-2L2 .2c.3-.1.6 0 .9.1l12.6 7.3L12 11zm6.4 4l-2.4-1.4L13.4 11l3-3 2.4-1.4c.7.5.7 2 0 2.7L18.4 14z"
        fill="currentColor"
      />
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.2 11.7c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.4 1-4.3 2.6-1.9 3.2-.5 8 1.3 10.7.9 1.3 1.9 2.7 3.3 2.7 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.9c1.4 0 2.3-1.3 3.2-2.6.7-1 1.3-2 1.5-2.5-2-1-2-3-2-3z"
        fill="currentColor"
      />
    </svg>
  );
}
function OneStoreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="2" />
      <text x="11" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor">
        1
      </text>
    </svg>
  );
}

/* ─── Runmile: 로고(muted) + 회사 정보 ─── */
const RUNMILE_LOGO = BRAND_LOGOS.runmile?.muted?.dataUri ?? "";
const runmileCompany = {
  representatives: "송승근, 박정신",
  name: "㈜넛지헬스케어주식회사",
  bizNumber: "849-88-00418",
  address: "서울특별시 강남구 역삼로1길8 넛지캠퍼스 빌딩",
};
const RUNMILE_COPYRIGHT = "© 2025 by CashWalk Inc. All Rights Reserved";
const RUNMILE_CONTACT_EMAIL = "cs@cashwalk.io";

/* ─── CashwalkBiz ─── */
const cashwalkPlaceholderLinks = [
  { label: "이용약관", href: "#" },
  { label: "개인정보처리방침", href: "#", bold: true },
  { label: "고객센터", href: "#" },
];
const cashwalkPlaceholderCompany = {
  name: "캐시워크 주식회사",
  ceo: "박상민",
  address: "서울특별시 강남구 ...",
  bizNumber: "000-00-00000",
  email: "support@cashwalk.io",
  copyright: "© 2025 Cashwalk Inc. All Rights Reserved",
};

const meta: Meta = {
  title: "Brands/Footer",
  // 사이드바·docs 에서 숨김 — "Brands/<Brand>/개요" mdx 의 <Canvas> 로 본다.
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

/* ═══════════════════ NudgeEAP ═══════════════════ */

export const NudgeEAPApp: Story = {
  name: "NudgeEAP/Mobile",
  globals: { brand: "nudge-eap" },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <NudgeEAPFooter
        surface="app"
        links={bNudge.footer.links}
        company={bNudge.footer.company}
        logo={{
          src: bNudge.logo.footer.src,
          width: bNudge.logo.footer.width,
          height: bNudge.logo.footer.height,
        }}
      />
    </div>
  ),
};

export const NudgeEAPWeb: Story = {
  name: "NudgeEAP/Desktop",
  globals: { brand: "nudge-eap" },
  parameters: {
    docs: {
      description: {
        story:
          "Figma 20:13799 정합 — bg #FAFAFA · max-width 1200 · 약관 4개(개인정보 처리방침 bold 강조) · 우상단 앱다운로드 원형 3개 · 회사정보 · ISO/IEC 27001 인증 · DAIN 자회사 로고.",
      },
    },
  },
  render: () => (
    <NudgeEAPFooter
      surface="web"
      links={[
        { label: "고객센터", href: "#" },
        { label: "개인정보 처리방침", href: "#", bold: true },
        { label: "서비스 이용약관", href: "#" },
        { label: "위치기반 서비스 이용약관", href: "#" },
      ]}
      company={{
        address: bNudge.footer.company.address,
        bizNumber: bNudge.footer.company.bizNumber,
        phone: bNudge.footer.company.phone,
        fax: "02-2268-5955",
        email: bNudge.footer.company.email,
        copyright: bNudge.footer.company.copyright,
      }}
      poweredBy="powered by Cashwalk"
      appDownloads={[
        { key: "google", href: "#", ariaLabel: "Google Play", icon: <GooglePlayIcon /> },
        { key: "apple", href: "#", ariaLabel: "App Store", icon: <AppleIcon /> },
        { key: "onestore", href: "#", ariaLabel: "OneStore", icon: <OneStoreIcon /> },
      ]}
    />
  ),
};

/* ═══════════════════ Geniet ═══════════════════ */

export const GenietInfoFooter: Story = {
  name: "Geniet/Mobile",
  globals: { brand: "geniet" },
  render: () => (
    <GenietFooter
      links={bGeniet.footer.links}
      company={bGeniet.footer.company}
      extra={bGeniet.footer.extra}
      logo={{
        src: bGeniet.logo.footer.src,
        width: bGeniet.logo.footer.width,
        height: bGeniet.logo.footer.height,
      }}
    />
  ),
};

/* ═══════════════════ Trost ═══════════════════ */

export const TrostWeb: Story = {
  name: "Trost/Desktop",
  globals: { brand: "trost" },
  parameters: {
    docs: {
      description: {
        story:
          "Trost 데스크톱 다크 푸터. SNS / 앱 다운로드 / 회사 정보 / 약관 링크 슬롯을 prop 으로 받습니다. width >= 1024 에서만 노출됩니다.",
      },
    },
  },
  render: () => <TrostFooter surface="web" />,
};

export const TrostAppDesktop: Story = {
  name: "Trost/Desktop (앱 레이아웃)",
  globals: { brand: "trost" },
  render: () => (
    <TrostFooter
      surface="app"
      layout="desktop"
      links={bTrost.footer.links}
      company={bTrost.footer.company}
      extra={bTrost.footer.extra}
      logo={{
        src: bTrost.logo.footer.src,
        width: bTrost.logo.footer.width,
        height: bTrost.logo.footer.height,
      }}
    />
  ),
};

export const TrostAppMobile: Story = {
  name: "Trost/Mobile",
  globals: { brand: "trost" },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <TrostFooter
        surface="app"
        layout="mobile"
        links={bTrost.footer.links}
        company={bTrost.footer.company}
        extra={bTrost.footer.extra}
      />
    </div>
  ),
};

/* ═══════════════════ Runmile ═══════════════════ */

/** Figma 22:80 — PC 1440×180. gray200 bg. */
export const RunmileFooterPc: Story = {
  name: "Runmile/Desktop",
  globals: { brand: "runmile" },
  parameters: {
    viewport: { defaultViewport: "responsive" },
  },
  render: () => (
    <RunmileFooter
      layout="desktop"
      company={runmileCompany}
      contactEmail={RUNMILE_CONTACT_EMAIL}
      copyright={RUNMILE_COPYRIGHT}
      logo={{ src: RUNMILE_LOGO, width: 142, height: 32 }}
    />
  ),
};

/** Figma 43:846 — Mobile 360×265. 회사 정보 wrap, 로고 좌측 하단. */
export const RunmileFooterMobile: Story = {
  name: "Runmile/Mobile",
  globals: { brand: "runmile" },
  render: () => (
    <div style={{ width: 360, margin: "0 auto" }}>
      <RunmileFooter
        layout="mobile"
        company={runmileCompany}
        contactEmail={RUNMILE_CONTACT_EMAIL}
        copyright={RUNMILE_COPYRIGHT}
        logo={{ src: RUNMILE_LOGO, width: 130, height: 29 }}
      />
    </div>
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
          "Figma 380:2208 (한국 캐시워크 WEB Dev). 캐포비는 dark 푸터 아닌 light 패턴 — Neutral 톤 + 캐포비 시그니처는 헤더에서만. surface='web' 만 지원 (App 없음).",
      },
    },
  },
  render: () => (
    <CashwalkBizFooter
      layout="desktop"
      links={cashwalkPlaceholderLinks}
      company={cashwalkPlaceholderCompany}
      maxWidth={1600}
    />
  ),
};

export const CashwalkBizMobile: Story = {
  name: "CashwalkBiz/Mobile",
  globals: { brand: "cashwalk-biz" },
  parameters: {
    docs: { story: "Figma 98:1267 — mobile light 푸터." },
  },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <CashwalkBizFooter
        layout="mobile"
        links={cashwalkPlaceholderLinks}
        company={cashwalkPlaceholderCompany}
      />
    </div>
  ),
};
