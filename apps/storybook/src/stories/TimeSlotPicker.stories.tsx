import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TimeSlotPicker, FormField } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/TimeSlotPicker",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("TimeSlotPicker"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const FLAT_SLOTS = [
  { value: "09:00" },
  { value: "09:30", unavailable: true },
  { value: "10:00" },
  { value: "10:30" },
  { value: "11:00", unavailable: true },
  { value: "11:30" },
  { value: "13:00" },
  { value: "13:30" },
  { value: "14:00", unavailable: true },
  { value: "14:30" },
  { value: "15:00" },
  { value: "15:30" },
];

function FlatExample() {
  const [value, setValue] = useState<string>();
  return (
    <div style={{ width: 360 }}>
      <TimeSlotPicker slots={FLAT_SLOTS} value={value} onValueChange={setValue} />
    </div>
  );
}

function GroupedExample() {
  const [value, setValue] = useState<string>("13:00");
  return (
    <div style={{ width: 360 }}>
      <FormField label="상담 시간 선택" required>
        <TimeSlotPicker
          value={value}
          onValueChange={setValue}
          groups={[
            {
              key: "morning",
              label: "오전",
              slots: [
                { value: "09:00" },
                { value: "09:30", unavailable: true },
                { value: "10:00" },
                { value: "10:30" },
                { value: "11:00" },
                { value: "11:30", unavailable: true },
              ],
            },
            {
              key: "afternoon",
              label: "오후",
              slots: [
                { value: "13:00" },
                { value: "13:30" },
                { value: "14:00", unavailable: true },
                { value: "14:30" },
                { value: "15:00" },
                { value: "15:30" },
              ],
            },
            {
              key: "evening",
              label: "저녁",
              slots: [
                { value: "18:00" },
                { value: "18:30" },
                { value: "19:00" },
                { value: "19:30", unavailable: true },
              ],
            },
          ]}
        />
      </FormField>
    </div>
  );
}

function ThreeColumnsExample() {
  const [value, setValue] = useState<string>();
  return (
    <div style={{ width: 320 }}>
      <TimeSlotPicker
        columns={3}
        value={value}
        onValueChange={setValue}
        slots={[
          { value: "10:00" },
          { value: "11:00" },
          { value: "12:00" },
          { value: "13:00", unavailable: true },
          { value: "14:00" },
          { value: "15:00" },
        ]}
      />
    </div>
  );
}

function EmptyExample() {
  return (
    <div style={{ width: 360 }}>
      <TimeSlotPicker slots={[]} onValueChange={() => {}} />
    </div>
  );
}

export const Flat: Story = { name: "단순 그리드", render: () => <FlatExample /> };
export const Grouped: Story = { name: "오전/오후/저녁 그룹", render: () => <GroupedExample /> };
export const ThreeColumns: Story = { name: "3열", render: () => <ThreeColumnsExample /> };
export const Empty: Story = { name: "빈 상태", render: () => <EmptyExample /> };
