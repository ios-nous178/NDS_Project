import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { EmotionHeatmap, type EmotionEntry } from "@nudge-design/react";

const meta: Meta<typeof EmotionHeatmap> = {
  title: "Components/EmotionHeatmap",
  component: EmotionHeatmap,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof EmotionHeatmap>;

const t = new Date();
const ym = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;
const daysInMonth = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();

const buildEntries = (densityPct: number): EmotionEntry[] => {
  const entries: EmotionEntry[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    if (Math.random() > densityPct) continue;
    entries.push({
      date: `${ym}-${String(d).padStart(2, "0")}`,
      level: (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4,
    });
  }
  return entries;
};

export const Playground: Story = {
  render: function Render() {
    const [entries] = React.useState(() => buildEntries(0.7));
    return (
      <div style={{ width: 360 }}>
        <EmotionHeatmap entries={entries} title="이번 달 감정 기록" />
      </div>
    );
  },
};

export const Sparse: Story = {
  name: "Recipe/기록이 적은 달",
  render: function Render() {
    const [entries] = React.useState(() => buildEntries(0.3));
    return (
      <div style={{ width: 360 }}>
        <EmotionHeatmap entries={entries} />
      </div>
    );
  },
};

export const CustomColors: Story = {
  name: "Variant/색상 커스텀 (warm)",
  render: function Render() {
    const [entries] = React.useState(() => buildEntries(0.6));
    return (
      <div style={{ width: 360 }}>
        <EmotionHeatmap
          entries={entries}
          colors={["#FFE9C4", "#FFD088", "#FFB44D", "#F08020", "#C25B0E"]}
          legendLabels={{ low: "차분", high: "활기" }}
        />
      </div>
    );
  },
};

export const WithClick: Story = {
  name: "Interaction/셀 클릭",
  render: function Render() {
    const [entries] = React.useState(() => buildEntries(0.5));
    const [picked, setPicked] = React.useState<string | null>(null);
    return (
      <div style={{ width: 360 }}>
        <EmotionHeatmap
          entries={entries}
          onCellClick={(date, level) => setPicked(`${date} (단계 ${level})`)}
        />
        <p>선택: {picked ?? "없음"}</p>
      </div>
    );
  },
};
