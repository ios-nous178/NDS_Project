import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ActivityTimeline } from "@nudge-eap/react";

const meta: Meta<typeof ActivityTimeline> = {
  title: "Components/ActivityTimeline",
  component: ActivityTimeline,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ActivityTimeline>;

export const Default: Story = {
  name: "State/Default",
  render: () => (
    <div style={{ width: 480 }}>
      <ActivityTimeline
        items={[
          {
            key: "1",
            date: "2026.04.18",
            title: "PHQ-9 우울 검사",
            description: "총점 7점 (정상)",
            status: "completed",
            statusLabel: "완료",
          },
          {
            key: "2",
            date: "2026.04.20 14:00",
            title: "박민지 상담사와 1:1 상담",
            description: "초기 상담 · 50분",
            status: "completed",
            statusLabel: "완료",
          },
          {
            key: "3",
            date: "2026.05.04 14:00",
            title: "다음 상담",
            description: "박민지 상담사 · 50분",
            status: "ongoing",
            statusLabel: "진행 중",
          },
          {
            key: "4",
            date: "2026.05.18",
            title: "PHQ-9 재검사 예정",
            status: "default",
          },
        ]}
      />
    </div>
  ),
};

export const WithWarning: Story = {
  name: "State/With Warning",
  render: () => (
    <div style={{ width: 480 }}>
      <ActivityTimeline
        items={[
          {
            key: "1",
            date: "2026.05.01",
            title: "GAD-7 불안 검사",
            description: "총점 14점 (중등도)",
            status: "warning",
            statusLabel: "주의",
          },
          {
            key: "2",
            date: "2026.05.02",
            title: "상담 예약 안내 발송",
            status: "completed",
            statusLabel: "완료",
          },
          {
            key: "3",
            date: "2026.05.03",
            title: "예약 미응답",
            status: "error",
            statusLabel: "응답 없음",
          },
        ]}
      />
    </div>
  ),
};
