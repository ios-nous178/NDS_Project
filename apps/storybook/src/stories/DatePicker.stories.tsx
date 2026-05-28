import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker, FormField } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/DatePicker",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("DatePicker"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function BasicExample() {
  const [date, setDate] = useState<Date>();
  return (
    <div style={{ width: 280 }}>
      <DatePicker value={date} onChange={setDate} fullWidth />
    </div>
  );
}

function FutureOnlyExample() {
  const [date, setDate] = useState<Date>();
  const today = new Date();
  const max = new Date();
  max.setMonth(max.getMonth() + 3);
  return (
    <div style={{ width: 320 }}>
      <FormField label="상담 희망일" required helper="오늘부터 3개월 이내로 선택해주세요">
        <DatePicker value={date} onChange={setDate} minDate={today} maxDate={max} fullWidth />
      </FormField>
    </div>
  );
}

function PreFilledExample() {
  const [date, setDate] = useState<Date>(new Date(2026, 4, 15));
  return (
    <div style={{ width: 280 }}>
      <DatePicker value={date} onChange={setDate} fullWidth />
    </div>
  );
}

function DisabledExample() {
  return (
    <div style={{ width: 280 }}>
      <DatePicker value={new Date(2026, 0, 1)} onChange={() => {}} disabled fullWidth />
    </div>
  );
}

export const Basic: Story = { name: "기본", render: () => <BasicExample /> };
export const Booking: Story = { name: "상담 예약 (min/max)", render: () => <FutureOnlyExample /> };
export const PreFilled: Story = { name: "초기값 있음", render: () => <PreFilledExample /> };
export const Disabled: Story = { name: "비활성화", render: () => <DisabledExample /> };
