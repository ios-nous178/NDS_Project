import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppFooter, AppFooterTabBar } from "@nudge-eap/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("trost");

const meta: Meta = {
  title: "Brands/Trost/AppFooter",
  parameters: { layout: "fullscreen" },
  globals: { brand: "trost" },
};
export default meta;
type Story = StoryObj;

/* ─── Trost 에셋 (CDN) ─── */

const CDN = "https://assets.trost.co.kr/images/service/partner";

const appStoreLinks = [
  {
    href: "https://play.google.com/store/apps/details?id=com.humartcompany.trost",
    img: `${CDN}/footer_store_and_pc.png`,
    alt: "Google Play",
  },
  {
    href: "https://apps.apple.com/kr/app/id1036587764",
    img: `${CDN}/footer_store_ios_pc.png`,
    alt: "App Store",
  },
];

const snsLinks = [
  {
    href: "https://www.facebook.com/trostU/",
    img: `${CDN}/footer_sns_facebook_pc.png`,
    alt: "Facebook",
  },
  {
    href: "https://www.instagram.com/trost.official/",
    img: `${CDN}/footer_sns_insta_pc.png`,
    alt: "Instagram",
  },
  {
    href: "https://brunch.co.kr/@trost#articles",
    img: `${CDN}/footer_sns_brunch_pc.png`,
    alt: "Brunch",
  },
  { href: "https://pf.kakao.com/_mywEM", img: `${CDN}/footer_sns_kakao_pc.png`, alt: "KakaoTalk" },
];

/* ─── Sub-components ─── */

const AppStoreButtons = () => (
  <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
    {appStoreLinks.map((s) => (
      <a key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer">
        <img src={s.img} alt={s.alt} width={145} height={48} style={{ display: "block" }} />
      </a>
    ))}
  </div>
);

const SNSIcons = () => (
  <div style={{ display: "flex", gap: 12 }}>
    {snsLinks.map((s) => (
      <a key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer">
        <img
          src={s.img}
          alt={s.alt}
          width={40}
          height={40}
          style={{ display: "block", borderRadius: "50%" }}
        />
      </a>
    ))}
  </div>
);

/* ─── Tab icon ─── */

const TabIcon = ({ char, filled }: { char: string; filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="10"
      fill={filled ? "white" : "currentColor"}
      fontWeight="600"
    >
      {char}
    </text>
  </svg>
);

/* ─── Stories ─── */

export const DesktopFooter: Story = {
  name: "Desktop/다크 푸터 (전체)",
  render: () => (
    <AppFooter.Info
      style={
        {
          "--nds-footer-background": "#333",
          color: "#fff",
          padding: "52px 0 45px",
        } as React.CSSProperties
      }
    >
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px" }}>
        {/* 약관 링크 + 앱 다운로드 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "1px solid #555",
            paddingBottom: 24,
            marginBottom: 20,
          }}
        >
          <AppFooter.Links links={b.footer.links} />
          <AppStoreButtons />
        </div>

        {/* 회사정보 + SNS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            {b.footer.extra && <AppFooter.Extra>{b.footer.extra}</AppFooter.Extra>}
            <AppFooter.CompanyInfo
              data={b.footer.company}
              logoSrc={b.logo.footer.src}
              logoWidth={b.logo.footer.width}
              logoHeight={b.logo.footer.height}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 16,
              flexShrink: 0,
            }}
          >
            <SNSIcons />
          </div>
        </div>
      </div>
    </AppFooter.Info>
  ),
};

export const MobileFooter: Story = {
  name: "Mobile/다크 푸터",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <AppFooter.Info
        style={{ "--nds-footer-background": "#464646", color: "#ccc" } as React.CSSProperties}
      >
        <AppFooter.Links links={b.footer.links} />
        <div style={{ margin: "16px 0" }}>
          <AppStoreButtons />
        </div>
        {b.footer.extra && <AppFooter.Extra>{b.footer.extra}</AppFooter.Extra>}
        <AppFooter.CompanyInfo data={b.footer.company} />
        <div style={{ marginTop: 20 }}>
          <SNSIcons />
        </div>
      </AppFooter.Info>
    </div>
  ),
};

export const TabBar: Story = {
  name: "하단 탭바 (5탭)",
  render: () => {
    const tabs = b.tabBar.tabLabels.map((l, i) => ({
      key: `tab-${i}`,
      label: l,
      href: "#",
      icon: <TabIcon char={l[0]} />,
      activeIcon: <TabIcon char={l[0]} filled />,
    }));
    return (
      <div style={{ height: 120, background: "#f9f9f9", display: "flex", alignItems: "flex-end" }}>
        <AppFooterTabBar tabs={tabs} activeTab="tab-0" style={{ position: "static" }} />
      </div>
    );
  },
};
