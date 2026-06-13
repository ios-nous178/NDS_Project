import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Input, ValidationChip, type ValidationChipState } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";

const STATES: ValidationChipState[] = ["incomplete", "complete", "error"];

const STATE_LABEL: Record<ValidationChipState, string> = {
  incomplete: "Incomplete (기본·미충족)",
  complete: "Complete (충족)",
  error: "Error (실패)",
};

const meta: Meta<typeof ValidationChip> = {
  title: "Components/Inputs/ValidationChip",
  component: ValidationChip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("ValidationChip"),
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: STATES,
      description: "Figma `state` — incomplete(muted) → complete(brand) → error(status-error)",
    },
    children: {
      control: "text",
      description: "규칙 라벨 (예: '6자 이상')",
    },
  },
  args: {
    state: "incomplete",
    children: "6자 이상",
  },
};

export default meta;
type Story = StoryObj<typeof ValidationChip>;

export const Playground: Story = {};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      {STATES.map((state) => (
        <div key={state} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <ValidationChip state={state}>
            {state === "error" ? "8-20자 이내" : "6자 이상"}
          </ValidationChip>
          <span style={{ fontSize: 11, color: "#999" }}>{STATE_LABEL[state]}</span>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 입력값이 규칙을 충족하면 chip 이 Brand Blue 로 전환되는 신호 — data-state 로 잠금
    const complete = canvas.getByText("6자 이상", { selector: '[data-state="complete"] *' });
    expect(complete).toBeInTheDocument();
  },
};

/** 회원가입 비밀번호 검증 — Input 아래에 규칙 칩을 나열(pattern:form-validation). */
export const WithInput: Story = {
  tags: ["gallery"],
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div style={{ maxWidth: 332, display: "flex", flexDirection: "column", gap: 8 }}>
      <Input placeholder="비밀번호" type="password" defaultValue="abc123" />
      <div style={{ display: "flex", gap: 12 }}>
        <ValidationChip state="complete">6자 이상</ValidationChip>
        <ValidationChip state="incomplete">영문+숫자</ValidationChip>
      </div>
    </div>
  ),
};
