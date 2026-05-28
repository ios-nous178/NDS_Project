import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { UserCard, Avatar, Button } from "@nudge-design/react";

const meta: Meta<typeof UserCard> = {
  title: "Components/UserCard",
  component: UserCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof UserCard>;

export const Playground: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <UserCard
        avatar={<Avatar name="김민지" size="lg" />}
        name="김민지"
        handle="@minji.kim"
        bio="마음챙김 가이드 작성자, 임상심리사"
        meta={<>팔로워 1.2K · 게시물 48</>}
        verified
        action={<Button size="sm">팔로우</Button>}
      />
    </div>
  ),
};

export const Stacked: Story = {
  name: "Layout/세로 (프로필 모달)",
  render: () => (
    <div style={{ width: 280 }}>
      <UserCard
        layout="stacked"
        avatar={<Avatar name="이수영" size="xl" />}
        name="이수영"
        handle="임상심리사"
        bio={"6년차 임상심리사. 불안·우울·관계 중심 상담."}
        meta="주 4회 상담 가능"
        action={<Button>상담 예약</Button>}
      />
    </div>
  ),
};

export const List: Story = {
  name: "Recipe/팔로우 리스트",
  render: () => (
    <div
      style={{
        width: 480,
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-default)",
      }}
    >
      {[
        { name: "김민지", handle: "@minji" },
        { name: "이수영", handle: "@suyoung" },
        { name: "박지원", handle: "@jiwon" },
      ].map((u) => (
        <UserCard
          key={u.name}
          avatar={<Avatar name={u.name} />}
          name={u.name}
          handle={u.handle}
          action={
            <Button size="sm" variant="outlined">
              팔로우
            </Button>
          }
          onClick={() => undefined}
        />
      ))}
    </div>
  ),
};

export const Minimal: Story = {
  name: "Edge/최소",
  render: () => (
    <div style={{ width: 320 }}>
      <UserCard avatar={<Avatar name="홍길동" />} name="홍길동" />
    </div>
  ),
};
