import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppFooter, AppFooterTabBar } from "@nudge-eap/react";
import {
  HomeIcon,
  HomeActiveIcon,
  CouponIcon,
  MypageIcon,
  MypageActiveIcon,
} from "@nudge-eap/icons";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("nudge-eap");

const meta: Meta = {
  title: "Brands/NudgeEAP/AppFooter",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const TAB_ICON_COLOR = "var(--semantic-icon-normal-default)";
const TAB_ICON_ACTIVE_COLOR = "var(--semantic-icon-brand-default)";

const tabIconFor = (label: string, active?: boolean) => {
  const color = active ? TAB_ICON_ACTIVE_COLOR : TAB_ICON_COLOR;
  switch (label) {
    case "홈":
      return active ? (
        <HomeActiveIcon size={24} color={color} />
      ) : (
        <HomeIcon size={24} color={color} />
      );
    case "심리샵":
      return <CouponIcon size={24} color={color} />;
    case "마이":
      return active ? (
        <MypageActiveIcon size={24} color={color} />
      ) : (
        <MypageIcon size={24} color={color} />
      );
    default:
      return <HomeIcon size={24} color={color} />;
  }
};

export const InfoFooter: Story = {
  name: "회사정보 푸터",
  render: () => (
    <AppFooter.Info>
      <AppFooter.Links links={b.footer.links} />
      <AppFooter.CompanyInfo
        data={b.footer.company}
        logoSrc={b.logo.footer.src}
        logoWidth={b.logo.footer.width}
        logoHeight={b.logo.footer.height}
      />
    </AppFooter.Info>
  ),
};

export const TabBar: Story = {
  name: "하단 탭바 (3탭)",
  render: () => {
    const tabs = b.tabBar.tabLabels.map((l, i) => ({
      key: `tab-${i}`,
      label: l,
      href: "#",
      icon: tabIconFor(l),
      activeIcon: tabIconFor(l, true),
    }));
    return (
      <div style={{ height: 120, background: "#f9f9f9", display: "flex", alignItems: "flex-end" }}>
        <AppFooterTabBar tabs={tabs} activeTab="tab-0" style={{ position: "static" }} />
      </div>
    );
  },
};
