import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import {
  Chip,
  chipColorGuide,
  chipVariantGuide,
  type ChipColor,
  type ChipProps,
  type ChipVariant,
} from "@nudge-eap/react";
import { PinIcon, TelephoneIcon } from "@nudge-eap/icons";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";
import { DesignGuideBadge } from "../components/DesignGuideBadge";

const VARIANTS: ChipVariant[] = ["fill", "outlined", "ghost"];
const COLORS: ChipColor[] = ["brand", "neutral", "success", "error", "caution"];

const VARIANT_USAGE: Record<ChipVariant, string> = {
  fill: "선택됨 (강조)",
  outlined: "선택 가능 (기본)",
  ghost: "비활성 / 보조",
};

const COLOR_LABEL: Record<ChipColor, string> = {
  brand: "브랜드",
  neutral: "일반",
  success: "완료",
  error: "오류",
  caution: "주의",
};

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
      options: VARIANTS,
      description: "Figma `Style` — fill(선택됨) / outlined(선택 가능) / ghost(비활성)",
    },
    color: {
      control: "radio",
      options: COLORS,
    },
    size: {
      control: "radio",
      options: ["sm", "md"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    label: "심리상담",
    variant: "outlined",
    color: "brand",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<ChipProps>;

export const Playground: Story = {};

export const StyleMatrix: Story = {
  name: "Figma/Style × Color Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-loose)" }}>
      {VARIANTS.map((variant) => (
        <div
          key={variant}
          style={{ display: "flex", alignItems: "center", gap: "var(--gap-comfortable)" }}
        >
          <div style={{ minWidth: 110 }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: "capitalize" }}>
              {variant}
            </div>
            <div style={{ fontSize: 11, color: "#888" }}>{VARIANT_USAGE[variant]}</div>
          </div>
          <div style={{ display: "flex", gap: "var(--gap-default)", flexWrap: "wrap" }}>
            {COLORS.map((color) => (
              <Chip key={color} label={COLOR_LABEL[color]} variant={variant} color={color} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  name: "Figma/Sizes",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--gap-default)" }}>
      <Chip label="Small" size="sm" variant="fill" color="brand" />
      <Chip label="Medium" size="md" variant="fill" color="brand" />
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
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--gap-default)", maxWidth: 360 }}>
      {subjects.map((s) => (
        <Chip
          key={s}
          label={s}
          variant={selected.has(s) ? "fill" : "outlined"}
          color="brand"
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
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--gap-default)" }}>
      {filters.map((f) => (
        <Chip
          key={f}
          label={f}
          variant="fill"
          color="brand"
          onRemove={() => setFilters((prev) => prev.filter((x) => x !== f))}
        />
      ))}
    </div>
  );
}

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => (
    <div style={{ display: "flex", gap: "var(--gap-default)" }}>
      <Chip label="Disabled" variant="outlined" color="brand" disabled />
      <Chip label="Disabled Filled" variant="fill" color="brand" disabled />
    </div>
  ),
};

export const WithIcon: Story = {
  name: "Recipe/With Icon",
  render: () => (
    <div style={{ display: "flex", gap: "var(--gap-default)" }}>
      <Chip
        label="대면"
        variant="ghost"
        color="neutral"
        size="sm"
        icon={<PinIcon size={14} color="currentColor" />}
      />
      <Chip
        label="전화"
        variant="ghost"
        color="neutral"
        size="sm"
        icon={<TelephoneIcon size={14} color="currentColor" />}
      />
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

    await expect(chip).toHaveAttribute("data-variant", "outlined");
    await user.click(chip);
    const chipAfter = canvas.getByRole("button", { name: "수면" });
    await expect(chipAfter).toHaveAttribute("data-variant", "fill");
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
    await expect(chip).toHaveAttribute("data-variant", "outlined");

    chip.focus();
    await user.keyboard("{Enter}");
    const after = canvas.getByRole("button", { name: "대인관계" });
    await expect(after).toHaveAttribute("data-variant", "fill");
  },
};

export const DisabledChipInteraction: Story = {
  name: "Interaction/Disabled Chip",
  render: () => (
    <div style={{ display: "flex", gap: "var(--gap-default)" }}>
      <Chip label="비활성" variant="outlined" color="brand" disabled />
      <Chip label="비활성 채움" variant="fill" color="brand" disabled />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const disabledChip = canvas.getByText("비활성").closest("[data-slot]");
    await expect(disabledChip).toHaveAttribute("data-disabled", "true");

    const disabledFilled = canvas.getByText("비활성 채움").closest("[data-slot]");
    await expect(disabledFilled).toHaveAttribute("data-disabled", "true");
  },
};

export const DesignGuideOverview: Story = {
  name: "Design Guide/Overview",
  parameters: {
    docs: {
      description: {
        story: "각 variant/color 가 Figma 가이드(171:10856)에 등재된 core 항목인지 확인.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-wide)" }}>
      <div>
        <h4 style={{ marginBottom: 12 }}>Variants</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 220px)",
            gap: "var(--gap-loose)",
          }}
        >
          {VARIANTS.map((variant) => (
            <div
              key={variant}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--gap-default)",
                padding: "var(--inset-input)",
                border: "1px solid #ECECEC",
                borderRadius: 8,
              }}
            >
              <Chip label={variant} variant={variant} color="brand" />
              <DesignGuideBadge meta={chipVariantGuide[variant]} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: 12 }}>Colors</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 220px)",
            gap: "var(--gap-loose)",
          }}
        >
          {COLORS.map((color) => (
            <div
              key={color}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--gap-default)",
                padding: "var(--inset-input)",
                border: "1px solid #ECECEC",
                borderRadius: 8,
              }}
            >
              <Chip label={COLOR_LABEL[color]} variant="fill" color={color} />
              <DesignGuideBadge meta={chipColorGuide[color]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
