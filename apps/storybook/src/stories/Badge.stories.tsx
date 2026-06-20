import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Badge, type BadgeColor, type BadgeType, type BadgeVariant } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";
import { DesignGuideBadge } from "../components/DesignGuideBadge";
import { coreGuideMeta } from "../components/guideMeta";

// Figma 가이드(171:10856) 등재 메타 — SSOT 는 guides-src/components/Badge.md frontmatter
const badgeGuideMeta = coreGuideMeta("Badge");

const VARIANTS: BadgeVariant[] = ["fill", "ghost", "line"];
const COLORS: BadgeColor[] = ["project", "neutral", "success", "error", "caution", "info"];
const TYPES: BadgeType[] = ["label", "dot", "count"];

const COLOR_USAGE: Record<BadgeColor, string> = {
  project: "주요 액션, 프로젝트 강조",
  neutral: "일반 카테고리, 기본 레이블",
  success: "완료, 성공, 진행 중",
  error: "오류, 실패, 위험",
  caution: "주의, 경고, 선착순",
  info: "정보, 안내, 공지",
};

const COLOR_LABEL: Record<BadgeColor, string> = {
  project: "Project",
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
    type: {
      control: "select",
      options: TYPES,
      description:
        "Figma `type`(트로스트 5107-130) — label(텍스트 배지, 기본) / dot(8×8 상태 점) / count(min 18px 원형 숫자 카운터)",
    },
  },
  args: {
    variant: "fill",
    color: "project",
    size: "md",
    children: "Project",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Overview: Story = {
  name: "Overview",
  tags: ["gallery"],
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-default)" }}>
      <Badge variant="fill" color="project">
        진행 중
      </Badge>
      <Badge variant="ghost" color="success">
        완료
      </Badge>
      <Badge variant="line" color="info">
        공지
      </Badge>
      <Badge variant="fill" color="caution">
        주의
      </Badge>
      <Badge variant="fill" color="neutral" shape="pill">
        태그
      </Badge>
    </div>
  ),
};

export const Playground: Story = {};

export const StyleMatrix: Story = {
  name: "Spec/Style × Color Matrix",
  tags: ["gallery"],
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
      <Badge size="sm" color="project">
        SM
      </Badge>
      <Badge size="md" color="project">
        MD
      </Badge>
      <Badge size="lg" color="project">
        LG
      </Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const sm = canvas.getByText("SM").closest('[data-slot="root"]');
    await expect(sm).toHaveAttribute("data-size", "sm");

    const md = canvas.getByText("MD").closest('[data-slot="root"]');
    await expect(md).toHaveAttribute("data-size", "md");

    const lg = canvas.getByText("LG").closest('[data-slot="root"]');
    await expect(lg).toHaveAttribute("data-size", "lg");
  },
};

export const ShapeScale: Story = {
  name: "Spec/Shape",
  tags: ["gallery"],
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-default)" }}>
      <Badge shape="default" variant="ghost" color="project">
        default
      </Badge>
      <Badge shape="pill" variant="ghost" color="project">
        pill
      </Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const square = canvas.getByText("default").closest('[data-slot="root"]');
    await expect(square).toHaveAttribute("data-shape", "default");

    const pill = canvas.getByText("pill").closest('[data-slot="root"]');
    await expect(pill).toHaveAttribute("data-shape", "pill");
  },
};

export const TypeAxis: Story = {
  name: "Spec/Type (label · dot · count)",
  tags: ["gallery"],
  parameters: {
    docs: {
      description: {
        story:
          "트로스트 가이드(5107-130) type 축. label(텍스트 배지, 기본) / dot(8×8 상태 점, 텍스트 없음) / count(min 18px 원형 숫자 카운터). dot·count 의 색은 variant=fill 룰에서 나온다(color 로 의미색 지정).",
      },
    },
  },
  render: () => (
    <div
      data-project="trost"
      style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-loose)" }}>
        <span style={{ minWidth: 56, fontSize: 13, fontWeight: 700 }}>label</span>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-default)" }}>
          <Badge type="label" variant="fill" color="project">
            NEW
          </Badge>
          <Badge type="label" variant="ghost" color="success">
            완료
          </Badge>
          <Badge type="label" variant="ghost" color="neutral">
            태그
          </Badge>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-loose)" }}>
        <span style={{ minWidth: 56, fontSize: 13, fontWeight: 700 }}>dot</span>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-default)" }}>
          <Badge type="dot" variant="fill" color="error" aria-label="미확인" />
          <Badge type="dot" variant="fill" color="success" aria-label="활성" />
          <Badge type="dot" variant="fill" color="project" aria-label="강조" />
          <Badge type="dot" variant="fill" color="neutral" aria-label="기본" />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-loose)" }}>
        <span style={{ minWidth: 56, fontSize: 13, fontWeight: 700 }}>count</span>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-default)" }}>
          <Badge type="count" variant="fill" color="error">
            1
          </Badge>
          <Badge type="count" variant="fill" color="error">
            12
          </Badge>
          <Badge type="count" variant="fill" color="project">
            99+
          </Badge>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const dot = canvas.getByLabelText("미확인").closest('[data-slot="root"]');
    await expect(dot).toHaveAttribute("data-type", "dot");

    const count = canvas.getByText("12").closest('[data-slot="root"]');
    await expect(count).toHaveAttribute("data-type", "count");

    const label = canvas.getByText("NEW").closest('[data-slot="root"]');
    await expect(label).toHaveAttribute("data-type", "label");
  },
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
      <Badge variant="ghost" color="project">
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
          "캐포비 admin(Figma 3782-20558): 동적 상태값 = 라운드 사각(shape 기본), 정적 식별 태그 = pill. 톤은 ghost 매핑(충전=project·사용=info·적립=success·만료=neutral·취소=error).",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--semantic-gap-default)" }}>
        <Badge variant="ghost" color="project" size="sm">
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
        <Badge variant="ghost" color="project" shape="pill" size="sm">
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
      color="project"
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
