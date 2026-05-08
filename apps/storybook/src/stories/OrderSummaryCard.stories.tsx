import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OrderSummaryCard, Button } from "@nudge-eap/react";

const meta: Meta<typeof OrderSummaryCard> = {
  title: "Components/OrderSummaryCard",
  component: OrderSummaryCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof OrderSummaryCard>;

export const Playground: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <OrderSummaryCard
        rows={[
          { label: "상품 금액", value: "39,000원" },
          { label: "쿠폰 할인", value: "-5,000원", emphasis: "discount" },
          { label: "포인트 사용", value: "-1,000원", emphasis: "discount" },
          { label: "배송비", value: "무료" },
        ]}
        total={<>33,000원</>}
        footer={<Button fullWidth>33,000원 결제하기</Button>}
      />
    </div>
  ),
};

export const Counseling: Story = {
  name: "Recipe/상담 예약 요약",
  render: () => (
    <div style={{ width: 480 }}>
      <OrderSummaryCard
        title="상담 예약 정보"
        rows={[
          { label: "상담사", value: "김민지" },
          { label: "일시", value: "2026.05.15 14:00" },
          { label: "방식", value: "화상 상담" },
          { label: "회기", value: "1회기 / 50분" },
        ]}
        totalLabel="결제 금액"
        total={<>80,000원</>}
        footer={<Button fullWidth>예약 확정하기</Button>}
      />
    </div>
  ),
};

export const FreeOrder: Story = {
  name: "Edge/무료 (EAP)",
  render: () => (
    <div style={{ width: 480 }}>
      <OrderSummaryCard
        title="EAP 무료 상담"
        rows={[
          { label: "상담료", value: "80,000원" },
          { label: "EAP 지원", value: "-80,000원", emphasis: "discount" },
          { label: "회사 부담", value: "100% 지원", emphasis: "info" },
        ]}
        total={<span style={{ color: "var(--color-semantic-success-main, #2BAA48)" }}>0원</span>}
        footer={<Button fullWidth>무료 상담 신청하기</Button>}
      />
    </div>
  ),
};
