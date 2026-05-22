import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TrostAppFooter, TrostBottomNav } from "@nudge-eap/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("trost");

const meta: Meta = {
  title: "Components/AppFooter",
  parameters: { layout: "fullscreen" },
  globals: { brand: "trost" },
};
export default meta;
type Story = StoryObj;

export const TrostDesktopFooter: Story = {
  name: "Trost/Desktop (다크 푸터 전체)",
  render: () => (
    <TrostAppFooter
      variant="desktop"
      links={b.footer.links}
      company={b.footer.company}
      extra={b.footer.extra}
      logo={{
        src: b.logo.footer.src,
        width: b.logo.footer.width,
        height: b.logo.footer.height,
      }}
    />
  ),
};

export const TrostMobileFooter: Story = {
  name: "Trost/Mobile (다크 푸터)",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <TrostAppFooter
        variant="mobile"
        links={b.footer.links}
        company={b.footer.company}
        extra={b.footer.extra}
      />
    </div>
  ),
};

export const TrostTabBar: Story = {
  name: "Trost/하단 탭바 (5탭)",
  render: () => {
    const tabs = b.tabBar.tabLabels.map((l, i) => ({
      key: `tab-${i}`,
      label: l,
      href: "#",
    }));
    return (
      <div style={{ height: 120, background: "#f9f9f9", display: "flex", alignItems: "flex-end" }}>
        <TrostBottomNav tabs={tabs} activeTab="tab-0" position="static" />
      </div>
    );
  },
};
