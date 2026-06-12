import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Badge, type BadgeColor, type BadgeVariant } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";
import { DesignGuideBadge } from "../components/DesignGuideBadge";
import { coreGuideMeta } from "../components/guideMeta";

// Figma 가이드(171:10856) 등재 메타 — SSOT 는 guides-src/components/Badge.md frontmatter
const badgeGuideMeta = coreGuideMeta("Badge");

const VARIANTS: BadgeVariant[] = ["fill", "ghost", "line"];
const COLORS: BadgeColor[] = ["brand", "neutral", "success", "error", "caution", "info"];

const COLOR_USAGE: Record<BadgeColor, string> = {
  brand: "주요 액션, 브랜드 강조",
  neutral: "일반 카테고리, 기본 레이블",
  success: "완료, 성공, 진행 중",
  error: "오류, 실패, 위험",
  caution: "주의, 경고, 선착순",
  info: "정보, 안내, 공지",
};

const COLOR_LABEL: Record<BadgeColor, string> = {
  brand: "Brand",
  neutral: "Neutral",
  success: "완료",
  error: "오류",
  caution: "주의",
  info: "정보",
};

const meta: Meta<typeof Badge> = {
  title: "Components/Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Badge"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
      description: "Figma `Style` — fill(강조) → ghost(보조) → line(최소)",
    },
    color: {
      control: "select",
      options: COLORS,
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    shape: {
      control: "select",
      options: ["default", "pill"],
      description:
        "Figma `Shape` — default(라운드 사각, 동적 상태값) / pill(완전 둥근, 정적 식별 태그)",
    },
  },
  args: {
    variant: "fill",
    color: "brand",
    size: "md",
    children: "Brand",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {};

export const StyleMatrix: Story = {
  name: "Spec/Style × Color Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}>
      {VARIANTS.map((variant) => (
        <div
          key={variant}
          style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-comfortable)" }}
        >
          <span
            style={{
              minWidth: 64,
              fontSize: 13,
              fontWeight: 700,
              textTransform: "capitalize",
            }}
          >
            {variant}
          </span>
          <div style={{ display: "flex", gap: "var(--semantic-gap-default)", flexWrap: "wrap" }}>
            {COLORS.map((color) => (
              <Badge key={color} variant={variant} color={color}>
                {COLOR_LABEL[color]}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const SizeScale: Story = {
  name: "Spec/Size Scale",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-default)" }}>
      <Badge size="sm" color="brand">
        SM
      </Badge>
      <Badge size="md" color="brand">
        MD
      </Badge>
      <Badge size="lg" color="brand">
        LG
      </Badge>
    </div>
  ),
};

export const ShapeScale: Story = {
  name: "Spec/Shape",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-default)" }}>
      <Badge shape="default" variant="ghost" color="brand">
        default
      </Badge>
      <Badge shape="pill" variant="ghost" color="brand">
        pill
      </Badge>
    </div>
  ),
};

export const ColorUsage: Story = {
  name: "Spec/Color Usage",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "var(--semantic-gap-comfortable) var(--semantic-gap-loose)",
        alignItems: "center",
      }}
    >
      {COLORS.map((color) => (
        <>
          <span key={`${color}-label`} style={{ fontSize: 13, fontWeight: 600 }}>
            {COLOR_LABEL[color]}
          </span>
          <span key={`${color}-usage`} style={{ fontSize: 12, color: "#888" }}>
            {COLOR_USAGE[color]}
          </span>
          <Badge key={`${color}-sample`} variant="fill" color={color}>
            {COLOR_LABEL[color]}
          </Badge>
        </>
      ))}
    </div>
  ),
};

export const StatusBadges: Story = {
  name: "Recipe/Status Badges",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--semantic-gap-default)" }}>
      <Badge variant="fill" color="success">
        참여중
      </Badge>
      <Badge variant="fill" color="caution">
        선착순
      </Badge>
      <Badge variant="fill" color="error">
        취소됨
      </Badge>
      <Badge variant="ghost" color="brand">
        방문 전용
      </Badge>
      <Badge variant="ghost" color="neutral">
        온라인 전용
      </Badge>
      <Badge variant="line" color="info">
        공지
      </Badge>
    </div>
  ),
};

export const CashwalkBizAdminTags: Story = {
  name: "Recipe/CashwalkBiz Admin Tags",
  parameters: {
    docs: {
      description: {
        story:
          "캐포비 admin(Figma 3782-20558): 동적 상태값 = 라운드 사각(shape 기본), 정적 식별 태그 = pill. 톤은 ghost 매핑(충전=brand·사용=info·적립=success·만료=neutral·취소=error).",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--semantic-gap-default)" }}>
        <Badge variant="ghost" color="brand" size="sm">
          충전
        </Badge>
        <Badge variant="ghost" color="info" size="sm">
          사용
        </Badge>
        <Badge variant="ghost" color="success" size="sm">
          적립
        </Badge>
        <Badge variant="ghost" color="neutral" size="sm">
          만료
        </Badge>
        <Badge variant="ghost" color="error" size="sm">
          취소
        </Badge>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--semantic-gap-default)" }}>
        <Badge variant="ghost" color="neutral" shape="pill" size="sm">
          일반 계정
        </Badge>
        <Badge variant="ghost" color="brand" shape="pill" size="sm">
          프리미엄
        </Badge>
        <Badge variant="ghost" color="info" shape="pill" size="sm">
          신규
        </Badge>
      </div>
    </div>
  ),
};

export const LabelSlotOverride: Story = {
  name: "Recipe/Label Slot Override",
  render: () => (
    <Badge
      variant="ghost"
      color="brand"
      slotProps={{
        label: {
          style: {
            letterSpacing: "-0.02em",
          },
        },
      }}
    >
      온라인 전용
    </Badge>
  ),
};

export const VariantRenderingInteraction: Story = {
  name: "Interaction/Variant Rendering",
  args: {
    variant: "fill",
    color: "success",
    size: "sm",
    children: "참여중",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText("참여중").closest('[data-slot="root"]');

    await expect(badge).toHaveAttribute("data-variant", "fill");
    await expect(badge).toHaveAttribute("data-color", "success");
    await expect(badge).toHaveAttribute("data-size", "sm");
  },
};

export const AllColorsContractInteraction: Story = {
  name: "Interaction/All Colors Contract",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--semantic-gap-default)" }}>
      {COLORS.map((color) => (
        <Badge key={color} color={color}>
          {color}
        </Badge>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const color of COLORS) {
      const badge = canvas.getByText(color).closest('[data-slot="root"]');
      await expect(badge).toHaveAttribute("data-color", color);
    }
  },
};

export const SizeContractInteraction: Story = {
  name: "Interaction/Size Contract",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-default)" }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const sm = canvas.getByText("Small").closest('[data-slot="root"]');
    await expect(sm).toHaveAttribute("data-size", "sm");

    const md = canvas.getByText("Medium").closest('[data-slot="root"]');
    await expect(md).toHaveAttribute("data-size", "md");

    const lg = canvas.getByText("Large").closest('[data-slot="root"]');
    await expect(lg).toHaveAttribute("data-size", "lg");
  },
};

export const ShapeContractInteraction: Story = {
  name: "Interaction/Shape Contract",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-default)" }}>
      <Badge shape="default">Square</Badge>
      <Badge shape="pill">Pill</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const square = canvas.getByText("Square").closest('[data-slot="root"]');
    await expect(square).toHaveAttribute("data-shape", "default");

    const pill = canvas.getByText("Pill").closest('[data-slot="root"]');
    await expect(pill).toHaveAttribute("data-shape", "pill");
  },
};

export const DesignGuideOverview: Story = {
  name: "Recipe/Design Guide Overview",
  parameters: {
    docs: {
      description: {
        story: "각 variant/color 가 Figma 가이드(171:10856)에 등재된 core 항목인지 확인.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-wide)" }}>
      <div>
        <h4 style={{ marginBottom: 12 }}>Variants</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 220px)",
            gap: "var(--semantic-gap-loose)",
          }}
        >
          {VARIANTS.map((variant) => (
            <div
              key={variant}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--semantic-gap-default)",
                padding: "var(--semantic-inset-input)",
                border: "1px solid #ECECEC",
                borderRadius: 8,
              }}
            >
              <Badge variant={variant}>{variant}</Badge>
              <DesignGuideBadge meta={badgeGuideMeta} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: 12 }}>Colors</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 220px)",
            gap: "var(--semantic-gap-loose)",
          }}
        >
          {COLORS.map((color) => (
            <div
              key={color}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--semantic-gap-default)",
                padding: "var(--semantic-inset-input)",
                border: "1px solid #ECECEC",
                borderRadius: 8,
              }}
            >
              <Badge color={color}>{color}</Badge>
              <DesignGuideBadge meta={badgeGuideMeta} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
