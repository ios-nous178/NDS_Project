import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "@nudge-design/react";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
  args: { size: "md" },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Playground: Story = {
  args: { src: "https://i.pravatar.cc/150?img=3", alt: "사용자" },
};

export const WithImage: Story = {
  name: "Fallback/이미지",
  args: { src: "https://i.pravatar.cc/150?img=5", alt: "사용자", size: "lg" },
};

export const WithInitials: Story = {
  name: "Fallback/이니셜",
  args: { name: "홍길동", size: "lg" },
};

export const DefaultIcon: Story = {
  name: "Fallback/기본 아이콘",
  args: { size: "lg" },
};

export const BrokenImage: Story = {
  name: "Fallback/이미지 오류→이니셜",
  args: { src: "https://broken-url.invalid/404.jpg", name: "김철수", size: "lg" },
};

export const AllSizes: Story = {
  name: "Size/전체 비교",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-comfortable)" }}>
      <Avatar size="xs" name="A" />
      <Avatar size="sm" name="BC" />
      <Avatar size="md" name="홍길동" />
      <Avatar size="lg" src="https://i.pravatar.cc/150?img=8" />
      <Avatar size="xl" src="https://i.pravatar.cc/150?img=12" />
    </div>
  ),
};
