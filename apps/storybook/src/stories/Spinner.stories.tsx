import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Spinner, Button } from "@nudge-design/react";

const meta: Meta<typeof Spinner> = {
  title: "Components/Display/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  name: "State/Default",
  render: () => <Spinner />,
};

export const Sizes: Story = {
  name: "State/Sizes",
  render: () => (
    <div style={{ display: "flex", gap: "var(--semantic-gap-wide)", alignItems: "center" }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size={48} />
    </div>
  ),
};

export const InsideButton: Story = {
  name: "Recipe/Inside Button",
  render: () => (
    <Button color="primary" variant="solid" disabled>
      <Spinner size="sm" color="currentColor" />
      <span style={{ marginLeft: 8 }}>처리 중...</span>
    </Button>
  ),
};

export const InfiniteLoad: Story = {
  name: "Recipe/Infinite Scroll Loader",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--semantic-gap-default)",
        padding: 40,
        color: "var(--semantic-text-subtle-default)",
      }}
    >
      <Spinner />
      <span style={{ fontSize: 13 }}>더 불러오는 중</span>
    </div>
  ),
};
