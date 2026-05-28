import type { Meta, StoryObj } from "@storybook/react";
import { sizing } from "@nudge-design/tokens";
import React from "react";

function SizeRow({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 80px 1fr",
        alignItems: "center",
        gap: 20,
        padding: "14px 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>{label}</div>
      <div style={{ fontSize: 13, color: "#666666" }}>{value}px</div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--gap-loose)" }}>
        <div
          style={{
            width: Math.max(value * 2, 48),
            height: value,
            borderRadius: 8,
            backgroundColor: "#E3F2FC",
            border: "1px solid #91CAF6",
            boxSizing: "border-box",
          }}
        />
        <div style={{ fontSize: 12, color: "#999999" }}>Height sample</div>
      </div>
    </div>
  );
}

function SizingTokensPage() {
  const rows = [
    ["sizing.icon.default", sizing.icon.default],
    ["sizing.button.lg", sizing.button.lg],
    ["sizing.button.md", sizing.button.md],
    ["sizing.button.sm", sizing.button.sm],
    ["sizing.button.xs", sizing.button.xs],
    ["sizing.button.field", sizing.button.field],
    ["sizing.appBar.height", sizing.appBar.height],
    ["sizing.bottomBar.height", sizing.bottomBar.height],
    ["sizing.input.default", sizing.input.default],
    ["sizing.input.field", sizing.input.field],
  ] as const;

  return (
    <div
      style={{
        fontFamily: "'Pretendard', sans-serif",
        padding: "var(--inset-modal)",
        backgroundColor: "#FFFFFF",
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#111111" }}>
        Sizing Tokens
      </h2>
      <p style={{ fontSize: 14, lineHeight: "20px", color: "#666666", marginBottom: 32 }}>
        Shared sizing tokens for icons, buttons, app bars, bottom bars, and inputs.
      </p>
      <div>
        {rows.map(([label, value]) => (
          <SizeRow key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Sizing",
  component: SizingTokensPage,
};

export default meta;

export const AllSizing: StoryObj = {
  name: "Reference/All Sizing",
};
