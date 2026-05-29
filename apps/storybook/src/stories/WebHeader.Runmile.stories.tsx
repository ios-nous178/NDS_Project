import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RunmileWebHeader } from "@nudge-design/react";
import { BRAND_LOGOS } from "@nudge-design/assets";

/**
 * Runmile 데스크톱 웹 헤더 — `RunmileWebHeader` (Figma 1058:13271 / 1058:13336 / 1059:13975).
 *
 *   - height 80, bg white, border-bottom 1px gray300, content max-width 1440 / 좌우 80px
 *   - 로고(coral) + 좌측 GNB(대회 정보 / 커뮤니티) + 중앙 검색바(coral 2px, rounded 100) +
 *     우측 액션(아이콘 28 + 라벨 14)
 *   - 로그인 전: 채팅 / 로그인  ·  로그인 후: 채팅(미읽음 badge) / 마이페이지
 *
 * 로고는 @nudge-design/assets 의 runmile default(coral #FF5B37) base64 dataUri 사용.
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

export const RunmileWebHeaderLoggedOut: Story = {
  name: "RunmileWebHeader/Desktop (로그인 전)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 1058:13271 — 로그인 전 기본 상태. 로고 + 대회 정보/커뮤니티 GNB + 중앙 검색바 + 우측 채팅/로그인. 우측 액션은 28px 아이콘 위 14px 라벨 스택.",
      },
    },
  },
  render: () => (
    <RunmileWebHeader
      logoSrc={RUNMILE_LOGO}
      menuItems={RUNMILE_GNB}
      activeKey="competition"
      loggedIn={false}
      loginHref="#"
      chatHref="#"
      onSearch={(k) => console.log("[runmile search]", k)}
    />
  ),
};

export const RunmileWebHeaderLoggedIn: Story = {
  name: "RunmileWebHeader/Desktop — 로그인 후 (채팅 미읽음 12)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 1058:13336 — 로그인 후. 채팅 아이콘 우상단 미읽음 개수 badge(coral) + 마이페이지(프로필 아바타). 미읽음 0/미지정이면 badge 숨김.",
      },
    },
  },
  render: () => (
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
  ),
};
