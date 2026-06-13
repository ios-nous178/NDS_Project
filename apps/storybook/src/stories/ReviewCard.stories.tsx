import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ReviewCard, Avatar, LikeButton } from "@nudge-design/react";

const meta: Meta<typeof ReviewCard> = {
  title: "Components/Display/ReviewCard",
  component: ReviewCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ReviewCard>;

export const Playground: Story = {
  render: function Render() {
    const [liked, setLiked] = useState(false);
    return (
      <div style={{ width: 480 }}>
        <ReviewCard
          avatar={<Avatar name="김민지" />}
          author="김민지"
          meta="2026.05.07"
          verified
          rating={4.5}
          ratingLabel="4.5"
          title="진심으로 들어주셔서 감사해요"
          body={
            "처음엔 어색했는데 회차를 거듭할수록 편해졌어요.\n특히 호흡 가이드는 평소에도 도움이 많이 됐어요."
          }
          tags={["편안함", "전문성", "추천"]}
          footer={<LikeButton liked={liked} count={liked ? 4 : 3} onChange={setLiked} size="sm" />}
        />
      </div>
    );
  },
};

export const HalfStar: Story = {
  name: "Edge/0.5점 단위",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-comfortable)",
        width: 480,
      }}
    >
      {[5, 4.5, 4, 3.5, 3].map((r) => (
        <ReviewCard
          key={r}
          author={`별 ${r}점 사용자`}
          rating={r}
          ratingLabel={r.toFixed(1)}
          body={`별 ${r}점 후기 본문 예시입니다.`}
        />
      ))}
    </div>
  ),
};

export const ProductReview: Story = {
  tags: ["gallery"],
  name: "Recipe/상품 후기",
  render: () => (
    <div style={{ width: 480 }}>
      <ReviewCard
        author="익명 구매자"
        meta="구매 인증 · 2026.04.20"
        verified
        rating={5}
        ratingLabel="5.0"
        body={"포장이 깔끔하고 배송도 빨라요. 명상 가이드북이 생각보다 알차서 만족합니다."}
        tags={["빠른배송", "포장만족"]}
      />
    </div>
  ),
};

export const Minimal: Story = {
  name: "Edge/작성자 + 별점만",
  render: () => <ReviewCard author="홍길동" rating={4} body="좋았어요" />,
};
