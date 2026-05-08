/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OtpInput } from "@nudge-eap/react";

const meta: Meta<typeof OtpInput> = {
  title: "Components/OtpInput",
  component: OtpInput,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof OtpInput>;

export const Default: Story = {
  name: "State/Default",
  render: () => {
    const [v, setV] = useState("");
    return <OtpInput value={v} onValueChange={setV} autoFocus />;
  },
};

export const Length4: Story = {
  name: "State/4 Digits",
  render: () => {
    const [v, setV] = useState("");
    return <OtpInput length={4} value={v} onValueChange={setV} />;
  },
};

export const Error: Story = {
  name: "State/Error",
  render: () => {
    const [v, setV] = useState("123");
    return <OtpInput value={v} onValueChange={setV} error />;
  },
};

export const OnComplete: Story = {
  name: "Recipe/On Complete",
  render: () => {
    const [v, setV] = useState("");
    const [done, setDone] = useState<string | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <OtpInput value={v} onValueChange={setV} onComplete={(value) => setDone(value)} />
        {done && (
          <span style={{ fontSize: 13, color: "var(--color-semantic-success-main)" }}>
            완성 → {done}
          </span>
        )}
      </div>
    );
  },
};
