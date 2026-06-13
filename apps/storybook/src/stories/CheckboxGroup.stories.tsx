import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Checkbox, CheckboxGroup, type CheckboxGroupItem } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta = {
  title: "Components/Controls/CheckboxGroup",
  id: "components-checkboxgroup",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: getComponentDocsDescription("CheckboxGroup"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* ─── 레이아웃 모드 (children 직접) ─── */

export const LayoutMode: Story = {
  name: "Recipe/직접 조립 (children)",
  render: () => {
    const Harness = () => {
      const [items, setItems] = useState<Record<string, boolean>>({
        stress: true,
        sleep: false,
        relation: false,
      });
      const toggle = (k: string) => setItems((p) => ({ ...p, [k]: !p[k] }));
      return (
        <div style={{ width: 360 }}>
          <CheckboxGroup>
            <Checkbox
              checked={items.stress}
              onCheckedChange={() => toggle("stress")}
              label="스트레스"
            />
            <Checkbox checked={items.sleep} onCheckedChange={() => toggle("sleep")} label="수면" />
            <Checkbox
              checked={items.relation}
              onCheckedChange={() => toggle("relation")}
              label="대인관계"
            />
          </CheckboxGroup>
        </div>
      );
    };
    return <Harness />;
  },
};

/* ─── 데이터 모드 ─── */

const FILTERS: CheckboxGroupItem[] = [
  { value: "stress", label: "스트레스" },
  { value: "sleep", label: "수면" },
  { value: "relation", label: "대인관계" },
  { value: "anxiety", label: "불안" },
  { value: "depression", label: "우울" },
];

export const DataSelectAll: Story = {
  name: "Variant/전체선택 (indeterminate)",
  tags: ["gallery"],
  render: () => {
    const Harness = () => {
      const [v, setV] = useState<string[]>(["stress"]);
      return (
        <div style={{ width: 360 }}>
          <CheckboxGroup
            items={FILTERS}
            value={v}
            onValueChange={setV}
            selectAll
            selectAllLabel="전체 선택"
          />
        </div>
      );
    };
    return <Harness />;
  },
};

/* 약관/개인정보 동의 화면은 전용 Agreement 컴포넌트로 이관 (badge·detail·전체동의 포함). CheckboxGroup 은 필터/리스트 선택 전용. */

/* ─── Interaction Tests ─── */

export const SelectAllIndeterminateInteraction: Story = {
  name: "Interaction/전체선택 indeterminate → 전체 → 해제",
  render: () => {
    const Harness = () => {
      const [v, setV] = useState<string[]>(["stress", "sleep"]);
      return (
        <div style={{ width: 360 }}>
          <CheckboxGroup items={FILTERS} value={v} onValueChange={setV} selectAll />
        </div>
      );
    };
    return <Harness />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const all = canvas.getByLabelText("전체 선택") as HTMLInputElement;
    // 2/5 선택 → 부분선택(mixed)
    await expect(all).not.toBeChecked();
    await expect(all.indeterminate).toBe(true);

    // 전체선택 클릭 → 전부 체크 + indeterminate 해제
    await user.click(all);
    await expect(canvas.getByLabelText("우울")).toBeChecked();
    await expect(all).toBeChecked();
    await expect(all.indeterminate).toBe(false);

    // 다시 클릭 → 전부 해제
    await user.click(all);
    await expect(canvas.getByLabelText("우울")).not.toBeChecked();
    await expect(all).not.toBeChecked();
  },
};

export const ItemToggleInteraction: Story = {
  name: "Interaction/개별 토글 → 부모 파생",
  render: () => {
    const Harness = () => {
      const [v, setV] = useState<string[]>([]);
      return (
        <div style={{ width: 360 }}>
          <CheckboxGroup items={FILTERS} value={v} onValueChange={setV} selectAll />
        </div>
      );
    };
    return <Harness />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const all = canvas.getByLabelText("전체 선택") as HTMLInputElement;
    await expect(all).not.toBeChecked();
    await expect(all.indeterminate).toBe(false);

    // 하나 체크 → 부모 indeterminate
    await user.click(canvas.getByLabelText("수면"));
    await expect(all.indeterminate).toBe(true);
  },
};
