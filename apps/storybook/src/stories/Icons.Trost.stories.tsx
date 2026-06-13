import type { Meta, StoryObj } from "@storybook/react";
import { IconCatalog } from "@nudge-design/catalog";
import iconCatalog from "../../../../metadata/iconCatalog.json";

/**
 * Brands/Trost/Icons — Trost 브랜드 전용 아이콘 카탈로그.
 *
 * 데이터: metadata/iconCatalog.json 에서 brand="trost"(=`Trost*` prefix) 자동 분류.
 * 그리드·검색·복사는 공유 컴포넌트(@nudge-design/catalog)와 단일 구현을 공유.
 *
 * 정책 (MCP get_brand_info("trost").iconPolicy 와 동일):
 *   - 브랜드 모드(brand='trost') 작업 시 공용 아이콘보다 우선 사용.
 *   - 공통 컴포넌트(AppFooter/BottomNav 등) 에 brand 분기 박지 말고, 사용처에서 import 해 전달.
 */
const TROST_COUNT = iconCatalog.icons.filter((i) => i.brand === "trost").length;

const meta: Meta<typeof IconCatalog> = {
  title: "Brands/Trost/Icons",
  component: IconCatalog,
  globals: { brand: "trost" },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `**Trost 브랜드 전용 아이콘 ${TROST_COUNT}종.**`,
          "",
          "Trost 홈페이지의 mental 카테고리 / 검사 결과 / SNS 링크 / 마인드키 심볼 / 에너지·심리검사 아이콘을 24×24, currentColor 로 정규화한 것입니다.",
          "공용 아이콘(`HomeIcon`/`SearchIcon` 등) 과 별개로 Trost 디자인 그대로 가져온 변종입니다.",
          "브랜드 모드(brand='trost')에서 같은 의미의 prefix 아이콘이 있으면 **반드시 이쪽을 우선** 사용.",
          "",
          "사용 예: `<TrostMentalDepressionIcon size={32} color='var(--semantic-icon-strong-default)' />`",
        ].join("\n"),
      },
    },
  },
  args: {
    data: iconCatalog,
    mode: "single-brand",
    brand: "trost",
    copyMode: "name",
    iconSize: 24,
    searchPlaceholder: "이름으로 검색 (예: mental, testresult, link)",
  },
};
export default meta;
type Story = StoryObj<typeof IconCatalog>;

export const All: Story = { name: "Variant/전체" };

export const BrandTint: Story = {
  name: "Variant/Brand 색 (cobalt)",
  args: { iconColor: "var(--semantic-border-focus-default, #4968FF)" },
  parameters: {
    docs: {
      description: {
        story:
          "Trost focus·info 컬러(`--semantic-border-focus-default`, #4968FF) 로 렌더링. Trost primary 는 노랑이지만 노란 배경 위 가독성 때문에 cobalt 를 brand tint 로 사용.",
      },
    },
  },
};

export const Size32: Story = {
  name: "Variant/Size 32 (mental 카테고리 칩)",
  args: { iconSize: 32 },
  parameters: {
    docs: {
      description: {
        story: "Trost 멘탈 카테고리 칩은 32×32 로 사용되는 게 다수 — 원본 viewBox 도 32×32.",
      },
    },
  },
};

export const Size20: Story = {
  name: "Variant/Size 20 (Button 내부)",
  args: { iconSize: 20 },
};

export const OnDarkSurface: Story = {
  name: "Variant/다크 배경",
  args: { surface: "dark" },
};
