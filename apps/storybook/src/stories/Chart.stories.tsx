import type { Meta, StoryObj } from "@storybook/react";
import { Chart } from "@nudge-design/react";
import React from "react";

const meta: Meta<typeof Chart> = {
  title: "Components/Chart",
  component: Chart,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "캐포비 어드민 통계 차트 — line / grouped-bar. 무번들러 목업 정합을 위해 런타임 차트 " +
          "라이브러리 없이 정적 inline-SVG 로 렌더. 시리즈 색은 --nds-chart-* 토큰으로 오버라이드 " +
          "(line=#FFD200, bar1=#007AFF 남성, bar2=#FF8437 여성). Figma 퀴즈 통계 (3001:47404).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chart>;

const AGES = ["10", "20", "30", "40", "50", "60"];

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 16,
      padding: "24px 28px",
      maxWidth: 620,
      boxShadow: "0 1px 4px rgba(0,0,0,.08)",
    }}
  >
    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{title}</div>
    {children}
  </div>
);

export const Line: Story = {
  render: () => (
    <Card title="연령대별 차트 — 지급된 캐시">
      <Chart
        type="line"
        labels={AGES}
        series={[
          {
            name: "지급된 캐시",
            values: [11000000, 28000000, 33000000, 40000000, 42000000, 47000000],
          },
        ]}
        tooltip={{ index: 3, text: "123,456,789 w/s" }}
      />
    </Card>
  ),
};

export const GroupedBar: Story = {
  render: () => (
    <Card title="연령대별 차트 — 성별 분포">
      <Chart
        type="bar"
        labels={AGES}
        yMax={60000000}
        series={[
          { name: "남성", values: [14000000, 15500000, 22000000, 25000000, 26000000, 16000000] },
          { name: "여성", values: [14000000, 18500000, 20500000, 28000000, 26000000, 14500000] },
        ]}
      />
    </Card>
  ),
};

/** 도넛 — 성별 분포. 시리즈 1개 = 1 세그먼트, 범례에 % 표기. 알수없음은 --nds-chart-empty(회색). */
export const Donut: Story = {
  name: "Donut (성별 분포)",
  render: () => (
    <Card title="성별">
      <Chart
        type="donut"
        labels={[]}
        series={[
          { name: "남성", values: [20] },
          { name: "여성", values: [20] },
          { name: "알수없음", values: [60], color: "var(--nds-chart-empty)" },
        ]}
      />
    </Card>
  ),
};

/** 도넛 빈 상태 — 데이터 0 이면 전체 회색 링 + 범례 0%. */
export const DonutEmpty: Story = {
  name: "Donut/빈 상태 (0%)",
  render: () => (
    <Card title="성별">
      <Chart
        type="donut"
        labels={[]}
        series={[
          { name: "남성", values: [0] },
          { name: "여성", values: [0] },
          { name: "알수없음", values: [0], color: "var(--nds-chart-empty)" },
        ]}
      />
    </Card>
  ),
};
