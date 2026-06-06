import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "@nudge-design/react";

const meta: Meta = {
  title: "Brands/NudgeEAP/Banner",
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj;

export const EAPIntro: Story = {
  name: "Desktop/EAP 프로그램 안내",
  render: () => (
    <Banner
      title="직원 심리 건강, 지금 시작하세요"
      description="넛지 EAP 프로그램으로 조직의 멘탈 헬스를 관리하세요."
      actionLabel="도입 문의하기"
      actionHref="https://eapkorea.co.kr"
      style={
        {
          "--nds-banner-background": "var(--semantic-bg-brand-subtle)",
          "--nds-banner-radius": "8px",
          "--nds-banner-action-color": "var(--semantic-text-brand-default)",
        } as React.CSSProperties
      }
    />
  ),
};

export const TestRecommend: Story = {
  name: "Mobile/심리검사 추천",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Banner
      title="번아웃이 의심되시나요?"
      description="3분 자가진단으로 현재 상태를 확인해 보세요."
      actionLabel="검사 시작하기"
      style={
        {
          "--nds-banner-background": "var(--semantic-bg-brand-subtle)",
          "--nds-banner-radius": "8px",
          "--nds-banner-title-font-size": "16px",
          "--nds-banner-desc-font-size": "14px",
          "--nds-banner-action-font-size": "14px",
          "--nds-banner-action-color": "var(--semantic-text-brand-default)",
        } as React.CSSProperties
      }
    />
  ),
};

export const AppDownload: Story = {
  name: "Mobile/앱 다운로드",
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
      title="넛지 EAP 앱에서 더 편리하게"
      description="언제 어디서든 상담 신청과 심리검사를 받아보세요."
      actionLabel="앱 다운로드"
      actionHref="#"
      style={
        {
          "--nds-banner-radius": "8px",
        } as React.CSSProperties
      }
    />
  ),
};
