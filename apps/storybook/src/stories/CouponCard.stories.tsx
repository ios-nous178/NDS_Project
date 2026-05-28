import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CouponCard } from "@nudge-design/react";

const meta: Meta<typeof CouponCard> = {
  title: "Components/CouponCard",
  component: CouponCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof CouponCard>;

export const Playground: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <CouponCard
        discount="30%"
        title="첫 구매 30% 할인 쿠폰"
        description="3만원 이상 구매 시 사용 가능"
        expiry="2026.06.30 까지"
        onAction={() => alert("쿠폰 사용")}
      />
    </div>
  ),
};

export const FixedAmount: Story = {
  name: "Variant/금액 할인",
  render: () => (
    <div style={{ width: 480 }}>
      <CouponCard
        discount="5,000"
        discountSuffix="원"
        title="EAP 가입 환영 쿠폰"
        description="첫 결제에 자동 적용"
        expiry="2026.05.31 까지"
        onAction={() => undefined}
      />
    </div>
  ),
};

export const Disabled: Story = {
  name: "State/사용 완료",
  render: () => (
    <div style={{ width: 480 }}>
      <CouponCard
        discount="30%"
        title="첫 구매 30% 할인"
        description="3만원 이상"
        expiry="2026.05.10 사용함"
        disabled
        onAction={() => undefined}
      />
    </div>
  ),
};

export const List: Story = {
  name: "Recipe/쿠폰 리스트",
  render: () => (
    <div
      style={{
        width: 480,
        display: "flex",
        flexDirection: "column",
        gap: "var(--gap-comfortable)",
      }}
    >
      <CouponCard
        discount="30%"
        title="첫 구매 30% 할인"
        description="3만원 이상"
        expiry="2026.06.30"
        onAction={() => undefined}
      />
      <CouponCard
        discount="5,000"
        discountSuffix="원"
        title="가입 환영 쿠폰"
        description="첫 결제 자동 적용"
        expiry="2026.05.31"
        onAction={() => undefined}
      />
      <CouponCard
        discount="무료"
        discountSuffix=""
        title="명상 콘텐츠 1주 무료"
        description="신규 가입자"
        expiry="2026.05.20 사용함"
        disabled
      />
    </div>
  ),
};
