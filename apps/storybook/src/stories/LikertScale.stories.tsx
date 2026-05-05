import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LikertScale } from "@nudge-eap/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/LikertScale",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("LikertScale"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const FIVE_POINT = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

const PHQ9 = [
  { value: "0", label: "전혀" },
  { value: "1", label: "며칠" },
  { value: "2", label: "절반\n이상" },
  { value: "3", label: "거의\n매일" },
];

function FivePointExample() {
  const [value, setValue] = useState<string | number>();
  return (
    <div style={{ width: 400 }}>
      <p style={{ marginBottom: 16, fontSize: 14 }}>나는 평소 스트레스를 잘 관리하고 있다.</p>
      <LikertScale
        name="q1"
        options={FIVE_POINT}
        value={value}
        onValueChange={setValue}
        startLabel="전혀 그렇지 않다"
        endLabel="매우 그렇다"
      />
    </div>
  );
}

function PHQExample() {
  const [value, setValue] = useState<string | number>();
  return (
    <div style={{ width: 400 }}>
      <p style={{ marginBottom: 16, fontSize: 14 }}>
        지난 2주 동안, 매사에 흥미나 즐거움이 거의 없었다.
      </p>
      <LikertScale name="phq-1" options={PHQ9} value={value} onValueChange={setValue} />
    </div>
  );
}

function SevenPointExample() {
  const [value, setValue] = useState<string | number>("4");
  return (
    <div style={{ width: 480 }}>
      <p style={{ marginBottom: 16, fontSize: 14 }}>상담사와의 대화가 도움이 되었다.</p>
      <LikertScale
        name="rating"
        options={[
          { value: "1" },
          { value: "2" },
          { value: "3" },
          { value: "4" },
          { value: "5" },
          { value: "6" },
          { value: "7" },
        ]}
        value={value}
        onValueChange={setValue}
        startLabel="매우 불만족"
        endLabel="매우 만족"
      />
    </div>
  );
}

function DisabledExample() {
  return (
    <div style={{ width: 400 }}>
      <LikertScale
        name="disabled"
        options={FIVE_POINT}
        value="3"
        onValueChange={() => {}}
        startLabel="전혀"
        endLabel="매우"
        disabled
      />
    </div>
  );
}

export const FivePoint: Story = {
  name: "5점 척도 (양 끝 라벨)",
  render: () => <FivePointExample />,
};

export const PHQ: Story = {
  name: "PHQ-9 스타일 (각 점 라벨)",
  render: () => <PHQExample />,
};

export const SevenPoint: Story = {
  name: "7점 척도",
  render: () => <SevenPointExample />,
};

export const Disabled: Story = {
  name: "비활성화",
  render: () => <DisabledExample />,
};
