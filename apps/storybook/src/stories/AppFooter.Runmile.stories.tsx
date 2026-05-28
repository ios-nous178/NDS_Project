import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RunmileBottomNav, RunmileFooter } from "@nudge-design/react";
import { BRAND_LOGOS } from "@nudge-design/assets";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("runmile");
const RUNMILE_LOGO = BRAND_LOGOS.runmile?.muted?.dataUri ?? "";

const meta: Meta = {
  title: "Components/Footer",
  parameters: { layout: "fullscreen" },
  globals: { brand: "runmile" },
};
export default meta;
type Story = StoryObj;

const company = {
  representatives: "송승근, 박정신",
  name: "㈜넛지헬스케어주식회사",
  bizNumber: "849-88-00418",
  address: "서울특별시 강남구 역삼로1길8 넛지캠퍼스 빌딩",
};

const COPYRIGHT = "© 2025 by CashWalk Inc. All Rights Reserved";
const CONTACT_EMAIL = "cs@cashwalk.io";

/**
 * Figma 22:80 — PC 1440×180. gray200 bg.
 */
export const RunmileFooterPc: Story = {
  name: "Runmile/푸터 PC (Figma 22:80)",
  parameters: {
    viewport: { defaultViewport: "responsive" },
  },
  render: () => (
    <RunmileFooter
      layout="desktop"
      company={company}
      contactEmail={CONTACT_EMAIL}
      copyright={COPYRIGHT}
      logo={{ src: RUNMILE_LOGO, width: 142, height: 32 }}
    />
  ),
};

/**
 * Figma 43:846 — Mobile 360×265. 회사 정보 wrap, 로고 좌측 하단.
 */
export const RunmileFooterMobile: Story = {
  name: "Runmile/푸터 Mobile (Figma 43:846)",
  render: () => (
    <div style={{ width: 360, margin: "0 auto" }}>
      <RunmileFooter
        layout="mobile"
        company={company}
        contactEmail={CONTACT_EMAIL}
        copyright={COPYRIGHT}
        logo={{ src: RUNMILE_LOGO, width: 130, height: 29 }}
      />
    </div>
  ),
};

/**
 * Figma 83:887 — 4탭 (홈/대회정보/커뮤니티/마이페이지).
 * active = black filled icon · gray600 inactive · label Pretendard Medium 12/16.
 */
export const RunmileTabBar: Story = {
  name: "Runmile/하단 탭바 (4탭, Figma 83:887)",
  render: () => {
    const tabs = b.tabBar.tabLabels.map((l, i) => ({
      key: `tab-${i}`,
      label: l,
      href: "#",
    }));
    return (
      <div
        style={{
          height: 120,
          background: "#f9fafb",
          display: "flex",
          alignItems: "flex-end",
          width: 375,
          margin: "0 auto",
        }}
      >
        <RunmileBottomNav tabs={tabs} activeTab="tab-0" position="static" />
      </div>
    );
  },
};

export const RunmileTabBarFlagActive: Story = {
  name: "Runmile/하단 탭바 — 대회정보 활성",
  render: () => {
    const tabs = b.tabBar.tabLabels.map((l, i) => ({
      key: `tab-${i}`,
      label: l,
      href: "#",
    }));
    return (
      <div
        style={{
          height: 120,
          background: "#f9fafb",
          display: "flex",
          alignItems: "flex-end",
          width: 375,
          margin: "0 auto",
        }}
      >
        <RunmileBottomNav tabs={tabs} activeTab="tab-1" position="static" />
      </div>
    );
  },
};

export const RunmileTabBarMyPageActive: Story = {
  name: "Runmile/하단 탭바 — 마이페이지 활성",
  render: () => {
    const tabs = b.tabBar.tabLabels.map((l, i) => ({
      key: `tab-${i}`,
      label: l,
      href: "#",
    }));
    return (
      <div
        style={{
          height: 120,
          background: "#f9fafb",
          display: "flex",
          alignItems: "flex-end",
          width: 375,
          margin: "0 auto",
        }}
      >
        <RunmileBottomNav tabs={tabs} activeTab="tab-3" position="static" />
      </div>
    );
  },
};
