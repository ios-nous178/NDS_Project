import type { Meta, StoryObj } from "@storybook/react";
import {
  neutral,
  coolGray,
  blue,
  magenta,
  yellow,
  red,
  green,
  nudgeEapSemantic,
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
    <div style={{ display: "flex", alignItems: "center", gap: "var(--gap-comfortable)" }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          backgroundColor: hex,
          border: hex === "#FFFFFF" ? "1px solid #ECECEC" : undefined,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-tight)" }}>
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 200px)",
          gap: "var(--gap-default)",
        }}
      >
        {Object.entries(palette).map(([key, hex]) => (
          <Swatch key={key} name={`${key}`} hex={hex} />
        ))}
      </div>
    </div>
  );
}

/** Flatten role-based semantic subtree to dotted-path → hex map */
function flattenSemantic(
  obj: Record<string, unknown>,
  prefix = "",
): Array<{ path: string; hex: string }> {
  const out: Array<{ path: string; hex: string }> = [];
  for (const [key, value] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      out.push({ path: p, hex: value });
    } else if (typeof value === "object" && value !== null) {
      out.push(...flattenSemantic(value as Record<string, unknown>, p));
    }
  }
  return out;
}

function RoleGroup({
  title,
  group,
}: {
  title: string;
  group: keyof typeof nudgeEapSemantic & string;
}) {
  const tokens = flattenSemantic(nudgeEapSemantic[group] as Record<string, unknown>);
  // Map dotted-path key inside the group → guide path used by semanticGuide.
  // Guide keys use cv dotted paths (surface.brand / textRole.brand etc.) which
  // differ from semantic field paths (bg.brand.default / text.brand.default).
  const guideGroupOf = (g: string): string => {
    if (g === "bg") return "surface";
    if (g === "text") return "textRole";
    if (g === "icon") return "iconRole";
    if (g === "border") return "borderRole";
    if (g === "buttonBg" || g === "buttonText" || g === "buttonBorder") return "button";
    return g;
  };
  const cvGroup = guideGroupOf(group);
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{title}</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 240px)",
          gap: "var(--gap-default)",
        }}
      >
        {tokens.map(({ path, hex }) => {
          // Convert semantic path `brand.default` → cv key `brand` (drop `.default`)
          // and `status.error` → `statusError` (camelCase).
          const cvKey = path
            .replace(/\.default$/, "")
            .replace(/\.([a-z])/g, (_, c: string) => c.toUpperCase());
          return <Swatch key={path} name={path} hex={hex} group={cvGroup} tokenKey={cvKey} />;
        })}
      </div>
    </div>
  );
}

function ColorTokensPage() {
  return (
    <div style={{ fontFamily: "'Pretendard', sans-serif", padding: "var(--inset-modal)" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Color Tokens</h2>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#111111" }}>
        Semantic (Figma SemanticColorGuide 171:6675)
      </h2>
      <RoleGroup title="BG" group="bg" />
      <RoleGroup title="Text" group="text" />
      <RoleGroup title="ButtonBG" group="buttonBg" />
      <RoleGroup title="ButtonText" group="buttonText" />
      <RoleGroup title="ButtonBorder" group="buttonBorder" />
      <RoleGroup title="Icon" group="icon" />
      <RoleGroup title="Border" group="border" />
      <RoleGroup title="Fill" group="fill" />
      <RoleGroup title="Input" group="input" />

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
