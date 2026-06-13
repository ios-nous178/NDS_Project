import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FilterBar } from "@nudge-design/react";

const meta: Meta<typeof FilterBar> = {
  title: "Components/Navigation/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

const CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "meditation", label: "명상", count: 12 },
  { key: "sleep", label: "수면", count: 8 },
  { key: "stress", label: "스트레스", count: 24 },
  { key: "relationship", label: "관계" },
  { key: "growth", label: "성장" },
  { key: "anxiety", label: "불안", count: 5 },
];

export const Playground: Story = {
  render: function Render() {
    const [v, setV] = useState<string[]>([]);
    return (
      <div style={{ width: 480 }}>
        <FilterBar options={CATEGORIES} value={v} onValueChange={setV} />
      </div>
    );
  },
};

const GALLERY_CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "meditation", label: "명상", count: 12 },
  { key: "sleep", label: "수면", count: 8 },
];

export const Overview: Story = {
  tags: ["gallery"],
  name: "Overview",
  render: function Render() {
    const [v, setV] = useState<string[]>(["meditation"]);
    return (
      <div style={{ width: 320 }}>
        <FilterBar
          options={GALLERY_CATEGORIES}
          value={v}
          onValueChange={setV}
          showReset
        />
      </div>
    );
  },
};

export const Single: Story = {
  name: "Variant/단일 선택",
  render: function Render() {
    const [v, setV] = useState<string[]>(["all"]);
    return (
      <div style={{ width: 480 }}>
        <FilterBar options={CATEGORIES} value={v} onValueChange={setV} single />
      </div>
    );
  },
};

export const ManyOptions: Story = {
  name: "Edge/많은 옵션 (가로 스크롤)",
  render: function Render() {
    const [v, setV] = useState<string[]>([]);
    return (
      <div style={{ width: 320 }}>
        <FilterBar
          options={Array.from({ length: 12 }, (_, i) => ({
            key: `cat-${i}`,
            label: `카테고리 ${i + 1}`,
            count: Math.floor(Math.random() * 30),
          }))}
          value={v}
          onValueChange={setV}
        />
      </div>
    );
  },
};
