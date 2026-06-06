import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedControl } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/Controls/SegmentedControl",
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

const DashIcon = (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const RiskIcon = (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L18 17H2L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="14" r="0.8" fill="currentColor" />
  </svg>
);

/** lg(PC) + 아이콘 — 구 Tabs variant="segment" 의 어드민 세그먼트 용도 흡수 */
function LargePcExample() {
  const [value, setValue] = useState<"dashboard" | "risk" | "counsel">("dashboard");
  return (
    <div style={{ width: 520 }}>
      <SegmentedControl
        size="lg"
        fullWidth
        options={[
          { value: "dashboard", label: "통합 대시보드", icon: DashIcon },
          { value: "risk", label: "고위험군 관리", icon: RiskIcon },
          { value: "counsel", label: "상담" },
        ]}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

export const Basic: Story = {
  name: "State/기본",
  render: () => <BasicExample />,
};

export const Medium: Story = {
  name: "Variant/Medium 사이즈",
  render: () => <MediumExample />,
};

export const FullWidth: Story = {
  name: "Variant/Full Width",
  render: () => <FullWidthExample />,
};

export const DisabledItem: Story = {
  name: "State/비활성 아이템 포함",
  render: () => <DisabledItemExample />,
};

export const LargePc: Story = {
  name: "Variant/PC + 아이콘 (구 Tabs.segment)",
  parameters: { layout: "padded" },
  render: () => <LargePcExample />,
};
