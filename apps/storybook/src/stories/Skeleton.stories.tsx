import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "@nudge-design/react";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Display/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["rectangular", "circular", "text"] },
    width: { control: "text" },
    height: { control: "text" },
  },
  args: { variant: "rectangular", width: 200, height: 120 },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Playground: Story = {};

export const Rectangular: Story = {
  name: "Variant/Rectangular",
  args: { variant: "rectangular", width: 300, height: 160 },
};

export const Circular: Story = {
  name: "Variant/Circular",
  args: { variant: "circular", width: 48 },
};

export const Text: Story = {
  name: "Variant/Text",
  args: { variant: "text", width: "80%" },
};

export const CardSkeleton: Story = {
  name: "Recipe/카드 로딩",
  render: () => (
    <div
      style={{
        width: 280,
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-comfortable)",
      }}
    >
      <Skeleton width={280} height={160} />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="90%" />
      <div style={{ display: "flex", gap: "var(--semantic-gap-default)", alignItems: "center" }}>
        <Skeleton variant="circular" width={32} />
        <Skeleton variant="text" width={100} />
      </div>
    </div>
  ),
};
