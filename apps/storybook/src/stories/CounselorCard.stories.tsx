import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CounselorCard } from "@nudge-design/react";

const meta: Meta<typeof CounselorCard> = {
  title: "Components/Domain/CounselorCard",
  component: CounselorCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof CounselorCard>;

const w = (children: React.ReactNode) => <div style={{ width: 480 }}>{children}</div>;

export const Default: Story = {
  name: "State/Default",
  render: () =>
    w(
      <CounselorCard
        name="박민지"
        jobTitle="임상심리전문가"
        rating={4.8}
        reviewCount={120}
        tags={["우울", "불안", "직장스트레스"]}
        bio="따뜻한 공감과 인지행동치료(CBT) 기반으로 함께 해결책을 찾아갑니다."
        ctaLabel="예약하기"
        onCtaClick={() => {}}
      />,
    ),
};

export const ClickableRow: Story = {
  name: "State/Clickable Row",
  render: () =>
    w(
      <CounselorCard
        name="김상담"
        jobTitle="정신건강의학과 전문의"
        rating={4.9}
        reviewCount={450}
        tags={["불면", "공황"]}
        bio="안전한 공간에서 본인의 감정을 충분히 이야기할 수 있도록 돕습니다."
        onCardClick={() => {}}
      />,
    ),
};

export const NoImage: Story = {
  name: "State/No Image (Initials)",
  render: () =>
    w(
      <CounselorCard
        name="이도윤"
        jobTitle="청소년상담사 1급"
        rating={4.6}
        reviewCount={28}
        tags={["청소년", "학업"]}
        bio="청소년기 정체성 문제와 가족관계를 주로 다룹니다."
        ctaLabel="예약하기"
        onCtaClick={() => {}}
      />,
    ),
};
