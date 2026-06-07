import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SelectionButtonGroup } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/Controls/SelectionButtonGroup",
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

function EqualWidthExample() {
  // 라벨 길이가 제각각이어도(전체 / 특정 지역 / 특정 시간대만) 그룹 내 옵션은
  // 가장 넓은 옵션 기준으로 등폭 정렬된다 — fullWidth 없이 hug 상태에서도.
  const [value, setValue] = useState<"all" | "region" | "time">("region");
  return (
    <SelectionButtonGroup
      options={[
        { value: "all", label: "전체" },
        { value: "region", label: "특정 지역" },
        { value: "time", label: "특정 시간대만" },
      ]}
      value={value}
      onValueChange={setValue}
    />
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
  name: "Variant/2개 옵션",
  render: () => <TwoOptionExample />,
};

export const ThreeOptions: Story = {
  name: "Variant/3개 옵션",
  render: () => <ThreeOptionExample />,
};

export const EqualWidth: Story = {
  name: "Variant/등폭 (라벨 길이 다름)",
  render: () => <EqualWidthExample />,
};

export const FullWidth: Story = {
  name: "Variant/Full Width",
  render: () => <FullWidthExample />,
};

export const DisabledItem: Story = {
  name: "State/비활성 아이템 포함",
  render: () => <DisabledItemExample />,
};
