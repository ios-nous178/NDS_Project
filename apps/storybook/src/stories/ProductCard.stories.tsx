import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProductCard } from "@nudge-eap/react";

const meta: Meta<typeof ProductCard> = {
  title: "Components/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "상품 카드 (140w). 정사각 썸네일 + 상품명(2줄 ellipsis) + 할인율/가격/단위 가로 row. " +
          "가격은 Lato Black 18 / 할인율은 Lato Medium 18 + statusError — 자릿수가 늘어도 시각 무게 일정.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

/* ─── State: Default ─── */

export const Default: Story = {
  name: "State/Default",
  render: () => (
    <ProductCard
      thumbnail="https://picsum.photos/seed/product-1/300/300"
      title="베스트 닭가슴살 패키지 모음전 — 단독 상품"
      discountPercent={31}
      price={13900}
      onClick={() => undefined}
    />
  ),
};

/* ─── State: 할인 없음 ─── */

export const NoDiscount: Story = {
  name: "State/No Discount",
  render: () => (
    <ProductCard
      thumbnail="https://picsum.photos/seed/cashdeal-2/300/300"
      title="정상가 그릭요거트 6팩 세트"
      price={9800}
    />
  ),
};

/* ─── State: 짧은 제목 ─── */

export const ShortTitle: Story = {
  name: "State/Short Title",
  render: () => (
    <ProductCard
      thumbnail="https://picsum.photos/seed/cashdeal-3/300/300"
      title="단호박 다이어트"
      discountPercent={15}
      price={5900}
    />
  ),
};

/* ─── State: 긴 가격 (자릿수 늘어도 유지) ─── */

export const HighPrice: Story = {
  name: "State/High Price",
  render: () => (
    <ProductCard
      thumbnail="https://picsum.photos/seed/cashdeal-4/300/300"
      title="프리미엄 단백질 보충제 1.5kg 대용량"
      discountPercent={20}
      price={129000}
    />
  ),
};

/* ─── State: NEW 뱃지 ─── */

export const NewBadge: Story = {
  name: "State/NEW Badge",
  render: () => (
    <ProductCard
      thumbnail="https://picsum.photos/seed/cashdeal-5/300/300"
      badge="NEW"
      title="2026 봄 신상 다이어트 도시락"
      discountPercent={10}
      price={11900}
    />
  ),
};

/* ─── State: 품절 ─── */

export const SoldOut: Story = {
  name: "State/SoldOut",
  render: () => (
    <ProductCard
      thumbnail="https://picsum.photos/seed/cashdeal-6/300/300"
      title="한정판 명상 키트"
      discountPercent={25}
      price={49000}
      soldOut
    />
  ),
};

/* ─── Recipe: 가로 스크롤 행 ─── */

export const HorizontalRow: Story = {
  name: "Recipe/Horizontal Row",
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 16,
        overflowX: "auto",
        padding: "8px 0",
        width: 480,
      }}
    >
      {[
        {
          id: 1,
          title: "베스트 닭가슴살 패키지 모음전 — 단독 상품",
          discount: 31,
          price: 13900,
        },
        { id: 2, title: "그릭요거트 6팩 세트", discount: 15, price: 9800 },
        { id: 3, title: "단호박 다이어트 1주 도시락", discount: 25, price: 32000 },
        { id: 4, title: "유기농 통밀 식빵 정기배송", discount: 10, price: 7900 },
      ].map((p) => (
        <ProductCard
          key={p.id}
          thumbnail={`https://picsum.photos/seed/row${p.id}/300/300`}
          title={p.title}
          discountPercent={p.discount}
          price={p.price}
          onClick={() => undefined}
        />
      ))}
    </div>
  ),
};
