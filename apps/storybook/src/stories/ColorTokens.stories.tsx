import type { Meta, StoryObj } from "@storybook/react";
import { neutral, coolGray, blue, magenta, yellow, red, green } from "@nudge-eap/tokens";
import React from "react";

function Swatch({ name, hex }: { name: string; hex: string }) {
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
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 12, color: "#999" }}>{hex}</div>
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

function ColorTokensPage() {
  return (
    <div style={{ fontFamily: "'Pretendard', sans-serif", padding: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Color Tokens</h2>
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
