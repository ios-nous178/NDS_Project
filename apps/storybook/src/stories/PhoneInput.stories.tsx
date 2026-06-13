import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PhoneInput } from "@nudge-design/react";

const meta: Meta<typeof PhoneInput> = {
  title: "Components/Inputs/PhoneInput",
  component: PhoneInput,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Playground: Story = {
  render: function Render() {
    const [country, setCountry] = useState("KR");
    const [phone, setPhone] = useState("");
    return (
      <div style={{ width: 360 }}>
        <PhoneInput
          label="휴대폰 번호"
          countryCode={country}
          onCountryChange={setCountry}
          value={phone}
          onValueChange={setPhone}
          helperText="인증번호를 받을 번호를 입력해주세요"
          fullWidth
        />
      </div>
    );
  },
};

export const WithError: Story = {
  tags: ["gallery"],
  name: "State/에러",
  render: function Render() {
    const [country, setCountry] = useState("KR");
    const [phone, setPhone] = useState("0101234");
    return (
      <div style={{ width: 360 }}>
        <PhoneInput
          label="휴대폰 번호"
          countryCode={country}
          onCountryChange={setCountry}
          value={phone}
          onValueChange={setPhone}
          error
          helperText="번호 형식이 올바르지 않아요"
          fullWidth
        />
      </div>
    );
  },
};

export const WithHelper: Story = {
  tags: ["gallery"],
  name: "Recipe/헬퍼 텍스트",
  render: function Render() {
    const [country, setCountry] = useState("KR");
    const [phone, setPhone] = useState("");
    return (
      <div style={{ width: 360 }}>
        <PhoneInput
          label="휴대폰 번호"
          countryCode={country}
          onCountryChange={setCountry}
          value={phone}
          onValueChange={setPhone}
          helperText="인증번호를 받을 번호를 입력해주세요"
          fullWidth
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => (
    <div style={{ width: 360 }}>
      <PhoneInput
        label="휴대폰 번호 (변경 불가)"
        countryCode="KR"
        onCountryChange={() => undefined}
        value="01012345678"
        onValueChange={() => undefined}
        disabled
        fullWidth
      />
    </div>
  ),
};
