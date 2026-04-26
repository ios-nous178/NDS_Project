import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppBar } from "@nudge-eap/react";

const meta: Meta<typeof AppBar> = {
  title: "Components/AppBar",
  component: AppBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof AppBar>;

export const MobileDefault: Story = {
  name: "Mobile/기본 헤더",
  args: {
    position: "static",
    leftSlot: (
      <AppBar.Logo
        src="https://placehold.co/120x24?text=Logo"
        alt="Logo"
        style={{ height: 24, width: "auto" }}
      />
    ),
    rightSlot: <AppBar.AuthMenu items={[{ key: "login", label: "로그인" }]} separator="none" />,
  },
};

export const WebviewDefault: Story = {
  name: "Webview/기본 웹뷰 헤더",
  args: {
    variant: "webview",
    position: "static",
    title: "페이지 타이틀",
    leftSlot: <AppBar.BackButton />,
  },
};

export const ElevatedDefault: Story = {
  name: "State/Elevated",
  args: {
    position: "static",
    elevated: true,
    leftSlot: (
      <AppBar.Logo
        src="https://placehold.co/120x24?text=Logo"
        alt="Logo"
        style={{ height: 24, width: "auto" }}
      />
    ),
  },
};

export const SubComponents: Story = {
  name: "Compound/서브 컴포넌트 조합",
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
      <AppBar.MainBar maxWidth={1080}>
        <AppBar.Logo
          src="https://placehold.co/90x36?text=Logo"
          alt="Logo"
          href="/"
          width={90}
          height={36}
        />
        <AppBar.SearchBar placeholder="검색어를 입력하세요" />
        <AppBar.AuthMenu items={[{ key: "login", label: "로그인" }]} separator="none" />
      </AppBar.MainBar>
      <AppBar.Divider />
      <AppBar.NavBar maxWidth={1080} height={56}>
        <AppBar.GNB
          items={[
            { key: "home", label: "홈", href: "#" },
            { key: "feature", label: "기능", href: "#" },
            { key: "about", label: "소개", href: "#" },
          ]}
          activeKey="home"
        />
      </AppBar.NavBar>
      <AppBar.Divider />
    </AppBar>
  ),
};
