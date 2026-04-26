import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppFooter, AppFooterTabBar } from "@nudge-eap/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("geniet");

const meta: Meta = {
  title: "Brands/Geniet/AppFooter",
  parameters: { layout: "fullscreen" },
  globals: { brand: "geniet" },
};
export default meta;
type Story = StoryObj;

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

export const InfoFooter: Story = {
  name: "커머스 고지 푸터",
  render: () => (
    <AppFooter.Info>
      <AppFooter.Links links={b.footer.links} />
      {b.footer.extra && <AppFooter.Extra>{b.footer.extra}</AppFooter.Extra>}
      <AppFooter.CompanyInfo
        data={b.footer.company}
        logoSrc={b.logo.footer.src}
        logoWidth={b.logo.footer.width}
        logoHeight={b.logo.footer.height}
      />
    </AppFooter.Info>
  ),
};

export const TabBar: Story = {
  name: "하단 탭바 (4탭, 그림자)",
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
        <AppFooterTabBar
          tabs={tabs}
          activeTab="tab-0"
          style={{
            position: "static",
            borderTop: "none",
            boxShadow: "0 -2px 10px 0 rgba(17,17,17,0.05)",
          }}
        />
      </div>
    );
  },
};
