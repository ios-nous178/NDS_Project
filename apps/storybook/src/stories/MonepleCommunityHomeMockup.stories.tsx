import type { Meta, StoryObj } from "@storybook/react";
import MonepleCommunityHomeMockup from "./MonepleCommunityHomeMockup";

const meta: Meta<typeof MonepleCommunityHomeMockup> = {
  title: "Mockups/Moneple/Community Home",
  component: MonepleCommunityHomeMockup,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## 모네플 커뮤니티 홈 목업

모네플05 실제 커뮤니티 앱의 보드형 홈 구조와 CSS 변수 체계에 맞춰 구성했습니다.

- 목업 컬러: Moneple05 yellow/neutral 및 legacy --color-* aliases
- Moneple 반영: 1080px 컨테이너, 220px 사이드바, 40px content gap, 8px board radius
- 핵심 화면: 사이드 메뉴, 실시간 인기글, 공지/게시글 테이블, 모바일 리스트
- DS Coverage: AppBar, AppFooter, Button, Badge, Chip
        `,
      },
    },
  },
  globals: { brand: "moneple" },
};

export default meta;
type Story = StoryObj<typeof MonepleCommunityHomeMockup>;

export const Default: Story = {
  parameters: {
    viewport: { defaultViewport: "reset" },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
