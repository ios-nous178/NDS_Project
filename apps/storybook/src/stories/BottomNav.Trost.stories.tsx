import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TrostBottomNav } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("trost");

const meta: Meta = {
  title: "Components/BottomNav",
  parameters: { layout: "fullscreen" },
  globals: { brand: "trost" },
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

function TrostTabBarDemo() {
  const tabs = b.tabBar.tabLabels.map((l, i) => ({ key: `tab-${i}`, label: l, href: "#" }));
  const [active, setActive] = React.useState("tab-0");
  return (
    <div style={wrap}>
      <TrostBottomNav
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
 * 5탭. 탭을 클릭하면 해당 탭이 활성화됩니다.
 */
export const TrostTabBar: Story = {
  name: "Trost (5탭)",
  render: () => <TrostTabBarDemo />,
};
