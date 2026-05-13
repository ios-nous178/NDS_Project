import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppFooter, AppFooterTabBar } from "@nudge-eap/react";
import { HomeIcon, HomeActiveIcon, CommentIcon, CouponIcon, LikeIcon } from "@nudge-eap/icons";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("geniet");

const meta: Meta = {
  title: "Brands/Geniet/AppFooter",
  parameters: { layout: "fullscreen" },
  globals: { brand: "geniet" },
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
    case "커뮤니티":
      return <CommentIcon size={24} color={color} />;
    case "헬시딜":
      return <CouponIcon size={24} color={color} />;
    case "음식 리뷰":
      return <LikeIcon size={24} color={color} />;
    default:
      return <HomeIcon size={24} color={color} />;
  }
};

export const InfoFooter: Story = {
  name: "커머스 고지 푸터",
  render: () => (
    <AppFooter.Info>
      <AppFooter.Links links={b.footer.links} />
      {b.footer.extra && <AppFooter.Extra>{b.footer.extra}</AppFooter.Extra>}
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
  name: "하단 탭바 (4탭, 그림자)",
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
        <AppFooterTabBar
          tabs={tabs}
          activeTab="tab-0"
          style={{
            position: "static",
            borderTop: "none",
            boxShadow: "0 -2px 10px 0 rgba(17,17,17,0.05)",
          }}
        />
      </div>
    );
  },
};
