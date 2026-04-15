import React from "react";

const swatchStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  minWidth: 80,
};

const colorBoxStyle = (color) => ({
  width: "100%",
  height: 48,
  borderRadius: 8,
  background: color,
  border: "1px solid rgba(0,0,0,0.06)",
});

const labelStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: "#4E5462",
};

const valueStyle = {
  fontSize: 10,
  color: "#9CA2AE",
  fontFamily: "monospace",
};

export function ColorSwatch({ color, name }) {
  return (
    <div style={swatchStyle}>
      <div style={colorBoxStyle(color)} title={color} />
      <span style={labelStyle}>{name}</span>
      <span style={valueStyle}>{color}</span>
    </div>
  );
}

export function ColorPalette({ colors, name }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: "#111" }}>{name}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.entries(colors).map(([key, value]) => (
          <ColorSwatch key={key} color={value} name={key} />
        ))}
      </div>
    </div>
  );
}
