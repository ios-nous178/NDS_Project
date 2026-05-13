import type { Meta, StoryObj } from "@storybook/react";
import {
  neutral,
  coolGray,
  blue,
  magenta,
  yellow,
  red,
  green,
  semantic,
  getSemanticGuide,
} from "@nudge-eap/tokens";
import React from "react";
import { DesignGuideBadge } from "../components/DesignGuideBadge";

function Swatch({
  name,
  hex,
  group,
  tokenKey,
}: {
  name: string;
  hex: string;
  group?: string;
  tokenKey?: string;
}) {
  const guide = group && tokenKey ? getSemanticGuide(`${group}.${tokenKey}`) : undefined;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          backgroundColor: hex,
          border: hex === "#FFFFFF" ? "1px solid #ECECEC" : undefined,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 12, color: "#999" }}>{hex}</div>
        {guide && <DesignGuideBadge meta={guide} />}
      </div>
    </div>
  );
}

function PaletteGroup({ title, palette }: { title: string; palette: Record<string, string> }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{title}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 200px)", gap: 8 }}>
        {Object.entries(palette).map(([key, hex]) => (
          <Swatch key={key} name={`${key}`} hex={hex} />
        ))}
      </div>
    </div>
  );
}

function SemanticGroup({
  title,
  group,
  tokens,
}: {
  title: string;
  group: string;
  tokens: Record<string, string>;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{title}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 220px)", gap: 8 }}>
        {Object.entries(tokens).map(([key, value]) => (
          <Swatch key={key} name={key} hex={value} group={group} tokenKey={key} />
        ))}
      </div>
    </div>
  );
}

function ColorTokensPage() {
  return (
    <div style={{ fontFamily: "'Pretendard', sans-serif", padding: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Color Tokens</h2>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#111111" }}>
        Semantic Colors
      </h2>
      <SemanticGroup title="Primary" group="primary" tokens={semantic.primary} />
      <SemanticGroup title="Secondary" group="secondary" tokens={semantic.secondary} />
      <SemanticGroup title="Error" group="error" tokens={semantic.error} />
      <SemanticGroup title="Caution" group="caution" tokens={semantic.caution} />
      <SemanticGroup title="Success" group="success" tokens={semantic.success} />
      <SemanticGroup title="Text" group="text" tokens={semantic.text} />
      <SemanticGroup title="Background" group="bg" tokens={semantic.bg} />
      <SemanticGroup title="Border" group="border" tokens={semantic.border} />
      <SemanticGroup title="Icon" group="icon" tokens={semantic.icon} />

      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 16,
          marginTop: 48,
          color: "#111111",
        }}
      >
        Primitive Scales
      </h2>
      <PaletteGroup title="Neutral" palette={neutral} />
      <PaletteGroup title="Cool Gray" palette={coolGray} />
      <PaletteGroup title="Blue (Primary)" palette={blue} />
      <PaletteGroup title="Magenta (Secondary)" palette={magenta} />
      <PaletteGroup title="Yellow (Caution)" palette={yellow} />
      <PaletteGroup title="Red (Error)" palette={red} />
      <PaletteGroup title="Green (Success)" palette={green} />
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Colors",
  component: ColorTokensPage,
};
export default meta;

export const AllColors: StoryObj = {
  name: "Reference/All Colors",
};
