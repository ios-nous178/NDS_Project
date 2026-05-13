import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Sparkline } from "@nudge-eap/react";

const meta: Meta<typeof Sparkline> = {
  title: "Components/Sparkline",
  component: Sparkline,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    kind: { control: "radio", options: ["line", "area", "bar"] },
    showBaseline: { control: "boolean" },
    showLastDot: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Sparkline>;

const STRESS = [3, 4, 5, 6, 5, 4, 6, 7, 8, 6, 5, 4, 3, 2];
const SLEEP = [6.5, 7, 7.2, 6.8, 7.5, 8, 7.8];

export const Playground: Story = {
  args: { data: STRESS, kind: "line", width: 160, height: 48 },
  render: (args) => <Sparkline {...args} />,
};

export const Variants: Story = {
  name: "Variant/line area bar",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Sparkline data={STRESS} kind="line" width={200} height={48} />
      <Sparkline data={STRESS} kind="area" width={200} height={48} />
      <Sparkline data={STRESS} kind="bar" width={200} height={48} />
    </div>
  ),
};

export const InCard: Story = {
  name: "Recipe/카드 안의 미니 추이",
  render: () => (
    <div
      style={{
        width: 280,
        padding: 16,
        background: "#FAFBFC",
        borderRadius: 12,
        border: "1px solid #eee",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 13, color: "#888" }}>이번 주 평균 수면</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>7.4시간</div>
        </div>
        <Sparkline
          data={SLEEP}
          kind="area"
          width={120}
          height={48}
          color="var(--semantic-success-main, #2BAA48)"
        />
      </div>
    </div>
  ),
};

export const WithBaseline: Story = {
  name: "Variant/baseline 표시",
  render: () => (
    <div>
      <Sparkline
        data={[-2, 1, 3, -1, 4, 5, -3, 2]}
        kind="line"
        width={200}
        height={48}
        showBaseline
      />
    </div>
  ),
};
