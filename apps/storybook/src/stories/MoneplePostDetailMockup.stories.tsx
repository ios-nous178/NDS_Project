import type { Meta, StoryObj } from "@storybook/react";
import MoneplePostDetailMockup from "./MoneplePostDetailMockup";

const meta: Meta<typeof MoneplePostDetailMockup> = {
  title: "Mockups/Moneple/Post Detail",
  component: MoneplePostDetailMockup,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## 모네플 게시글 상세 목업

모네플05 실제 게시글 상세의 보드형 흐름과 디자인시스템 시맨틱 토큰을 기준으로 구성했습니다.

- 기준 구조: 게시판 라벨 → 제목/작성자/통계 → URL 복사 → 에디터 본문 → 추천/비추천 → 메뉴 → 댓글
- 목업 컬러: Moneple DS semantic tokens
- Moneple 반영: 1080px 컨테이너, 220px 사이드 메뉴, 780px 본문, PC 우측 광고 위치
- DS Coverage: AppBar, AppFooter, Button, Badge, Chip, Textarea, CommentItem
        `,
      },
    },
  },
  globals: { brand: "moneple" },
};

export default meta;
type Story = StoryObj<typeof MoneplePostDetailMockup>;

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
