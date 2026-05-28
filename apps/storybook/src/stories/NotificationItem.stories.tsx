import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NotificationItem } from "@nudge-design/react";

const meta: Meta<typeof NotificationItem> = {
  title: "Components/NotificationItem",
  component: NotificationItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof NotificationItem>;

export const Playground: Story = {
  render: () => (
    <div style={{ width: 480, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
      <NotificationItem
        kind="info"
        title="김민지 상담사가 메시지를 보냈어요"
        description="상담 일정이 변경됐어요. 확인 부탁드려요."
        time="3분 전"
        unread
        onClick={() => undefined}
      />
    </div>
  ),
};

export const List: Story = {
  name: "Recipe/알림 리스트",
  render: () => (
    <div style={{ width: 480, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
      <NotificationItem
        kind="info"
        title="김민지 상담사가 메시지를 보냈어요"
        description="상담 일정이 변경됐어요. 확인 부탁드려요."
        time="3분 전"
        unread
        onClick={() => undefined}
      />
      <NotificationItem
        kind="success"
        title="14일 챌린지 완료!"
        description="감정 기록을 14일 동안 이어왔어요. 다음 챌린지를 시작해보세요."
        time="1시간 전"
        unread
        onClick={() => undefined}
      />
      <NotificationItem
        kind="warning"
        title="복약 알림"
        description="아침 약 복용 시간이에요."
        time="오후 8:00"
        onClick={() => undefined}
      />
      <NotificationItem
        kind="system"
        title="앱 업데이트가 준비됐어요"
        description="새로운 명상 콘텐츠가 추가됐어요."
        time="어제"
        onClick={() => undefined}
      />
    </div>
  ),
};

export const Kinds: Story = {
  name: "Variant/모든 종류",
  render: () => (
    <div style={{ width: 480, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
      <NotificationItem kind="info" title="info 알림" description="안내 메시지" time="방금" />
      <NotificationItem kind="success" title="success 알림" description="성공 메시지" time="방금" />
      <NotificationItem kind="warning" title="warning 알림" description="주의 메시지" time="방금" />
      <NotificationItem kind="error" title="error 알림" description="오류 메시지" time="방금" />
      <NotificationItem kind="system" title="system 알림" description="시스템 안내" time="방금" />
    </div>
  ),
};

export const NoDescription: Story = {
  name: "Edge/제목과 시간만",
  render: () => (
    <div style={{ width: 480, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
      <NotificationItem title="새 댓글이 달렸어요" time="2분 전" unread />
      <NotificationItem title="🎉 새 콘텐츠가 도착했어요" time="3분 전" />
    </div>
  ),
};
