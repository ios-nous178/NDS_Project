import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppBar, Button, TrendingKeywords } from "@nudge-eap/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("trost");

const meta: Meta = {
  title: "Brands/Trost/AppBar",
  parameters: { layout: "fullscreen" },
  globals: { brand: "trost" },
};
export default meta;
type Story = StoryObj;

export const Desktop: Story = {
  name: "Desktop/2단 헤더",
  render: () => (
    <AppBar
      position="static"
      style={
        {
          "--nds-app-bar-height": "auto",
          "--nds-app-bar-padding-x": "0",
          "--nds-app-bar-border-bottom": "none",
          flexDirection: "column",
        } as React.CSSProperties
      }
    >
      <AppBar.MainBar
        maxWidth={b.header.pcMaxWidth}
        style={{ padding: b.header.mainBarPaddingY + " 16px" }}
      >
        <AppBar.Logo
          src={b.logo.headerPc.src}
          alt="Trost"
          href="/"
          width={b.logo.headerPc.width}
          height={b.logo.headerPc.height}
        />
        <AppBar.SearchBar
          placeholder={b.header.searchBar!.placeholder}
          style={
            {
              "--nds-app-bar-search-width": `${b.header.searchBar!.width}px`,
              "--nds-app-bar-search-height": `${b.header.searchBar!.height}px`,
            } as React.CSSProperties
          }
        />
        <AppBar.AuthMenu
          items={b.header.auth.items}
          separator="none"
          extra={
            <Button size="sm" variant="outlined-sub" style={{ marginLeft: 16 }}>
              앱 다운로드
            </Button>
          }
        />
      </AppBar.MainBar>
      <AppBar.Divider />
      <AppBar.NavBar
        maxWidth={b.header.pcMaxWidth}
        height={b.header.gnb.navHeight}
        style={{ justifyContent: "space-between" }}
      >
        <AppBar.GNB items={b.header.gnb.items} activeKey="home" />
        {b.header.trending && <TrendingKeywords items={b.header.trending} timestamp="09:00 기준" />}
      </AppBar.NavBar>
      <AppBar.Divider />
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
            alt="Trost"
            href="/"
            style={{ height: b.logo.headerMobile.height, width: "auto" }}
          />
          <AppBar.AuthMenu items={[b.header.auth.items[0]]} separator="none" />
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
