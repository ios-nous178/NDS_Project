import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RunmileBottomNav } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("runmile");

const meta: Meta = {
  title: "Brands/Runmile/BottomNav",
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
 *
 * 탭을 클릭하면 해당 탭이 활성화됩니다 (활성 상태별 스토리를 따로 두지 않음).
 */
function RunmileTabBarDemo() {
  const [active, setActive] = React.useState("tab-0");
  return (
    <div style={wrap}>
      <RunmileBottomNav
        tabs={makeTabs()}
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

export const RunmileTabBar: Story = {
  name: "Variant/Runmile (5탭, Figma 1221:64046)",
  render: () => <RunmileTabBarDemo />,
};
