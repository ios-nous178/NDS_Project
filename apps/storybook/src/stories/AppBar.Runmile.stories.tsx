import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RunmileAppBar } from "@nudge-design/react";
import { RunmileCalendarIcon, RunmileSearchIcon, RunmileCloseIcon } from "@nudge-design/icons";
import { BRAND_LOGOS } from "@nudge-design/assets";

/**
 * Figma 36:258 — 360×52 모바일 헤더 3 가지 variant.
 *
 * 로고 자산은 `@nudge-design/assets/brand-logos` 의 runmile / `muted` variant
 * (gray700 톤) base64 dataUri 사용 — 외부 호스팅 없이도 깨지지 않게.
 */

const RUNMILE_LOGO = BRAND_LOGOS.runmile?.muted?.dataUri ?? "";

const meta: Meta = {
  title: "Brands/Runmile/AppBar",
  parameters: { layout: "fullscreen" },
  globals: { brand: "runmile" },
};
export default meta;
type Story = StoryObj;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 360,
        margin: "40px auto",
        border: "1px solid var(--semantic-border-normal-default, #E5E8EB)",
        borderRadius: 8,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {children}
    </div>
  );
}

export const TitleIcon: Story = {
  name: "title-icon (좌측 back + 중앙 title + 우측 actions)",
  render: () => (
    <Frame>
      <RunmileAppBar variant="title-icon" title="텍스트" back={{ onClick: () => undefined }}>
        <RunmileCalendarIcon size={24} />
        <RunmileSearchIcon size={24} />
        <RunmileCloseIcon size={24} />
      </RunmileAppBar>
    </Frame>
  ),
};

export const Logo: Story = {
  name: "logo (중앙 로고 + 우측 actions)",
  render: () => (
    <Frame>
      <RunmileAppBar variant="logo" logo={{ src: RUNMILE_LOGO, width: 100, height: 23 }}>
        <RunmileSearchIcon size={24} />
        <RunmileCloseIcon size={24} />
      </RunmileAppBar>
    </Frame>
  ),
};

export const MenuTitle: Story = {
  name: "menu-title (좌측 back+title bold)",
  render: () => (
    <Frame>
      <RunmileAppBar variant="menu-title" title="텍스트" back={{ onClick: () => undefined }}>
        <RunmileCalendarIcon size={24} />
        <RunmileSearchIcon size={24} />
        <RunmileCloseIcon size={24} />
      </RunmileAppBar>
    </Frame>
  ),
};
