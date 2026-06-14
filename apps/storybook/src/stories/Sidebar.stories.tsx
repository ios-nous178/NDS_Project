import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NdsTag, BrandScope } from "./_ndsTag";

/**
 * Sidebar(어드민 LNB) — 목업 전용 html `<nds-sidebar brand>`(nds-brand-chrome 흡수).
 * 공개 react Sidebar 는 제거됨. 여닫기(collapse)·서브메뉴 토글 동작 보존.
 * 캐포비 어드민 ready-made 는 `get_guide({ topic:'pattern:cashwalk-biz-admin-sidebar' })`.
 */
const meta: Meta = {
  title: "Brands/Sidebar",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

/* 데모용 간단 inline SVG 아이콘 (실제 캐포비 GNB 아이콘은 find_icon). */
const icon = (paths: string) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">${paths}</svg>`;
const boxIcon = icon(`<rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.5"/>`);
const circleIcon = icon(`<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5"/>`);
const userIcon = icon(`<circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M5 19a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="1.5"/>`);

const ITEMS = [
  {
    key: "ad",
    label: "광고 관리",
    items: [
      {
        key: "banner",
        label: "배너",
        icon: boxIcon,
        children: [
          { key: "banner-new", label: "배너 등록" },
          { key: "banner-list", label: "배너 목록" },
          { key: "banner-report", label: "배너 리포트" },
        ],
      },
      { key: "channel", label: "채널", icon: circleIcon },
      { key: "message", label: "메시지", icon: circleIcon, badge: 3 },
    ],
  },
  {
    key: "asset",
    label: "자산 관리",
    items: [
      { key: "cash", label: "캐시 충전", icon: circleIcon },
      { key: "catalog", label: "상품 카탈로그", icon: boxIcon },
    ],
  },
  {
    key: "account",
    label: "계정 관리",
    items: [
      { key: "member", label: "회원", icon: userIcon },
      { key: "setting", label: "설정", icon: circleIcon },
    ],
  },
];

const ACCOUNT = {
  email: "biz@cashwalk.io",
  balanceLabel: "충전 잔액",
  balance: "₩1,250,000",
  actions: [
    { label: "충전하기", variant: "solid", key: "charge" },
    { label: "내역보기", variant: "outlined", key: "history" },
  ],
};

const FOOTER_ACTIONS = [{ label: "로그아웃", variant: "outlined", key: "logout" }];

/** 여닫기(collapse) 상태를 들고 toggle-collapse 이벤트로 갱신하는 데모. */
function SidebarDemo() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <BrandScope brand="cashwalk-biz">
        <NdsTag
          tag="nds-sidebar"
          attrs={{
            brand: "cashwalk-biz",
            "active-key": "banner-list",
            "show-toggle": true,
            collapsed,
            width: 300,
          }}
          jsonSlots={[
            { slot: "items", data: ITEMS },
            { slot: "account", data: ACCOUNT },
            { slot: "footer-actions", data: FOOTER_ACTIONS },
          ]}
          listeners={{ "toggle-collapse": () => setCollapsed((c) => !c) }}
        />
      </BrandScope>
      <main style={{ flex: 1, padding: 24, color: "var(--semantic-text-subtle-default, #888)" }}>
        헤더의 토글 버튼으로 여닫기(collapse), '배너' 항목 클릭으로 서브메뉴 펼치기.
      </main>
    </div>
  );
}

export const CashwalkBizAdmin: Story = {
  name: "캐포비 어드민 (여닫기)",
  render: () => <SidebarDemo />,
};
