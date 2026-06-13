import type { Meta, StoryObj } from "@storybook/react";
import { IconCatalog } from "@nudge-design/catalog";
import iconCatalog from "../../../../metadata/iconCatalog.json";

/**
 * Brands/Runmile/Icons — Runmile 브랜드 아이콘 카탈로그.
 * 데이터: metadata/iconCatalog.json 의 brand="runmile"(=`Runmile*` prefix) 자동 분류.
 * 그리드·검색·복사는 공유 컴포넌트(@nudge-design/catalog)와 단일 구현 공유.
 *
 * Figma 런마일 library Icon 페이지(20:94) base 심볼을 1:1 정규화(24×24 + currentColor).
 * Active/Inactive 페어 컨벤션: `RunmileHomeIcon`(outline) / `RunmileHomeActiveIcon`(filled).
 * Multicolor(RunmileFireColor 등)는 `*Color` 라 본 카탈로그(*Icon)에는 포함되지 않습니다.
 */
const RUNMILE_COUNT = iconCatalog.icons.filter((i) => i.brand === "runmile").length;

const meta: Meta<typeof IconCatalog> = {
  title: "Brands/Runmile/Icons",
  component: IconCatalog,
  globals: { brand: "runmile" },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `**Runmile 브랜드 아이콘 ${RUNMILE_COUNT}종.**`,
          "",
          "디자인 가이드의 5 컬러 슬롯(black/white/gray600/gray800/orange500)은 시멘틱 토큰",
          "(`--semantic-icon-{strong,inverse,muted,normal,brand}-default`)으로 매핑되어 color prop / 부모 cascade 로 자동 적용.",
          "",
          "사용 예: `<RunmileHomeIcon size={24} />` — color 는 부모(예: BottomNav nav-item) cascade 따라감.",
        ].join("\n"),
      },
    },
  },
  args: {
    data: iconCatalog,
    mode: "single-brand",
    brand: "runmile",
    copyMode: "name",
    iconSize: 24,
  },
};
export default meta;
type Story = StoryObj<typeof IconCatalog>;

export const All: Story = { name: "Variant/전체" };

export const Muted: Story = {
  name: "Variant/Muted (gray600)",
  args: { iconColor: "var(--semantic-icon-muted-default)" },
  parameters: {
    docs: { description: { story: "비활성 nav-item 등에 쓰는 muted 슬롯(gray600) 렌더링." } },
  },
};

export const BrandTint: Story = {
  name: "Variant/Brand 색 (orange500)",
  args: { iconColor: "var(--semantic-icon-brand-default)" },
  parameters: {
    docs: { description: { story: "Runmile primary(orange500) = `--semantic-icon-brand-default` 렌더링." } },
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
