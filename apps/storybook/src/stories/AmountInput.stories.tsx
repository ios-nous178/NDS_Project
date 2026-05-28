import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AmountInput } from "@nudge-design/react";

const meta: Meta<typeof AmountInput> = {
  title: "Components/AmountInput",
  component: AmountInput,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof AmountInput>;

export const Playground: Story = {
  render: function Render() {
    const [v, setV] = useState<number | null>(null);
    return (
      <div style={{ width: 360 }}>
        <AmountInput
          label="송금 금액"
          value={v}
          onValueChange={setV}
          fullWidth
          presets={[
            { label: "+1만", amount: 10000 },
            { label: "+5만", amount: 50000 },
            { label: "+10만", amount: 100000 },
            { label: "전액", amount: 500000, set: true },
          ]}
          helperText="최대 50만원까지 송금 가능"
          max={500000}
        />
      </div>
    );
  },
};

export const USD: Story = {
  name: "Variant/달러 (prefix)",
  render: function Render() {
    const [v, setV] = useState<number | null>(0);
    return (
      <div style={{ width: 360 }}>
        <AmountInput
          label="후원 금액"
          value={v}
          onValueChange={setV}
          prefix="$"
          unit=""
          fullWidth
        />
      </div>
    );
  },
};

export const WithError: Story = {
  name: "State/에러",
  render: function Render() {
    const [v, setV] = useState<number | null>(1500000);
    return (
      <div style={{ width: 360 }}>
        <AmountInput
          label="송금 금액"
          value={v}
          onValueChange={setV}
          error
          helperText="잔액(1,200,000원)을 초과합니다"
          fullWidth
        />
      </div>
    );
  },
};

export const Donation: Story = {
  name: "Recipe/후원 금액",
  render: function Render() {
    const [v, setV] = useState<number | null>(null);
    return (
      <div style={{ width: 360 }}>
        <AmountInput
          label="응원 금액"
          value={v}
          onValueChange={setV}
          presets={[
            { label: "5천원", amount: 5000, set: true },
            { label: "1만원", amount: 10000, set: true },
            { label: "3만원", amount: 30000, set: true },
            { label: "5만원", amount: 50000, set: true },
          ]}
          fullWidth
          min={1000}
        />
      </div>
    );
  },
};
