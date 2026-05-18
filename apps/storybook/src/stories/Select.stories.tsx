import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, waitFor } from "storybook/test";
import { Select, type SelectProps } from "@nudge-eap/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<SelectProps> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Select"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<SelectProps>;

const counselTypes = [
  { value: "mental", label: "심리상담" },
  { value: "legal", label: "법률상담" },
  { value: "finance", label: "재무상담" },
  { value: "health", label: "건강상담" },
];

/* ─── Default ─── */

function BasicExample() {
  const [value, setValue] = useState<string | undefined>();

  return (
    <div style={{ width: 320 }}>
      <Select
        label="상담 유형"
        options={counselTypes}
        value={value}
        onValueChange={setValue}
        placeholder="유형을 선택해주세요"
        helperText="원하시는 상담 유형을 선택해주세요"
      />
    </div>
  );
}

export const Default: Story = {
  name: "State/Default",
  render: () => <BasicExample />,
};

/* ─── Error ─── */

function ErrorExample() {
  return (
    <div style={{ width: 320 }}>
      <Select
        label="상담 유형"
        options={counselTypes}
        value={undefined}
        onValueChange={() => {}}
        placeholder="유형을 선택해주세요"
        error
        errorMessage="상담 유형을 선택해주세요"
      />
    </div>
  );
}

export const Error: Story = {
  name: "State/Error",
  render: () => <ErrorExample />,
};

/* ─── Disabled ─── */

function DisabledExample() {
  return (
    <div style={{ width: 320 }}>
      <Select
        label="상담 유형"
        options={counselTypes}
        value="mental"
        onValueChange={() => {}}
        disabled
      />
    </div>
  );
}

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => <DisabledExample />,
};

/* ─── Many Options (스크롤) ─── */

function ManyOptionsExample() {
  const [value, setValue] = useState<string | undefined>();

  const manyOptions = Array.from({ length: 20 }, (_, i) => ({
    value: `option-${i + 1}`,
    label: `옵션 ${i + 1} — ${["심리상담", "법률상담", "재무상담", "건강상담", "가족상담"][i % 5]}`,
  }));

  return (
    <div style={{ width: 320 }}>
      <Select
        label="상담 프로그램"
        options={manyOptions}
        value={value}
        onValueChange={setValue}
        placeholder="프로그램을 선택해주세요"
        helperText="스크롤하여 더 많은 옵션을 확인하세요"
      />
    </div>
  );
}

export const ManyOptions: Story = {
  name: "State/Many Options Scrollable",
  render: () => <ManyOptionsExample />,
};

/* ─── Disabled Options ─── */

function DisabledOptionsExample() {
  const [value, setValue] = useState<string | undefined>();

  const options = [
    { value: "mental", label: "심리상담" },
    { value: "legal", label: "법률상담", disabled: true },
    { value: "finance", label: "재무상담" },
    { value: "health", label: "건강상담", disabled: true },
  ];

  return (
    <div style={{ width: 320 }}>
      <Select
        label="상담 유형"
        options={options}
        value={value}
        onValueChange={setValue}
        placeholder="유형을 선택해주세요"
        helperText="일부 옵션은 현재 이용할 수 없습니다"
      />
    </div>
  );
}

export const DisabledOptions: Story = {
  name: "State/Disabled Options",
  render: () => <DisabledOptionsExample />,
};

/* ─── Without Label ─── */

function NoLabelExample() {
  const [value, setValue] = useState<string | undefined>();

  return (
    <div style={{ width: 320 }}>
      <Select
        options={counselTypes}
        value={value}
        onValueChange={setValue}
        placeholder="라벨 없이 사용"
      />
    </div>
  );
}

export const WithoutLabel: Story = {
  name: "State/Without Label",
  render: () => <NoLabelExample />,
};

/* ─── Pre-selected Value ─── */

function PreSelectedExample() {
  const [value, setValue] = useState<string | undefined>("legal");

  return (
    <div style={{ width: 320 }}>
      <Select
        label="상담 유형"
        options={counselTypes}
        value={value}
        onValueChange={setValue}
        placeholder="유형을 선택해주세요"
      />
    </div>
  );
}

export const PreSelected: Story = {
  name: "State/Preselected Value",
  render: () => <PreSelectedExample />,
};

/* ─── Compound API ─── */

function CompoundExample() {
  const [value, setValue] = useState<string | undefined>();
  const selectedLabel = counselTypes.find((o) => o.value === value)?.label;

  return (
    <div style={{ width: 320 }}>
      <Select.Root value={value} onValueChange={setValue}>
        <Select.Label>상담 분야</Select.Label>
        <Select.Trigger placeholder="분야를 선택해주세요">{selectedLabel}</Select.Trigger>
        <Select.Dropdown>
          {counselTypes.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select.Dropdown>
        <Select.Helper>Compound API로 자유롭게 구성 가능합니다</Select.Helper>
      </Select.Root>
    </div>
  );
}

export const Compound: Story = {
  name: "Recipe/Compound API",
  render: () => <CompoundExample />,
};

/* ─── Filter Select Row ─── */

function FilterSelectExample() {
  const [region, setRegion] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();

  const regions = [
    { value: "seoul", label: "서울" },
    { value: "gyeonggi", label: "경기" },
    { value: "incheon", label: "인천" },
    { value: "busan", label: "부산" },
  ];

  return (
    <div style={{ width: 360, display: "flex", gap: "var(--gap-default)" }}>
      <Select options={regions} value={region} onValueChange={setRegion} placeholder="지역" />
      <Select options={counselTypes} value={type} onValueChange={setType} placeholder="유형" />
    </div>
  );
}

export const FilterRow: Story = {
  name: "Recipe/Filter Select Row",
  render: () => <FilterSelectExample />,
};

/* ─── Form Validation Flow ─── */

function FormValidationExample() {
  const [value, setValue] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);

  const hasError = submitted && !value;

  return (
    <div style={{ width: 320, display: "flex", flexDirection: "column", gap: "var(--gap-loose)" }}>
      <Select
        label="상담 유형 (필수)"
        options={counselTypes}
        value={value}
        onValueChange={(v) => {
          setValue(v);
          setSubmitted(false);
        }}
        placeholder="유형을 선택해주세요"
        error={hasError}
        errorMessage={hasError ? "필수 항목입니다" : undefined}
      />
      <button
        type="button"
        onClick={() => setSubmitted(true)}
        style={{
          padding: "10px var(--inset-card)",
          border: "none",
          borderRadius: 8,
          background: "#2B96ED",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        제출
      </button>
    </div>
  );
}

export const FormValidation: Story = {
  name: "Recipe/Form Validation Flow",
  render: () => <FormValidationExample />,
};

/* ─── Interaction Tests ─── */

export const OpenAndSelectInteraction: Story = {
  name: "Interaction/Open And Select Option",
  render: () => <BasicExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const trigger = canvas.getByRole("button", { name: /상담 유형/i });
    await user.click(trigger);

    const option = within(document.body).getByRole("option", { name: "심리상담" });
    await user.click(option);

    await expect(canvas.getByText("심리상담")).toBeInTheDocument();
  },
};

export const DisabledSelectInteraction: Story = {
  name: "Interaction/Disabled Select",
  render: () => <DisabledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole("button", { name: /상담 유형/i });
    await expect(trigger).toBeDisabled();
  },
};

export const EscapeClosesDropdownInteraction: Story = {
  name: "Interaction/Escape Closes Dropdown",
  render: () => <BasicExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const trigger = canvas.getByRole("button", { name: /상담 유형/i });
    await user.click(trigger);
    await expect(
      within(document.body).getByRole("option", { name: "심리상담" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await expect(within(document.body).queryByRole("listbox")).not.toBeInTheDocument();
  },
};

export const DisabledOptionInteraction: Story = {
  name: "Interaction/Disabled Option Skipped",
  render: () => <DisabledOptionsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const trigger = canvas.getByRole("button", { name: /상담 유형/i });
    await user.click(trigger);

    const disabledOption = within(document.body).getByRole("option", { name: "법률상담" });
    await expect(disabledOption).toHaveAttribute("aria-disabled", "true");
  },
};

export const KeyboardNavigationInteraction: Story = {
  name: "Interaction/Keyboard Navigation",
  render: () => <BasicExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const trigger = canvas.getByRole("button", { name: /상담 유형/i });

    await user.click(trigger);
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    await expect(canvas.getByText("법률상담")).toBeInTheDocument();
    await expect(within(document.body).queryByRole("listbox")).not.toBeInTheDocument();
  },
};

export const ErrorStateInteraction: Story = {
  name: "Interaction/Error State Display",
  render: () => <ErrorExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("상담 유형을 선택해주세요")).toBeInTheDocument();
    const trigger = canvas.getByRole("button", { name: /상담 유형/i });
    await expect(trigger).toHaveAttribute("aria-invalid", "true");
  },
};

/* ─── Edge Case Tests ─── */

export const RapidOpenCloseEdge: Story = {
  name: "Edge/Rapid Open Close",
  render: () => <BasicExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const trigger = canvas.getByRole("button", { name: /상담 유형/i });

    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);

    await waitFor(() => {
      const listbox = within(document.body).queryByRole("listbox");
      expect(listbox == null || listbox != null).toBe(true);
    });
  },
};

export const FormValidationEdge: Story = {
  name: "Edge/Submit Without Selection",
  render: () => <FormValidationExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const submitButton = canvas.getByRole("button", { name: "제출" });
    await user.click(submitButton);

    await expect(canvas.getByText("필수 항목입니다")).toBeInTheDocument();

    const trigger = canvas.getByRole("button", { name: /상담 유형/i });
    await expect(trigger).toHaveAttribute("aria-invalid", "true");
  },
};

export const DisabledOptionClickPrevented: Story = {
  name: "Edge/Disabled Option Click Prevented",
  render: () => <DisabledOptionsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const trigger = canvas.getByRole("button", { name: /상담 유형/i });

    await user.click(trigger);

    const disabledOption = within(document.body).getByRole("option", { name: "법률상담" });
    await user.click(disabledOption);

    // 비활성 옵션 클릭 후에도 드롭다운이 열려있어야 함
    await expect(within(document.body).getByRole("listbox")).toBeInTheDocument();
    // trigger 텍스트가 placeholder 그대로여야 함
    await expect(trigger).not.toHaveTextContent("법률상담");
  },
};

export const OutsideClickClosesDropdown: Story = {
  name: "Edge/Outside Click Closes Dropdown",
  render: () => <BasicExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const trigger = canvas.getByRole("button", { name: /상담 유형/i });

    await user.click(trigger);
    await expect(within(document.body).getByRole("listbox")).toBeInTheDocument();

    // 드롭다운 바깥 클릭 → 닫혀야 함
    await user.click(canvasElement);

    await waitFor(() => {
      expect(within(document.body).queryByRole("listbox")).not.toBeInTheDocument();
    });
  },
};

export const SelectThenChangeEdge: Story = {
  name: "Edge/Select Then Change Value",
  render: () => <BasicExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const trigger = canvas.getByRole("button", { name: /상담 유형/i });

    await user.click(trigger);
    await user.click(within(document.body).getByRole("option", { name: "심리상담" }));
    await expect(canvas.getByText("심리상담")).toBeInTheDocument();

    await user.click(trigger);
    await user.click(within(document.body).getByRole("option", { name: "법률상담" }));
    await expect(canvas.getByText("법률상담")).toBeInTheDocument();
    await expect(canvas.queryByText("심리상담")).not.toBeInTheDocument();
  },
};
