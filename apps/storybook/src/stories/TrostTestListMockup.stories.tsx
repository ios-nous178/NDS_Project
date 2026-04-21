import type { Meta, StoryObj } from "@storybook/react";
import TrostTestListMockup from "./TrostTestListMockup";

const meta: Meta<typeof TrostTestListMockup> = {
  title: "Mockups/TrostTestList",
  component: TrostTestListMockup,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## 트로스트 심리검사 목록 페이지 목업

**Harness 파이프라인 POC 산출물**

- Ticket: Notion 기획서 (트로스트 심리검사 목록 페이지 개선)
- Harness 1 → PRD.md
- Harness 2 → UI Schema + Coverage (71%)
- Mockup Renderer → 이 파일

### DS Coverage
- **Covered**: Button, Badge, Card, Chip (4개)
- **Missing**: Accordion, StickyBottomBar (2개 — 임시 HTML+Tailwind 구현)
- **Product Comp 후보**: TestCard, EmotionRoutingCard

### Missing 컴포넌트 DS Gate 판단
- Accordion → DS L2 신규 후보 (범용성 높음)
- StickyBottomBar → DS L2 신규 후보 (CTA 패턴)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TrostTestListMockup>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
