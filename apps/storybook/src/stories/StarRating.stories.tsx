import type { Meta, StoryObj } from "@storybook/react";
import { StarRating } from "@nudge-design/react";

const meta: Meta<typeof StarRating> = {
  title: "Components/Display/StarRating",
  component: StarRating,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof StarRating>;

export const Ratings: Story = {
  name: "Variant/값 · 크기",
  tags: ["gallery"],
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <StarRating value={5} size={20} />
      <StarRating value={4} size={20} />
      <StarRating value={3} size={20} />
      <StarRating value={4} size={20} showValue />
      <StarRating value={2} size={14} />
    </div>
  ),
};

export const Review: Story = {
  name: "Recipe/리뷰 평점",
  render: () => (
    <div
      style={{
        width: 240,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        border: "1px solid var(--semantic-border-default)",
        borderRadius: 12,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 600 }}>상담 만족도</span>
      <StarRating value={5} size={18} showValue />
    </div>
  ),
};
