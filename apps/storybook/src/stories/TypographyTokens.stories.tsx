import type { Meta, StoryObj } from "@storybook/react";
import { fontFamily, fontWeight, typeScale } from "@nudge-eap/tokens";
import React from "react";

function TypeRow({
  name,
  fontSize,
  lineHeight,
  letterSpacing,
  weight,
}: {
  name: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  weight: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(180px, 220px) 1fr",
        gap: 24,
        padding: "20px 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#111111", marginBottom: 6 }}>
          {name}
        </div>
        <div style={{ fontSize: 12, color: "#777777", lineHeight: "18px" }}>
          {fontSize}px / {lineHeight}px / {weight}
        </div>
        <div style={{ fontSize: 12, color: "#999999", lineHeight: "18px" }}>
          letter-spacing: {letterSpacing}
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: fontFamily.web,
            fontSize,
            lineHeight: `${lineHeight}px`,
            letterSpacing,
            fontWeight: weight,
            color: "#383838",
          }}
        >
          The quick brown fox jumps over the lazy dog
        </div>
        <div
          style={{
            fontFamily: fontFamily.web,
            fontSize,
            lineHeight: `${lineHeight}px`,
            letterSpacing,
            fontWeight: weight,
            color: "#383838",
            marginTop: 8,
          }}
        >
          오늘의 감정 흐름을 차분하게 살펴보세요
        </div>
      </div>
    </div>
  );
}

function TypographyTokensPage() {
  return (
    <div style={{ fontFamily: fontFamily.web, padding: 24, backgroundColor: "#FFFFFF" }}>
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
          gap: 12,
          marginBottom: 32,
        }}
      >
        <div style={{ padding: 16, borderRadius: 12, backgroundColor: "#F8F9FB" }}>
          <div style={{ fontSize: 12, color: "#777777", marginBottom: 6 }}>Font Family</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>{fontFamily.web}</div>
        </div>
        <div style={{ padding: 16, borderRadius: 12, backgroundColor: "#F8F9FB" }}>
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
            weight={token.fontWeight}
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
