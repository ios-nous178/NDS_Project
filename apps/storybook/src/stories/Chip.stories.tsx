import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Chip, type ChipColor, type ChipProps, type ChipVariant } from "@nudge-design/react";
import { PinIcon, TelephoneIcon } from "@nudge-design/icons";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";
import { DesignGuideBadge } from "../components/DesignGuideBadge";
import { coreGuideMeta } from "../components/guideMeta";

// Figma 가이드(171:10856) 등재 메타 — SSOT 는 guides-src/components/Chip.md frontmatter
const chipGuideMeta = coreGuideMeta("Chip");

const VARIANTS: ChipVariant[] = ["fill", "outlined", "ghost"];
const COLORS: ChipColor[] = ["project", "neutral", "success", "error", "caution"];

const VARIANT_USAGE: Record<ChipVariant, string> = {
  fill: "선택됨 (강조)",
  outlined: "선택 가능 (기본)",
  ghost: "비활성 / 보조",
};

const COLOR_LABEL: Record<ChipColor, string> = {
  project: "프로젝트",
  neutral: "일반",
  success: "완료",
  error: "오류",
  caution: "주의",
};

const meta: Meta<ChipProps> = {
  title: "Components/Controls/Chip",
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
    color: "project",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<ChipProps>;

export const Overview: Story = {
  tags: ["gallery"],
  name: "Overview",
  render: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--semantic-gap-default)",
        flexWrap: "wrap",
        maxWidth: 240,
      }}
    >
      <Chip label="선택됨" variant="fill" color="project" />
      <Chip label="선택 가능" variant="outlined" color="project" />
      <Chip label="보조" variant="ghost" color="neutral" />
      <Chip label="대면" variant="ghost" color="neutral" size="sm" icon={<PinIcon size={14} color="currentColor" />} />
      <Chip label="필터" variant="fill" color="project" onRemove={() => {}} />
    </div>
  ),
};

export const Playground: Story = {};

export const StyleMatrix: Story = {
  name: "Spec/Style × Color Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}>
      {VARIANTS.map((variant) => (
        <div
          key={variant}
          style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-comfortable)" }}
        >
          <div style={{ minWidth: 110 }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: "capitalize" }}>
              {variant}
            </div>
            <div style={{ fontSize: 11, color: "#888" }}>{VARIANT_USAGE[variant]}</div>
          </div>
          <div style={{ display: "flex", gap: "var(--semantic-gap-default)", flexWrap: "wrap" }}>
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
  name: "Spec/Sizes",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-default)" }}>
      <Chip label="Small" size="sm" variant="fill" color="project" />
      <Chip label="Medium" size="md" variant="fill" color="project" />
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
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--semantic-gap-default)",
        maxWidth: 360,
      }}
    >
      {subjects.map((s) => (
        <Chip
          key={s}
          label={s}
          variant={selected.has(s) ? "fill" : "outlined"}
          color="project"
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
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--semantic-gap-default)" }}>
      {filters.map((f) => (
        <Chip
          key={f}
          label={f}
          variant="fill"
          color="project"
          onRemove={() => setFilters((prev) => prev.filter((x) => x !== f))}
        />
      ))}
    </div>
  );
}

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => (
    <div style={{ display: "flex", gap: "var(--semantic-gap-default)" }}>
      <Chip label="Disabled" variant="outlined" color="project" disabled />
      <Chip label="Disabled Filled" variant="fill" color="project" disabled />
    </div>
  ),
};

export const WithIcon: Story = {
  name: "Recipe/With Icon",
  render: () => (
    <div style={{ display: "flex", gap: "var(--semantic-gap-default)" }}>
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

export const TrostFilterChips: Story = {
  name: "Spec/Trost Filter Chips",
  tags: ["gallery"],
  parameters: {
    docs: {
      description: {
        story:
          "트로스트 필터칩(5107-130). color='neutral' 기본 = 회색(보더 #E5E5E5 + 텍스트 #606060), selected 시 프로젝트 노랑 강조(보더 #FFF42E + subtle bg #FFFDD9 + 오렌지 텍스트 #FF9D00, outlined-selected 룩). height 30 · 좌우 padding 10. 색은 컴포넌트가 아니라 트로스트 토큰 override 가 슬롯에 주입(데모용 data-project='trost' 래퍼).",
      },
    },
  },
  render: () => <TrostFilterChipsExample />,
};

function TrostFilterChipsExample() {
  const initial = ["대면", "전화", "화상"];
  const [selected, setSelected] = useState<Set<string>>(new Set(["대면"]));
  const [filters, setFilters] = useState(initial);

  const toggle = (s: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(s)) {
        next.delete(s);
      } else {
        next.add(s);
      }
      return next;
    });

  return (
    // data-project="trost" → 트로스트 토큰이 Chip 슬롯(보더/bg/텍스트색·치수)을 override (데모용 래퍼)
    <div data-project="trost" style={{ display: "flex", flexWrap: "wrap", gap: "var(--semantic-gap-default)", maxWidth: 360 }}>
      {filters.map((f) => (
        <Chip
          key={f}
          label={f}
          variant="outlined"
          color="neutral"
          selected={selected.has(f)}
          icon={<PinIcon size={14} color="currentColor" />}
          onClick={() => toggle(f)}
          onRemove={() => {
            setFilters((prev) => prev.filter((x) => x !== f));
            setSelected((prev) => {
              const next = new Set(prev);
              next.delete(f);
              return next;
            });
          }}
        />
      ))}
    </div>
  );
}

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
    <div style={{ display: "flex", gap: "var(--semantic-gap-default)" }}>
      <Chip label="비활성" variant="outlined" color="project" disabled />
      <Chip label="비활성 채움" variant="fill" color="project" disabled />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const disabledChip = canvas.getByText("비활성").closest('[data-slot="root"]');
    await expect(disabledChip).toHaveAttribute("data-disabled", "true");

    const disabledFilled = canvas.getByText("비활성 채움").closest('[data-slot="root"]');
    await expect(disabledFilled).toHaveAttribute("data-disabled", "true");
  },
};

export const DesignGuideOverview: Story = {
  name: "Recipe/Overview",
  parameters: {
    docs: {
      description: {
        story: "각 variant/color 가 Figma 가이드(171:10856)에 등재된 core 항목인지 확인.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-wide)" }}>
      <div>
        <h4 style={{ marginBottom: 12 }}>Variants</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 220px)",
            gap: "var(--semantic-gap-loose)",
          }}
        >
          {VARIANTS.map((variant) => (
            <div
              key={variant}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--semantic-gap-default)",
                padding: "var(--semantic-inset-input)",
                border: "1px solid #ECECEC",
                borderRadius: 8,
              }}
            >
              <Chip label={variant} variant={variant} color="project" />
              <DesignGuideBadge meta={chipGuideMeta} />
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
            gap: "var(--semantic-gap-loose)",
          }}
        >
          {COLORS.map((color) => (
            <div
              key={color}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--semantic-gap-default)",
                padding: "var(--semantic-inset-input)",
                border: "1px solid #ECECEC",
                borderRadius: 8,
              }}
            >
              <Chip label={COLOR_LABEL[color]} variant="fill" color={color} />
              <DesignGuideBadge meta={chipGuideMeta} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
