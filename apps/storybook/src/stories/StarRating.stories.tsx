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
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      {[1, 2, 3, 4, 5].map((v) => (
        <StarRating key={v} value={v} size={20} showValue />
      ))}
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
