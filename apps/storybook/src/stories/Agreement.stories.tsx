import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Agreement, type AgreementItemData } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta = {
  title: "Components/Controls/Agreement",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Agreement"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* ─── 약관 데이터 (필수/선택 + 보기 링크) ─── */

const TERMS: AgreementItemData[] = [
  { value: "tos", label: "(필수) 서비스 이용약관 동의", required: true, viewHref: "#tos" },
  { value: "privacy", label: "(필수) 개인정보 수집·이용 동의", required: true, viewHref: "#privacy" },
  { value: "age", label: "(필수) 만 14세 이상입니다", required: true },
  { value: "mkt", label: "(선택) 마케팅 정보 수신 동의", required: false, viewHref: "#mkt" },
];

/* ─── 대표: 온보딩 약관 동의 ─── */

export const Default: Story = {
  tags: ["gallery"],
  name: "온보딩 약관 동의",
  render: function Render() {
    const [value, setValue] = useState<string[]>([]);
    const requiredOk = TERMS.filter((t) => t.required).every((t) => value.includes(t.value));
    return (
      <div style={{ width: 360, display: "flex", flexDirection: "column", gap: 20 }}>
        <Agreement items={TERMS} value={value} onValueChange={setValue} allLabel="전체 동의하기" />
        <button
          type="button"
          disabled={!requiredOk}
          style={{
            height: 48,
            borderRadius: 12,
            border: "none",
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
            background: requiredOk
              ? "var(--semantic-button-bg-brand, #3b82f6)"
              : "var(--semantic-button-bg-disabled, #d4d4d4)",
            cursor: requiredOk ? "pointer" : "not-allowed",
          }}
        >
          {requiredOk ? "동의하고 시작하기" : "필수 약관에 동의해 주세요"}
        </button>
      </div>
    );
  },
};

/* ─── 부분 선택 (indeterminate) ─── */

export const PartiallySelected: Story = {
  tags: ["gallery"],
  name: "부분 선택 (전체동의 indeterminate)",
  render: function Render() {
    const [value, setValue] = useState<string[]>(["tos", "mkt"]);
    return (
      <div style={{ width: 360 }}>
        <Agreement items={TERMS} value={value} onValueChange={setValue} />
      </div>
    );
  },
};

/* ─── compound API (커스텀 구성) ─── */

export const CompoundComposition: Story = {
  name: "Compound (Root/All/Item)",
  render: function Render() {
    const [value, setValue] = useState<string[]>(["tos"]);
    return (
      <div style={{ width: 360 }}>
        <Agreement.Root value={value} onValueChange={setValue}>
          <Agreement.All>약관 전체 동의</Agreement.All>
          <Agreement.Item value="tos" required viewHref="#tos">
            서비스 이용약관
          </Agreement.Item>
          <Agreement.Item value="privacy" required viewHref="#privacy">
            개인정보 처리방침
          </Agreement.Item>
          <Agreement.Item value="mkt" viewHref="#mkt">
            마케팅 수신 (선택)
          </Agreement.Item>
        </Agreement.Root>
      </div>
    );
  },
};

/* ─── interaction: 전체동의 cascade ─── */

export const TogglesAll: Story = {
  name: "전체동의 cascade (play)",
  render: function Render() {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={{ width: 360 }} data-testid="agreement">
        <Agreement items={TERMS} value={value} onValueChange={setValue} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const user = createInteractionUser();
    const canvas = within(canvasElement);
    const checks = canvas.getAllByRole("checkbox");
    // [0]=전체동의, [1..]=항목
    await user.click(checks[0]);
    for (const cb of checks.slice(1)) {
      await expect(cb).toBeChecked();
    }
    // 전체동의 다시 클릭 → 전부 해제
    await user.click(checks[0]);
    for (const cb of checks.slice(1)) {
      await expect(cb).not.toBeChecked();
    }
  },
};
