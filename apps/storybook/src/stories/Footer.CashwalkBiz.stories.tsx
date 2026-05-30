import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CashwalkBizFooter } from "@nudge-design/react";

const meta: Meta = {
  title: "Components/Footer",
  parameters: { layout: "fullscreen" },
  globals: { brand: "cashwalk-biz" },
};
export default meta;
type Story = StoryObj;

const placeholderLinks = [
  { label: "이용약관", href: "#" },
  { label: "개인정보처리방침", href: "#", bold: true },
  { label: "고객센터", href: "#" },
];

const placeholderCompany = {
  name: "캐시워크 주식회사",
  ceo: "박상민",
  address: "서울특별시 강남구 ...",
  bizNumber: "000-00-00000",
  email: "support@cashwalk.io",
  copyright: "© 2025 Cashwalk Inc. All Rights Reserved",
};

export const CashwalkBizDesktop: Story = {
  name: "CashwalkBiz/Desktop",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 380:2208 (한국 캐시워크 WEB Dev). 캐포비는 dark 푸터 아닌 light 패턴 — Neutral 톤 + 캐포비 시그니처는 헤더에서만. surface='web' 만 지원 (App 없음).",
      },
    },
  },
  render: () => (
    <CashwalkBizFooter
      layout="desktop"
      links={placeholderLinks}
      company={placeholderCompany}
      maxWidth={1600}
    />
  ),
};

export const CashwalkBizMobile: Story = {
  name: "CashwalkBiz/Mobile",
  parameters: {
    docs: { story: "Figma 98:1267 — mobile light 푸터." },
  },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <CashwalkBizFooter layout="mobile" links={placeholderLinks} company={placeholderCompany} />
    </div>
  ),
};
