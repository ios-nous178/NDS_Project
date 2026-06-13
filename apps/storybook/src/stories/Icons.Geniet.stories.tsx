import type { Meta, StoryObj } from "@storybook/react";
import { IconCatalog } from "@nudge-design/catalog";
import iconCatalog from "../../../../metadata/iconCatalog.json";

/**
 * Brands/Geniet/Icons — Geniet 브랜드 전용 아이콘 카탈로그.
 * 데이터: metadata/iconCatalog.json 의 brand="geniet"(=`Geniet*` prefix) 자동 분류.
 * 그리드·검색·복사는 공유 컴포넌트(@nudge-design/catalog)와 단일 구현 공유.
 */
const GENIET_COUNT = iconCatalog.icons.filter((i) => i.brand === "geniet").length;

const meta: Meta<typeof IconCatalog> = {
  title: "Brands/Geniet/Icons",
  component: IconCatalog,
  globals: { brand: "geniet" },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `**Geniet 브랜드 전용 아이콘 ${GENIET_COUNT}종.**`,
          "",
          "공용 아이콘(`HomeIcon`/`CouponIcon` 등) 과 별개로 Geniet 디자인 그대로 가져온 변종입니다.",
          "브랜드 모드(brand='geniet')에서 같은 의미의 prefix 아이콘이 있으면 **반드시 이쪽을 우선** 사용.",
          "",
          "사용 예: `<GenietRecordIcon size={24} />` — color 는 부모(예: AppFooter nav-item) cascade 따라감.",
        ].join("\n"),
      },
    },
  },
  args: {
    data: iconCatalog,
    mode: "single-brand",
    brand: "geniet",
    copyMode: "name",
    iconSize: 24,
  },
};
export default meta;
type Story = StoryObj<typeof IconCatalog>;

export const All: Story = { name: "Variant/전체" };

export const BrandTint: Story = {
  name: "Variant/Brand 색",
  args: { iconColor: "var(--semantic-icon-brand-default)" },
  parameters: {
    docs: {
      description: {
        story: "Geniet brand 컬러(`--semantic-icon-brand-default`) 로 렌더링. 브랜드 테마가 적용된 토큰을 따릅니다.",
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
