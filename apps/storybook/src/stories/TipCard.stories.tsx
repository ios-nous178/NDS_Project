import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TipCard } from "@nudge-design/react";

const meta: Meta<typeof TipCard> = {
  title: "Components/TipCard",
  component: TipCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    tone: { control: "radio", options: ["info", "success", "warning", "neutral"] },
  },
  args: { tone: "info" },
};

export default meta;
type Story = StoryObj<typeof TipCard>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 480 }}>
      <TipCard
        {...args}
        label="오늘의 팁"
        title="3분만이라도 호흡에 집중해보세요"
        description="짧은 호흡 가이드는 긴장 회복에 도움이 돼요."
        actionLabel="시작하기"
        onAction={() => alert("호흡 가이드로 이동")}
      />
    </div>
  ),
};

export const Tones: Story = {
  name: "Variant/모든 톤",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--gap-comfortable)",
        width: 480,
      }}
    >
      <TipCard
        tone="info"
        label="정보"
        title="info — 주로 안내"
        description="가벼운 팁/링크에 적합"
      />
      <TipCard
        tone="success"
        label="긍정"
        title="success — 격려"
        description="잘 진행되고 있을 때"
      />
      <TipCard
        tone="warning"
        label="조심"
        title="warning — 주의 환기"
        description="너무 강하지 않은 안내"
      />
      <TipCard
        tone="neutral"
        label="중립"
        title="neutral — 차분한 정보"
        description="일반 인포 톤"
      />
    </div>
  ),
};

export const Minimal: Story = {
  name: "Edge/제목만",
  render: () => (
    <div style={{ width: 480 }}>
      <TipCard title="작은 변화가 쌓이면 큰 차이를 만들어요" />
    </div>
  ),
};

export const ClickableCard: Story = {
  name: "Recipe/카드 전체 클릭",
  render: () => (
    <div style={{ width: 480 }}>
      <TipCard
        tone="success"
        label="새 콘텐츠"
        title="명상 가이드 #5가 도착했어요"
        description="이번 주제는 '잠들기 전 5분'이에요."
        onClick={() => alert("디테일")}
      />
    </div>
  ),
};
