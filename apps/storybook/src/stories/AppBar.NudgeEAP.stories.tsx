import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NudgeEAPAppBar } from "@nudge-eap/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("nudge-eap");

const meta: Meta = {
  title: "Components/AppBar",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const NudgeEAPDesktop: Story = {
  name: "NudgeEAP/Desktop (1단)",
  render: () => (
    <NudgeEAPAppBar
      variant="desktop"
      logo={{
        src: b.logo.headerPc.src,
        alt: "NudgeEAP",
        href: "/",
      }}
      pcMaxWidth={b.header.pcMaxWidth}
      gnbItems={b.header.gnb.items}
      activeKey="home"
      authItems={b.header.auth.items}
    />
  ),
};

export const NudgeEAPMobile: Story = {
  name: "NudgeEAP/Mobile",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <NudgeEAPAppBar
        variant="mobile"
        logo={{
          src: b.logo.headerMobile.src,
          alt: "NudgeEAP",
          href: "/",
          height: b.logo.headerMobile.height,
        }}
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
      logo={{ src: b.logo.headerMobile.src }}
      webviewTitle={b.header.webviewTitle}
      mobileHeight={b.header.mobileHeight}
    />
  ),
};
