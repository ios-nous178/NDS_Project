import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FAB } from "@nudge-eap/react";

const PlusIcon = (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
    <path d="M11 4v14M4 11h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const EditIcon = (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
    <path
      d="M14 4l4 4-9 9H5v-4l9-9z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

const meta: Meta<typeof FAB> = {
  title: "Components/FAB",
  component: FAB,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    color: { control: "radio", options: ["primary", "secondary", "neutral"] },
    size: { control: "radio", options: ["md", "lg"] },
    position: {
      control: "radio",
      options: ["bottom-right", "bottom-left", "bottom-center", "static"],
    },
  },
  args: { color: "primary", size: "md", position: "static", "aria-label": "추가" },
};

export default meta;
type Story = StoryObj<typeof FAB>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ height: 200, position: "relative" }}>
      <FAB {...args} icon={PlusIcon} />
    </div>
  ),
};

export const Extended: Story = {
  name: "Variant/Extended (라벨 포함)",
  render: () => <FAB icon={EditIcon} label="새로 작성" position="static" />,
};

export const Sizes: Story = {
  name: "Size/md vs lg",
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <FAB icon={PlusIcon} aria-label="md" size="md" position="static" />
      <FAB icon={PlusIcon} aria-label="lg" size="lg" position="static" />
    </div>
  ),
};

export const Colors: Story = {
  name: "Color/primary secondary neutral",
  render: () => (
    <div style={{ display: "flex", gap: 16, padding: 24, background: "#F5F6F8", borderRadius: 12 }}>
      <FAB icon={PlusIcon} aria-label="primary" color="primary" position="static" />
      <FAB icon={PlusIcon} aria-label="secondary" color="secondary" position="static" />
      <FAB icon={PlusIcon} aria-label="neutral" color="neutral" position="static" />
    </div>
  ),
};

export const FixedBottomRight: Story = {
  name: "Position/bottom-right (fixed)",
  render: () => (
    <div
      style={{
        position: "relative",
        height: 320,
        background: "#F5F6F8",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <p style={{ padding: 24 }}>스크롤 가능한 콘텐츠. 우측 하단에 글쓰기 FAB가 떠 있습니다.</p>
      <div
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
        }}
      >
        <FAB icon={EditIcon} aria-label="새 글 작성" position="static" />
      </div>
    </div>
  ),
};
