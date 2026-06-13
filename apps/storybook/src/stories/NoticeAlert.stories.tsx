import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NoticeAlert } from "@nudge-design/react";

const meta: Meta<typeof NoticeAlert> = {
  title: "Components/Feedback/NoticeAlert",
  component: NoticeAlert,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "notice", "caution", "success", "error"],
    },
    message: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof NoticeAlert>;

export const Playground: Story = {
  args: { variant: "info", message: "안내 메시지" },
  render: (args) => (
    <div style={{ width: 640 }}>
      <NoticeAlert {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  tags: ["gallery"],
  name: "Variant/5종 상태",
  render: () => (
    <div style={{ width: 640, display: "flex", flexDirection: "column", gap: 12 }}>
      <NoticeAlert variant="info" message="최대 30자 이내로 입력해 주세요." />
      <NoticeAlert variant="notice" message="이벤트는 승인 후 24시간 이내에 노출됩니다." />
      <NoticeAlert variant="caution" message="목표 참여자 수는 1,000명 단위로 입력해 주세요." />
      <NoticeAlert variant="success" message="타겟팅 조건이 정상적으로 저장되었어요." />
      <NoticeAlert
        variant="error"
        message="참여 가능한 유저 수가 0이거나 설정하지 않았어요. 타겟팅 정보를 확인해 주세요."
      />
    </div>
  ),
};

export const MultiLine: Story = {
  tags: ["gallery"],
  name: "Recipe/여러 줄",
  render: () => (
    <div style={{ width: 420 }}>
      <NoticeAlert
        variant="info"
        message={
          "쿠폰은 유저가 정답을 맞힌 경우 지급되며, 제공을 원하시는 경우\n‘제공’을 선택한 후 광고팀에 문의해 주세요."
        }
      />
    </div>
  ),
};
