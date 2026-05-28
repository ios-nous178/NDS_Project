import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Stepper, Button } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/Stepper",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Stepper"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const COUNSEL_STEPS = [
  { key: "intro", label: "안내" },
  { key: "info", label: "정보 입력" },
  { key: "test", label: "검사" },
  { key: "result", label: "결과" },
];

function NumberedExample() {
  return (
    <div style={{ width: 480 }}>
      <Stepper steps={COUNSEL_STEPS} current={1} />
    </div>
  );
}

function CompletedExample() {
  return (
    <div style={{ width: 480 }}>
      <Stepper steps={COUNSEL_STEPS} current={3} />
    </div>
  );
}

function DotsExample() {
  return (
    <div style={{ width: 320 }}>
      <Stepper
        steps={[{ key: "1" }, { key: "2" }, { key: "3" }, { key: "4" }, { key: "5" }]}
        current={2}
        variant="dots"
      />
    </div>
  );
}

function InteractiveExample() {
  const [current, setCurrent] = useState(0);
  const total = COUNSEL_STEPS.length;
  return (
    <div
      style={{
        width: 480,
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-wide)",
      }}
    >
      <Stepper steps={COUNSEL_STEPS} current={current} />
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

export const Numbered: Story = {
  name: "기본 (numbered)",
  render: () => <NumberedExample />,
};

export const Completed: Story = {
  name: "거의 완료",
  render: () => <CompletedExample />,
};

export const Dots: Story = {
  name: "도트 스타일",
  render: () => <DotsExample />,
};

export const Interactive: Story = {
  name: "인터랙션",
  render: () => <InteractiveExample />,
};
