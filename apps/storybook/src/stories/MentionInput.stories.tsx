import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MentionInput, type MentionUser, Avatar } from "@nudge-design/react";

const meta: Meta<typeof MentionInput> = {
  title: "Components/MentionInput",
  component: MentionInput,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MentionInput>;

const USERS: MentionUser[] = [
  {
    key: "1",
    name: "김민지",
    description: "수석 상담사",
    avatar: <Avatar name="김민지" size="sm" />,
  },
  {
    key: "2",
    name: "이수영",
    description: "임상심리사",
    avatar: <Avatar name="이수영" size="sm" />,
  },
  {
    key: "3",
    name: "박지원",
    description: "정신건강사회복지사",
    avatar: <Avatar name="박지원" size="sm" />,
  },
  {
    key: "4",
    name: "최서연",
    description: "수면 코치",
    avatar: <Avatar name="최서연" size="sm" />,
  },
  {
    key: "5",
    name: "정태훈",
    description: "그룹 상담",
    avatar: <Avatar name="정태훈" size="sm" />,
  },
];

export const Playground: Story = {
  render: function Render() {
    const [v, setV] = useState("");
    return (
      <div style={{ width: 480 }}>
        <MentionInput
          label="댓글"
          placeholder="@를 입력하면 멘션할 수 있어요"
          value={v}
          onValueChange={setV}
          users={USERS}
          helperText="↑↓로 이동, Enter로 선택"
        />
      </div>
    );
  },
};

export const PreFilled: Story = {
  name: "Recipe/이미 멘션 포함",
  render: function Render() {
    const [v, setV] = useState("@김민지 안녕하세요. 다음 세션 일정 조정 가능할까요?");
    return (
      <div style={{ width: 480 }}>
        <MentionInput label="메시지" value={v} onValueChange={setV} users={USERS} />
      </div>
    );
  },
};

export const CustomTrigger: Story = {
  name: "Variant/트리거 # (해시태그)",
  render: function Render() {
    const [v, setV] = useState("");
    return (
      <div style={{ width: 480 }}>
        <MentionInput
          label="태그 추천"
          placeholder="#로 키워드를 추천해요"
          value={v}
          onValueChange={setV}
          users={[
            { key: "sleep", name: "수면" },
            { key: "anxiety", name: "불안" },
            { key: "stress", name: "스트레스" },
          ]}
          trigger="#"
        />
      </div>
    );
  },
};
