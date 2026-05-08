/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DateRangePicker, defaultRangePresets, type DateRange } from "@nudge-eap/react";

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  name: "State/Default",
  render: () => {
    const [v, setV] = useState<DateRange>({});
    return (
      <div style={{ width: 520 }}>
        <DateRangePicker value={v} onValueChange={setV} />
      </div>
    );
  },
};

export const WithPresets: Story = {
  name: "Recipe/With Presets",
  render: () => {
    const [v, setV] = useState<DateRange>({});
    return (
      <div style={{ width: 520 }}>
        <DateRangePicker value={v} onValueChange={setV} presets={defaultRangePresets} />
      </div>
    );
  },
};

export const Prefilled: Story = {
  name: "State/Prefilled",
  render: () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    const [v, setV] = useState<DateRange>({ from: start, to: today });
    return (
      <div style={{ width: 520 }}>
        <DateRangePicker value={v} onValueChange={setV} presets={defaultRangePresets} />
      </div>
    );
  },
};
