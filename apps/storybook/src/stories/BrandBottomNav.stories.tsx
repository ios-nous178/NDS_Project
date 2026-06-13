import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  NudgeEAPBottomNav,
  GenietBottomNav,
  TrostBottomNav,
  RunmileBottomNav,
} from "@nudge-design/react";
import type { TrostBottomNavVariant } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

/**
 * Brands/BottomNav — 4개 브랜드의 모바일 하단 탭바를 한 파일에 모은 카탈로그.
 * 브랜드마다 별도 컴포넌트. 각 스토리가 `globals.brand` 로 테마를 건다.
 * 탭을 클릭하면 해당 탭이 활성화됩니다 (활성 상태별 스토리를 따로 두지 않음).
 */

const bNudge = getBrandFixture("nudge-eap");
const bGeniet = getBrandFixture("geniet");
const bTrost = getBrandFixture("trost");
const bRunmile = getBrandFixture("runmile");

const wrap: React.CSSProperties = {
  height: 120,
  background: "#f9f9f9",
  display: "flex",
  alignItems: "flex-end",
  width: 375,
  margin: "0 auto",
};
const wrapRunmile: React.CSSProperties = { ...wrap, background: "#f9fafb" };

const meta: Meta = {
  title: "Brands/BottomNav",
  // 사이드바·docs 에서 숨김 — "Brands/<Brand>/개요" mdx 의 <Canvas> 로 본다.
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

/* ═══════════════════ NudgeEAP ═══════════════════ */

function NudgeEAPTabBarDemo() {
  const tabs = bNudge.tabBar.tabLabels.map((l, i) => ({ key: `tab-${i}`, label: l, href: "#" }));
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

/** 5탭 (홈/챌린지/상담/멘탈케어/내 공간, Figma 20:3331). */
export const NudgeEAPTabBar: Story = {
  name: "NudgeEAP (5탭)",
  globals: { brand: "nudge-eap" },
  render: () => <NudgeEAPTabBarDemo />,
};

/* ═══════════════════ Geniet ═══════════════════ */

function GenietTabBarDemo() {
  const tabs = bGeniet.tabBar.tabLabels.map((l, i) => ({ key: `tab-${i}`, label: l, href: "#" }));
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

/** Figma 90:2 — 5탭. */
export const GenietTabBar: Story = {
  name: "Geniet (5탭, Figma 90:2)",
  globals: { brand: "geniet" },
  render: () => <GenietTabBarDemo />,
};

/* ═══════════════════ Trost ═══════════════════ */

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
 */
export const TrostTabBar: Story = {
  name: "Trost 앱 (5탭)",
  globals: { brand: "trost" },
  render: () => <TrostTabBarDemo variant="trost" labels={bTrost.tabBar.tabLabels} />,
};

/**
 * (캐시워크)트로스트 앱 5탭 (홈/사운드/내음악/커뮤니티/마이페이지 — Figma 5:1249·5:1306).
 * 같은 `TrostBottomNav` 의 `variant="cashwalk-trost"`. 커뮤니티는 말풍선(TrostTalk),
 * 트로스트 앱의 게시판(TrostCommunity)과 다른 그래픽입니다.
 */
export const CashwalkTrostTabBar: Story = {
  name: "(캐시워크)트로스트 앱 (5탭)",
  globals: { brand: "trost" },
  render: () => (
    <TrostTabBarDemo
      variant="cashwalk-trost"
      labels={["홈", "사운드", "내음악", "커뮤니티", "마이페이지"]}
    />
  ),
};

/* ═══════════════════ Runmile ═══════════════════ */

/**
 * Figma 1221:64046 `bottomnavi5` — 5탭 (홈/대회정보/커뮤니티/채팅/마이페이지).
 * active = black filled icon · gray600 inactive · label Pretendard Medium 12/16.
 */
function RunmileTabBarDemo() {
  const tabs = bRunmile.tabBar.tabLabels.map((l, i) => ({ key: `tab-${i}`, label: l, href: "#" }));
  const [active, setActive] = React.useState("tab-0");
  return (
    <div style={wrapRunmile}>
      <RunmileBottomNav
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

export const RunmileTabBar: Story = {
  name: "Runmile (5탭, Figma 1221:64046)",
  globals: { brand: "runmile" },
  render: () => <RunmileTabBarDemo />,
};
