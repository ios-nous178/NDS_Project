/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MoodSelector } from "@nudge-eap/react";

const meta: Meta<typeof MoodSelector> = {
  title: "Components/MoodSelector",
  component: MoodSelector,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MoodSelector>;

export const Default: Story = {
  name: "State/Default",
  render: () => {
    const [v, setV] = useState<string | undefined>("neutral");
    return (
      <div style={{ width: 360 }}>
        <MoodSelector value={v} onValueChange={setV} />
      </div>
    );
  },
};

export const NoLabels: Story = {
  name: "State/Compact (No Labels)",
  render: () => {
    const [v, setV] = useState<string | undefined>("good");
    return (
      <div style={{ width: 240 }}>
        <MoodSelector value={v} onValueChange={setV} showLabels={false} />
      </div>
    );
  },
};

export const CustomOptions: Story = {
  name: "Recipe/3-Step",
  render: () => {
    const [v, setV] = useState<string | undefined>();
    return (
      <div style={{ width: 280 }}>
        <MoodSelector
          value={v}
          onValueChange={setV}
          options={[
            { value: "bad", emoji: "😟", label: "별로" },
            { value: "ok", emoji: "🙂", label: "괜찮아요" },
            { value: "great", emoji: "😀", label: "좋아요" },
          ]}
        />
      </div>
    );
  },
};
