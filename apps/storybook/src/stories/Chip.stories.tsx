import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Chip, type ChipProps } from "@nudge-eap/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<ChipProps> = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Chip"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["outlined", "filled", "soft", "strong"],
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    shape: {
      control: "radio",
      options: ["pill", "square"],
    },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "심리상담",
    variant: "outlined",
    size: "md",
    shape: "pill",
  },
};

export default meta;
type Story = StoryObj<ChipProps>;

export const Playground: Story = {};

export const Variants: Story = {
  name: "State/Variants",
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Chip label="Outlined" variant="outlined" />
      <Chip label="Outlined Selected" variant="outlined" selected />
      <Chip label="Filled" variant="filled" />
      <Chip label="Filled Selected" variant="filled" selected />
      <Chip label="Soft" variant="soft" />
      <Chip label="Strong" variant="strong" />
      <Chip label="Strong Selected" variant="strong" selected />
    </div>
  ),
};

export const Shapes: Story = {
  name: "State/Shapes",
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ marginBottom: 8, fontSize: 12 }}>Pill (Default)</p>
        <Chip label="심리상담" shape="pill" variant="filled" />
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ marginBottom: 8, fontSize: 12 }}>Square (8px)</p>
        <Chip label="심리상담" shape="square" variant="filled" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  name: "State/Sizes",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Chip label="Small" size="sm" variant="filled" />
      <Chip label="Medium" size="md" variant="filled" />
      <Chip label="Large" size="lg" variant="filled" />
    </div>
  ),
};

export const Interactive: Story = {
  name: "Recipe/Interactive Selection",
  render: () => <ToggleChipsExample />,
};

function ToggleChipsExample() {
  const subjects = ["스트레스", "수면", "대인관계", "우울", "불안", "번아웃"];
  const [selected, setSelected] = useState<Set<string>>(new Set(["스트레스"]));

  const toggle = (s: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(s)) {
        next.delete(s);
      } else {
        next.add(s);
      }
      return next;
    });
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxWidth: 360 }}>
      {subjects.map((s) => (
        <Chip
          key={s}
          label={s}
          variant="strong"
          selected={selected.has(s)}
          onClick={() => toggle(s)}
        />
      ))}
    </div>
  );
}

export const Removable: Story = {
  name: "State/Removable Chips",
  render: () => <RemovableChipsExample />,
};

function RemovableChipsExample() {
  const [filters, setFilters] = useState(["서울", "심리상담", "대면"]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {filters.map((f) => (
        <Chip
          key={f}
          label={f}
          variant="outlined"
          selected
          onRemove={() => setFilters((prev) => prev.filter((x) => x !== f))}
        />
      ))}
    </div>
  );
}

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Chip label="Disabled" variant="outlined" disabled />
      <Chip label="Disabled Selected" variant="filled" selected disabled />
    </div>
  ),
};

/**
 * 홈페이지의 실무 스타일을 재현한 예시입니다.
 * (사각형 라운드 + 특정 가로 패딩)
 */
export const HomePageStyles: Story = {
  name: "Recipe/Homepage Practical Styles",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#666" }}>
          1. 상단 선택 필터 (Active Filter)
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <Chip label="서울" shape="square" selected onRemove={() => {}} />
          <Chip label="심리상담" shape="square" selected onRemove={() => {}} />
        </div>
      </div>

      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#666" }}>
          2. 카드 내부 키워드 (#태그, 촘촘한 패딩)
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <Chip label="#불안" variant="soft" shape="square" size="sm" className="px-2" />
          <Chip label="#우울" variant="soft" shape="square" size="sm" className="px-2" />
          <Chip label="#대인관계" variant="soft" shape="square" size="sm" className="px-2" />
        </div>
      </div>

      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#666" }}>
          3. 상담 방식 (아이콘 + 작은 사이즈)
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <Chip
            label="대면"
            variant="filled"
            shape="square"
            size="sm"
            className="h-6 px-[5px] bg-[#f3f4f6] text-[#4b5563]"
            icon={<span style={{ fontSize: 12 }}>📍</span>}
          />
          <Chip
            label="전화"
            variant="filled"
            shape="square"
            size="sm"
            className="h-6 px-[5px] bg-[#f3f4f6] text-[#4b5563]"
            icon={<span style={{ fontSize: 12 }}>📞</span>}
          />
        </div>
      </div>
    </div>
  ),
};

export const ToggleInteraction: Story = {
  name: "Interaction/Toggle Chip",
  render: () => <ToggleChipsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const chip = canvas.getByRole("button", { name: "수면" });

    await expect(chip).toHaveAttribute("aria-pressed", "false");
    await user.click(chip);
    await expect(chip).toHaveAttribute("aria-pressed", "true");
  },
};

export const RemoveInteraction: Story = {
  name: "Interaction/Remove Chip",
  render: () => <RemovableChipsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await expect(canvas.getByText("심리상담")).toBeInTheDocument();
    await user.click(canvas.getByRole("button", { name: "심리상담 삭제" }));
    await expect(canvas.queryByText("심리상담")).not.toBeInTheDocument();
  },
};

export const KeyboardToggleInteraction: Story = {
  name: "Interaction/Keyboard Toggle",
  render: () => <ToggleChipsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const chip = canvas.getByRole("button", { name: "대인관계" });
    await expect(chip).toHaveAttribute("aria-pressed", "false");

    chip.focus();
    await user.keyboard("{Enter}");
    await expect(chip).toHaveAttribute("aria-pressed", "true");

    await user.keyboard(" ");
    await expect(chip).toHaveAttribute("aria-pressed", "false");
  },
};

export const DisabledChipInteraction: Story = {
  name: "Interaction/Disabled Chip",
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Chip label="비활성" variant="outlined" disabled />
      <Chip label="비활성 선택" variant="filled" selected disabled />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const disabledChip = canvas.getByText("비활성").closest("[data-slot]");
    await expect(disabledChip).toHaveAttribute("data-disabled", "true");

    const disabledSelected = canvas.getByText("비활성 선택").closest("[data-slot]");
    await expect(disabledSelected).toHaveAttribute("data-disabled", "true");
  },
};

export const RemoveAllChipsInteraction: Story = {
  name: "Edge/Remove All Chips Empties List",
  render: () => <RemovableChipsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    // 모든 칩을 하나씩 삭제
    await user.click(canvas.getByRole("button", { name: "서울 삭제" }));
    await expect(canvas.queryByText("서울")).not.toBeInTheDocument();

    await user.click(canvas.getByRole("button", { name: "심리상담 삭제" }));
    await expect(canvas.queryByText("심리상담")).not.toBeInTheDocument();

    await user.click(canvas.getByRole("button", { name: "대면 삭제" }));
    await expect(canvas.queryByText("대면")).not.toBeInTheDocument();

    // 칩이 모두 삭제되면 버튼이 없어야 함
    await expect(canvas.queryAllByRole("button").length).toBe(0);
  },
};

export const SelectedStateToggleBackInteraction: Story = {
  name: "Edge/Selected State Toggle Back",
  render: () => <ToggleChipsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    // "스트레스"는 기본 선택 상태
    const stressChip = canvas.getByRole("button", { name: "스트레스" });
    await expect(stressChip).toHaveAttribute("aria-pressed", "true");

    // 클릭으로 해제
    await user.click(stressChip);
    await expect(stressChip).toHaveAttribute("aria-pressed", "false");

    // 다시 클릭으로 선택
    await user.click(stressChip);
    await expect(stressChip).toHaveAttribute("aria-pressed", "true");
  },
};
