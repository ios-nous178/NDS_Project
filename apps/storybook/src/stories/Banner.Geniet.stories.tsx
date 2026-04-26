import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "@nudge-eap/react";

const meta: Meta = {
  title: "Brands/Geniet/Banner",
  parameters: { layout: "padded" },
  globals: { brand: "geniet" },
};
export default meta;
type Story = StoryObj;

export const HealthyDeal: Story = {
  name: "Desktop/헬시딜 프로모션",
  render: () => (
    <Banner
      title="오늘의 헬시딜"
      description="건강한 식품을 특가로 만나보세요. 매일 새로운 상품이 업데이트됩니다."
      actionLabel="헬시딜 보러가기"
      actionHref="/cashdeal"
      imageSrc="https://placehold.co/120x120/E4F6F7/48C2C5?text=Deal"
      imageWidth={120}
      imageHeight={120}
      style={
        {
          "--nds-banner-background": "#E4F6F7",
          "--nds-banner-radius": "12px",
          "--nds-banner-action-color": "#48C2C5",
        } as React.CSSProperties
      }
    />
  ),
};

export const FriendInvite: Story = {
  name: "Mobile/친구초대 이벤트",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Banner
      title="친구 초대하고 포인트 받기"
      description="초대한 친구가 가입하면 서로 1,000P를 드려요."
      actionLabel="친구 초대하기"
      style={
        {
          "--nds-banner-background": "#ECF8F9",
          "--nds-banner-radius": "8px",
          "--nds-banner-title-font-size": "16px",
          "--nds-banner-desc-font-size": "14px",
          "--nds-banner-action-color": "#48C2C5",
        } as React.CSSProperties
      }
    />
  ),
};

export const DietRecord: Story = {
  name: "Mobile/식단 기록 유도",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Banner
      variant="outlined"
      title="오늘 뭐 드셨나요?"
      description="식단을 기록하고 건강 리포트를 받아보세요."
      actionLabel="기록하기"
      actionHref="/record"
      style={
        {
          "--nds-banner-radius": "8px",
        } as React.CSSProperties
      }
    />
  ),
};
