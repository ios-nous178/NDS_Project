import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NudgeEAPBottomNav } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("nudge-eap");

const meta: Meta = {
  title: "Components/BottomNav",
  parameters: { layout: "fullscreen" },
  globals: { brand: "nudge-eap" },
};
export default meta;
type Story = StoryObj;

export const NudgeEAPTabBar: Story = {
  name: "NudgeEAP/기본 (3탭)",
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
