import type { Meta, StoryObj } from "@storybook/react";
import TrostMedicationDetailMockup from "./TrostMedicationDetailMockup";

const meta: Meta<typeof TrostMedicationDetailMockup> = {
  title: "Mockups/Trost/Medication Detail",
  component: TrostMedicationDetailMockup,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## 트로스트 복용약 상세 페이지 목업

렉사프로(에스시탈로프람) 기준 상세 페이지. 상담 전환률 최적화.

### 전환 포인트 (5곳)
1. 기본정보 탭 중간 CTA — "혼자 고민하지 마세요"
2. 부작용 탭 하단 CTA — "부작용이 걱정되시나요?"
3. 상호작용 탭 하단 CTA — "복용 중인 약이 여러 개?"
4. 리뷰 탭 하단 CTA — "나도 비슷한 경험이 있다면"
5. StickyBottomBar — "이 약 관련 상담받기" (항상 노출)

### SEO
- Breadcrumb, 구조화된 H1/H2, FAQ Accordion
- 약물 설명/작용기전/적응증/부작용 등 롱텍스트

### 체류시간
- 5개 탭 (기본정보/부작용/상호작용/용법·용량/리뷰)
- 유사 약물 비교, 관련 콘텐츠 6개, FAQ 7개, 리뷰 7개

### DS Coverage
- **Covered**: AppBar, AppFooter, Button, Card, Badge, Chip, TrendingKeywords (7개)
- **Missing**: Accordion, StickyBottomBar, PillImage, StarRating, FrequencyBar, CounselingCTA (6개 임시)
        `,
      },
    },
  },
  globals: { brand: "trost" },
};

export default meta;
type Story = StoryObj<typeof TrostMedicationDetailMockup>;

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
