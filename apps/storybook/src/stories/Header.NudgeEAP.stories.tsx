import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NudgeEAPAppBar, NudgeEAPWebHeader } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";
import { DesktopPreview } from "../desktop-preview";

const b = getBrandFixture("nudge-eap");

const meta: Meta = {
  title: "Components/Header",
  parameters: { layout: "fullscreen" },
  globals: { brand: "nudge-eap" },
};
export default meta;
type Story = StoryObj;

/* ─── 데스크톱 웹 (NudgeEAPWebHeader) ─── */

export const NudgeEAPWebHeaderDesktop: Story = {
  name: "NudgeEAP/Desktop",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 39:5751 정합 — height 80, bg white, 1px #ECECEC bottom border, content max-width 1200. 로고는 698:87 (NudgeEAP Library) 의 KO+EN horizontal 대표 로고. 6탭 GNB(상담하기/심리검사/심리치료/주간레터/소식/마이페이지) + 우측 앱다운로드 + 로그인/로그아웃.",
      },
    },
  },
  render: () => (
    <DesktopPreview>
      <NudgeEAPWebHeader
        maxWidth={b.header.pcMaxWidth}
        menuItems={b.header.gnb.items}
        activeKey="counsel"
        showAppDownload
        appDownloadHref="#"
        authState="login"
        authHref="#"
      />
    </DesktopPreview>
  ),
};

export const NudgeEAPWebHeaderLoggedIn: Story = {
  name: "NudgeEAP/Desktop (로그인 후)",
  render: () => (
    <DesktopPreview>
      <NudgeEAPWebHeader
        maxWidth={b.header.pcMaxWidth}
        menuItems={b.header.gnb.items}
        activeKey="my"
        showAppDownload
        appDownloadHref="#"
        authState="logout"
        authHref="#"
      />
    </DesktopPreview>
  ),
};

/* ─── 앱 / 모바일 (NudgeEAPAppBar) ─── */

export const NudgeEAPMobile: Story = {
  name: "NudgeEAP/Mobile",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <NudgeEAPAppBar
        variant="mobile"
        mobileHeight={b.header.mobileHeight}
        authItems={b.header.auth.items}
      />
    </div>
  ),
};

export const NudgeEAPWebview: Story = {
  name: "NudgeEAP/Webview",
  render: () => (
    <NudgeEAPAppBar
      variant="webview"
      webviewTitle={b.header.webviewTitle}
      mobileHeight={b.header.mobileHeight}
    />
  ),
};
