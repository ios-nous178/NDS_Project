import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "@nudge-design/react";

const meta: Meta<typeof Slider> = {
  title: "Components/Controls/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Slider>;

const Wrapped = (props: React.ComponentProps<typeof Slider>) => {
  const [v, setV] = useState(props.value);
  return (
    <div style={{ width: 360 }}>
      <Slider {...props} value={v} onValueChange={setV} />
    </div>
  );
};

export const Default: Story = {
  name: "State/Default",
  render: () => <Wrapped value={50} onValueChange={() => {}} />,
};

export const PainScale: Story = {
  name: "Recipe/Pain Scale",
  render: () => (
    <Wrapped
      value={3}
      min={0}
      max={10}
      step={1}
      startLabel="없음"
      endLabel="극심함"
      showValue
      onValueChange={() => {}}
    />
  ),
};

export const StressPercent: Story = {
  name: "Recipe/Stress %",
  render: () => (
    <Wrapped
      value={60}
      min={0}
      max={100}
      step={5}
      showValue
      formatValue={(v) => `${v}%`}
      onValueChange={() => {}}
    />
  ),
};

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => (
    <div style={{ width: 360 }}>
      <Slider value={30} onValueChange={() => {}} disabled />
    </div>
  ),
};
