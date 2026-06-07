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

/* ─── 동의 화면 (badge + detail + 전체동의) ─── */

const TERMS: CheckboxGroupItem[] = [
  {
    value: "service",
    label: "서비스 이용약관",
    badge: "[필수]",
    detail: "본 약관은 NudgeEAP 멘탈케어 서비스 이용에 관한 권리·의무를 정합니다.",
  },
  {
    value: "privacy",
    label: "개인정보 수집·이용",
    badge: "[필수]",
    detail: "수집 항목: 이름, 이메일, 휴대폰번호. 목적: 서비스 제공·상담 매칭.",
  },
  {
    value: "sensitive",
    label: "민감정보(검사 결과) 수집·이용",
    badge: "[필수]",
    detail: "심리검사 결과는 민감정보로 분리 저장되며, 동의 없이 제3자에게 제공되지 않습니다.",
  },
  {
    value: "marketing",
    label: "마케팅 정보 수신",
    badge: "[선택]",
    detail: "프로모션·이벤트 정보를 이메일/문자로 받아보실 수 있어요. 언제든 해지 가능합니다.",
  },
];

export const ConsentScreen: Story = {
  name: "Variant/약관 동의 (pattern:consent)",
  render: () => {
    const Harness = () => {
      // pre-tick 금지(개인정보보호법) — 초기값 빈 배열
      const [v, setV] = useState<string[]>([]);
      return (
        <div style={{ width: 420 }}>
          <CheckboxGroup
            items={TERMS}
            value={v}
            onValueChange={setV}
            selectAll
            selectAllLabel="전체 동의"
            expandable
          />
        </div>
      );
    };
    return <Harness />;
  },
};

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
