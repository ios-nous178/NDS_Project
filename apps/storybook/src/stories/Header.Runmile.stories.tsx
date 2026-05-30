import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RunmileAppBar, RunmileWebHeader } from "@nudge-design/react";
import { RunmileCalendarIcon, RunmileSearchIcon, RunmileCloseIcon } from "@nudge-design/icons";
import { BRAND_LOGOS } from "@nudge-design/assets";
import { DesktopPreview } from "../desktop-preview";

/**
 * 모바일 헤더(Figma 36:258 — 360×52, 3 variant) + 데스크톱 웹 헤더
 * (RunmileWebHeader · Figma 1058:13271 / 1058:13336 / 1059:13975).
 *
 * 로고 자산은 `@nudge-design/assets/brand-logos` 의 runmile / `default` variant
 * (coral #FF5B37 = 런마일 primary) base64 dataUri 사용 — 외부 호스팅 없이도 깨지지 않게.
 */

const RUNMILE_LOGO = BRAND_LOGOS.runmile?.default?.dataUri ?? "";

const RUNMILE_GNB = [
  { key: "competition", label: "대회 정보", href: "/competitions" },
  { key: "community", label: "커뮤니티", href: "/community" },
];

const meta: Meta = {
  title: "Components/Header",
  parameters: { layout: "fullscreen" },
  globals: { brand: "runmile" },
};
export default meta;
type Story = StoryObj;

function Frame({ children }: { children: React.ReactNode }) {
  // 다른 브랜드 모바일 스토리와 동일하게 단순 폭 제한만 둔다.
  // (이전엔 border/radius 로 감싸 Runmile 만 아웃라인이 잡혀 보였음)
  return <div style={{ maxWidth: 360 }}>{children}</div>;
}

/* ─── 앱 / 모바일 (RunmileAppBar · 360×52 3 variant) ─── */

export const TitleIcon: Story = {
  name: "Runmile/Mobile (title-icon)",
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
  name: "Runmile/Mobile (logo)",
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
  name: "Runmile/Mobile (menu-title)",
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

/* ─── 데스크톱 웹 (RunmileWebHeader · height 80, max-width 1440) ─── */

export const RunmileWebHeaderLoggedOut: Story = {
  name: "Runmile/Desktop",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 1058:13271 — 로그인 전 기본 상태. 로고 + 대회 정보/커뮤니티 GNB + 중앙 검색바 + 우측 채팅/로그인. 우측 액션은 28px 아이콘 위 14px 라벨 스택.",
      },
    },
  },
  render: () => (
    <DesktopPreview>
      <RunmileWebHeader
        logoSrc={RUNMILE_LOGO}
        menuItems={RUNMILE_GNB}
        activeKey="competition"
        loggedIn={false}
        loginHref="#"
        chatHref="#"
        onSearch={(k) => console.log("[runmile search]", k)}
      />
    </DesktopPreview>
  ),
};

export const RunmileWebHeaderLoggedIn: Story = {
  name: "Runmile/Desktop (로그인 후)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 1058:13336 — 로그인 후. 채팅 아이콘 우상단 미읽음 개수 badge(coral) + 마이페이지(프로필 아바타). 미읽음 0/미지정이면 badge 숨김.",
      },
    },
  },
  render: () => (
    <DesktopPreview>
      <RunmileWebHeader
        logoSrc={RUNMILE_LOGO}
        menuItems={RUNMILE_GNB}
        activeKey="community"
        loggedIn
        chatUnreadCount={12}
        chatHref="#"
        myPageHref="#"
        onSearch={(k) => console.log("[runmile search]", k)}
      />
    </DesktopPreview>
  ),
};
