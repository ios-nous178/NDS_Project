import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BreathingGuide } from "@nudge-design/react";

const meta: Meta<typeof BreathingGuide> = {
  title: "Components/BreathingGuide",
  component: BreathingGuide,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof BreathingGuide>;

export const BoxBreathing: Story = {
  name: "Recipe/박스 호흡 (4-4-4-4)",
  render: () => (
    <div style={{ width: 360 }}>
      <BreathingGuide />
    </div>
  ),
};

export const Pattern478: Story = {
  name: "Recipe/4-7-8 호흡 (이완)",
  render: () => (
    <div style={{ width: 360 }}>
      <BreathingGuide
        phases={[
          { kind: "inhale", seconds: 4 },
          { kind: "hold", seconds: 7 },
          { kind: "exhale", seconds: 8 },
        ]}
      />
    </div>
  ),
};

export const ThreeCycles: Story = {
  name: "Recipe/3 사이클 후 종료",
  render: () => (
    <div style={{ width: 360 }}>
      <BreathingGuide cycles={3} autoStart onComplete={() => alert("완료!")} />
    </div>
  ),
};

export const NoControls: Story = {
  name: "Variant/컨트롤 숨김 + 자동 시작",
  render: () => (
    <div style={{ width: 360 }}>
      <BreathingGuide autoStart hideControls showCount={false} />
    </div>
  ),
};
