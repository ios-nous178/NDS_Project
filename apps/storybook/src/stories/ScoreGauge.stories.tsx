import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ScoreGauge } from "@nudge-design/react";

const meta: Meta<typeof ScoreGauge> = {
  title: "Components/Data/ScoreGauge",
  component: ScoreGauge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ScoreGauge>;

export const Default: Story = {
  name: "State/Default",
  render: () => (
    <div style={{ width: 280 }}>
      <ScoreGauge value={45} max={100} />
    </div>
  ),
};

export const PHQ9Custom: Story = {
  tags: ["gallery"],
  name: "Recipe/구간별 점수",
  render: () => (
    <div style={{ width: 320 }}>
      <ScoreGauge
        value={72}
        max={100}
        segments={[
          { level: "normal", label: "낮음", from: 0, to: 40 },
          { level: "mild", label: "보통", from: 40, to: 70 },
          { level: "moderate", label: "높음", from: 70, to: 90 },
          { level: "severe", label: "매우 높음", from: 90, to: 100 },
        ]}
        showLegend
      />
    </div>
  ),
};

export const SeverNeedle: Story = {
  name: "State/Severe",
  render: () => (
    <div style={{ width: 280 }}>
      <ScoreGauge value={88} max={100} />
    </div>
  ),
};
