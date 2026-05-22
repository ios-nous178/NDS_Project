import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppFooter, AppFooterTabBar } from "@nudge-eap/react";
import {
  HomeIcon,
  GenietHomeOnIcon,
  GenietRecordOnIcon,
  GenietWriteOffIcon,
  GenietBenefitOnIcon,
  GenietBenefitOffIcon,
  GenietReviewOnIcon,
  GenietReviewOffIcon,
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
 * 색상은 BottomNav cascade (--nds-footer-nav-{active,inactive}-color) 가 nav-item 의
 * `color` 로 적용되고, 각 SVG 가 currentColor 로 받으므로 따로 inject 하지 않는다.
 * Geniet 브랜드 시멘틱:
 *   - active   = #00A8AC (mint600 = --semantic-text-brand-default)
 *   - inactive = #999    (gray500 = --semantic-text-muted-default)
 */
const tabIconFor = (label: string, active?: boolean) => {
  switch (label) {
    case "홈":
      // home-off SVG 가 별도 추출되어 있지 않아 on 그래픽 재사용 (currentColor 색만 바뀜).
      return <GenietHomeOnIcon size={24} />;
    case "기록":
      return active ? <GenietRecordOnIcon size={24} /> : <GenietWriteOffIcon size={24} />;
    case "혜택":
      return active ? <GenietBenefitOnIcon size={24} /> : <GenietBenefitOffIcon size={24} />;
    case "리뷰":
      return active ? <GenietReviewOnIcon size={24} /> : <GenietReviewOffIcon size={24} />;
    case "커뮤니티":
      // community on/off 가 동일 그래픽 (Figma 단일 노드) — color 만 cascade 로 토글.
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
      activeIcon: tabIconFor(l, true),
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
      activeIcon: tabIconFor(l, true),
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
