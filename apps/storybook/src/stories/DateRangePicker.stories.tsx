/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DateRangePicker, defaultRangePresets, type DateRange } from "@nudge-design/react";

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/Inputs/DateRangePicker",
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
        <DateRangePicker
          value={v}
          onValueChange={setV}
          allowClear
          onClear={() => setV({})}
          fullWidth
        />
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
        <DateRangePicker
          value={v}
          onValueChange={setV}
          presets={defaultRangePresets}
          allowClear
          onClear={() => setV({})}
          fullWidth
        />
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
        <DateRangePicker
          value={v}
          onValueChange={setV}
          presets={defaultRangePresets}
          allowClear
          onClear={() => setV({})}
          fullWidth
        />
      </div>
    );
  },
};

export const WeekdayOnly: Story = {
  name: "Constraint/Weekday Only",
  render: () => {
    const [v, setV] = useState<DateRange>({});
    return (
      <div style={{ width: 520 }}>
        <DateRangePicker
          value={v}
          onValueChange={setV}
          disabledDate={(d) => d.getDay() === 0 || d.getDay() === 6}
          status="warning"
          placeholder="평일 기간 선택"
          allowClear
          onClear={() => setV({})}
          fullWidth
        />
      </div>
    );
  },
};
