import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Checkbox, CheckboxGroup } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta = {
  title: "Components/Controls/Checkbox",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Checkbox"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function CheckboxStatesExample() {
  const [unchecked, setUnchecked] = useState(false);
  const [checked, setChecked] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Checkbox checked={unchecked} onCheckedChange={setUnchecked} label="미선택" />
      <Checkbox checked={checked} onCheckedChange={setChecked} label="선택됨" />
      <Checkbox checked={false} indeterminate label="부분 선택" />
      <Checkbox checked={true} disabled label="비활성 (선택됨)" />
      <Checkbox checked={false} disabled label="비활성 (미선택)" />
    </div>
  );
}

function CheckboxExample() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);

  return (
    <CheckboxGroup>
      <Checkbox checked={a} onCheckedChange={setA} label="심리상담 동의" />
      <Checkbox checked={b} onCheckedChange={setB} label="개인정보 처리 동의" />
      <Checkbox checked={c} onCheckedChange={setC} label="마케팅 수신 동의 (선택)" />
    </CheckboxGroup>
  );
}

function CheckboxHorizontalExample() {
  const [items, setItems] = useState<Record<string, boolean>>({
    stress: true,
    sleep: false,
    relation: false,
  });

  const toggle = (key: string) => setItems((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <CheckboxGroup layout="horizontal" gap={20}>
      <Checkbox checked={items.stress} onCheckedChange={() => toggle("stress")} label="스트레스" />
      <Checkbox checked={items.sleep} onCheckedChange={() => toggle("sleep")} label="수면" />
      <Checkbox
        checked={items.relation}
        onCheckedChange={() => toggle("relation")}
        label="대인관계"
      />
    </CheckboxGroup>
  );
}

function CheckboxDisabledExample() {
  return (
    <CheckboxGroup>
      <Checkbox checked={true} label="동의함 (변경 불가)" disabled />
      <Checkbox checked={false} label="비활성화된 항목" disabled />
    </CheckboxGroup>
  );
}

function CheckboxIndeterminateExample() {
  const [children, setChildren] = useState<Record<string, boolean>>({
    a: true,
    b: false,
    c: false,
  });
  const values = Object.values(children);
  const allChecked = values.every(Boolean);
  const someChecked = values.some(Boolean);

  const toggleAll = () => {
    const next = !allChecked;
    setChildren({ a: next, b: next, c: next });
  };
  const toggle = (key: string) => setChildren((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <CheckboxGroup>
      <Checkbox
        checked={allChecked}
        indeterminate={someChecked && !allChecked}
        onCheckedChange={toggleAll}
        label="전체 선택"
      />
      <div style={{ paddingLeft: 28, display: "flex", flexDirection: "column", gap: 8 }}>
        <Checkbox checked={children.a} onCheckedChange={() => toggle("a")} label="스트레스" />
        <Checkbox checked={children.b} onCheckedChange={() => toggle("b")} label="수면" />
        <Checkbox checked={children.c} onCheckedChange={() => toggle("c")} label="대인관계" />
      </div>
    </CheckboxGroup>
  );
}

export const States: Story = {
  name: "Item / States",
  tags: ["gallery"],
  render: () => <CheckboxStatesExample />,
};

export const Vertical: Story = {
  name: "State/Vertical",
  render: () => <CheckboxExample />,
};

export const Horizontal: Story = {
  name: "State/Horizontal",
  render: () => <CheckboxHorizontalExample />,
};

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => <CheckboxDisabledExample />,
};

export const Indeterminate: Story = {
  name: "State/Indeterminate",
  render: () => <CheckboxIndeterminateExample />,
};

/* ─── Interaction Tests ─── */

export const ToggleInteraction: Story = {
  name: "Interaction/Toggle",
  render: () => <CheckboxExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const checkbox = canvas.getByLabelText("개인정보 처리 동의");
    await expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    await expect(checkbox).toBeChecked();

    await user.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};

export const DisabledInteraction: Story = {
  name: "Interaction/Disabled",
  render: () => <CheckboxDisabledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const disabledChecked = canvas.getByLabelText("동의함 (변경 불가)");
    await expect(disabledChecked).toBeDisabled();
    await expect(disabledChecked).toBeChecked();
  },
};

export const KeyboardToggleInteraction: Story = {
  name: "Interaction/Keyboard Space Toggle",
  render: () => <CheckboxExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const checkbox = canvas.getByLabelText("마케팅 수신 동의 (선택)");
    await expect(checkbox).not.toBeChecked();

    checkbox.focus();
    await user.keyboard(" ");
    await expect(checkbox).toBeChecked();

    await user.keyboard(" ");
    await expect(checkbox).not.toBeChecked();
  },
};

export const IndeterminateParentInteraction: Story = {
  name: "Interaction/Indeterminate Parent",
  render: () => <CheckboxIndeterminateExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const all = canvas.getByLabelText("전체 선택") as HTMLInputElement;
    // 초기: 스트레스만 선택 → 부모는 부분선택(mixed)
    await expect(all).not.toBeChecked();
    await expect(all.indeterminate).toBe(true);

    // 전체 선택 클릭 → 모두 체크 + indeterminate 해제
    await user.click(all);
    await expect(canvas.getByLabelText("수면")).toBeChecked();
    await expect(canvas.getByLabelText("대인관계")).toBeChecked();
    await expect(all).toBeChecked();
    await expect(all.indeterminate).toBe(false);
  },
};

export const GroupMultipleSelectionInteraction: Story = {
  name: "Interaction/Group Multiple Selection",
  render: () => <CheckboxExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const privacy = canvas.getByLabelText("개인정보 처리 동의");
    const marketing = canvas.getByLabelText("마케팅 수신 동의 (선택)");

    // 체크박스는 라디오와 달리 여러 개 동시 선택 가능
    await user.click(privacy);
    await user.click(marketing);

    await expect(privacy).toBeChecked();
    await expect(marketing).toBeChecked();

    // 하나만 해제해도 다른 건 유지
    await user.click(privacy);
    await expect(privacy).not.toBeChecked();
    await expect(marketing).toBeChecked();
  },
};
