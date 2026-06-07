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
  name: "Recipe/PHQ-9 Custom Segments",
  render: () => (
    <div style={{ width: 320 }}>
      <ScoreGauge
        value={14}
        max={27}
        segments={[
          { level: "normal", label: "정상", from: 0, to: 5 },
          { level: "mild", label: "경증", from: 5, to: 10 },
          { level: "moderate", label: "중등도", from: 10, to: 20 },
          { level: "severe", label: "심각", from: 20, to: 28 },
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
