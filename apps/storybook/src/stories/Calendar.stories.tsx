import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "@nudge-eap/react";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Playground: Story = {
  render: function Render() {
    const [value, setValue] = useState<string | undefined>();
    return (
      <div style={{ width: 360 }}>
        <Calendar value={value} onChange={setValue} />
      </div>
    );
  },
};

export const WithMarkers: Story = {
  name: "Recipe/일정 마커",
  render: function Render() {
    const [value, setValue] = useState<string | undefined>();
    const today = new Date();
    const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const markers = [
      { date: `${ym}-05`, color: "var(--semantic-text-brand-default)" },
      { date: `${ym}-12`, color: "var(--semantic-text-status-success)" },
      { date: `${ym}-19`, color: "var(--semantic-text-status-caution)" },
      { date: `${ym}-22` },
    ];
    return (
      <div style={{ width: 360 }}>
        <Calendar value={value} onChange={setValue} markers={markers} />
      </div>
    );
  },
};

export const WithDisabledDates: Story = {
  name: "Recipe/예약 가능 날짜",
  render: function Render() {
    const [value, setValue] = useState<string | undefined>();
    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return (
      <div style={{ width: 360 }}>
        <Calendar
          value={value}
          onChange={setValue}
          isDateDisabled={(iso: string) => iso < todayIso || new Date(iso).getDay() === 0}
        />
      </div>
    );
  },
};

export const MondayStart: Story = {
  name: "Variant/주 시작 = 월요일",
  render: () => (
    <div style={{ width: 360 }}>
      <Calendar weekStartsOn={1} />
    </div>
  ),
};

export const NoHeader: Story = {
  name: "State/외부 헤더로 제어",
  render: function Render() {
    const [ym, setYm] = useState(() => {
      const t = new Date();
      return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;
    });
    const [y, m] = ym.split("-").map(Number);
    const prev = () => {
      const d = new Date(y, m - 2, 1);
      setYm(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    };
    const next = () => {
      const d = new Date(y, m, 1);
      setYm(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    };
    return (
      <div style={{ width: 360 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <button onClick={prev} type="button">
            ◀
          </button>
          <strong>
            {y}년 {m}월
          </strong>
          <button onClick={next} type="button">
            ▶
          </button>
        </div>
        <Calendar month={ym} hideHeader onMonthChange={setYm} />
      </div>
    );
  },
};
