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

const wrap: React.CSSProperties = {
  height: 120,
  background: "#f9f9f9",
  display: "flex",
  alignItems: "flex-end",
  width: 375,
  margin: "0 auto",
};

function NudgeEAPTabBarDemo() {
  const tabs = b.tabBar.tabLabels.map((l, i) => ({ key: `tab-${i}`, label: l, href: "#" }));
  const [active, setActive] = React.useState("tab-0");
  return (
    <div style={wrap}>
      <NudgeEAPBottomNav
        tabs={tabs}
        activeTab={active}
        position="static"
        onTabClick={(tab, e) => {
          e.preventDefault();
          setActive(tab.key);
        }}
      />
    </div>
  );
}

/**
 * 5탭 (홈/챌린지/상담/멘탈케어/내 공간, Figma 20:3331). 탭을 클릭하면 해당 탭이 활성화됩니다.
 */
export const NudgeEAPTabBar: Story = {
  name: "NudgeEAP (5탭)",
  render: () => <NudgeEAPTabBarDemo />,
};
