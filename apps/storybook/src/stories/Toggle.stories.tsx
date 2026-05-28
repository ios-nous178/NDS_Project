import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "@nudge-design/react";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    disabled: { control: "boolean" },
  },
  args: { size: "md", label: "알림 수신", disabled: false },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

function ToggleExample(props: React.ComponentProps<typeof Toggle>) {
  const [checked, setChecked] = useState(false);
  return <Toggle {...props} checked={checked} onCheckedChange={setChecked} />;
}

export const Playground: Story = {
  render: (args) => <ToggleExample {...args} />,
};

export const Sizes: Story = {
  name: "Size/비교",
  render: function Render() {
    const [a, setA] = useState(true);
    const [b, setB] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}>
        <Toggle size="md" checked={a} onCheckedChange={setA} label="Medium (44×24)" />
        <Toggle size="sm" checked={b} onCheckedChange={setB} label="Small (36×20)" />
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}>
      <Toggle checked={false} disabled label="비활성 OFF" />
      <Toggle checked={true} disabled label="비활성 ON" />
    </div>
  ),
};

export const AllStates: Story = {
  name: "State/All States",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Toggle checked={false} onCheckedChange={() => undefined} label="Off" />
      <Toggle checked onCheckedChange={() => undefined} label="On" />
      <Toggle checked={false} disabled label="Disabled (Off)" />
      <Toggle checked disabled label="Disabled (On)" />
    </div>
  ),
};
