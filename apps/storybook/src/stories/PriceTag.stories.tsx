import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PriceTag } from "@nudge-design/react";

const meta: Meta<typeof PriceTag> = {
  title: "Components/Display/PriceTag",
  component: PriceTag,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
  },
  args: { amount: 39000, originalAmount: 45000, size: "md" },
};

export default meta;
type Story = StoryObj<typeof PriceTag>;

export const Playground: Story = { render: (args) => <PriceTag {...args} /> };

export const Sizes: Story = {
  name: "Variant/sm md lg",
  render: () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-comfortable)" }}
    >
      <PriceTag size="sm" amount={39000} originalAmount={45000} />
      <PriceTag size="md" amount={39000} originalAmount={45000} />
      <PriceTag size="lg" amount={39000} originalAmount={45000} />
    </div>
  ),
};

export const NoDiscount: Story = {
  name: "Variant/할인 없음",
  render: () => <PriceTag amount={29000} />,
};

export const Free: Story = {
  name: "Edge/무료",
  render: () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-comfortable)" }}
    >
      <PriceTag amount={0} />
      <PriceTag amount={0} freeLabel="무료 체험" />
    </div>
  ),
};

export const USD: Story = {
  name: "Variant/달러 (prefix)",
  render: () => <PriceTag amount={29.99} originalAmount={49.99} prefix="$" unit="" />,
};

export const InCardContext: Story = {
  name: "Recipe/상품 카드 안",
  render: () => (
    <div
      style={{
        width: 240,
        padding: "var(--semantic-inset-card)",
        border: "1px solid #ddd",
        borderRadius: 12,
      }}
    >
      <div style={{ background: "#FAFBFC", height: 120, borderRadius: 8, marginBottom: 12 }} />
      <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>마음챙김 가이드북</div>
      <PriceTag amount={19000} originalAmount={25000} size="lg" />
    </div>
  ),
};
