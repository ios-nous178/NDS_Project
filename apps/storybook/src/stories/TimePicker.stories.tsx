import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from "@nudge-eap/react";

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Playground: Story = {
  render: function Render() {
    const [t, setT] = useState("09:00");
    return (
      <div style={{ width: 280 }}>
        <TimePicker
          label="알림 시각"
          value={t}
          onValueChange={setT}
          helperText="5분 단위로 선택할 수 있어요"
          fullWidth
        />
      </div>
    );
  },
};

export const StepOneMinute: Story = {
  name: "Variant/1분 단위",
  render: function Render() {
    const [t, setT] = useState("14:30");
    return (
      <div style={{ width: 280 }}>
        <TimePicker label="시간 (1분 단위)" value={t} onValueChange={setT} step={60} fullWidth />
      </div>
    );
  },
};

export const Bounded: Story = {
  name: "Edge/min~max 제한",
  render: function Render() {
    const [t, setT] = useState("10:00");
    return (
      <div style={{ width: 280 }}>
        <TimePicker
          label="상담 가능 시간 (09:00 ~ 18:00)"
          value={t}
          onValueChange={setT}
          min="09:00"
          max="18:00"
          fullWidth
        />
      </div>
    );
  },
};

export const WithError: Story = {
  name: "State/에러",
  render: () => (
    <div style={{ width: 280 }}>
      <TimePicker
        label="시작 시간"
        value="22:00"
        onValueChange={() => undefined}
        error
        helperText="22시 이후는 선택할 수 없어요"
        max="21:00"
        fullWidth
      />
    </div>
  ),
};
