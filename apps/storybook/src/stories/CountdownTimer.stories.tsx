import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CountdownTimer } from "@nudge-design/react";

const meta: Meta<typeof CountdownTimer> = {
  title: "Components/CountdownTimer",
  component: CountdownTimer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof CountdownTimer>;

const inMin = (n: number) => Date.now() + n * 60 * 1000;

export const Playground: Story = {
  render: () => <CountdownTimer endsAt={inMin(3)} label="후 자동 만료" />,
};

export const Urgent: Story = {
  name: "Recipe/임박 (10초)",
  render: () => <CountdownTimer endsAt={Date.now() + 10_000} label="후 만료" />,
};

export const HHMMSS: Story = {
  name: "Variant/hh:mm:ss",
  render: () => <CountdownTimer endsAt={inMin(125)} format="hh:mm:ss" label="남음" />,
};

export const Remaining: Story = {
  name: "Variant/remaining (자연어)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-default)" }}>
      <CountdownTimer endsAt={Date.now() + 30 * 1000} format="remaining" />
      <CountdownTimer endsAt={inMin(45)} format="remaining" />
      <CountdownTimer endsAt={inMin(180)} format="remaining" />
    </div>
  ),
};

export const Expired: Story = {
  name: "State/만료됨",
  render: () => <CountdownTimer endsAt={Date.now() - 10_000} expiredText="시간이 지났어요" />,
};

export const InContext: Story = {
  name: "Recipe/인증코드 만료 표시",
  render: () => (
    <div
      style={{
        padding: "var(--semantic-inset-card)",
        border: "1px solid #ddd",
        borderRadius: 8,
        display: "flex",
        gap: "var(--semantic-gap-comfortable)",
        alignItems: "center",
      }}
    >
      <input
        placeholder="인증번호 6자리"
        style={{
          flex: 1,
          height: 40,
          padding: "0 var(--semantic-inset-input)",
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />
      <CountdownTimer endsAt={Date.now() + 3 * 60 * 1000} label="안에 입력" />
    </div>
  ),
};
