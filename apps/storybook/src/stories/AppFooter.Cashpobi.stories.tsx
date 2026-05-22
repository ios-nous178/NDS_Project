import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CashpobiWebFooter } from "@nudge-eap/react";

const meta: Meta = {
  title: "Components/AppFooter",
  parameters: { layout: "fullscreen" },
  globals: { brand: "cashpobi" },
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

export const CashpobiDesktop: Story = {
  name: "Cashpobi/Desktop (PC)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 380:2208 (한국 캐시워크 WEB Dev). 캐포비는 dark 푸터 아닌 light 패턴 — Neutral 톤 + 캐포비 시그니처는 헤더에서만.",
      },
    },
  },
  render: () => (
    <CashpobiWebFooter
      variant="desktop"
      links={placeholderLinks}
      company={placeholderCompany}
      maxWidth={1600}
    />
  ),
};

export const CashpobiMobile: Story = {
  name: "Cashpobi/Mobile",
  parameters: {
    docs: { story: "Figma 98:1267 — mobile light 푸터." },
  },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <CashpobiWebFooter variant="mobile" links={placeholderLinks} company={placeholderCompany} />
    </div>
  ),
};
