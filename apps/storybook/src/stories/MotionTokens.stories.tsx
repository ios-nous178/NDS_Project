import type { Meta, StoryObj } from "@storybook/react";
import { duration, easing, transition } from "@nudge-design/tokens";
import React, { useState } from "react";

function DurationItem({ token, value }: { token: string; value: number }) {
  const [active, setActive] = useState(false);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px 80px 1fr",
        alignItems: "center",
        gap: 20,
        padding: "var(--semantic-inset-card) 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>duration.{token}</div>
      <div style={{ fontSize: 13, color: "#666666" }}>{value}ms</div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-loose)" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            backgroundColor: active
              ? "var(--semantic-fill-brand-default)"
              : "var(--semantic-bg-brand-subtle)",
            transition: `background-color ${value}ms ease`,
            cursor: "pointer",
          }}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
        />
        <div style={{ fontSize: 12, color: "#999999" }}>Hover to preview</div>
      </div>
    </div>
  );
}

function EasingItem({ token, value }: { token: string; value: string }) {
  const [active, setActive] = useState(false);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px 120px 1fr",
        alignItems: "center",
        gap: 20,
        padding: "var(--semantic-inset-card) 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>easing.{token}</div>
      <div style={{ fontSize: 13, color: "#666666" }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-loose)" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            backgroundColor: "var(--semantic-fill-brand-default)",
            transform: active ? "translateX(80px)" : "translateX(0)",
            transition: `transform 300ms ${value}`,
            cursor: "pointer",
          }}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
        />
        <div style={{ fontSize: 12, color: "#999999", marginLeft: 96 }}>Hover to preview</div>
      </div>
    </div>
  );
}

function TransitionItem({ token, value }: { token: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px 1fr",
        alignItems: "center",
        gap: 20,
        padding: "var(--semantic-inset-card) 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>transition.{token}</div>
      <div style={{ fontSize: 13, color: "#666666" }}>{value}</div>
    </div>
  );
}

function MotionTokensPage() {
  return (
    <div
      style={{
        fontFamily: "'Pretendard', sans-serif",
        padding: "var(--semantic-inset-modal)",
        backgroundColor: "#FFFFFF",
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#111111" }}>
        Motion Tokens
      </h2>
      <p style={{ fontSize: 14, lineHeight: "20px", color: "#666666", marginBottom: 32 }}>
        Duration, easing, and transition presets. Hover the samples to preview timing.
      </p>

      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111111" }}>
        Duration
      </h3>
      <div style={{ marginBottom: 40 }}>
        {Object.entries(duration).map(([token, value]) => (
          <DurationItem key={token} token={token} value={value} />
        ))}
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111111" }}>Easing</h3>
      <div style={{ marginBottom: 40 }}>
        {Object.entries(easing).map(([token, value]) => (
          <EasingItem key={token} token={token} value={value} />
        ))}
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111111" }}>
        Transition Presets
      </h3>
      <div>
        {Object.entries(transition).map(([token, value]) => (
          <TransitionItem key={token} token={token} value={value} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Motion",
  component: MotionTokensPage,
};

export default meta;

export const AllMotion: StoryObj = {
  name: "Reference/All Motion",
};
