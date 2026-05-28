import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FAB } from "@nudge-design/react";
import { PlusIcon, EditIcon } from "@nudge-design/icons";

const plusIconNode = <PlusIcon size={22} aria-hidden />;
const editIconNode = <EditIcon size={22} aria-hidden />;

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
      <FAB {...args} icon={plusIconNode} />
    </div>
  ),
};

export const Extended: Story = {
  name: "Variant/Extended (라벨 포함)",
  render: () => <FAB icon={editIconNode} label="새로 작성" position="static" />,
};

export const Sizes: Story = {
  name: "Size/md vs lg",
  render: () => (
    <div style={{ display: "flex", gap: "var(--gap-loose)", alignItems: "center" }}>
      <FAB icon={plusIconNode} aria-label="md" size="md" position="static" />
      <FAB icon={plusIconNode} aria-label="lg" size="lg" position="static" />
    </div>
  ),
};

export const Colors: Story = {
  name: "Color/primary secondary neutral",
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "var(--gap-loose)",
        padding: "var(--inset-modal)",
        background: "#F5F6F8",
        borderRadius: 12,
      }}
    >
      <FAB icon={plusIconNode} aria-label="primary" color="primary" position="static" />
      <FAB icon={plusIconNode} aria-label="secondary" color="secondary" position="static" />
      <FAB icon={plusIconNode} aria-label="neutral" color="neutral" position="static" />
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
      <p style={{ padding: "var(--inset-modal)" }}>
        스크롤 가능한 콘텐츠. 우측 하단에 글쓰기 FAB가 떠 있습니다.
      </p>
      <div
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
        }}
      >
        <FAB icon={editIconNode} aria-label="새 글 작성" position="static" />
      </div>
    </div>
  ),
};
