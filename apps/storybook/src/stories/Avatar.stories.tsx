import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "@nudge-design/react";

const SIZE_PX: Record<string, number> = { xs: 24, sm: 32, md: 48, lg: 64, xl: 96 };

const meta: Meta<typeof Avatar> = {
  title: "Components/Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Figma 24/32/48/64/96 = xs/sm/md/lg/xl",
    },
    shape: {
      control: "inline-radio",
      options: ["circle", "rounded", "square"],
      description: "circle(인물 프로필·기본) · rounded(앱/썸네일) · square(콘텐츠/제품)",
    },
  },
  args: { size: "md", shape: "circle" },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Playground: Story = {
  args: { src: "https://i.pravatar.cc/150?img=3", alt: "사용자" },
};

export const WithImage: Story = {
  name: "Variant/이미지",
  tags: ["gallery"],
  args: { src: "https://i.pravatar.cc/150?img=5", alt: "사용자", size: "lg" },
};

export const WithInitials: Story = {
  name: "Variant/이니셜",
  args: { name: "홍길동", size: "lg" },
};

export const DefaultIcon: Story = {
  name: "Variant/기본 아이콘",
  args: { size: "lg" },
};

export const BrokenImage: Story = {
  name: "Variant/이미지 오류→이니셜",
  args: { src: "https://broken-url.invalid/404.jpg", name: "김철수", size: "lg" },
};

export const AllSizes: Story = {
  name: "Variant/Size 전체 비교 (24/32/48/64/96)",
  render: () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--semantic-gap-comfortable)" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Avatar size={size} name="홍길동" />
          <span style={{ fontSize: 11, color: "#999" }}>
            {size} · {SIZE_PX[size]}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const AllShapes: Story = {
  name: "Variant/Shape 3종 (circle/rounded/square)",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-comfortable)" }}>
      {(["circle", "rounded", "square"] as const).map((shape) => (
        <div key={shape} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Avatar size="xl" shape={shape} src="https://i.pravatar.cc/150?img=8" />
          <span style={{ fontSize: 11, color: "#999" }}>{shape}</span>
        </div>
      ))}
    </div>
  ),
};

export const ShapeSizeMatrix: Story = {
  name: "Variant/Shape × Size 매트릭스",
  tags: ["gallery"],
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {(["circle", "rounded", "square"] as const).map((shape) => (
        <div key={shape} style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <span style={{ width: 56, fontSize: 12, color: "#666" }}>{shape}</span>
          {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
            <Avatar key={size} size={size} shape={shape} name="A" />
          ))}
        </div>
      ))}
    </div>
  ),
};
