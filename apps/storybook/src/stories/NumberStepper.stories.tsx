import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NumberStepper } from "@nudge-design/react";

const meta: Meta<typeof NumberStepper> = {
  title: "Components/NumberStepper",
  component: NumberStepper,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    editable: { control: "boolean" },
  },
  args: { min: 0, max: 10, step: 1, size: "md" },
};

export default meta;
type Story = StoryObj<typeof NumberStepper>;

export const Playground: Story = {
  render: function Render(args) {
    const [v, setV] = useState(1);
    return <NumberStepper {...args} value={v} onValueChange={setV} />;
  },
};

export const Sizes: Story = {
  name: "Size/sm md lg",
  render: function Render() {
    const [a, setA] = useState(1);
    const [b, setB] = useState(2);
    const [c, setC] = useState(3);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}>
        <NumberStepper size="sm" value={a} onValueChange={setA} max={10} />
        <NumberStepper size="md" value={b} onValueChange={setB} max={10} />
        <NumberStepper size="lg" value={c} onValueChange={setC} max={10} />
      </div>
    );
  },
};

export const WithUnit: Story = {
  name: "Recipe/단위 표시",
  render: function Render() {
    const [n, setN] = useState(2);
    return (
      <NumberStepper
        value={n}
        onValueChange={setN}
        min={1}
        max={5}
        unit="회"
        aria-label="복약 횟수"
      />
    );
  },
};

export const Editable: Story = {
  name: "Recipe/직접 입력 가능",
  render: function Render() {
    const [n, setN] = useState(50);
    return <NumberStepper value={n} onValueChange={setN} min={0} max={100} step={5} editable />;
  },
};

export const AtLimits: Story = {
  name: "Edge/min·max 도달",
  render: function Render() {
    const [n, setN] = useState(0);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}>
        <NumberStepper value={n} onValueChange={setN} min={0} max={3} />
        <small>min: -버튼 비활성, max: +버튼 비활성</small>
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => <NumberStepper value={2} onValueChange={() => undefined} disabled />,
};
