import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppFooter, AppFooterTabBar } from "@nudge-eap/react";
import {
  HomeIcon,
  GenietHomeIcon,
  GenietRecordIcon,
  GenietBenefitIcon,
  GenietReviewIcon,
  GenietCommunityIcon,
} from "@nudge-eap/icons";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("geniet");

const meta: Meta = {
  title: "Brands/Geniet/AppFooter",
  parameters: { layout: "fullscreen" },
  globals: { brand: "geniet" },
};
export default meta;
type Story = StoryObj;

/**
 * Geniet 브랜드 탭 아이콘 매핑 — Figma 90:2 (BottomNav Guide, app(geniet) 5탭).
 *
 * 정책: 단일 그래픽 + color cascade. 모든 아이콘이 currentColor 로 정제돼 있어,
 * BottomNav cascade (--nds-footer-nav-{active,inactive}-color) 가 nav-item `color` 로
 * 적용되고 SVG 가 그대로 따라간다. 별도 -on/-off 매핑 불필요.
 *
 * Geniet 시멘틱:
 *   - active   = #00A8AC (mint600 = --semantic-text-brand-default)
 *   - inactive = #999    (gray500 = --semantic-text-muted-default)
 */
const tabIconFor = (label: string) => {
  switch (label) {
    case "홈":
      return <GenietHomeIcon size={24} />;
    case "기록":
      return <GenietRecordIcon size={24} />;
    case "혜택":
      return <GenietBenefitIcon size={24} />;
    case "리뷰":
      return <GenietReviewIcon size={24} />;
    case "커뮤니티":
      return <GenietCommunityIcon size={24} />;
    default:
      return <HomeIcon size={24} />;
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
  name: "하단 탭바 (5탭, Figma 90:2)",
  render: () => {
    const tabs = b.tabBar.tabLabels.map((l, i) => ({
      key: `tab-${i}`,
      label: l,
      href: "#",
      icon: tabIconFor(l),
      activeIcon: tabIconFor(l),
    }));
    return (
      <div
        style={{
          height: 120,
          background: "#f9f9f9",
          display: "flex",
          alignItems: "flex-end",
          width: 375,
          margin: "0 auto",
        }}
      >
        <AppFooterTabBar
          tabs={tabs}
          activeTab="tab-0"
          style={{
            position: "static",
            boxShadow: "0 -2px 10px 0 rgba(17,17,17,0.05)",
          }}
        />
      </div>
    );
  },
};

export const TabBarCommunityActive: Story = {
  name: "하단 탭바 — 커뮤니티 활성",
  render: () => {
    const tabs = b.tabBar.tabLabels.map((l, i) => ({
      key: `tab-${i}`,
      label: l,
      href: "#",
      icon: tabIconFor(l),
      activeIcon: tabIconFor(l),
    }));
    return (
      <div
        style={{
          height: 120,
          background: "#f9f9f9",
          display: "flex",
          alignItems: "flex-end",
          width: 375,
          margin: "0 auto",
        }}
      >
        <AppFooterTabBar tabs={tabs} activeTab="tab-4" style={{ position: "static" }} />
      </div>
    );
  },
};
