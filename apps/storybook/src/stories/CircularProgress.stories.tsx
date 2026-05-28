import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CircularProgress } from "@nudge-design/react";

const meta: Meta<typeof CircularProgress> = {
  title: "Components/CircularProgress",
  component: CircularProgress,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: { type: "number", min: 40, max: 240 } },
    value: { control: { type: "number", min: 0, max: 100 } },
  },
  args: { value: 65, size: 96 },
};

export default meta;
type Story = StoryObj<typeof CircularProgress>;

export const Playground: Story = {
  render: (args) => <CircularProgress {...args} />,
};

export const Sizes: Story = {
  name: "Size/sm md lg",
  render: () => (
    <div style={{ display: "flex", gap: "var(--semantic-gap-wide)", alignItems: "center" }}>
      <CircularProgress value={70} size={48} />
      <CircularProgress value={70} size={80} />
      <CircularProgress value={70} size={120} />
    </div>
  ),
};

export const Colors: Story = {
  name: "Color/semantic 톤",
  render: () => (
    <div style={{ display: "flex", gap: "var(--semantic-gap-wide)" }}>
      <CircularProgress value={80} size={80} caption="목표" />
      <CircularProgress
        value={50}
        size={80}
        color="var(--semantic-text-status-caution)"
        caption="주의"
      />
      <CircularProgress
        value={20}
        size={80}
        color="var(--semantic-text-status-error)"
        caption="낮음"
      />
      <CircularProgress
        value={95}
        size={80}
        color="var(--semantic-text-status-success)"
        caption="달성"
      />
    </div>
  ),
};

export const WithLabelOverride: Story = {
  name: "Recipe/라벨 커스텀 (분/시간)",
  render: () => (
    <div style={{ display: "flex", gap: "var(--semantic-gap-wide)" }}>
      <CircularProgress value={28} max={60} size={96} label="28분" caption="목표 60분" />
      <CircularProgress value={3} max={5} size={96} label="3/5" caption="이번 주" />
    </div>
  ),
};

export const Animated: Story = {
  name: "Recipe/값 변경 애니메이션",
  render: function Render() {
    const [v, setV] = useState(0);
    useEffect(() => {
      const t = setInterval(() => {
        setV((cur) => (cur >= 100 ? 0 : cur + 5));
      }, 600);
      return () => clearInterval(t);
    }, []);
    return <CircularProgress value={v} size={96} />;
  },
};

export const HideLabel: Story = {
  name: "Variant/라벨 숨김",
  render: () => <CircularProgress value={45} size={48} hideLabel />,
};
