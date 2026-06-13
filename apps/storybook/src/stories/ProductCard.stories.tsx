import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProductCard } from "@nudge-design/react";

const meta: Meta<typeof ProductCard> = {
  title: "Components/Domain/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "상품 카드. `size='sm'` (140w 모바일) / `size='md'` (236w 데스크탑) 두 사이즈. " +
          "선택 슬롯: `rankingNumber` · `originalPrice` · `reward` · `freeShipping` · `pointDiscount` · `buyersCount` · `rating` · `reviewCount`. " +
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

/* ─── Variation: 캐시딜 PC (236w) — 랭킹 + 풀 메타 ─── */

export const CashdealDesktop: Story = {
  tags: ["gallery"],
  name: "Variant/Desktop (md)",
  parameters: {
    docs: {
      description: {
        story:
          "데스크탑 상품 카드 (236w). 랭킹 배지 + 원가(취소선) + 할인율/가격 + 적립/무료배송 칩 + 구매자수/별점 풀스펙.",
      },
    },
  },
  render: () => (
    <ProductCard
      size="md"
      thumbnail="https://picsum.photos/seed/product-pc-1/472/472"
      rankingNumber={1}
      title="베스트셀러 종합비타민 30일분 2박스 패키지 모음전"
      originalPrice={20250}
      discountPercent={31}
      price={13900}
      reward={{ amount: 417 }}
      freeShipping
      buyersCount={329}
      rating={5}
      onClick={() => undefined}
    />
  ),
};

/* ─── Recipe: 캐시딜 PC 랭킹 리스트 1~5위 ─── */

export const CashdealRankingRow: Story = {
  tags: ["gallery"],
  name: "Recipe/랭킹 목록 (Desktop)",
  parameters: {
    docs: {
      description: {
        story: "Figma 337:1122 — 랭킹 1~5위 가로 나열. 각 카드는 size='md'.",
      },
    },
  },
  render: () => {
    const items = [
      {
        title: "허닭X캐시딜단독 베스트 닭가슴살/주먹밥/소시지 외 패키지 모음전",
        original: 20250,
        discount: 31,
        price: 13900,
        reward: 417,
        buyers: 329,
        rating: 5,
      },
      {
        title: "하림 맛닭가슴살 바베큐맛 100g 10개",
        original: 29900,
        discount: 78,
        price: 6500,
        reward: 195,
        buyers: 99999,
        rating: 5,
      },
      {
        title: "네네치킨 저당 닭가슴살/닭다리살/소시지/스테이크/주먹밥 외 52종 골라담기",
        original: 28800,
        discount: 48,
        price: 15900,
        reward: 447,
        buyers: 329,
        rating: 4.7,
      },
      {
        title: "[만원의행복] 1+1 비그레인 시카고 프로틴 베이글 골라담기",
        original: 13900,
        discount: 31,
        price: 10500,
        reward: 300,
        buyers: 2644,
        rating: 5,
      },
      {
        title: "[품질보장] 명물 춘천 간장/양념 닭갈비 500g 2팩 (총 1kg) 닭다리살",
        original: 14900,
        discount: 27,
        price: 10900,
        reward: 327,
        buyers: 234,
        rating: 5,
      },
    ];
    return (
      <div style={{ display: "flex", gap: 25, overflowX: "auto", padding: "8px 0" }}>
        {items.map((p, i) => (
          <ProductCard
            key={p.title}
            size="md"
            thumbnail={`https://picsum.photos/seed/cashdeal-rank-${i + 1}/472/472`}
            rankingNumber={i + 1}
            title={p.title}
            originalPrice={p.original}
            discountPercent={p.discount}
            price={p.price}
            reward={{ amount: p.reward }}
            freeShipping
            buyersCount={p.buyers}
            rating={p.rating}
            onClick={() => undefined}
          />
        ))}
      </div>
    );
  },
};

/* ─── Variation: 캐시딜 Mobile (140w) — 포인트할인 + 풀 메타 ─── */

export const CashdealMobile: Story = {
  name: "Variant/Cashdeal Mobile (sm)",
  parameters: {
    docs: {
      description: {
        story:
          "캐시딜 모바일 카드 (140w). 포인트할인 외곽선 칩 + 원가(취소선) + 할인율/가격 + 별점/리뷰수 + 적립/무료배송 칩 + 구매자수.",
      },
    },
  },
  render: () => (
    <ProductCard
      thumbnail="https://picsum.photos/seed/cashdeal-mo-1/280/280"
      title="허닭X캐시딜단독 베스트 닭가슴살/주먹밥/소시지 외 패키지 모음전"
      pointDiscount
      originalPrice={523900}
      discountPercent={30}
      price={400000}
      reward={{ amount: 40000 }}
      freeShipping
      buyersCount={999999}
      rating={5}
      reviewCount={1208}
      onClick={() => undefined}
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
