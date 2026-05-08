import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AssessmentResultCard } from "@nudge-eap/react";

const meta: Meta<typeof AssessmentResultCard> = {
  title: "Components/AssessmentResultCard",
  component: AssessmentResultCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof AssessmentResultCard>;

const w = (children: React.ReactNode) => <div style={{ width: 360 }}>{children}</div>;

export const Normal: Story = {
  name: "Level/Normal",
  render: () =>
    w(
      <AssessmentResultCard
        title="PHQ-9 우울 검사"
        score={3}
        maxScore={27}
        level="normal"
        description="우울 관련 증상이 거의 없는 상태입니다."
        actionLabel="결과 자세히 보기"
        onAction={() => {}}
      />,
    ),
};

export const Mild: Story = {
  name: "Level/Mild",
  render: () =>
    w(
      <AssessmentResultCard
        title="GAD-7 불안 검사"
        score={8}
        maxScore={21}
        level="mild"
        description="일상에 영향을 주는 가벼운 불안이 있어요."
        actionLabel="관리법 보기"
        onAction={() => {}}
      />,
    ),
};

export const Moderate: Story = {
  name: "Level/Moderate",
  render: () =>
    w(
      <AssessmentResultCard
        title="PHQ-9 우울 검사"
        score={14}
        maxScore={27}
        level="moderate"
        description="중등도 우울로, 전문가 상담이 권장됩니다."
        actionLabel="상담 예약하기"
        onAction={() => {}}
      />,
    ),
};

export const Severe: Story = {
  name: "Level/Severe",
  render: () =>
    w(
      <AssessmentResultCard
        title="PHQ-9 우울 검사"
        score={22}
        maxScore={27}
        level="severe"
        description="심한 우울 상태입니다. 즉시 전문가의 도움이 필요해요."
        actionLabel="지금 상담 연결"
        onAction={() => {}}
      />,
    ),
};
