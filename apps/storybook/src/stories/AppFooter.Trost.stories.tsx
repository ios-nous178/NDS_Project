import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TrostFooter, TrostBottomNav } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("trost");

const meta: Meta = {
  title: "Components/Footer",
  parameters: { layout: "fullscreen" },
  globals: { brand: "trost" },
};
export default meta;
type Story = StoryObj;

export const TrostAppDesktop: Story = {
  name: "Trost/App Desktop (surface='app' layout='desktop')",
  render: () => (
    <TrostFooter
      surface="app"
      layout="desktop"
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

export const TrostAppMobile: Story = {
  name: "Trost/App Mobile (surface='app' layout='mobile')",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <TrostFooter
        surface="app"
        layout="mobile"
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
