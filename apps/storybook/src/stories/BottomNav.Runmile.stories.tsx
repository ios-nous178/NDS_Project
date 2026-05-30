import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RunmileBottomNav } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("runmile");

const meta: Meta = {
  title: "Components/BottomNav",
  parameters: { layout: "fullscreen" },
  globals: { brand: "runmile" },
};
export default meta;
type Story = StoryObj;

const wrap: React.CSSProperties = {
  height: 120,
  background: "#f9fafb",
  display: "flex",
  alignItems: "flex-end",
  width: 375,
  margin: "0 auto",
};

const makeTabs = () => b.tabBar.tabLabels.map((l, i) => ({ key: `tab-${i}`, label: l, href: "#" }));

/**
 * Figma 1221:64046 `bottomnavi5` — 5탭 (홈/대회정보/커뮤니티/채팅/마이페이지).
 * 4탭(83:887) → 5탭 업데이트: 채팅 신설, 커뮤니티=2인 그룹, 마이페이지=원형 인물 아이콘.
 * active = black filled icon · gray600 inactive · label Pretendard Medium 12/16.
 */
export const RunmileTabBar: Story = {
  name: "Runmile/기본 (5탭, Figma 1221:64046)",
  render: () => (
    <div style={wrap}>
      <RunmileBottomNav tabs={makeTabs()} activeTab="tab-0" position="static" />
    </div>
  ),
};

export const RunmileTabBarFlagActive: Story = {
  name: "Runmile/대회정보 활성",
  render: () => (
    <div style={wrap}>
      <RunmileBottomNav tabs={makeTabs()} activeTab="tab-1" position="static" />
    </div>
  ),
};

export const RunmileTabBarChatActive: Story = {
  name: "Runmile/채팅 활성",
  render: () => (
    <div style={wrap}>
      <RunmileBottomNav tabs={makeTabs()} activeTab="tab-3" position="static" />
    </div>
  ),
};

export const RunmileTabBarMyPageActive: Story = {
  name: "Runmile/마이페이지 활성",
  render: () => (
    <div style={wrap}>
      <RunmileBottomNav tabs={makeTabs()} activeTab="tab-4" position="static" />
    </div>
  ),
};
