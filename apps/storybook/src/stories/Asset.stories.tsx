import type { Meta, StoryObj } from "@storybook/react";
import { Asset } from "@nudge-design/react";
import { CalendarIcon, CounselIcon } from "@nudge-design/icons/mono";
import { GenietPlayIcon, TrostMentalDepressionIcon } from "@nudge-design/icons/multicolor";

const meta: Meta<typeof Asset> = {
  title: "Components/Display/Asset",
  component: Asset,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    shape: { control: "select", options: ["square", "rounded", "circle"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
    scaleType: { control: "select", options: ["cover", "contain", "fill"] },
    overlap: { control: { type: "number", min: 0, max: 24 } },
  },
};

export default meta;
type Story = StoryObj<typeof Asset>;

const SAMPLE = "https://i.pravatar.cc/150?img=3";

export const Playground: Story = {
  args: {
    shape: "circle",
    size: "lg",
    content: { type: "image", src: SAMPLE, alt: "사용자" },
  },
};

export const ContentImage: Story = {
  name: "Variant/Content 이미지",
  args: { size: "lg", content: { type: "image", src: SAMPLE, alt: "프로필" } },
};

export const ContentIcon: Story = {
  name: "Variant/Content 아이콘 (mono)",
  args: {
    size: "lg",
    shape: "rounded",
    content: { type: "icon", icon: <CalendarIcon /> },
  },
};

export const ContentInitial: Story = {
  name: "Variant/Content 이니셜",
  args: { size: "lg", content: { type: "initial", name: "이정민" } },
};

export const ContentMulticolor: Story = {
  name: "Variant/Content Multicolor 아이콘",
  args: {
    size: "xl",
    shape: "rounded",
    content: { type: "icon", icon: <TrostMentalDepressionIcon /> },
  },
};

export const Fallback: Story = {
  name: "Variant/Fallback 이미지 오류 → 이니셜",
  args: {
    size: "lg",
    content: { type: "image", src: "https://broken.invalid/x.jpg", alt: "김상담" },
  },
};

export const Shapes: Story = {
  name: "Variant/Shape 비교",
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Asset size="lg" shape="square" content={{ type: "image", src: SAMPLE, alt: "" }} />
      <Asset size="lg" shape="rounded" content={{ type: "image", src: SAMPLE, alt: "" }} />
      <Asset size="lg" shape="circle" content={{ type: "image", src: SAMPLE, alt: "" }} />
    </div>
  ),
};

export const Sizes: Story = {
  name: "Variant/Size 비교",
  tags: ["gallery"],
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
        <Asset key={s} size={s} content={{ type: "image", src: SAMPLE, alt: "" }} />
      ))}
    </div>
  ),
};

export const UnionOverlap: Story = {
  name: "Variant/Union Overlap (AvatarGroup 대체)",
  render: () => (
    <div style={{ display: "flex" }}>
      <Asset
        size="md"
        overlap={12}
        content={{ type: "image", src: "https://i.pravatar.cc/150?img=4", alt: "A" }}
      />
      <Asset
        size="md"
        overlap={12}
        content={{ type: "image", src: "https://i.pravatar.cc/150?img=5", alt: "B" }}
      />
      <Asset
        size="md"
        overlap={12}
        content={{ type: "image", src: "https://i.pravatar.cc/150?img=6", alt: "C" }}
      />
      <Asset size="md" content={{ type: "initial", name: "+5" }} />
    </div>
  ),
};

export const UnionAcc: Story = {
  name: "Variant/Union Accessory (status dot)",
  tags: ["gallery"],
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Asset
        size="lg"
        content={{ type: "image", src: SAMPLE, alt: "온라인" }}
        acc={
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid white",
            }}
          />
        }
      />
      <Asset
        size="lg"
        shape="rounded"
        content={{ type: "icon", icon: <CounselIcon /> }}
        acc={
          <span
            style={{
              minWidth: 18,
              height: 18,
              padding: "0 6px",
              borderRadius: 9,
              background: "#ef4444",
              color: "white",
              fontSize: 11,
            }}
          >
            3
          </span>
        }
      />
    </div>
  ),
};

export const BrandSignature: Story = {
  name: "Recipe/브랜드 시그니처 (Geniet/Trost)",
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Asset size="xl" shape="rounded" content={{ type: "icon", icon: <GenietPlayIcon /> }} />
      <Asset
        size="xl"
        shape="rounded"
        content={{ type: "icon", icon: <TrostMentalDepressionIcon /> }}
      />
    </div>
  ),
};
