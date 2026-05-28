import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NudgeEAPAppBar } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("nudge-eap");

const meta: Meta = {
  title: "Components/Header",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const NudgeEAPDesktop: Story = {
  name: "NudgeEAPAppBar/Desktop (1단)",
  render: () => (
    <NudgeEAPAppBar
      variant="desktop"
      pcMaxWidth={b.header.pcMaxWidth}
      gnbItems={b.header.gnb.items}
      activeKey="home"
      authItems={b.header.auth.items}
    />
  ),
};

export const NudgeEAPMobile: Story = {
  name: "NudgeEAPAppBar/Mobile",
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
  name: "NudgeEAPAppBar/Webview",
  render: () => (
    <NudgeEAPAppBar
      variant="webview"
      webviewTitle={b.header.webviewTitle}
      mobileHeight={b.header.mobileHeight}
    />
  ),
};
