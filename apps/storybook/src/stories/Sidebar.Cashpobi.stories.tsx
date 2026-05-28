import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar, type SidebarItem, type SidebarSection } from "@nudge-design/react";
import {
  CashpobiGnbBannerIcon,
  CashpobiGnbCashIcon,
  CashpobiGnbChannelIcon,
  CashpobiGnbChatIcon,
  CashpobiGnbMemberIcon,
  CashpobiGnbQuizIcon,
  CashpobiGnbSettingIcon,
} from "@nudge-design/icons";

/**
 * Brands/Cashpobi/Sidebar — 캐포비(캐시워크 for Business) 어드민 사이드바.
 *
 * 레퍼런스 (Figma 한국 캐시워크_WEB-Dev 실측):
 *   - 168:1250 — 단일 사이드바 표준 (광고/운영/관리 3섹션, 7 GNB 아이템)
 *   - 290:1593 — 서브메뉴 변형 (퀴즈 관리 펼침)
 *
 * Figma 실측 메트릭:
 *   - 컨테이너: 300px width, white bg, right border #E7E7E7
 *   - 헤더: 32 top padding, 36×36 rounded-8 avatar + 16 Bold name + 13 caption account#
 *   - 섹션: py-28, 1px top border #EEE (첫 섹션 제외)
 *   - 섹션 라벨: 14 Medium uppercase #666, pl-20 pr-10
 *   - 아이템: 252×42, rounded-16(idle)/12(active), padding 20×12, gap 10, icon 24, label 16
 *   - 활성: bg #FFF4C0 + #383838 텍스트 (Medium 유지, Bold 아님)
 *   - data-brand="cashpobi" 가 :root 에 있을 때 자동 톤 매핑
 *
 * 두 가지 레이아웃:
 *   1) `Default` — 168:1250 미러. 광고/운영/관리 3섹션 (실제 캐포비 admin 라벨)
 *   2) `WithSubMenu` — 290:1593 미러. 퀴즈 관리 펼침 (등록하기/목록/통계)
 *   3) `Collapsed` — 아이콘 only, 72px 너비
 */

const meta: Meta<typeof Sidebar> = {
  title: "Brands/Cashpobi/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  globals: { brand: "cashpobi" },
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

const LogoMark: React.FC = () => (
  <span
    aria-label="Cashpobi"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "#111111",
      color: "#FFD200",
      fontWeight: 800,
      fontSize: 14,
      letterSpacing: -0.5,
    }}
  >
    캐
  </span>
);

const PreviewFrame: React.FC<{ children: React.ReactNode; rightLabel?: string }> = ({
  children,
  rightLabel,
}) => (
  <div style={{ display: "flex", minHeight: 720, background: "#FAFAFA" }}>
    {children}
    <main
      style={{
        flex: 1,
        padding: 32,
        color: "#666666",
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0 }}>
        {rightLabel ?? "본문 영역"}
      </h1>
      <p style={{ marginTop: 8, fontSize: 14 }}>
        사이드바는 sticky로 viewport 높이를 채우며, 본문 영역은 flex로 확장됩니다.
      </p>
    </main>
  </div>
);

/* ─── Story 1 — 168:1250: 광고/운영/관리 3섹션 admin 사이드바 ─────────────── */

const DefaultStory: React.FC = () => {
  const [activeKey, setActiveKey] = useState("cash");

  const sections: SidebarSection[] = [
    {
      key: "ad",
      label: "광고",
      items: [
        { key: "banner", label: "배너", icon: <CashpobiGnbBannerIcon size={24} /> },
        { key: "quiz", label: "퀴즈", icon: <CashpobiGnbQuizIcon size={24} /> },
        { key: "message", label: "메세지", icon: <CashpobiGnbChatIcon size={24} /> },
      ],
    },
    {
      key: "operate",
      label: "운영",
      items: [{ key: "channel", label: "채널", icon: <CashpobiGnbChannelIcon size={24} /> }],
    },
    {
      key: "manage",
      label: "관리",
      items: [
        { key: "member", label: "멤버 관리", icon: <CashpobiGnbMemberIcon size={24} /> },
        { key: "ad-account", label: "광고계정 관리", icon: <CashpobiGnbBannerIcon size={24} /> },
        { key: "cash", label: "캐시 관리", icon: <CashpobiGnbCashIcon size={24} /> },
      ],
    },
  ];

  return (
    <PreviewFrame rightLabel="캐시 관리">
      <Sidebar
        items={sections}
        activeKey={activeKey}
        onItemClick={(item) => setActiveKey(item.key)}
        header={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "0 5px",
              width: "100%",
            }}
          >
            <LogoMark />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: "24px",
                  fontWeight: 700,
                  color: "#383838",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                리비바이오 광고
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 13,
                  lineHeight: "18px",
                  color: "#666666",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                광고계정 번호 : 123923
              </p>
            </div>
          </div>
        }
      />
    </PreviewFrame>
  );
};

export const Default: Story = {
  name: "Cashpobi/Default (광고 · 운영 · 관리)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 168:1250 미러. 캐포비 admin 표준 — 사업자(광고계정) + 광고/운영/관리 3섹션 + 캐시 관리 활성.",
      },
    },
  },
  render: () => <DefaultStory />,
};

/* ─── Story 2 — 290:1593: 서브메뉴 펼침 (퀴즈 관리 등록/목록/통계) ─────────── */

const WithSubMenuStory: React.FC = () => {
  const [activeKey, setActiveKey] = useState("quiz-create");

  const items: SidebarItem[] = [
    { key: "channel", label: "채널 관리", icon: <CashpobiGnbChannelIcon size={24} /> },
    { key: "message", label: "메시지 관리", icon: <CashpobiGnbChatIcon size={24} /> },
    {
      key: "quiz",
      label: "퀴즈 관리",
      icon: <CashpobiGnbQuizIcon size={24} />,
      children: [
        { key: "quiz-create", label: "퀴즈 등록하기" },
        { key: "quiz-list", label: "퀴즈 목록" },
        { key: "quiz-stat", label: "퀴즈 통계" },
      ],
    },
    { key: "setting", label: "정보 수정", icon: <CashpobiGnbSettingIcon size={24} /> },
  ];

  return (
    <PreviewFrame rightLabel="퀴즈 · 등록하기">
      <Sidebar
        items={items}
        activeKey={activeKey}
        onItemClick={(item) => setActiveKey(item.key)}
        header={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "0 5px",
              width: "100%",
            }}
          >
            <LogoMark />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: "24px",
                  fontWeight: 700,
                  color: "#383838",
                }}
              >
                business@cashwalk.io
              </p>
            </div>
          </div>
        }
        footer={
          <button
            type="button"
            style={{
              width: "100%",
              height: 56,
              borderRadius: 28,
              border: "1px solid #D8D8D8",
              background: "white",
              color: "#111",
              fontFamily: "inherit",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            로그아웃
          </button>
        }
      />
    </PreviewFrame>
  );
};

export const WithSubMenu: Story = {
  name: "Cashpobi/WithSubMenu (퀴즈 펼침)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 290:1593 미러. 퀴즈 관리 펼침 — 등록하기/목록/통계 3 서브아이템. 1단계 children 지원.",
      },
    },
  },
  render: () => <WithSubMenuStory />,
};

/* ─── Story 3 — Collapsed (icon-only) ─────────────────────────── */

const CollapsedStory: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [activeKey, setActiveKey] = useState("chat");

  const items: SidebarItem[] = [
    { key: "banner", label: "배너", icon: <CashpobiGnbBannerIcon size={24} /> },
    { key: "cash", label: "캐시", icon: <CashpobiGnbCashIcon size={24} /> },
    { key: "channel", label: "채널", icon: <CashpobiGnbChannelIcon size={24} /> },
    { key: "chat", label: "채팅", icon: <CashpobiGnbChatIcon size={24} />, badge: 12 },
    { key: "member", label: "회원", icon: <CashpobiGnbMemberIcon size={24} /> },
    { key: "quiz", label: "퀴즈", icon: <CashpobiGnbQuizIcon size={24} /> },
    { key: "setting", label: "설정", icon: <CashpobiGnbSettingIcon size={24} /> },
  ];

  return (
    <PreviewFrame rightLabel="채팅">
      <Sidebar
        logo={{ element: <LogoMark /> }}
        title="캐시워크 for Business"
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        items={items}
        activeKey={activeKey}
        onItemClick={(item) => setActiveKey(item.key)}
        user={{ name: "정민" }}
      />
    </PreviewFrame>
  );
};

export const Collapsed: Story = {
  name: "Cashpobi/Collapsed (72px · icon only)",
  parameters: {
    docs: {
      description: {
        story:
          "collapsed=true 일 때 72px 너비로 축소. 라벨/뱃지/캐럿 모두 숨기고 아이콘만 노출. 헤더 좌측 토글로 펼침.",
      },
    },
  },
  render: () => <CollapsedStory />,
};
