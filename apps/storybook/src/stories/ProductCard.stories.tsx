import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProductCard, PriceTag } from "@nudge-eap/react";
import { StarIcon } from "@nudge-eap/icons";

const RatingFooter = ({ children }: { children: React.ReactNode }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--gap-tight)" }}>
    <StarIcon size={12} color="var(--semantic-icon-status-caution)" />
    {children}
  </span>
);

const meta: Meta<typeof ProductCard> = {
  title: "Components/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Playground: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <ProductCard
        thumbnail="https://picsum.photos/seed/book/400/400"
        description="마음챙김 굿즈"
        title="마음챙김 가이드북 + 명상 카드 세트"
        price={<PriceTag amount={29000} originalAmount={39000} size="md" />}
        footer={<RatingFooter>4.8 (124)</RatingFooter>}
        onClick={() => undefined}
      />
    </div>
  ),
};

export const Grid: Story = {
  name: "Recipe/2칸 그리드",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "var(--gap-comfortable)",
        width: 480,
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <ProductCard
          key={i}
          thumbnail={`https://picsum.photos/seed/p${i}/400/400`}
          description="굿즈"
          title={`마음챙김 상품 ${i}`}
          price={<PriceTag amount={10000 * i} size="sm" />}
          footer={<RatingFooter>{(4.0 + i * 0.2).toFixed(1)}</RatingFooter>}
          onClick={() => undefined}
        />
      ))}
    </div>
  ),
};

export const SoldOut: Story = {
  name: "State/품절",
  render: () => (
    <div style={{ width: 240 }}>
      <ProductCard
        thumbnail="https://picsum.photos/seed/sold/400/400"
        title="한정판 명상 키트"
        price={<PriceTag amount={49000} />}
        soldOut
      />
    </div>
  ),
};

export const NewBadge: Story = {
  name: "Recipe/NEW 뱃지",
  render: () => (
    <div style={{ width: 240 }}>
      <ProductCard
        thumbnail="https://picsum.photos/seed/new/400/400"
        badge="NEW"
        description="신규 출시"
        title="2026 봄 신상품 마음챙김 키트"
        price={<PriceTag amount={29000} />}
      />
    </div>
  ),
};
