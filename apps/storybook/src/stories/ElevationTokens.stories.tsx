import type { Meta, StoryObj } from "@storybook/react";
import { shadow, zIndex } from "@nudge-eap/tokens";
import React from "react";

function ShadowItem({ token, value }: { token: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        alignItems: "center",
        gap: 20,
        padding: "20px 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>shadow.{token}</div>
        <div style={{ fontSize: 12, color: "#999999", marginTop: 4 }}>{value}</div>
      </div>
      <div
        style={{
          width: 160,
          height: 80,
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
          boxShadow: value,
        }}
      />
    </div>
  );
}

function ZIndexItem({ token, value }: { token: string; value: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px 80px 1fr",
        alignItems: "center",
        gap: 20,
        padding: "14px 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>zIndex.{token}</div>
      <div style={{ fontSize: 13, color: "#666666" }}>{value}</div>
      <div
        style={{
          width: Math.max(value / 5, 8),
          height: 16,
          borderRadius: 999,
          backgroundColor: "#2B96ED",
        }}
      />
    </div>
  );
}

function ElevationTokensPage() {
  return (
    <div
      style={{ fontFamily: "'Pretendard', sans-serif", padding: 24, backgroundColor: "#FFFFFF" }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#111111" }}>
        Elevation Tokens
      </h2>
      <p style={{ fontSize: 14, lineHeight: "20px", color: "#666666", marginBottom: 32 }}>
        Box shadow and z-index tokens for layering and depth.
      </p>

      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111111" }}>Shadow</h3>
      <div style={{ marginBottom: 40 }}>
        {Object.entries(shadow).map(([token, value]) => (
          <ShadowItem key={token} token={token} value={value} />
        ))}
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111111" }}>Z-Index</h3>
      <div>
        {Object.entries(zIndex).map(([token, value]) => (
          <ZIndexItem key={token} token={token} value={value} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Elevation",
  component: ElevationTokensPage,
};

export default meta;

export const AllElevation: StoryObj = {
  name: "Reference/All Elevation",
};
