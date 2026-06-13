import type { Meta, StoryObj } from "@storybook/react";
import { SelectedItemRow, SelectedItemsPanel } from "@nudge-design/react";
import React, { useState } from "react";

const meta: Meta<typeof SelectedItemsPanel> = {
  title: "Components/Controls/SelectedItemsPanel",
  component: SelectedItemsPanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "선택 항목 슬롯 패널 — 헤더(타이틀 + 강조 개수 + 추가 선택/선택 해제 액션)는 고정, " +
          "본문은 SelectedItemRow 리스트 · 폼 · 테이블 등으로 swap 하는 슬롯. 캐포비 admin 의 다중 선택 결과 패널 패턴 (Figma 3828:1577).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectedItemsPanel>;

const SAMPLE = ["강원특별자치도 > 강릉시", "서울특별시 > 강남구", "부산광역시 > 해운대구"];

/* ─── Default (SelectedItemRow 리스트) ─── */

function DefaultDemo() {
  const [items, setItems] = useState(SAMPLE);
  return (
    <div style={{ maxWidth: 664 }}>
      <SelectedItemsPanel
        title="선택한 항목"
        count={items.length}
        onAdd={() => setItems((prev) => [...prev, `추가 항목 ${prev.length + 1}`])}
        onClear={() => setItems([])}
        style={{ ["--nds-selected-items-panel-body-max-height" as string]: "320px" }}
      >
        {items.map((label) => (
          <SelectedItemRow
            key={label}
            onRemove={() => setItems((prev) => prev.filter((i) => i !== label))}
          >
            {label}
          </SelectedItemRow>
        ))}
      </SelectedItemsPanel>
    </div>
  );
}

export const Default: Story = {
  tags: ["gallery"],
  render: () => <DefaultDemo />,
};

/* ─── Empty (슬롯 비었을 때) ─── */

export const Empty: Story = {
  render: () => (
    <div style={{ maxWidth: 664 }}>
      <SelectedItemsPanel title="선택한 항목" count={0} onAdd={() => {}} onClear={() => {}}>
        <div
          style={{
            border: "1px dashed var(--semantic-border-strong-default)",
            borderRadius: 8,
            padding: "48px 0",
            textAlign: "center",
            color: "var(--semantic-text-muted-default)",
            fontSize: 13,
          }}
        >
          ↔ 콘텐츠 슬롯 — 리스트/폼/테이블 등으로 Swap
        </div>
      </SelectedItemsPanel>
    </div>
  ),
};

/* ─── No actions (헤더 액션 숨김) ─── */

export const NoActions: Story = {
  render: () => (
    <div style={{ maxWidth: 664 }}>
      <SelectedItemsPanel title="선택한 항목" count={3} showActions={false}>
        {SAMPLE.map((label) => (
          <SelectedItemRow key={label}>{label}</SelectedItemRow>
        ))}
      </SelectedItemsPanel>
    </div>
  ),
};
