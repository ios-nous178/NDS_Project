import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QuickActionGrid } from "@nudge-eap/react";

const meta: Meta<typeof QuickActionGrid> = {
  title: "Components/QuickActionGrid",
  component: QuickActionGrid,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof QuickActionGrid>;

const HOME_ACTIONS = [
  { key: "record", icon: "📝", label: "감정 기록" },
  { key: "counsel", icon: "💬", label: "상담 예약" },
  { key: "challenge", icon: "🎯", label: "챌린지" },
  { key: "content", icon: "📚", label: "콘텐츠" },
];

export const Playground: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <QuickActionGrid
        actions={HOME_ACTIONS.map((a) => ({ ...a, onClick: () => alert(a.label) }))}
      />
    </div>
  ),
};

export const SixActionsThreeCols: Story = {
  name: "Variant/3 columns × 2 rows",
  render: () => (
    <div style={{ width: 360 }}>
      <QuickActionGrid
        columns={3}
        actions={[
          { key: "1", icon: "📝", label: "기록" },
          { key: "2", icon: "💬", label: "상담" },
          { key: "3", icon: "🎯", label: "챌린지" },
          { key: "4", icon: "🧘", label: "명상" },
          { key: "5", icon: "📚", label: "콘텐츠" },
          { key: "6", icon: "⚙️", label: "설정" },
        ]}
      />
    </div>
  ),
};

export const WithBadges: Story = {
  name: "Recipe/배지 (NEW / 카운트)",
  render: () => (
    <div style={{ width: 360 }}>
      <QuickActionGrid
        actions={[
          { key: "1", icon: "📝", label: "감정 기록" },
          { key: "2", icon: "🔔", label: "알림", badge: "3" },
          { key: "3", icon: "✨", label: "신규 기능", badge: "N" },
          { key: "4", icon: "📚", label: "콘텐츠" },
        ]}
      />
    </div>
  ),
};

export const Disabled: Story = {
  name: "State/비활성 액션",
  render: () => (
    <div style={{ width: 360 }}>
      <QuickActionGrid
        actions={[
          { key: "1", icon: "📝", label: "기록" },
          { key: "2", icon: "💬", label: "상담" },
          { key: "3", icon: "🔒", label: "프리미엄", disabled: true },
          { key: "4", icon: "📚", label: "콘텐츠" },
        ]}
      />
    </div>
  ),
};

export const CustomIconColors: Story = {
  name: "Recipe/아이콘 배경 색 커스텀",
  render: () => (
    <div style={{ width: 360 }}>
      <QuickActionGrid
        actions={[
          { key: "1", icon: "🌅", label: "아침", iconBg: "#FFF4E0" },
          { key: "2", icon: "☀️", label: "낮", iconBg: "#FFE9C4" },
          { key: "3", icon: "🌆", label: "저녁", iconBg: "#FCD2D2" },
          { key: "4", icon: "🌙", label: "밤", iconBg: "#E8E2FA" },
        ]}
      />
    </div>
  ),
};
