import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppBar, TrendingKeywords } from "@nudge-eap/react";
import { GenietMenuIcon } from "@nudge-eap/icons";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("geniet");

const meta: Meta = {
  title: "Brands/Geniet/AppBar",
  parameters: { layout: "fullscreen" },
  globals: { brand: "geniet" },
};
export default meta;
type Story = StoryObj;

/**
 * Figma 207:2491 — "음식 카테고리" 박스 (NavBar 좌측 진입).
 * Geniet 헤더의 핵심 진입점. GenietMenuIcon (brand prefix 아이콘) 사용.
 * AppBar 컴포넌트 안에 분기 박지 않고, 여기서 명시적으로 NavBar 의 children 으로 전달.
 */
function GenietCategoryMenu() {
  return (
    <a
      href="/category"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        height: 58,
        padding: "0 15px",
        border: "1px solid var(--semantic-border-normal-default, #ECECEC)",
        boxSizing: "border-box",
        color: "var(--semantic-text-strong-default, #111111)",
        textDecoration: "none",
        font: "700 17px/24px Pretendard, sans-serif",
        minWidth: 160,
      }}
    >
      <GenietMenuIcon size={24} />
      음식 카테고리
    </a>
  );
}

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
          alt="Geniet"
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
        <AppBar.AuthMenu items={b.header.auth.items} separator="divider" />
      </AppBar.MainBar>
      <AppBar.Divider />
      <AppBar.NavBar
        maxWidth={b.header.pcMaxWidth}
        height={b.header.gnb.navHeight}
        style={{ justifyContent: "space-between", gap: 20 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <GenietCategoryMenu />
          <AppBar.GNB items={b.header.gnb.items} activeKey="home" />
        </div>
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
            alt="Geniet"
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
