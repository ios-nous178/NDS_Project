import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NudgeEAPFooter, NudgeEAPBottomNav } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("nudge-eap");

const meta: Meta = {
  title: "Components/Footer",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const NudgeEAPApp: Story = {
  name: "NudgeEAP/회사정보 푸터 (surface='app')",
  render: () => (
    <NudgeEAPFooter
      surface="app"
      links={b.footer.links}
      company={b.footer.company}
      logo={{
        src: b.logo.footer.src,
        width: b.logo.footer.width,
        height: b.logo.footer.height,
      }}
    />
  ),
};

export const NudgeEAPTabBar: Story = {
  name: "NudgeEAP/하단 탭바 (3탭)",
  render: () => {
    const tabs = b.tabBar.tabLabels.map((l, i) => ({
      key: `tab-${i}`,
      label: l,
      href: "#",
    }));
    return (
      <div style={{ height: 120, background: "#f9f9f9", display: "flex", alignItems: "flex-end" }}>
        <NudgeEAPBottomNav tabs={tabs} activeTab="tab-0" position="static" />
      </div>
    );
  },
};
