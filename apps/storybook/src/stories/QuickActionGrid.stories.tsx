import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QuickActionGrid } from "@nudge-design/react";
import {
  ChallengeIcon,
  CommentIcon,
  MockupBoldBookIcon,
  MockupBoldNotificationIcon,
  MockupBoldPenToolIcon,
  MockupBoldSettingsIcon,
  MockupBoldSunIcon,
  MockupBoldMoonIcon,
} from "@nudge-design/icons";

const meta: Meta<typeof QuickActionGrid> = {
  title: "Components/Layout/QuickActionGrid",
  component: QuickActionGrid,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof QuickActionGrid>;

const HOME_ACTIONS = [
  { key: "record", icon: <MockupBoldPenToolIcon size={24} />, label: "감정 기록" },
  { key: "counsel", icon: <CommentIcon size={24} />, label: "상담 예약" },
  { key: "challenge", icon: <ChallengeIcon size={24} />, label: "챌린지" },
  { key: "content", icon: <MockupBoldBookIcon size={24} />, label: "콘텐츠" },
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
          { key: "1", icon: <MockupBoldPenToolIcon size={24} />, label: "기록" },
          { key: "2", icon: <CommentIcon size={24} />, label: "상담" },
          { key: "3", icon: <ChallengeIcon size={24} />, label: "챌린지" },
          { key: "4", icon: <MockupBoldMoonIcon size={24} />, label: "명상" },
          { key: "5", icon: <MockupBoldBookIcon size={24} />, label: "콘텐츠" },
          { key: "6", icon: <MockupBoldSettingsIcon size={24} />, label: "설정" },
        ]}
      />
    </div>
  ),
};

export const WithBadges: Story = {
  tags: ["gallery"],
  name: "Recipe/배지 (NEW / 카운트)",
  render: () => (
    <div style={{ width: 360 }}>
      <QuickActionGrid
        actions={[
          { key: "1", icon: <MockupBoldPenToolIcon size={24} />, label: "감정 기록" },
          { key: "2", icon: <MockupBoldNotificationIcon size={24} />, label: "알림", badge: "3" },
          {
            key: "3",
            icon: <MockupBoldNotificationIcon size={24} />,
            label: "신규 기능",
            badge: "N",
          },
          { key: "4", icon: <MockupBoldBookIcon size={24} />, label: "콘텐츠" },
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
          { key: "1", icon: <MockupBoldPenToolIcon size={24} />, label: "기록" },
          { key: "2", icon: <CommentIcon size={24} />, label: "상담" },
          {
            key: "3",
            icon: <MockupBoldSettingsIcon size={24} />,
            label: "프리미엄",
            disabled: true,
          },
          { key: "4", icon: <MockupBoldBookIcon size={24} />, label: "콘텐츠" },
        ]}
      />
    </div>
  ),
};

export const CustomIconColors: Story = {
  tags: ["gallery"],
  name: "Recipe/아이콘 배경 색 커스텀",
  render: () => (
    <div style={{ width: 360 }}>
      <QuickActionGrid
        actions={[
          { key: "1", icon: <MockupBoldSunIcon size={24} />, label: "아침", iconBg: "#FFF4E0" },
          { key: "2", icon: <MockupBoldSunIcon size={24} />, label: "낮", iconBg: "#FFE9C4" },
          { key: "3", icon: <MockupBoldSunIcon size={24} />, label: "저녁", iconBg: "#FCD2D2" },
          { key: "4", icon: <MockupBoldMoonIcon size={24} />, label: "밤", iconBg: "#E8E2FA" },
        ]}
      />
    </div>
  ),
};
