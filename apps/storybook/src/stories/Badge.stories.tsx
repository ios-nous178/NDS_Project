import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Badge } from "@nudge-eap/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
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
      options: ["primary", "secondary", "success", "caution", "error", "neutral"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
  args: {
    variant: "primary",
    size: "md",
    children: "참여중",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {};

export const Primary: Story = {
  name: "State/Primary",
  args: {
    variant: "primary",
    children: "기본 배지",
  },
};

export const Success: Story = {
  name: "State/Success",
  args: {
    variant: "success",
    children: "완료",
  },
};

export const Error: Story = {
  name: "State/Error",
  args: {
    variant: "error",
    children: "오류",
  },
};

export const SizeScale: Story = {
  name: "State/Size Scale",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
    </div>
  ),
};

export const ChallengeBadges: Story = {
  name: "Recipe/Challenge Badges",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Badge variant="secondary">배당형</Badge>
      <Badge variant="caution">선착순형</Badge>
      <Badge variant="primary">응모형</Badge>
      <Badge variant="success">참여중</Badge>
    </div>
  ),
};

export const CouponAndStatusBadges: Story = {
  name: "Recipe/Coupon And Status Badges",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Badge variant="primary">방문 전용</Badge>
      <Badge variant="secondary">온라인 전용</Badge>
      <Badge variant="neutral">상태없음</Badge>
      <Badge variant="error">취소됨</Badge>
    </div>
  ),
};

export const RoundedPillExamples: Story = {
  name: "Recipe/Rounded Pill Examples",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Badge style={{ borderRadius: 999, paddingInline: 10 }}>배당형</Badge>
      <Badge variant="caution" style={{ borderRadius: 999, paddingInline: 10 }}>
        선착순
      </Badge>
      <Badge variant="primary" style={{ borderRadius: 999, paddingInline: 10 }}>
        응모형
      </Badge>
    </div>
  ),
};

export const LabelSlotOverride: Story = {
  name: "Recipe/Label Slot Override",
  render: () => (
    <Badge
      variant="secondary"
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
    variant: "success",
    size: "sm",
    children: "참여중",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText("참여중").closest('[data-slot="root"]');

    await expect(badge).toHaveAttribute("data-variant", "success");
    await expect(badge).toHaveAttribute("data-size", "sm");
  },
};

export const AllVariantsContractInteraction: Story = {
  name: "Interaction/All Variants Contract",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="caution">Caution</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const variants = ["primary", "secondary", "success", "caution", "error", "neutral"] as const;
    for (const variant of variants) {
      const text = variant.charAt(0).toUpperCase() + variant.slice(1);
      const badge = canvas.getByText(text).closest('[data-slot="root"]');
      await expect(badge).toHaveAttribute("data-variant", variant);
    }
  },
};

export const SizeContractInteraction: Story = {
  name: "Interaction/Size Contract",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const sm = canvas.getByText("Small").closest('[data-slot="root"]');
    await expect(sm).toHaveAttribute("data-size", "sm");

    const md = canvas.getByText("Medium").closest('[data-slot="root"]');
    await expect(md).toHaveAttribute("data-size", "md");
  },
};
