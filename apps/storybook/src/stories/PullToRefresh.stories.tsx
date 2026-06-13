import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PullToRefresh } from "@nudge-design/react";

const meta: Meta<typeof PullToRefresh> = {
  title: "Components/Layout/PullToRefresh",
  component: PullToRefresh,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof PullToRefresh>;

export const Playground: Story = {
  render: function Render() {
    const [items, setItems] = useState(["기록 1", "기록 2", "기록 3"]);
    const refresh = async () => {
      await new Promise((r) => setTimeout(r, 1200));
      setItems((prev) => [`방금 추가됨 ${prev.length + 1}`, ...prev]);
    };
    return (
      <div style={{ width: 360, height: 400, border: "1px solid #ddd", borderRadius: 8 }}>
        <PullToRefresh onRefresh={refresh} style={{ height: "100%" }}>
          <div
            style={{
              padding: "var(--semantic-inset-card)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--semantic-gap-default)",
            }}
          >
            <p style={{ margin: 0, color: "#888", fontSize: 13 }}>
              위로 끌어내려서 새로고침해보세요.
            </p>
            {items.map((it, i) => (
              <div
                key={i}
                style={{
                  padding: "var(--semantic-inset-input)",
                  background: "#FAFBFC",
                  borderRadius: 8,
                }}
              >
                {it}
              </div>
            ))}
          </div>
        </PullToRefresh>
      </div>
    );
  },
};

const sampleRows = ["오늘의 감정 기록", "수면 7시간 20분", "명상 10분 완료", "물 1.2L 섭취"];

function SampleList() {
  return (
    <div
      style={{
        padding: "var(--semantic-inset-card)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-default)",
      }}
    >
      {sampleRows.map((it, i) => (
        <div
          key={i}
          style={{
            padding: "var(--semantic-inset-input)",
            background: "#FAFBFC",
            borderRadius: 8,
            fontSize: 13,
            color: "#333",
          }}
        >
          {it}
        </div>
      ))}
    </div>
  );
}

/* ─── Pulled (gallery) ─── 제스처 없는 정적 렌더에서도 인디케이터(라벨)가 보이도록 당김 상태를 CSS 변수로 고정. */
export const PulledState: Story = {
  tags: ["gallery"],
  name: "State/당겨진 상태",
  render: () => (
    <div
      style={{
        width: 360,
        height: 280,
        border: "1px solid #ECECEC",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <PullToRefresh
        onRefresh={async () => new Promise((r) => setTimeout(r, 800))}
        pullLabel="놓으면 새로고침"
        style={
          {
            height: "100%",
            // 스토리북/갤러리는 정적 렌더라 제스처가 없다 → 당김 상태를 고정해 인디케이터를 노출.
            "--nds-ptr-pull": "56px",
            "--nds-ptr-anim": "0ms",
          } as React.CSSProperties
        }
      >
        <SampleList />
      </PullToRefresh>
    </div>
  ),
};

export const CustomLabels: Story = {
  name: "Recipe/라벨 커스텀",
  render: () => (
    <div
      style={{
        width: 360,
        height: 280,
        border: "1px solid #ECECEC",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <PullToRefresh
        onRefresh={async () => new Promise((r) => setTimeout(r, 800))}
        pullLabel="당겨서 일기 동기화"
        releaseLabel="놓으면 동기화"
        refreshingLabel="동기화 중..."
        style={{ height: "100%" }}
      >
        <SampleList />
      </PullToRefresh>
    </div>
  ),
};
