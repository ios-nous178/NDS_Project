import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CommentItem, Avatar, Badge, LikeButton } from "@nudge-design/react";

const meta: Meta<typeof CommentItem> = {
  title: "Components/Domain/CommentItem",
  component: CommentItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof CommentItem>;

/** 댓글 좋아요는 DS LikeButton(nds-like-button)을 likeAction 슬롯에 그대로 사용 — 손조립 버튼 금지. */
function CommentLike({ count = 0, size = "sm" }: { count?: number; size?: "sm" | "md" | "lg" }) {
  const [liked, setLiked] = useState(false);
  return (
    <LikeButton size={size} liked={liked} count={count + (liked ? 1 : 0)} onChange={setLiked} />
  );
}

export const Playground: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <CommentItem
        avatar={<Avatar name="김민지" />}
        author="김민지"
        time="3분 전"
        text="이 글 정말 도움이 됐어요. 감사합니다 :)"
        likeAction={<CommentLike count={12} />}
        onReply={() => alert("답글")}
      />
    </div>
  ),
};

export const WithBadgeAndReplies: Story = {
  name: "Recipe/뱃지 + 답글 트리",
  render: () => (
    <div style={{ width: 480 }}>
      <CommentItem
        avatar={<Avatar name="박지원" />}
        author="박지원"
        authorBadge={
          <Badge variant="fill" color="brand" size="sm">
            상담사
          </Badge>
        }
        time="10분 전"
        text="좋은 글 잘 읽었어요. 다음 주 상담 때 더 이야기 나눠봐요."
        likeAction={<CommentLike count={4} />}
        onReply={() => undefined}
        replies={
          <>
            <CommentItem
              isReply
              avatar={<Avatar name="이수영" size="sm" />}
              author="이수영"
              time="5분 전"
              text="저도 동의해요!"
              onReply={() => undefined}
            />
            <CommentItem
              isReply
              avatar={<Avatar name="최서연" size="sm" />}
              author="최서연"
              time="2분 전"
              text="공감합니다"
            />
          </>
        }
      />
    </div>
  ),
};

export const SimpleList: Story = {
  name: "Recipe/간단 리스트",
  render: () => (
    <div style={{ width: 480, display: "flex", flexDirection: "column" }}>
      {[
        { name: "김민지", time: "3분 전", text: "이 글 잘 읽었어요." },
        { name: "이수영", time: "1시간 전", text: "저도 비슷한 경험이 있어요. 공감해요." },
        { name: "박지원", time: "어제", text: "용기 내주셔서 감사해요. 응원합니다." },
      ].map((c, i) => (
        <CommentItem
          key={i}
          avatar={<Avatar name={c.name} />}
          author={c.name}
          time={c.time}
          text={c.text}
          onReply={() => undefined}
        />
      ))}
    </div>
  ),
};

export const Minimal: Story = {
  name: "Edge/익명/액션 없이",
  render: () => <CommentItem author="익명" time="방금" text="짧은 한 줄 코멘트입니다." />,
};
