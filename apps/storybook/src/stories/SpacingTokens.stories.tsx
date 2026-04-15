import type { Meta, StoryObj } from "@storybook/react";
import { spacing } from "@nudge-eap/tokens";

function SpacingItem({ token, value }: { token: string; value: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 80px 1fr",
        alignItems: "center",
        gap: 20,
        padding: "14px 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>spacing.{token}</div>
      <div style={{ fontSize: 13, color: "#666666" }}>{value}px</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: value,
            height: 16,
            minWidth: value,
            backgroundColor: "#2B96ED",
            borderRadius: 999,
          }}
        />
        <div style={{ fontSize: 12, color: "#999999" }}>Visual width sample</div>
      </div>
    </div>
  );
}

function SpacingTokensPage() {
  return (
    <div
      style={{
        fontFamily: "'Pretendard', sans-serif",
        padding: 24,
        backgroundColor: "#FFFFFF",
      }}
    >
      <h2
        style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 12,
          color: "#111111",
        }}
      >
        Spacing Tokens
      </h2>
      <p
        style={{
          fontSize: 14,
          lineHeight: "20px",
          color: "#666666",
          marginBottom: 32,
        }}
      >
        Spacing scale from the design tokens, shown as measured visual widths.
      </p>
      <div>
        {Object.entries(spacing).map(([token, value]) => (
          <SpacingItem key={token} token={token} value={value} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Spacing",
  component: SpacingTokensPage,
};

export default meta;

export const AllSpacing: StoryObj = {
  name: "Reference/All Spacing",
};
