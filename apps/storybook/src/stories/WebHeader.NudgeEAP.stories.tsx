import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NudgeEAPWebHeader } from "@nudge-eap/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("nudge-eap");

const meta: Meta = {
  title: "Components/Header",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const NudgeEAPWebHeaderDesktop: Story = {
  name: "NudgeEAPWebHeader/Desktop (Figma 39:5751)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 39:5751 정합 — height 80, bg white, 1px #ECECEC bottom border, content max-width 1200. 로고는 698:87 (NudgeEAP Library) 의 KO+EN horizontal 대표 로고. 6탭 GNB(상담하기/심리검사/심리치료/주간레터/소식/마이페이지) + 우측 앱다운로드 + 로그인/로그아웃.",
      },
    },
  },
  render: () => (
    <NudgeEAPWebHeader
      maxWidth={b.header.pcMaxWidth}
      menuItems={b.header.gnb.items}
      activeKey="counsel"
      showAppDownload
      appDownloadHref="#"
      authState="login"
      authHref="#"
    />
  ),
};

export const NudgeEAPWebHeaderLoggedIn: Story = {
  name: "NudgeEAPWebHeader/Desktop — Logged in",
  render: () => (
    <NudgeEAPWebHeader
      maxWidth={b.header.pcMaxWidth}
      menuItems={b.header.gnb.items}
      activeKey="my"
      showAppDownload
      appDownloadHref="#"
      authState="logout"
      authHref="#"
    />
  ),
};
