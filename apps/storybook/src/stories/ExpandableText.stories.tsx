import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ExpandableText } from "@nudge-design/react";

const meta: Meta<typeof ExpandableText> = {
  title: "Components/Display/ExpandableText",
  component: ExpandableText,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ExpandableText>;

const LONG_TEXT =
  "오늘 하루도 평범한 듯 평범하지 않았다. 아침엔 출근길에 오랜만에 동네 카페에 들러 라떼를 한 잔 마셨다. " +
  "원두 향이 좋았다. 점심엔 동료들과 새로 생긴 식당에 다녀왔는데 분위기가 따뜻했고 음식도 맛있었다. " +
  "오후 회의에서는 처음 맡는 프로젝트의 방향이 잡혀가는 느낌이었고, 내가 의견을 낸 부분에 대한 반응도 긍정적이어서 기뻤다. " +
  "퇴근 후엔 한참을 산책하면서 내일 할 일을 머릿속으로 정리했다. 오늘 같은 하루가 자주 있었으면 좋겠다.";

export const Playground: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <ExpandableText>{LONG_TEXT}</ExpandableText>
    </div>
  ),
};

export const FiveLines: Story = {
  name: "Variant/5줄까지 표시",
  render: () => (
    <div style={{ width: 360 }}>
      <ExpandableText lines={5}>{LONG_TEXT}</ExpandableText>
    </div>
  ),
};

export const ShortText: Story = {
  name: "Edge/짧은 텍스트 (토글 없음)",
  render: () => (
    <div style={{ width: 360 }}>
      <ExpandableText>오늘은 평온했다.</ExpandableText>
    </div>
  ),
};

export const HideCollapse: Story = {
  name: "Variant/한 번 펼치면 못 접기",
  render: () => (
    <div style={{ width: 360 }}>
      <ExpandableText hideCollapse lines={2}>
        {LONG_TEXT}
      </ExpandableText>
    </div>
  ),
};

export const CustomLabels: Story = {
  name: "Recipe/라벨 커스텀",
  render: () => (
    <div style={{ width: 360 }}>
      <ExpandableText expandLabel="이용약관 전문 보기" collapseLabel="요약 보기">
        {LONG_TEXT}
      </ExpandableText>
    </div>
  ),
};
