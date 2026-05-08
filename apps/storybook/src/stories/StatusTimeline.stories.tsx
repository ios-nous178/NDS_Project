import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StatusTimeline } from "@nudge-eap/react";

const meta: Meta<typeof StatusTimeline> = {
  title: "Components/StatusTimeline",
  component: StatusTimeline,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof StatusTimeline>;

const SHIPPING = [
  { key: "received", label: "주문 접수", time: "5/8 14:00" },
  { key: "preparing", label: "상품 준비", time: "5/8 16:30" },
  { key: "shipping", label: "배송 중", time: "5/9 08:00" },
  { key: "delivered", label: "배송 완료" },
];

export const Horizontal: Story = {
  name: "Variant/가로 (배송 추적)",
  render: () => (
    <div style={{ width: 600 }}>
      <StatusTimeline steps={SHIPPING} current={2} direction="horizontal" />
    </div>
  ),
};

export const Vertical: Story = {
  name: "Variant/세로 (상담 진행)",
  render: () => (
    <div style={{ width: 360 }}>
      <StatusTimeline
        steps={[
          {
            key: "intake",
            label: "초기 면담",
            description: "기본 정보와 상담 목표 설정",
            time: "2026.05.01",
          },
          {
            key: "session",
            label: "상담 진행",
            description: "주 1회, 4회기 진행 중",
            time: "2026.05.08 ~ 진행 중",
          },
          {
            key: "review",
            label: "중간 점검",
            description: "진행 상황 리뷰",
          },
          {
            key: "completion",
            label: "종결",
          },
        ]}
        current={1}
        direction="vertical"
      />
    </div>
  ),
};

export const AllDone: Story = {
  name: "State/전부 완료",
  render: () => (
    <div style={{ width: 600 }}>
      <StatusTimeline steps={SHIPPING} current={SHIPPING.length} />
    </div>
  ),
};

export const Start: Story = {
  name: "State/첫 단계",
  render: () => (
    <div style={{ width: 600 }}>
      <StatusTimeline steps={SHIPPING} current={0} />
    </div>
  ),
};
