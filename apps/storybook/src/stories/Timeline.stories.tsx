import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta<typeof Timeline> = {
  title: "Components/Display/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: getComponentDocsDescription("Timeline"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

/* ── activity 모드: 시간순 이벤트 로그 ── */
export const Activity: Story = {
  name: "Variant/이벤트 로그 (activity)",
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Timeline
        mode="activity"
        items={[
          {
            key: "1",
            date: "2024.03.20",
            title: "상담 예약 완료",
            description: "선생님과의 첫 상담이 예약되었습니다.",
            status: "completed",
            statusLabel: "완료",
          },
          {
            key: "2",
            date: "2024.03.21",
            title: "심리 검사 진행",
            status: "ongoing",
            statusLabel: "진행 중",
          },
          { key: "3", date: "2024.03.22", title: "결과 리포트 발송", status: "default" },
        ]}
      />
    </div>
  ),
};

/* ── tracker 모드: 단계 진행 트래커 ── */
const TRACKER_STEPS = [
  { key: "received", title: "접수", date: "05/20" },
  { key: "processing", title: "처리 중", date: "05/22" },
  { key: "done", title: "완료" },
];

export const TrackerHorizontal: Story = {
  name: "Variant/단계 트래커 · 가로 (tracker)",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Timeline mode="tracker" direction="horizontal" current={1} items={TRACKER_STEPS} />
    </div>
  ),
};

export const TrackerVertical: Story = {
  name: "Variant/단계 트래커 · 세로 (tracker)",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Timeline
        mode="tracker"
        direction="vertical"
        current={1}
        items={[
          { key: "received", title: "접수", date: "05/20", description: "신청서가 접수되었어요." },
          {
            key: "review",
            title: "검토 중",
            date: "05/22",
            description: "담당자가 확인하고 있어요.",
          },
          { key: "approved", title: "승인 완료" },
        ]}
      />
    </div>
  ),
};
