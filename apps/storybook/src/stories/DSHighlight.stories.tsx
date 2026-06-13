import type { Meta, StoryObj } from "@storybook/react";
import { DSHighlightProvider, DSMark } from "@nudge-design/react";

// DSHighlight 는 페이지 단위 개발용 오버레이 도구(Provider + Mark + 토글)다. 카드형 미니
// 프리뷰에는 부적합(오버레이가 body 포털로 전체를 덮음)이라 gallery 태그는 달지 않는다 —
// AllComponents 카탈로그에서는 메타 카드로 표시(scripts/storybook-catalog-baseline.json waiver).
const meta: Meta<typeof DSHighlightProvider> = {
  title: "Components/Display/DSHighlight",
  component: DSHighlightProvider,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof DSHighlightProvider>;

export const Overlay: Story = {
  name: "Recipe/영역 하이라이트",
  render: () => (
    <DSHighlightProvider defaultMode="all">
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
        <DSMark label="헤더 영역">
          <div style={{ padding: 16, border: "1px solid #E5E5E5", borderRadius: 12 }}>
            상단 헤더 영역
          </div>
        </DSMark>
        <DSMark label="본문 영역">
          <div style={{ padding: 16, border: "1px solid #E5E5E5", borderRadius: 12 }}>
            본문 콘텐츠 영역 — DSMark 로 감싼 구역에 라벨이 오버레이로 표시됩니다.
          </div>
        </DSMark>
      </div>
    </DSHighlightProvider>
  ),
};
