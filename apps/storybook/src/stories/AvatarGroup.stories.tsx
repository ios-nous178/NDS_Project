import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AvatarGroup } from "@nudge-eap/react";

const meta: Meta<typeof AvatarGroup> = {
  title: "Components/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    max: { control: { type: "number", min: 1, max: 10 } },
  },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

const PEOPLE = [
  { name: "김민지" },
  { name: "이수영" },
  { name: "박지원" },
  { name: "최서연" },
  { name: "정태훈" },
  { name: "한가람" },
];

export const Playground: Story = {
  args: { items: PEOPLE, max: 4, size: "md" },
  render: (args) => <AvatarGroup {...args} />,
};

export const Sizes: Story = {
  name: "Size/모든 크기",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-comfortable)" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <AvatarGroup key={s} items={PEOPLE} size={s} />
      ))}
    </div>
  ),
};

export const NoOverflow: Story = {
  name: "Edge/+N 없음",
  render: () => <AvatarGroup items={PEOPLE.slice(0, 3)} />,
};

export const ManyMembers: Story = {
  name: "Recipe/단체 상담 (12명)",
  render: () => (
    <AvatarGroup items={Array.from({ length: 12 }, (_, i) => ({ name: `회원${i + 1}` }))} max={5} />
  ),
};

export const WithImages: Story = {
  name: "Recipe/이미지 + 이니셜 fallback",
  render: () => (
    <AvatarGroup
      items={[
        { src: "https://i.pravatar.cc/100?img=1", name: "Alex" },
        { src: "https://i.pravatar.cc/100?img=2", name: "Sam" },
        { name: "이수영" },
        { src: "https://i.pravatar.cc/100?img=4", name: "Ben" },
        { name: "박지원" },
      ]}
      max={4}
    />
  ),
};
