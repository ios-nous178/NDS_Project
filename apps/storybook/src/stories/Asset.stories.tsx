import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";
import { Asset, Badge } from "@nudge-design/react";
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

// 캐시워크 마스코트 — 투명 PNG 를 연노랑(#FEF3C7) 정사각 캔버스에 합성해 구운 이미지.
// apps/storybook/public/asset-sample-mascot.png (360×360, 배경 baked) — staticDirs:["../public"] 로 이 경로 로드.
// 정사각이라 circle/rounded 어느 프레임에도 cover 로 꽉 찬다. --nds-asset-bg 는 동일색 fallback(로드 실패 대비).
const MASCOT = "/asset-sample-mascot.png";
const MASCOT_BG = "#FEF3C7"; // 이미지에 구운 연노랑과 동일 색 (스토리 데모용 — DS 토큰 아님)

export const Playground: Story = {
  args: {
    shape: "circle",
    size: "xl",
    scaleType: "cover",
    content: { type: "image", src: MASCOT, alt: "캐시워크 마스코트" },
  },
  render: (args) => <Asset {...args} style={{ "--nds-asset-bg": MASCOT_BG } as CSSProperties} />,
};

export const ContentImage: Story = {
  name: "Variant/Content 이미지",
  args: {
    size: "xl",
    shape: "rounded",
    scaleType: "cover",
    content: { type: "image", src: MASCOT, alt: "캐시워크 마스코트" },
  },
  render: (args) => <Asset {...args} style={{ "--nds-asset-bg": MASCOT_BG } as CSSProperties} />,
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

/**
 * 여러 아바타를 겹쳐 쌓는 "그룹" UI 는 `AvatarGroup`(items/max/자동 +N) 을 쓰세요.
 * Asset 의 `overlap` 은 그 위에서 단일 Asset 의 우측 음수 마진을 제어하는 저수준 prop 입니다.
 *
 * acc 슬롯에는 raw hex inline-style 로 점/뱃지를 손수 그리지 말고 DS 컴포넌트를 넣습니다 (예: count/상태 뱃지는 Badge).
 */
export const UnionAcc: Story = {
  name: "Variant/Union Accessory (badge)",
  tags: ["gallery"],
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Asset
        size="lg"
        shape="rounded"
        content={{ type: "icon", icon: <CounselIcon /> }}
        acc={
          <Badge variant="fill" color="error" shape="pill" size="sm">
            3
          </Badge>
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
