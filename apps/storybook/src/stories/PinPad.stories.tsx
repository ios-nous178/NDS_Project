import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PinPad } from "@nudge-eap/react";

const meta: Meta<typeof PinPad> = {
  title: "Components/PinPad",
  component: PinPad,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof PinPad>;

export const Playground: Story = {
  render: function Render() {
    const [pin, setPin] = useState("");
    return (
      <PinPad
        label="비밀번호 6자리를 입력하세요"
        value={pin}
        onValueChange={setPin}
        onComplete={(v) => alert(`입력 완료: ${v}`)}
      />
    );
  },
};

export const FourDigit: Story = {
  name: "Variant/4자리",
  render: function Render() {
    const [pin, setPin] = useState("");
    return (
      <PinPad
        label="간편 비밀번호 4자리"
        value={pin}
        onValueChange={setPin}
        length={4}
        onComplete={(v) => alert(`입력 완료: ${v}`)}
      />
    );
  },
};

export const Shuffled: Story = {
  name: "Recipe/키 셔플 (보안)",
  render: function Render() {
    const [pin, setPin] = useState("");
    return (
      <PinPad
        label="보안 키패드"
        value={pin}
        onValueChange={setPin}
        shuffle
        shuffleSeed={Date.now()}
      />
    );
  },
};

export const WithError: Story = {
  name: "State/에러 (틀림)",
  render: () => <PinPad value="123456" onValueChange={() => undefined} error />,
};
