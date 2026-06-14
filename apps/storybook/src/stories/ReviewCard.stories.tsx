import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ReviewCard, Avatar, LikeButton, List, ListItem, Button, TextButton } from "@nudge-design/react";

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

// pattern:review-list — List 컨테이너(header/footer) + ReviewCard 아이템.
// 도움돼요는 카드 footer 안 / 더보기는 List footer 슬롯. (목업 오용 "도움돼요 카드 밖" 교정 예시)
const REVIEWS = [
  {
    id: 1,
    author: "건강맘4**",
    meta: "2026.03.15 · 구매인증",
    rating: 5,
    body: "눈이 자주 피로했는데 3개월 정도 먹고 나서 확실히 눈 뻑뻑함이 줄었어요. 알약도 크지 않아 먹기 편하고 재구매 의향 있어요.",
    verified: true,
    helpful: 34,
  },
  {
    id: 2,
    author: "워킹맘1**",
    meta: "2026.03.08 · 구매인증",
    rating: 4,
    body: "알약이 크지 않아서 먹기 편하고 냄새도 없어요. 2개월 복용 중인데 아직 극적인 변화는 없지만 꾸준히 먹어볼 생각입니다.",
    verified: true,
    helpful: 21,
  },
];

export const ReviewListRecipe: Story = {
  tags: ["gallery"],
  name: "Recipe/리뷰 리스트 (pattern:review-list)",
  render: () => (
    <div style={{ width: 480 }}>
      <List
        variant="plain"
        header={
          <>
            <span>리뷰 47</span>
            <span style={{ color: "var(--semantic-text-muted-default)" }}>평점 4.7</span>
          </>
        }
        footer={
          <Button fullWidth variant="outlined">
            리뷰 더 보기 (전체 47)
          </Button>
        }
      >
        {REVIEWS.map((r) => (
          <ListItem key={r.id}>
            <ReviewCard
              author={r.author}
              meta={r.meta}
              rating={r.rating}
              body={r.body}
              verified={r.verified}
              footer={<TextButton>도움돼요 {r.helpful}</TextButton>}
            />
          </ListItem>
        ))}
      </List>
    </div>
  ),
};
