import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GenietFooter, GenietBottomNav } from "@nudge-eap/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("geniet");

const meta: Meta = {
  title: "Components/Footer",
  parameters: { layout: "fullscreen" },
  globals: { brand: "geniet" },
};
export default meta;
type Story = StoryObj;

export const GenietInfoFooter: Story = {
  name: "Geniet/커머스 고지 푸터 (surface='app')",
  render: () => (
    <GenietFooter
      links={b.footer.links}
      company={b.footer.company}
      extra={b.footer.extra}
      logo={{
        src: b.logo.footer.src,
        width: b.logo.footer.width,
        height: b.logo.footer.height,
      }}
    />
  ),
};

export const GenietTabBar: Story = {
  name: "Geniet/하단 탭바 (5탭, Figma 90:2)",
  render: () => {
    const tabs = b.tabBar.tabLabels.map((l, i) => ({
      key: `tab-${i}`,
      label: l,
      href: "#",
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
        <GenietBottomNav tabs={tabs} activeTab="tab-0" position="static" />
      </div>
    );
  },
};

export const GenietTabBarCommunityActive: Story = {
  name: "Geniet/하단 탭바 — 커뮤니티 활성",
  render: () => {
    const tabs = b.tabBar.tabLabels.map((l, i) => ({
      key: `tab-${i}`,
      label: l,
      href: "#",
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
        <GenietBottomNav tabs={tabs} activeTab="tab-4" position="static" shadow={false} />
      </div>
    );
  },
};
