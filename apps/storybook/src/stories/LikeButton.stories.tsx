import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LikeButton } from "@nudge-design/react";

const meta: Meta<typeof LikeButton> = {
  title: "Components/Display/LikeButton",
  component: LikeButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    hideCount: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof LikeButton>;

export const Playground: Story = {
  render: function Render(args) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(12);
    return (
      <LikeButton
        {...args}
        liked={liked}
        count={count}
        onChange={(v) => {
          setLiked(v);
          setCount((c) => c + (v ? 1 : -1));
        }}
      />
    );
  },
};

export const Sizes: Story = {
  name: "Variant/sm md lg",
  render: function Render() {
    const [s, setS] = useState(false);
    const [m, setM] = useState(true);
    const [l, setL] = useState(false);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-wide)" }}>
        <LikeButton size="sm" liked={s} count={3} onChange={setS} />
        <LikeButton size="md" liked={m} count={42} onChange={setM} />
        <LikeButton size="lg" liked={l} count={1234} onChange={setL} />
      </div>
    );
  },
};

export const NoCount: Story = {
  name: "Variant/카운트 숨김",
  render: function Render() {
    const [v, setV] = useState(false);
    return <LikeButton liked={v} onChange={setV} hideCount />;
  },
};

export const CustomColor: Story = {
  name: "Variant/사용자 색 (primary)",
  render: function Render() {
    const [v, setV] = useState(true);
    return (
      <LikeButton
        liked={v}
        count={88}
        onChange={setV}
        activeColor="var(--semantic-text-brand-default)"
      />
    );
  },
};

export const LargeCount: Story = {
  name: "Edge/큰 카운트 (자동 K 변환)",
  render: function Render() {
    const [v, setV] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-default)" }}>
        <LikeButton liked={v} count={999} onChange={setV} />
        <LikeButton liked={v} count={1234} onChange={setV} />
        <LikeButton liked={v} count={12000} onChange={setV} />
      </div>
    );
  },
};
