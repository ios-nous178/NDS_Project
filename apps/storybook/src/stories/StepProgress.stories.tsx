import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StepProgress, Button } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/StepProgress",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("StepProgress"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const CAMPAIGN_STEPS = [
  { key: "campaign", label: "Step 1", title: "캠페인 만들기" },
  { key: "ad", label: "Step 2", title: "광고 만들기" },
  { key: "creative", label: "Step 3", title: "소재 만들기" },
];

function BasicExample() {
  return (
    <div style={{ width: 720 }}>
      <StepProgress steps={CAMPAIGN_STEPS} current={0} />
    </div>
  );
}

function MidwayExample() {
  return (
    <div style={{ width: 720 }}>
      <StepProgress steps={CAMPAIGN_STEPS} current={1} />
    </div>
  );
}

function CompletedExample() {
  return (
    <div style={{ width: 720 }}>
      <StepProgress steps={CAMPAIGN_STEPS} current={2} />
    </div>
  );
}

function InteractiveExample() {
  const [current, setCurrent] = useState(0);
  const total = CAMPAIGN_STEPS.length;
  return (
    <div
      style={{
        width: 720,
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-wide)",
      }}
    >
      <StepProgress steps={CAMPAIGN_STEPS} current={current} />
      <div
        style={{ display: "flex", gap: "var(--semantic-gap-default)", justifyContent: "center" }}
      >
        <Button
          variant="outlined"
          onClick={() => setCurrent((p) => Math.max(0, p - 1))}
          disabled={current === 0}
        >
          이전
        </Button>
        <Button
          onClick={() => setCurrent((p) => Math.min(total - 1, p + 1))}
          disabled={current === total - 1}
        >
          다음
        </Button>
      </div>
    </div>
  );
}

export const Step1: Story = {
  name: "Step 1 진행 중",
  render: () => <BasicExample />,
};

export const Step2: Story = {
  name: "Step 2 진행 중",
  render: () => <MidwayExample />,
};

export const Step3: Story = {
  name: "Step 3 진행 중",
  render: () => <CompletedExample />,
};

export const Interactive: Story = {
  name: "인터랙션",
  render: () => <InteractiveExample />,
};
