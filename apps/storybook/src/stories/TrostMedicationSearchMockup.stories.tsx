import type { Meta, StoryObj } from "@storybook/react";
import TrostMedicationSearchMockup from "./TrostMedicationSearchMockup";

const meta: Meta<typeof TrostMedicationSearchMockup> = {
  title: "Mockups/Trost/Medication Search",
  component: TrostMedicationSearchMockup,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## 트로스트 복용약 찾기 페이지 목업

트로스트 브랜드 기반 약물 검색 목록 페이지.

### 목표
- **SEO**: 복용약 검색, 항우울제 종류, 약 부작용 등 롱테일 키워드 유입
- **체류시간**: 검색 → 카테고리 탐색 → 가이드 → 상담 연계 플로우
- **전환**: 복약 상담 CTA

### DS Coverage
- **Covered**: AppBar, AppFooter, SearchInput, Button, Card, Badge, Chip (7개)
- **Missing**: Accordion, StickyBottomBar (2개 — 트로스트 스타일 임시 구현)

### 섹션 구조
1. AppBar (헤더) — 로고 + 검색 + GNB
2. Hero + SearchInput — 인기 검색어 태그
3. 카테고리 필터 — Chip 필터링
4. 약물 목록 — Card 그리드 (12개 더미)
5. 복용 주의사항 가이드 — 정보성 콘텐츠
6. FAQ — Accordion
7. 상담 연계 CTA
8. 관련 검색 태그
9. AppFooter (푸터) — 의료 면책 고지 포함
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TrostMedicationSearchMockup>;

export const Default: Story = {
  parameters: {
    viewport: { defaultViewport: "reset" },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
