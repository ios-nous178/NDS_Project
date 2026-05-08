import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StreakCard, type StreakDay } from "@nudge-eap/react";

const meta: Meta<typeof StreakCard> = {
  title: "Components/StreakCard",
  component: StreakCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof StreakCard>;

const last7 = (pattern: boolean[]): StreakDay[] => {
  const result: StreakDay[] = [];
  const labels = ["일", "월", "화", "수", "목", "금", "토"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    result.push({
      date: iso,
      label: labels[d.getDay()],
      done: pattern[6 - i] ?? false,
    });
  }
  return result;
};

export const Playground: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <StreakCard
        title="감정 기록"
        streak={7}
        days={last7([true, true, true, true, true, true, true])}
        footer="이번 주 매일 기록했어요. 멋져요!"
      />
    </div>
  ),
};

export const StartingOver: Story = {
  name: "Recipe/오늘은 미완료",
  render: () => (
    <div style={{ width: 360 }}>
      <StreakCard
        title="명상"
        streak={3}
        days={last7([false, true, true, true, false, false, false])}
        footer="오늘도 5분 명상으로 기록을 이어가보세요."
      />
    </div>
  ),
};

export const NoDayDots: Story = {
  name: "Recipe/숫자만",
  render: () => (
    <div style={{ width: 280 }}>
      <StreakCard title="복약 연속 기록" streak={28} icon="💊" />
    </div>
  ),
};

export const Broken: Story = {
  name: "Recipe/끊긴 후 새로 시작",
  render: () => (
    <div style={{ width: 360 }}>
      <StreakCard
        title="수면 기록"
        streak={1}
        days={last7([false, false, false, true, false, true, true])}
        footer="작은 시작이 큰 변화를 만들어요."
        icon="🌙"
      />
    </div>
  ),
};
