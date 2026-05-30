import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GenietBottomNav } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("geniet");

const meta: Meta = {
  title: "Components/BottomNav",
  parameters: { layout: "fullscreen" },
  globals: { brand: "geniet" },
};
export default meta;
type Story = StoryObj;

const wrap: React.CSSProperties = {
  height: 120,
  background: "#f9f9f9",
  display: "flex",
  alignItems: "flex-end",
  width: 375,
  margin: "0 auto",
};

export const GenietTabBar: Story = {
  name: "Geniet/기본 (5탭, Figma 90:2)",
  render: () => {
    const tabs = b.tabBar.tabLabels.map((l, i) => ({ key: `tab-${i}`, label: l, href: "#" }));
    return (
      <div style={wrap}>
        <GenietBottomNav tabs={tabs} activeTab="tab-0" position="static" />
      </div>
    );
  },
};

export const GenietTabBarCommunityActive: Story = {
  name: "Geniet/커뮤니티 활성",
  render: () => {
    const tabs = b.tabBar.tabLabels.map((l, i) => ({ key: `tab-${i}`, label: l, href: "#" }));
    return (
      <div style={wrap}>
        <GenietBottomNav tabs={tabs} activeTab="tab-4" position="static" shadow={false} />
      </div>
    );
  },
};
