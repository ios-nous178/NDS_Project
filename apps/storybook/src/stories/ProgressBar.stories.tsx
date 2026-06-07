import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "@nudge-design/react";

const meta: Meta<typeof ProgressBar> = {
  title: "Components/Display/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: { value: 65, size: "md" },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: "Variant/비교",
  render: () => (
    <div
      style={{
        width: 300,
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-loose)",
      }}
    >
      <ProgressBar value={30} size="sm" />
      <ProgressBar value={60} size="md" />
      <ProgressBar value={90} size="lg" />
    </div>
  ),
};

export const CustomColor: Story = {
  name: "Recipe/색상 오버라이드",
  render: () => (
    <div
      style={{
        width: 300,
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-loose)",
      }}
    >
      <ProgressBar value={100} color="#00A07C" />
      <ProgressBar value={75} color="#ED2E77" />
      <ProgressBar value={40} color="#FFC303" />
    </div>
  ),
};

export const Steps: Story = {
  name: "Recipe/심리검사 진행률",
  render: () => (
    <div style={{ width: 300 }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}
      >
        <span>3 / 10 문항</span>
        <span>30%</span>
      </div>
      <ProgressBar value={30} size="sm" />
    </div>
  ),
};
