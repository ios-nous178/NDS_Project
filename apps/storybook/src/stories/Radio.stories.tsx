/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup, RadioGroupItem } from "@nudge-eap/react";

const meta: Meta<typeof Radio> = {
  title: "Components/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  name: "State/Default",
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Radio checked={checked} onCheckedChange={setChecked} label="동의합니다" />;
  },
};

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => <Radio checked label="선택 불가" disabled />,
};

export const AllStates: Story = {
  name: "State/All States",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Radio checked={false} onCheckedChange={() => undefined} label="Default (Unselected)" />
      <Radio checked onCheckedChange={() => undefined} label="Selected" />
      <Radio checked={false} disabled label="Disabled (Unselected)" />
      <Radio checked disabled label="Disabled (Selected)" />
    </div>
  ),
};

export const VerticalGroup: Story = {
  name: "Group/Vertical",
  render: () => {
    const [value, setValue] = useState("daily");
    return (
      <div style={{ width: 280 }}>
        <RadioGroup name="frequency" value={value} onValueChange={setValue}>
          <RadioGroupItem value="daily" label="매일" />
          <RadioGroupItem value="weekly" label="매주" />
          <RadioGroupItem value="monthly" label="매월" />
        </RadioGroup>
      </div>
    );
  },
};

export const HorizontalGroup: Story = {
  name: "Group/Horizontal",
  render: () => {
    const [value, setValue] = useState("yes");
    return (
      <RadioGroup name="agree" value={value} onValueChange={setValue} layout="horizontal">
        <RadioGroupItem value="yes" label="예" />
        <RadioGroupItem value="no" label="아니오" />
        <RadioGroupItem value="maybe" label="모르겠음" />
      </RadioGroup>
    );
  },
};
