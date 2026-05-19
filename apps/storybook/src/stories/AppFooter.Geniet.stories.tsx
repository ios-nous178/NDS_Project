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

// Figma 207:3204 (platform=app(geniet))
//   active   = #000000 (text-strong)
//   inactive = #999999 (gray-600 → semantic-text-disabled)
// DS 토큰으로 매핑.
const TAB_ICON_COLOR = "var(--semantic-icon-disabled-default, #999999)";
const TAB_ICON_ACTIVE_COLOR = "var(--semantic-icon-strong-default, #111111)";

/**
 * Geniet 브랜드 탭 아이콘 매핑 — Figma 지니어트-Dev 207:3204 (bottomnavi platform=app(geniet)).
 * 모든 아이콘이 Geniet 디자인 라이브러리에서 추출한 brand prefix 아이콘.
 * (DS 컴포넌트에 brand 분기 박지 않고, 사용처에서 명시적으로 icon prop 으로 전달.)
 */
const tabIconFor = (label: string, active?: boolean) => {
  const color = active ? TAB_ICON_ACTIVE_COLOR : TAB_ICON_COLOR;
  switch (label) {
    case "홈":
      return active ? (
        <GenietHomeOnIcon size={24} color={color} />
      ) : (
        <HomeIcon size={24} color={color} />
      );
    case "기록":
      // active: GenietHomePage 추출본(검정 연필 fill), inactive: Figma 추출본(회색 outline)
      return active ? (
        <GenietRecordOnIcon size={24} color={color} />
      ) : (
        <GenietWriteOffIcon size={24} color={color} />
      );
    case "혜택":
      return active ? (
        <GenietBenefitOnIcon size={24} color={color} />
      ) : (
        <GenietBenefitOffIcon size={24} color={color} />
      );
    case "리뷰":
      return active ? (
        <GenietReviewOnIcon size={24} color={color} />
      ) : (
        <GenietReviewOffIcon size={24} color={color} />
      );
    case "커뮤니티":
      return <GenietCommunityIcon size={24} color={color} />;
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
