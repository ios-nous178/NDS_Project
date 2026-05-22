import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NudgeEAPFooter } from "@nudge-eap/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("nudge-eap");

const meta: Meta = {
  title: "Components/Footer",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

/* ─── App download icons (24×24, monochrome white) ─── */
function GooglePlayIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M.5 1.5C.5 1 .8.5 1.3.2L11 11 1.3 21.8C.8 21.5.5 21 .5 20.5v-19zM12 12l3.4 3.4-12.6 7.3c-.3.2-.6.2-.9.1L12 12zm0-2L2 .2c.3-.1.6 0 .9.1l12.6 7.3L12 11zm6.4 4l-2.4-1.4L13.4 11l3-3 2.4-1.4c.7.5.7 2 0 2.7L18.4 14z"
        fill="currentColor"
      />
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.2 11.7c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.4 1-4.3 2.6-1.9 3.2-.5 8 1.3 10.7.9 1.3 1.9 2.7 3.3 2.7 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.9c1.4 0 2.3-1.3 3.2-2.6.7-1 1.3-2 1.5-2.5-2-1-2-3-2-3z"
        fill="currentColor"
      />
    </svg>
  );
}
function OneStoreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="2" />
      <text x="11" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor">
        1
      </text>
    </svg>
  );
}

export const NudgeEAPWeb: Story = {
  name: "NudgeEAP/Web Desktop (surface='web', Figma 20:13799)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 20:13799 정합 — bg #FAFAFA · max-width 1200 · 약관 4개(개인정보 처리방침 bold 강조) · 우상단 앱다운로드 원형 3개 · 회사정보 · ISO/IEC 27001 인증 · DAIN 자회사 로고.",
      },
    },
  },
  render: () => (
    <NudgeEAPFooter
      surface="web"
      links={[
        { label: "고객센터", href: "#" },
        { label: "개인정보 처리방침", href: "#", bold: true },
        { label: "서비스 이용약관", href: "#" },
        { label: "위치기반 서비스 이용약관", href: "#" },
      ]}
      company={{
        address: b.footer.company.address,
        bizNumber: b.footer.company.bizNumber,
        phone: b.footer.company.phone,
        fax: "02-2268-5955",
        email: b.footer.company.email,
        copyright: b.footer.company.copyright,
      }}
      poweredBy="powered by Cashwalk"
      appDownloads={[
        { key: "google", href: "#", ariaLabel: "Google Play", icon: <GooglePlayIcon /> },
        { key: "apple", href: "#", ariaLabel: "App Store", icon: <AppleIcon /> },
        { key: "onestore", href: "#", ariaLabel: "OneStore", icon: <OneStoreIcon /> },
      ]}
    />
  ),
};
