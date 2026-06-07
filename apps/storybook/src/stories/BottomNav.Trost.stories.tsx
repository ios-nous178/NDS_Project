import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TrostBottomNav } from "@nudge-design/react";
import type { TrostBottomNavVariant } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("trost");

const meta: Meta = {
  title: "Brands/Trost/BottomNav",
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

function TrostTabBarDemo({
  variant,
  labels,
}: {
  variant: TrostBottomNavVariant;
  labels: string[];
}) {
  const tabs = labels.map((l, i) => ({ key: `tab-${i}`, label: l, href: "#" }));
  const [active, setActive] = React.useState("tab-0");
  return (
    <div style={wrap}>
      <TrostBottomNav
        variant={variant}
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
 * 신규 트로스트 앱 5탭 (홈/심리상담/커뮤니티/멘탈케어/내공간 — Figma 5:1169).
 * 탭을 클릭하면 해당 탭이 활성화됩니다.
 */
export const TrostTabBar: Story = {
  name: "Variant/Trost 앱 (5탭)",
  render: () => <TrostTabBarDemo variant="trost" labels={b.tabBar.tabLabels} />,
};

/**
 * (캐시워크)트로스트 앱 5탭 (홈/사운드/내음악/커뮤니티/마이페이지 — Figma 5:1249·5:1306).
 * 같은 `TrostBottomNav` 의 `variant="cashwalk-trost"`. 커뮤니티는 말풍선(TrostTalk),
 * 트로스트 앱의 게시판(TrostCommunity)과 다른 그래픽입니다.
 */
export const CashwalkTrostTabBar: Story = {
  name: "Variant/(캐시워크)트로스트 앱 (5탭)",
  render: () => (
    <TrostTabBarDemo
      variant="cashwalk-trost"
      labels={["홈", "사운드", "내음악", "커뮤니티", "마이페이지"]}
    />
  ),
};
