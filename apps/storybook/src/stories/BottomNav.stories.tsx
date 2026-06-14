import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BottomNav, type BottomNavItemProps } from "@nudge-design/react";
import {
  HomeIcon,
  HomeActiveIcon,
  ChallengeIcon,
  ChallengeActiveIcon,
  CounselIcon,
  CounselActiveIcon,
  MentalcareIcon,
  MentalcareActiveIcon,
  MypageIcon,
  MypageActiveIcon,
} from "@nudge-design/icons";

const meta: Meta<typeof BottomNav> = {
  title: "Components/Navigation/BottomNav",
  component: BottomNav,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof BottomNav>;

/** 360px 모바일 셸 — fixed 대신 static 으로 박아 인라인 미리보기. */
const PhoneShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 360,
      border: "1px solid var(--semantic-border-subtle-default)",
      borderRadius: 12,
      overflow: "hidden",
    }}
  >
    <div style={{ height: 120, background: "var(--semantic-bg-surface-subtle)" }} />
    {children}
  </div>
);

// icon/activeIcon/badge 는 컴포넌트 prop 타입으로 고정 — storybook(@types/react@18)과
// @nudge-design/react(@types/react@19) 의 ReactNode(bigint) 불일치를 피한다.
interface DemoTab {
  key: string;
  label: string;
  icon: BottomNavItemProps["icon"];
  activeIcon: BottomNavItemProps["activeIcon"];
  badge?: BottomNavItemProps["badge"];
}

const TABS: DemoTab[] = [
  {
    key: "home",
    label: "홈",
    icon: <HomeIcon size={24} />,
    activeIcon: <HomeActiveIcon size={24} />,
  },
  {
    key: "challenge",
    label: "챌린지",
    icon: <ChallengeIcon size={24} />,
    activeIcon: <ChallengeActiveIcon size={24} />,
  },
  {
    key: "counsel",
    label: "상담",
    icon: <CounselIcon size={24} />,
    activeIcon: <CounselActiveIcon size={24} />,
  },
  {
    key: "care",
    label: "멘탈케어",
    icon: <MentalcareIcon size={24} />,
    activeIcon: <MentalcareActiveIcon size={24} />,
  },
  {
    key: "my",
    label: "내 공간",
    icon: <MypageIcon size={24} />,
    activeIcon: <MypageActiveIcon size={24} />,
  },
];

/** 상태를 들고 있는 데모 — 스토리 render 가 hook 을 직접 부르지 않도록 컴포넌트로 분리. */
const BottomNavDemo: React.FC<{
  tabs?: DemoTab[];
  initial?: string;
  shadow?: boolean;
  style?: React.CSSProperties;
}> = ({ tabs = TABS, initial = "home", shadow, style }) => {
  const [active, setActive] = useState(initial);
  return (
    <PhoneShell>
      <BottomNav
        activeKey={active}
        onChange={setActive}
        position="static"
        shadow={shadow}
        style={style}
      >
        {tabs.map((t) => (
          <BottomNav.Item
            key={t.key}
            itemKey={t.key}
            label={t.label}
            icon={t.icon}
            activeIcon={t.activeIcon}
            badge={t.badge}
          />
        ))}
      </BottomNav>
    </PhoneShell>
  );
};

export const Default: Story = {
  name: "Default (5탭)",
  tags: ["gallery"],
  render: () => <BottomNavDemo />,
};

export const WithBadge: Story = {
  name: "Badge (카운트/알림)",
  render: () => (
    <BottomNavDemo tabs={[TABS[0], { ...TABS[1], badge: 3 }, { ...TABS[2], badge: 12 }, TABS[4]]} />
  ),
};

export const Shadow: Story = {
  name: "Shadow (상단 그림자)",
  render: () => <BottomNavDemo initial="counsel" shadow />,
};

export const BrandTokenOverride: Story = {
  name: "브랜드 토큰 override (컴포넌트는 브랜드 모름)",
  render: () => (
    <BottomNavDemo
      // 브랜드 토큰 파일이 하는 일을 인라인으로 시연 — 활성색만 브랜드 민트로.
      style={
        {
          "--nds-bottomnav-active-color": "var(--semantic-text-brand-default)",
        } as React.CSSProperties
      }
    />
  ),
};
