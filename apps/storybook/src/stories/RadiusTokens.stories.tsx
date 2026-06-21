import type { Meta, StoryObj } from "@storybook/react";
import { radius, stroke } from "@nudge-design/tokens";
import React from "react";

function RadiusItem({ token, value }: { token: string; value: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 80px 1fr",
        alignItems: "center",
        gap: 20,
        padding: "var(--semantic-inset-card) 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>radius.{token}</div>
      <div style={{ fontSize: 13, color: "#666666" }}>{value}px</div>
      <div
        style={{
          width: 120,
          height: 56,
          borderRadius: value,
          backgroundColor: "#F3F4F6",
          border: "1px solid #D2D5D9",
        }}
      />
    </div>
  );
}

function StrokeItem({ token, value }: { token: string; value: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 80px 1fr",
        alignItems: "center",
        gap: 20,
        padding: "var(--semantic-inset-card) 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>stroke.{token}</div>
      <div style={{ fontSize: 13, color: "#666666" }}>{value}px</div>
      <div
        style={{
          width: 120,
          height: 56,
          borderRadius: 8,
          backgroundColor: "#FFFFFF",
          border: `${value}px solid var(--semantic-border-brand-default)`,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function RadiusTokensPage() {
  return (
    <div
      style={{
        fontFamily: "'Pretendard', sans-serif",
        padding: "var(--semantic-inset-modal)",
        backgroundColor: "#FFFFFF",
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#111111" }}>
        Radius and Border Tokens
      </h2>
      <p style={{ fontSize: 14, lineHeight: "20px", color: "#666666", marginBottom: 32 }}>
        Corner radius and border width tokens used across buttons, inputs, modals, and containers.
      </p>

      <div style={{ marginBottom: 32 }}>
        {Object.entries(radius).map(([token, value]) => (
          <RadiusItem key={token} token={token} value={value} />
        ))}
      </div>

      <div>
        {Object.entries(stroke).map(([token, value]) => (
          <StrokeItem key={token} token={token} value={value} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Radius",
  component: RadiusTokensPage,
};

export default meta;

export const AllRadius: StoryObj = {
  name: "Reference/All Radius And Border Width",
};
