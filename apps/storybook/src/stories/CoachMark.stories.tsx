import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CoachMark } from "@nudge-design/react";
import { EditIcon, MockupBoldFlashCircleIcon, SettingIcon } from "@nudge-design/icons";

const meta: Meta<typeof CoachMark> = {
  title: "Components/Overlay/CoachMark",
  component: CoachMark,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof CoachMark>;

/* ─── Overview ─── 첫 화면 = 안내 말풍선이 떠 있는 상태(클릭 불필요). 갤러리 프리뷰로도 재사용(정적 인라인). */
export const Overview: Story = {
  name: "Overview",
  tags: ["gallery"],
  render: () => (
    <div style={{ position: "relative", width: 200, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 68 }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 200, padding: "10px 12px", background: "#111", color: "#fff", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.18)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>여기를 눌러보세요</div>
        <div style={{ fontSize: 11, color: "#bbb", lineHeight: 1.5 }}>이 버튼이 핵심 액션입니다.</div>
        <span aria-hidden style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 10, height: 10, background: "#111" }} />
      </div>
      <div style={{ padding: "8px 14px", border: "1px solid #D8D8D8", borderRadius: 8, fontSize: 13, color: "#111", background: "#fff" }}>도움말</div>
    </div>
  ),
};

export const Playground: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 32 }}>
        <button onClick={() => setOpen(true)} style={{ padding: "8px 16px", marginBottom: 24 }}>
          온보딩 시작
        </button>
        <div
          style={{
            display: "flex",
            gap: "var(--semantic-gap-wide)",
            padding: "var(--semantic-inset-modal)",
            background: "#FAFBFC",
            borderRadius: 12,
          }}
        >
          <button
            id="t-record"
            style={{ padding: "12px 24px", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <EditIcon size={16} color="var(--semantic-icon-normal-default)" /> 기록
          </button>
          <button id="t-discover" style={{ padding: "12px 24px" }}>
            <MockupBoldFlashCircleIcon size={16} color="var(--semantic-icon-normal-default)" />{" "}
            둘러보기
          </button>
          <button
            id="t-settings"
            style={{ padding: "12px 24px", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <SettingIcon size={16} color="var(--semantic-icon-normal-default)" /> 설정
          </button>
        </div>
        <CoachMark
          open={open}
          steps={[
            {
              target: "#t-record",
              title: "감정을 기록해보세요",
              description: "여기서 오늘의 기분을 한 줄로 남길 수 있어요.",
              placement: "bottom",
            },
            {
              target: "#t-discover",
              title: "콘텐츠를 둘러보세요",
              description: "큐레이션된 명상과 마음챙김 가이드가 매일 새로워요.",
              placement: "bottom",
            },
            {
              target: "#t-settings",
              title: "마지막으로, 알림 설정",
              description: "원하는 시간에 부드럽게 알림을 받을 수 있어요.",
              placement: "bottom",
            },
          ]}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const SingleStep: Story = {
  name: "Recipe/단일 안내",
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 32 }}>
        <button id="single-target" onClick={() => setOpen(true)} style={{ padding: "8px 16px" }}>
          여기를 클릭
        </button>
        <CoachMark
          open={open}
          hideSkip
          steps={[
            {
              target: "#single-target",
              title: "한 번만 보여주세요",
              description: "더 이상 안내가 필요 없을 때는 hideSkip + 단일 step.",
              placement: "right",
            },
          ]}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};
