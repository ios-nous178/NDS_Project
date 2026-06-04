import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SelectionButtonGroup } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/SelectionButtonGroup",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("SelectionButtonGroup"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function TwoOptionExample() {
  const [value, setValue] = useState<"daily" | "weekly">("daily");
  return (
    <SelectionButtonGroup
      options={[
        { value: "daily", label: "일별" },
        { value: "weekly", label: "요일별" },
      ]}
      value={value}
      onValueChange={setValue}
    />
  );
}

function ThreeOptionExample() {
  const [value, setValue] = useState<"always" | "time" | "weekday">("always");
  return (
    <SelectionButtonGroup
      options={[
        { value: "always", label: "항상" },
        { value: "time", label: "특정 시간만" },
        { value: "weekday", label: "특정 요일/시간만" },
      ]}
      value={value}
      onValueChange={setValue}
    />
  );
}

function FullWidthExample() {
  const [value, setValue] = useState<"a" | "b" | "c">("a");
  return (
    <div style={{ width: 420 }}>
      <SelectionButtonGroup
        fullWidth
        options={[
          { value: "a", label: "옵션 A" },
          { value: "b", label: "옵션 B" },
          { value: "c", label: "옵션 C" },
        ]}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

function DisabledItemExample() {
  const [value, setValue] = useState<"a" | "b" | "c">("a");
  return (
    <SelectionButtonGroup
      options={[
        { value: "a", label: "사용 가능" },
        { value: "b", label: "준비 중", disabled: true },
        { value: "c", label: "사용 가능" },
      ]}
      value={value}
      onValueChange={setValue}
    />
  );
}

export const TwoOptions: Story = {
  name: "2개 옵션",
  render: () => <TwoOptionExample />,
};

export const ThreeOptions: Story = {
  name: "3개 옵션",
  render: () => <ThreeOptionExample />,
};

export const FullWidth: Story = {
  name: "Full Width",
  render: () => <FullWidthExample />,
};

export const DisabledItem: Story = {
  name: "비활성 아이템 포함",
  render: () => <DisabledItemExample />,
};
