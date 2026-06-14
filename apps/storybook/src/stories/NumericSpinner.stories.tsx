import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { NumericSpinner } from "@nudge-design/react";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<typeof NumericSpinner> = {
  title: "Components/Inputs/NumericSpinner",
  component: NumericSpinner,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof NumericSpinner>;

export const Playground: Story = {
  render: function Render() {
    const [v, setV] = useState(1);
    return <NumericSpinner value={v} onValueChange={setV} min={0} max={10} />;
  },
};

export const Sizes: Story = {
  name: "Variant/사이즈",
  tags: ["gallery"],
  render: function Render() {
    const [a, setA] = useState(2);
    const [b, setB] = useState(2);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <NumericSpinner value={a} onValueChange={setA} size="medium" aria-label="medium" />
        <NumericSpinner value={b} onValueChange={setB} size="small" aria-label="small" />
      </div>
    );
  },
};

export const Bounds: Story = {
  name: "State/경계값 (버튼 비활성)",
  tags: ["gallery"],
  render: function Render() {
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(10);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* 최솟값 도달 → − 비활성 */}
        <NumericSpinner value={min} onValueChange={setMin} min={1} max={10} aria-label="최솟값" />
        {/* 최댓값 도달 → + 비활성 */}
        <NumericSpinner value={max} onValueChange={setMax} min={1} max={10} aria-label="최댓값" />
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "State/비활성",
  render: function Render() {
    const [v, setV] = useState(3);
    return <NumericSpinner value={v} onValueChange={setV} disabled aria-label="비활성" />;
  },
};

export const StepFive: Story = {
  name: "Recipe/5단위 증감",
  tags: ["gallery"],
  render: function Render() {
    const [v, setV] = useState(0);
    return (
      <NumericSpinner
        value={v}
        onValueChange={setV}
        min={0}
        max={100}
        step={5}
        aria-label="5단위"
      />
    );
  },
};

export const Interaction: Story = {
  name: "Test/증감 + 경계 clamp",
  render: function Render() {
    const [v, setV] = useState(8);
    return <NumericSpinner value={v} onValueChange={setV} min={0} max={10} aria-label="수량" />;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const spin = canvas.getByRole("spinbutton") as HTMLInputElement;
    const inc = canvas.getByLabelText("값 증가");
    const dec = canvas.getByLabelText("값 감소");

    expect(spin.value).toBe("8");

    await user.click(inc); // 9
    await user.click(inc); // 10 (max)
    expect(spin.value).toBe("10");
    // 최댓값 도달 → + 비활성, 더 눌러도 안 올라감
    expect(inc).toBeDisabled();

    await user.click(dec); // 9 → + 다시 활성
    expect(spin.value).toBe("9");
    expect(inc).not.toBeDisabled();
  },
};
