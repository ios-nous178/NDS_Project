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

function GenietTabBarDemo() {
  const tabs = b.tabBar.tabLabels.map((l, i) => ({ key: `tab-${i}`, label: l, href: "#" }));
  const [active, setActive] = React.useState("tab-0");
  return (
    <div style={wrap}>
      <GenietBottomNav
        tabs={tabs}
        activeTab={active}
        position="static"
        shadow={false}
        onTabClick={(tab, e) => {
          e.preventDefault();
          setActive(tab.key);
        }}
      />
    </div>
  );
}

/**
 * Figma 90:2 — 5탭. 탭을 클릭하면 해당 탭이 활성화됩니다.
 */
export const GenietTabBar: Story = {
  name: "Geniet (5탭, Figma 90:2)",
  render: () => <GenietTabBarDemo />,
};
