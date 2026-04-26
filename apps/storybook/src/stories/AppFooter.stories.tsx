import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppFooter, AppFooterTabBar } from "@nudge-eap/react";

const meta: Meta = {
  title: "Components/AppFooter",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const TabIcon = ({ char, filled }: { char: string; filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="10"
      fill={filled ? "white" : "currentColor"}
      fontWeight="600"
    >
      {char}
    </text>
  </svg>
);

export const InfoWithCompound: Story = {
  name: "Compound/서브 컴포넌트 조합",
  render: () => (
    <AppFooter.Info>
      <AppFooter.Links
        links={[
          { label: "개인정보 처리방침", href: "#", bold: true },
          { label: "서비스 이용약관", href: "#" },
        ]}
      />
      <AppFooter.CompanyInfo
        data={{
          name: "(주)샘플컴퍼니",
          address: "서울시 강남구 테헤란로 123",
          bizNumber: "123-45-67890",
          phone: "02-1234-5678",
          email: "hello@example.com",
          copyright: "© 2024 Sample Co., All Rights Reserved",
        }}
      />
    </AppFooter.Info>
  ),
};

export const InfoWithExtra: Story = {
  name: "Compound/고지사항 포함",
  render: () => (
    <AppFooter.Info>
      <AppFooter.Links
        links={[
          { label: "이용약관", href: "#" },
          { label: "개인정보처리방침", href: "#", bold: true },
        ]}
      />
      <AppFooter.Extra>
        이 서비스는 통신판매중개자이며 통신판매의 당사자가 아닙니다.
      </AppFooter.Extra>
      <AppFooter.CompanyInfo
        data={{
          name: "샘플 주식회사",
          ceo: "홍길동",
          address: "서울시 강남구 역삼동 123",
          bizNumber: "123-45-67890",
          email: "info@sample.co.kr",
          copyright: "Copyright 2024 Sample Inc.",
        }}
        logoSrc="https://placehold.co/100x30?text=Logo"
        logoWidth={100}
        logoHeight={30}
      />
    </AppFooter.Info>
  ),
};

export const TabBarDemo: Story = {
  name: "TabBar/기본 탭바",
  render: () => {
    const tabs = ["홈", "검색", "마이"].map((l, i) => ({
      key: `tab-${i}`,
      label: l,
      href: "#",
      icon: <TabIcon char={l[0]} />,
      activeIcon: <TabIcon char={l[0]} filled />,
    }));
    return (
      <div style={{ height: 120, background: "#f9f9f9", display: "flex", alignItems: "flex-end" }}>
        <AppFooterTabBar tabs={tabs} activeTab="tab-0" style={{ position: "static" }} />
      </div>
    );
  },
};
