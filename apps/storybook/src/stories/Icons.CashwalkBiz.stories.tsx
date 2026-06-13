import type { Meta, StoryObj } from "@storybook/react";
import { IconCatalog } from "@nudge-design/catalog";
import iconCatalog from "../../../../metadata/iconCatalog.json";

/**
 * Brands/CashwalkBiz/Icons — 캐포비 어드민 전용 큐레이션 아이콘 카탈로그.
 *
 * 데이터: metadata/iconCatalog.json 의 `cashwalkBiz` 큐레이션 섹션(카테고리·source SSOT).
 * 예전엔 이 46행 분류가 이 스토리 안 ICON_MAP 에 손으로 박혀 있었으나, 이제 generate-icon-catalog.mjs
 * 가 생성하는 SSOT 를 공유 컴포넌트(@nudge-design/catalog)가 source 칩 + 카테고리 그룹으로 렌더한다.
 */
const CW = iconCatalog.cashwalkBiz;
const COMMON_COUNT = CW.filter((e) => e.source === "common").length;
const BIZ_COUNT = CW.filter((e) => e.source === "cashwalk-biz").length;

const meta: Meta<typeof IconCatalog> = {
  title: "Brands/CashwalkBiz/Icons",
  component: IconCatalog,
  globals: { brand: "cashwalk-biz" },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `**캐포비 어드민 전용 아이콘 ${CW.length}종.** Figma 캐포비-Library / IconLibraryGuide (3112:948) SSOT.`,
          "",
          "**source 구분:**",
          `- \`common\` (${COMMON_COUNT}) — 공용 아이콘 재사용 (chevron/close/search 등).`,
          `- \`cashwalk-biz\` (${BIZ_COUNT}) — 캐포비 전용 글리프 (\`CashwalkBiz*Icon\`).`,
          "",
          "공통 컴포넌트(AppFooter/BottomNav) 안에 `if (brand === 'cashwalk-biz')` 분기를 박지 않습니다. 사용처에서 명시적으로 import 해 전달.",
        ].join("\n"),
      },
    },
  },
  args: {
    data: iconCatalog,
    mode: "cashwalk-biz",
    copyMode: "name",
    iconSize: 24,
    searchPlaceholder: "이름·카테고리로 검색 (예: gnb, check, arrow)",
  },
};
export default meta;
type Story = StoryObj<typeof IconCatalog>;

export const All: Story = { name: "Variant/전체" };

export const BrandTint: Story = {
  name: "Variant/Brand 색",
  args: { iconColor: "var(--semantic-icon-brand-default)" },
  parameters: {
    docs: { description: { story: "캐포비 brand 컬러(`--semantic-icon-brand-default`) 렌더링." } },
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
