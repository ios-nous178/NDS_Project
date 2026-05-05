import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedControl } from "@nudge-eap/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/SegmentedControl",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("SegmentedControl"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function BasicExample() {
  const [value, setValue] = useState<"weekly" | "monthly" | "yearly">("weekly");
  return (
    <SegmentedControl
      options={[
        { value: "weekly", label: "주간" },
        { value: "monthly", label: "월간" },
        { value: "yearly", label: "연간" },
      ]}
      value={value}
      onValueChange={setValue}
    />
  );
}

function MediumExample() {
  const [value, setValue] = useState<"all" | "mine" | "shared">("all");
  return (
    <SegmentedControl
      size="md"
      options={[
        { value: "all", label: "전체" },
        { value: "mine", label: "내 글" },
        { value: "shared", label: "공유받음" },
      ]}
      value={value}
      onValueChange={setValue}
    />
  );
}

function FullWidthExample() {
  const [value, setValue] = useState<"face" | "video" | "chat">("face");
  return (
    <div style={{ width: 360 }}>
      <SegmentedControl
        fullWidth
        options={[
          { value: "face", label: "대면" },
          { value: "video", label: "화상" },
          { value: "chat", label: "채팅" },
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
    <SegmentedControl
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

export const Basic: Story = {
  name: "기본",
  render: () => <BasicExample />,
};

export const Medium: Story = {
  name: "Medium 사이즈",
  render: () => <MediumExample />,
};

export const FullWidth: Story = {
  name: "Full Width",
  render: () => <FullWidthExample />,
};

export const DisabledItem: Story = {
  name: "비활성 아이템 포함",
  render: () => <DisabledItemExample />,
};
