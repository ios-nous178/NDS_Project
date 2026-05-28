import type { Meta, StoryObj } from "@storybook/react";
import { fontFamily, fontWeight, typeScale } from "@nudge-design/tokens";
import React from "react";

// Figma 가이드(171:6676)와 동일하게 각 스케일을 Bold/Medium/Regular 3개 weight 로 노출.
const WEIGHT_VARIANTS: Array<{ label: string; value: number }> = [
  { label: "Bold", value: 700 },
  { label: "Medium", value: 500 },
  { label: "Regular", value: 400 },
];

function TypeRow({
  name,
  fontSize,
  lineHeight,
  letterSpacing,
}: {
  name: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(180px, 220px) 1fr",
        gap: "var(--semantic-gap-wide)",
        padding: "var(--semantic-inset-card-large) 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#111111", marginBottom: 6 }}>
          {name}
        </div>
        <div style={{ fontSize: 12, color: "#777777", lineHeight: "18px" }}>
          {fontSize}px / {lineHeight}px
        </div>
        <div style={{ fontSize: 12, color: "#999999", lineHeight: "18px" }}>
          letter-spacing: {letterSpacing}
        </div>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-comfortable)" }}
      >
        {WEIGHT_VARIANTS.map((w) => (
          <div key={w.value}>
            <div style={{ fontSize: 11, color: "#999999", marginBottom: 4 }}>{w.label}</div>
            <div
              style={{
                fontFamily: fontFamily.web,
                fontSize,
                lineHeight: `${lineHeight}px`,
                letterSpacing,
                fontWeight: w.value,
                color: "#383838",
              }}
            >
              가나다라 Aa 123 The quick brown fox
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypographyTokensPage() {
  return (
    <div
      style={{
        fontFamily: fontFamily.web,
        padding: "var(--semantic-inset-modal)",
        backgroundColor: "#FFFFFF",
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#111111" }}>
        Typography Tokens
      </h2>
      <p style={{ fontSize: 14, lineHeight: "20px", color: "#666666", marginBottom: 32 }}>
        Figma typography tokens rendered as live text samples for visual QA.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "var(--semantic-gap-comfortable)",
          marginBottom: 32,
        }}
      >
        <div
          style={{
            padding: "var(--semantic-inset-card)",
            borderRadius: 12,
            backgroundColor: "#F8F9FB",
          }}
        >
          <div style={{ fontSize: 12, color: "#777777", marginBottom: 6 }}>Font Family</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>{fontFamily.web}</div>
        </div>
        <div
          style={{
            padding: "var(--semantic-inset-card)",
            borderRadius: 12,
            backgroundColor: "#F8F9FB",
          }}
        >
          <div style={{ fontSize: 12, color: "#777777", marginBottom: 6 }}>Font Weights</div>
          <div style={{ fontSize: 14, color: "#111111", lineHeight: "22px" }}>
            Regular {fontWeight.regular} / Medium {fontWeight.medium} / Bold {fontWeight.bold}
          </div>
        </div>
      </div>

      <div>
        {Object.entries(typeScale).map(([name, token]) => (
          <TypeRow
            key={name}
            name={name}
            fontSize={token.fontSize}
            lineHeight={token.lineHeight}
            letterSpacing={token.letterSpacing}
          />
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Typography",
  component: TypographyTokensPage,
};

export default meta;

export const AllTypography: StoryObj = {
  name: "Reference/All Typography",
};
