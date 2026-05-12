import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CoachMark } from "@nudge-eap/react";
import { EditIcon, SettingIcon } from "@nudge-eap/icons";

const meta: Meta<typeof CoachMark> = {
  title: "Components/CoachMark",
  component: CoachMark,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof CoachMark>;

export const Playground: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 32 }}>
        <button onClick={() => setOpen(true)} style={{ padding: "8px 16px", marginBottom: 24 }}>
          온보딩 시작
        </button>
        <div
          style={{ display: "flex", gap: 24, padding: 24, background: "#FAFBFC", borderRadius: 12 }}
        >
          <button
            id="t-record"
            style={{ padding: "12px 24px", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <EditIcon size={16} color="var(--eap-icon-normal-default)" /> 기록
          </button>
          <button id="t-discover" style={{ padding: "12px 24px" }}>
            ✨ 둘러보기
          </button>
          <button
            id="t-settings"
            style={{ padding: "12px 24px", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <SettingIcon size={16} color="var(--eap-icon-normal-default)" /> 설정
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
