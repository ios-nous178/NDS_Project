import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ReactionPicker } from "@nudge-eap/react";

const meta: Meta<typeof ReactionPicker> = {
  title: "Components/ReactionPicker",
  component: ReactionPicker,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ReactionPicker>;

const REACTIONS = [
  { key: "love", emoji: "❤️", label: "공감" },
  { key: "support", emoji: "🤗", label: "응원" },
  { key: "wow", emoji: "✨", label: "와우" },
  { key: "calm", emoji: "🌿", label: "평온" },
];

export const Playground: Story = {
  render: function Render() {
    const [v, setV] = useState<string[]>(["love"]);
    return (
      <ReactionPicker
        options={REACTIONS.map((r) => ({
          ...r,
          count: r.key === "love" ? 12 : Math.floor(Math.random() * 9),
        }))}
        value={v}
        onValueChange={setV}
      />
    );
  },
};

export const Single: Story = {
  name: "Variant/단일 선택",
  render: function Render() {
    const [v, setV] = useState<string[]>([]);
    return <ReactionPicker options={REACTIONS} value={v} onValueChange={setV} single hideCount />;
  },
};

export const NoCount: Story = {
  name: "Variant/카운트 숨김",
  render: function Render() {
    const [v, setV] = useState<string[]>([]);
    return <ReactionPicker options={REACTIONS} value={v} onValueChange={setV} hideCount />;
  },
};

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => (
    <ReactionPicker
      options={REACTIONS.map((r) => ({ ...r, count: 5 }))}
      value={["love"]}
      onValueChange={() => undefined}
      disabled
    />
  ),
};
