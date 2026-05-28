import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StatCard, Sparkline } from "@nudge-design/react";

const meta: Meta<typeof StatCard> = {
  title: "Components/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Playground: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <StatCard label="이번 주 평균 수면" value="7.4" unit="시간" delta="+0.4" trend="up" />
    </div>
  ),
};

export const Grid: Story = {
  name: "Recipe/대시보드 4-up 그리드",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "var(--gap-comfortable)",
        width: 600,
      }}
    >
      <StatCard
        label="감정 기록"
        value="14"
        unit="건"
        delta="+3"
        trend="up"
        description="이번 주"
      />
      <StatCard
        label="스트레스 점수"
        value="38"
        unit="점"
        delta="-5"
        trend="down"
        description="평균"
      />
      <StatCard
        label="명상 시간"
        value="42"
        unit="분"
        delta="0"
        trend="flat"
        description="이번 주"
      />
      <StatCard label="상담 세션" value="2" unit="회" description="이번 달" />
    </div>
  ),
};

export const WithSparkline: Story = {
  name: "Recipe/Sparkline 결합",
  render: () => (
    <div style={{ width: 320 }}>
      <StatCard
        label="이번 주 수면"
        value="7.4"
        unit="시간"
        delta="+0.4"
        trend="up"
        trailing={
          <Sparkline data={[6.5, 7, 7.2, 6.8, 7.5, 8, 7.4]} kind="area" width={100} height={36} />
        }
      />
    </div>
  ),
};

export const Clickable: Story = {
  name: "Recipe/카드 전체 클릭",
  render: () => (
    <div style={{ width: 280 }}>
      <StatCard
        label="챌린지 진행"
        value="12"
        unit="/ 30일"
        description="자세히 보기 →"
        onClick={() => alert("챌린지 디테일")}
      />
    </div>
  ),
};

export const Hero: Story = {
  name: "Recipe/큰 강조 (icon)",
  render: () => (
    <div style={{ width: 320 }}>
      <StatCard
        label="오늘의 마음 점수"
        value="78"
        unit="점"
        icon={<span style={{ fontSize: 18 }}>💙</span>}
        delta="+8"
        trend="up"
        description="어제보다 8점 높아졌어요"
      />
    </div>
  ),
};
