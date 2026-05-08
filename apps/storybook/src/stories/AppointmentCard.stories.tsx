import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppointmentCard } from "@nudge-eap/react";

const meta: Meta<typeof AppointmentCard> = {
  title: "Components/AppointmentCard",
  component: AppointmentCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof AppointmentCard>;

export const Playground: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <AppointmentCard
        date="2026-05-15"
        startTime="14:00"
        endTime="14:50"
        title="김민지 상담사 — 화상 상담"
        mode="video"
        status="confirmed"
        actions={[
          { label: "상세", onClick: () => undefined },
          { label: "참여", onClick: () => undefined, primary: true },
        ]}
      />
    </div>
  ),
};

export const Statuses: Story = {
  name: "State/모든 상태",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 480 }}>
      <AppointmentCard
        date="2026-05-10"
        startTime="10:00"
        title="첫 상담"
        mode="video"
        status="scheduled"
      />
      <AppointmentCard
        date="2026-05-12"
        startTime="14:00"
        title="이수영 상담사"
        mode="phone"
        status="confirmed"
      />
      <AppointmentCard
        date="2026-05-15"
        startTime="14:00"
        title="진행 중인 세션"
        mode="chat"
        status="in-progress"
      />
      <AppointmentCard
        date="2026-04-20"
        startTime="11:00"
        title="지난 상담"
        mode="video"
        status="completed"
      />
      <AppointmentCard
        date="2026-04-25"
        startTime="15:00"
        title="취소된 상담"
        mode="phone"
        status="canceled"
      />
    </div>
  ),
};

export const InPerson: Story = {
  name: "Recipe/방문 상담 (장소 포함)",
  render: () => (
    <div style={{ width: 480 }}>
      <AppointmentCard
        date="2026-05-22"
        startTime="11:00"
        endTime="12:00"
        title="박지원 상담사"
        mode="in-person"
        location="강남센터 3층 301호"
        status="confirmed"
        actions={[{ label: "위치 보기", onClick: () => undefined }]}
      />
    </div>
  ),
};

export const ClickableCard: Story = {
  name: "Recipe/카드 전체 클릭",
  render: () => (
    <div style={{ width: 480 }}>
      <AppointmentCard
        date="2026-05-30"
        startTime="16:00"
        title="상담 상세 보기 →"
        mode="video"
        status="scheduled"
        onClick={() => alert("디테일 화면으로 이동")}
      />
    </div>
  ),
};
