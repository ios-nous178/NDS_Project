import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CrisisCallout } from "@nudge-eap/react";

const meta: Meta<typeof CrisisCallout> = {
  title: "Components/CrisisCallout",
  component: CrisisCallout,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof CrisisCallout>;

const w = (children: React.ReactNode) => <div style={{ width: 480 }}>{children}</div>;

export const Danger: Story = {
  name: "Tone/Danger",
  render: () =>
    w(
      <CrisisCallout
        tone="danger"
        title="혼자 견디지 마세요"
        description="지금 너무 힘드시다면 24시간 상담 받을 수 있어요."
        actions={[
          { label: "1393 자살예방상담", phoneNumber: "1393" },
          { label: "119 응급", phoneNumber: "119", variant: "outlined" },
        ]}
      />,
    ),
};

export const Caution: Story = {
  name: "Tone/Caution",
  render: () =>
    w(
      <CrisisCallout
        tone="caution"
        title="잠시 숨을 고를 시간이에요"
        description="스트레스가 평소보다 높아 보여요. 짧은 명상은 어떠세요?"
        actions={[{ label: "명상 시작하기" }]}
      />,
    ),
};

export const TitleOnly: Story = {
  name: "State/Title Only",
  render: () =>
    w(
      <CrisisCallout
        title="자가검진 결과를 받아보려면 모든 문항에 응답이 필요해요"
        tone="caution"
      />,
    ),
};
