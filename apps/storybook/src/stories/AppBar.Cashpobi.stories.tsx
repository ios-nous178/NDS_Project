import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CashpobiWebHeader } from "@nudge-eap/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("cashpobi");

const meta: Meta = {
  title: "Components/Header",
  parameters: { layout: "fullscreen" },
  globals: { brand: "cashpobi" },
};
export default meta;
type Story = StoryObj;

const placeholderMenu = [
  { key: "channel", label: "채널", href: "/channel" },
  { key: "ad", label: "광고", href: "/ad" },
  { key: "case", label: "성공사례", href: "/case" },
  { key: "notice", label: "공지사항", href: "/notice" },
  { key: "guide", label: "이용방법", href: "/guide" },
];

export const CashpobiDesktop: Story = {
  name: "CashpobiWebHeader/Desktop (PC)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 98:1082 (한국 캐시워크 WEB Dev) — GNB 68h · cashwalk for business horizontal 로고(라이브러리 3154:550) · 메뉴 5개 (광고 활성) · 우측 노란 Pill CTA '광고 시작하기' (Yellow/500 #FFD200 + Gray/800).",
      },
    },
  },
  render: () => (
    <CashpobiWebHeader
      variant="desktop"
      logo={{
        src: b.logo.headerPc.src,
        alt: "Cashwalk for Business",
        href: "/",
        width: b.logo.headerPc.width,
        height: b.logo.headerPc.height,
      }}
      maxWidth={b.header.pcMaxWidth}
      menuItems={placeholderMenu}
      activeKey="ad"
      primaryCta={{ label: "광고 시작하기", href: "#" }}
    />
  ),
};

export const CashpobiMobile: Story = {
  name: "CashpobiWebHeader/Mobile",
  parameters: {
    docs: {
      description: { story: "Figma 380:1119 (한국 캐시워크 WEB Dev). 로고 + 햄버거." },
    },
  },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <CashpobiWebHeader
        variant="mobile"
        logo={{
          src: b.logo.headerMobile.src,
          alt: "Cashpobi",
          href: "/",
          width: b.logo.headerMobile.width,
          height: b.logo.headerMobile.height,
        }}
        onMobileMenu={() => {}}
      />
    </div>
  ),
};
