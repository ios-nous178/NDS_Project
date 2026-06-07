import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar, type SidebarSection } from "@nudge-design/react";
import { BRAND_LOGOS } from "@nudge-design/assets";
import {
  CashwalkBizGnbBannerIcon,
  CashwalkBizGnbCatalogIcon,
  CashwalkBizGnbChatIcon,
  CashwalkBizGnbEditIcon,
  CashwalkBizGnbQuizIcon,
} from "@nudge-design/icons";

/**
 * Brands/CashwalkBiz/Sidebar — 캐포비(캐시워크 for Business) 어드민 사이드바.
 *
 * 레퍼런스 (Figma 캐포비 Library):
 *   - 3304:617 — 전체 사이드바 구성 (계정/잔액/CTA + 광고·자산·계정 3섹션 + 로그아웃)
 *   - 3302:641 — MenuItem 변형 (1dep/2dep/3dep × default/selected)
 *
 * Figma 실측 메트릭:
 *   - 컨테이너: 300px width, white bg, px-24 py-40
 *   - 헤더 블록: 로고 → 계정 정보(14 #666 / 16 #333) → 잔액(14 #666 / 16 #333) → CTA 쌍(충전하기 검정 solid / 내역보기 outlined, rounded-8)
 *   - 섹션 라벨: 12 Bold #666 tracking 0.96 (광고 관리 / 자산 관리 / 계정 관리), 섹션 사이 1px #EEE divider
 *   - 메뉴아이템: 1dep 48px(아이콘 24 + 라벨 15) / 2dep 40px(pl-52, 라벨 14), rounded-16
 *   - 활성: bg Yellow/100 #FFFAE5 + 라벨 #333 유지 (Bold 아님), 좌측 accent stripe 없음
 *   - 색은 data-brand="cashwalk-biz" cascade 가 --semantic-* 토큰으로 자동 매핑 (컴포넌트가 hex 박지 않음)
 *
 * 세 스토리 모두 3304:617 레이아웃(계정/잔액/CTA 헤더 + 광고·자산·계정 섹션 + 로그아웃)을 공유한다:
 *   1) `Default` — 배너 등록 활성
 *   2) `WithSubMenu` — 동일 레이아웃 + 퀴즈 관리 펼침 (등록하기/목록/통계)
 *   3) `Collapsed` — 동일 레이아웃(펼친 상태로 로드) + 우상단 토글로 72px 아이콘-only 전환
 */

const meta: Meta<typeof Sidebar> = {
  title: "Brands/CashwalkBiz/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  globals: { brand: "cashwalk-biz" },
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

// 실제 캐포비 워드마크 (Figma 3304:617 logo/Cashwalk/Vertical). @nudge-design/assets 의
// base64 dataUri 사용 — 외부 호스팅 없이도 깨지지 않게. (assets 매니페스트상 vertical /
// horizontal 은 동일 lockup dataUri 로 매핑되어 있어 한 자산을 height 로 스케일해 쓴다.)
const CASHWALK_LOGO = BRAND_LOGOS["cashwalk-biz"]?.vertical?.dataUri ?? "";

const CashwalkLogo: React.FC<{ height?: number; maxWidth?: number }> = ({
  height = 40,
  maxWidth,
}) => (
  <img
    src={CASHWALK_LOGO}
    alt="캐시워크 for Business"
    style={{ height, width: "auto", maxWidth, display: "block" }}
  />
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

/* ─── 잔액 / CTA 헤더 블록 (3304:617 미러) ───────────────────────────── */

const ChargeCta: React.FC = () => (
  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
    <button
      type="button"
      style={{
        padding: "8px 16px",
        borderRadius: 8,
        border: "none",
        background: "#111111",
        color: "#FFFFFF",
        fontFamily: "inherit",
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      충전하기
    </button>
    <button
      type="button"
      style={{
        padding: "8px 16px",
        borderRadius: 8,
        border: "1px solid #111111",
        background: "#FFFFFF",
        color: "#111111",
        fontFamily: "inherit",
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      내역보기
    </button>
  </div>
);

const AccountHeader: React.FC = () => (
  <div style={{ width: "100%" }}>
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
      <CashwalkLogo height={56} />
    </div>
    <p style={{ margin: 0, fontSize: 14, color: "#666666" }}>계정 정보</p>
    <p style={{ margin: "8px 0 0", fontSize: 16, fontWeight: 500, color: "#333333" }}>
      business@cashwalk.io
    </p>
    <p style={{ margin: "24px 0 0", fontSize: 14, color: "#666666" }}>잔액</p>
    <p style={{ margin: "8px 0 0", fontSize: 16, fontWeight: 500, color: "#333333" }}>
      999,999,999,999원
    </p>
    <ChargeCta />
  </div>
);

/* ─── 공유: Figma 3304:617 섹션 + 로그아웃 푸터 (세 스토리 공통) ─────────── */

const SECTIONS: SidebarSection[] = [
  {
    key: "ad",
    label: "광고 관리",
    items: [
      {
        key: "banner",
        label: "배너",
        icon: <CashwalkBizGnbBannerIcon size={24} />,
        children: [
          { key: "banner-register", label: "배너 등록" },
          { key: "banner-list", label: "배너 목록" },
          { key: "banner-report", label: "배너 리포트" },
        ],
      },
      { key: "quiz", label: "퀴즈", icon: <CashwalkBizGnbQuizIcon size={24} /> },
      { key: "message", label: "메시지", icon: <CashwalkBizGnbChatIcon size={24} /> },
    ],
  },
  {
    key: "asset",
    label: "자산 관리",
    items: [{ key: "catalog", label: "카탈로그", icon: <CashwalkBizGnbCatalogIcon size={24} /> }],
  },
  {
    key: "account",
    label: "계정 관리",
    items: [{ key: "edit-info", label: "정보 수정", icon: <CashwalkBizGnbEditIcon size={24} /> }],
  },
];

const LogoutFooter: React.FC = () => (
  <button
    type="button"
    style={{
      width: "100%",
      height: 48,
      borderRadius: 28,
      border: "1px solid #EEEEEE",
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
);

/* ─── Story 1 — 3304:617: 광고·자산·계정 3섹션 + 배너 등록 활성 ─────────── */

const DefaultStory: React.FC = () => {
  const [activeKey, setActiveKey] = useState("banner-register");

  return (
    <PreviewFrame rightLabel="배너 · 등록">
      <Sidebar
        items={SECTIONS}
        activeKey={activeKey}
        onItemClick={(item) => setActiveKey(item.key)}
        header={<AccountHeader />}
        footer={<LogoutFooter />}
      />
    </PreviewFrame>
  );
};

export const Default: Story = {
  name: "CashwalkBiz/Default (광고 · 자산 · 계정)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 3304:617 미러. 캐포비 admin 표준 — 계정/잔액/CTA 헤더 + 광고 관리(배너▸등록/목록/리포트, 퀴즈, 메시지) / 자산 관리(카탈로그) / 계정 관리(정보 수정) + 로그아웃. 배너 등록 활성(Yellow/100).",
      },
    },
  },
  render: () => <DefaultStory />,
};

/* ─── Story 2 — 동일 Figma 레이아웃 + 퀴즈 서브메뉴 펼침 ───────────────── */

// SECTIONS 와 동일하되 퀴즈에 children(등록하기/목록/통계)을 달아 2단계 펼침을 시연.
const SECTIONS_QUIZ_EXPANDED: SidebarSection[] = [
  {
    key: "ad",
    label: "광고 관리",
    items: [
      {
        key: "banner",
        label: "배너",
        icon: <CashwalkBizGnbBannerIcon size={24} />,
        children: [
          { key: "banner-register", label: "배너 등록" },
          { key: "banner-list", label: "배너 목록" },
          { key: "banner-report", label: "배너 리포트" },
        ],
      },
      {
        key: "quiz",
        label: "퀴즈",
        icon: <CashwalkBizGnbQuizIcon size={24} />,
        children: [
          { key: "quiz-create", label: "퀴즈 등록하기" },
          { key: "quiz-list", label: "퀴즈 목록" },
          { key: "quiz-stat", label: "퀴즈 통계" },
        ],
      },
      { key: "message", label: "메시지", icon: <CashwalkBizGnbChatIcon size={24} /> },
    ],
  },
  {
    key: "asset",
    label: "자산 관리",
    items: [{ key: "catalog", label: "카탈로그", icon: <CashwalkBizGnbCatalogIcon size={24} /> }],
  },
  {
    key: "account",
    label: "계정 관리",
    items: [{ key: "edit-info", label: "정보 수정", icon: <CashwalkBizGnbEditIcon size={24} /> }],
  },
];

const WithSubMenuStory: React.FC = () => {
  const [activeKey, setActiveKey] = useState("quiz-create");

  return (
    <PreviewFrame rightLabel="퀴즈 · 등록하기">
      <Sidebar
        items={SECTIONS_QUIZ_EXPANDED}
        activeKey={activeKey}
        onItemClick={(item) => setActiveKey(item.key)}
        header={<AccountHeader />}
        footer={<LogoutFooter />}
      />
    </PreviewFrame>
  );
};

export const WithSubMenu: Story = {
  name: "CashwalkBiz/WithSubMenu (퀴즈 펼침)",
  parameters: {
    docs: {
      description: {
        story:
          "Default 와 동일한 3304:617 레이아웃(계정/잔액/CTA 헤더 + 광고·자산·계정 섹션 + 로그아웃). 퀴즈 관리에 서브메뉴(등록하기/목록/통계)를 펼쳐 2단계 children 을 시연.",
      },
    },
  },
  render: () => <WithSubMenuStory />,
};

/* ─── Story 3 — 동일 Figma 레이아웃 + collapsed(72px) 토글 ──────────────── */

const CollapseToggle: React.FC<{ collapsed: boolean; onToggle: () => void }> = ({
  collapsed,
  onToggle,
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={collapsed ? "펼치기" : "접기"}
    style={{
      width: 28,
      height: 28,
      border: "none",
      background: "transparent",
      borderRadius: 6,
      color: "#999999",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      fill="none"
      style={{ transform: collapsed ? "rotate(180deg)" : undefined }}
    >
      <path
        d="M12 5l-5 5 5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 5v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </button>
);

const CollapsedStory: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("banner-register");
  const toggle = () => setCollapsed((v) => !v);

  return (
    <PreviewFrame rightLabel="배너 · 등록">
      <Sidebar
        collapsed={collapsed}
        items={SECTIONS}
        activeKey={activeKey}
        onItemClick={(item) => setActiveKey(item.key)}
        header={
          collapsed ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                width: "100%",
              }}
            >
              <CollapseToggle collapsed onToggle={toggle} />
              <CashwalkLogo height={18} maxWidth={48} />
            </div>
          ) : (
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <CollapseToggle collapsed={false} onToggle={toggle} />
              </div>
              <AccountHeader />
            </div>
          )
        }
        footer={collapsed ? undefined : <LogoutFooter />}
      />
    </PreviewFrame>
  );
};

export const Collapsed: Story = {
  name: "CashwalkBiz/Collapsed (72px 토글)",
  parameters: {
    docs: {
      description: {
        story:
          "3304:617 레이아웃을 펼친 상태로 로드 — 헤더 우상단 토글로 72px 아이콘-only 모드로 전환. 접으면 계정/잔액/CTA·로그아웃은 숨고 메뉴 아이콘만 노출(라벨/캐럿 hidden).",
      },
    },
  },
  render: () => <CollapsedStory />,
};
