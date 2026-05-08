import type { Meta, StoryObj } from "@storybook/react";
import GenietNutritionDetailMockup from "./GenietNutritionDetailMockup";

const meta: Meta<typeof GenietNutritionDetailMockup> = {
  title: "Mockups/Geniet/Nutrition Detail",
  component: GenietNutritionDetailMockup,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## 지니어트 식품 영양 백과 상세 페이지 목업

지니어트 브랜드 기반 식품 영양 정보 상세 페이지.
식품별 개별 URL을 통해 대규모 SEO 랜딩 페이지를 자동 생성하는 구조.

### 목표
- **SEO**: 식품별 개별 URL, 롱테일 키워드(아보카도 칼로리, 아보카도 효능 등), 구조화 데이터(FAQPage, NutritionInformation)
- **체류시간**: 영양소 시각화 → 비교 탐색 → 레시피 → 헬시딜 → 리뷰 → 유사 식품 → 재탐색 루프
- **전환**: 헬시딜 상품 연계, 레시피 → 식재료 구매, 리뷰 작성 유도

### 기존 데이터 연동
- 음식 리뷰 데이터 → 리뷰 섹션
- 헬시딜 상품 → 관련 상품 섹션
- 커뮤니티 → 관련 검색 태그
- 검색 데이터 → 인기 검색 식품

### DS Coverage
- **Covered**: Button, Card, Badge, Chip, Tabs, ProgressBar, Avatar, Divider, Breadcrumb (9개)
- **Missing**: StarRating, NutrientBar, ComparisonChart (3개 — 지니어트 스타일 임시 구현)

### 섹션 구조
1. Breadcrumb — 네비게이션 경로
2. Hero — 식품 기본 정보 (이미지, 칼로리, 태그, 제철 정보)
3. 탭 영역 — 영양 정보 / 효능·주의 / 식품 비교
4. 관련 레시피 — Card 그리드
5. 헬시딜 연동 — 관련 상품 (가격, 할인율, 리뷰)
6. 사용자 리뷰 — 리뷰 요약 + 목록
7. 유사 식품 추천 — 내부 링크 허브
8. FAQ — Accordion (SEO FAQPage 스키마)
9. 인기 검색 식품 — 트렌딩 랭킹
10. 관련 검색 태그 — SEO 내부 링크 네트워크
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GenietNutritionDetailMockup>;

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
