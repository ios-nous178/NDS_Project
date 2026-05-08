import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { VotePoll, type VoteOption } from "@nudge-eap/react";

const meta: Meta<typeof VotePoll> = {
  title: "Components/VotePoll",
  component: VotePoll,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof VotePoll>;

const INITIAL_OPTIONS: VoteOption[] = [
  { key: "morning", label: "아침에 일어나자마자", count: 42 },
  { key: "lunch", label: "점심 먹고 나서", count: 18 },
  { key: "evening", label: "퇴근 후 저녁", count: 67 },
  { key: "bedtime", label: "잠들기 전", count: 33 },
];

export const Playground: Story = {
  render: function Render() {
    const [voted, setVoted] = useState<string | null>(null);
    const [opts, setOpts] = useState(INITIAL_OPTIONS);
    const handleVote = (key: string) => {
      setVoted(key);
      setOpts((prev) => prev.map((o) => (o.key === key ? { ...o, count: o.count + 1 } : o)));
    };
    return (
      <div style={{ width: 480 }}>
        <VotePoll
          question="명상하기 가장 좋은 시간은 언제일까요?"
          options={opts}
          votedKey={voted}
          onVote={handleVote}
          footer={`총 ${opts.reduce((s, o) => s + o.count, 0)}명 투표`}
        />
      </div>
    );
  },
};

export const AlwaysShowResults: Story = {
  name: "Variant/결과 항상 표시",
  render: () => (
    <div style={{ width: 480 }}>
      <VotePoll
        question="투표 종료 후 결과만 보여주는 케이스"
        options={INITIAL_OPTIONS}
        showResults
        footer="투표 종료"
      />
    </div>
  ),
};

export const Disabled: Story = {
  name: "State/Disabled (마감)",
  render: () => (
    <div style={{ width: 480 }}>
      <VotePoll
        question="이번 주 챌린지 주제는?"
        options={INITIAL_OPTIONS}
        showResults
        disabled
        footer="투표 마감 · 2026.05.05"
      />
    </div>
  ),
};
