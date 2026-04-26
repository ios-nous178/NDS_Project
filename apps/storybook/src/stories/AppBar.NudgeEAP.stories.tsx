import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppBar } from "@nudge-eap/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("nudge-eap");

const meta: Meta = {
  title: "Brands/NudgeEAP/AppBar",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const Desktop: Story = {
  name: "Desktop/1단 헤더",
  render: () => (
    <AppBar
      position="static"
      style={
        {
          "--nds-app-bar-height": "80px",
          "--nds-app-bar-border-bottom": "none",
        } as React.CSSProperties
      }
    >
      <AppBar.MainBar maxWidth={b.header.pcMaxWidth}>
        <AppBar.Logo
          src={b.logo.headerPc.src}
          alt="NudgeEAP"
          href="/"
          style={{ height: 40, width: "auto" }}
        />
        <AppBar.GNB items={b.header.gnb.items} activeKey="home" />
        <AppBar.AuthMenu items={b.header.auth.items} separator="none" />
      </AppBar.MainBar>
    </AppBar>
  ),
};

export const Mobile: Story = {
  name: "Mobile/모바일 헤더",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <AppBar
        position="static"
        style={{ "--nds-app-bar-height": `${b.header.mobileHeight}px` } as React.CSSProperties}
      >
        <AppBar.MainBar>
          <AppBar.Logo
            src={b.logo.headerMobile.src}
            alt="NudgeEAP"
            href="/"
            style={{ height: b.logo.headerMobile.height, width: "auto" }}
          />
          <AppBar.AuthMenu items={b.header.auth.items} separator="none" />
        </AppBar.MainBar>
      </AppBar>
    </div>
  ),
};

export const Webview: Story = {
  name: "Webview/웹뷰 헤더",
  render: () => (
    <AppBar
      variant="webview"
      position="static"
      title={b.header.webviewTitle}
      leftSlot={<AppBar.BackButton />}
      style={{ "--nds-app-bar-height": `${b.header.mobileHeight}px` } as React.CSSProperties}
    />
  ),
};
