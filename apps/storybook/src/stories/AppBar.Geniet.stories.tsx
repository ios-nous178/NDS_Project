import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GenietAppBar } from "@nudge-eap/react";
import type { GenietAppBarAction, GenietAppBarCta } from "@nudge-eap/react";
import {
  GenietCouponIcon,
  GenietMypageIcon,
  GenietLoginIcon,
  GenietCashreviewIcon,
  GenietConfettiIcon,
} from "@nudge-eap/icons";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("geniet");

/* ─── login_area action button 매핑 (auth.items key → icon) ─── */
const ACTION_ICONS: Record<string, GenietAppBarAction["icon"]> = {
  coupon: <GenietCouponIcon size={28} />,
  mypage: <GenietMypageIcon size={28} />,
  login: <GenietLoginIcon size={28} />,
};

const actionButtons: GenietAppBarAction[] = b.header.auth.items.map((item, i) => ({
  key: item.key,
  label: item.label,
  icon: ACTION_ICONS[item.key],
  /* 쿠폰상점 ↔ 마이페이지 사이에 divider — 그룹 시각 구분 */
  dividerBefore: i === 1,
  href: "#",
}));

const ctaButtons: GenietAppBarCta[] = [
  {
    key: "cashreview",
    label: "캐시리뷰",
    icon: <GenietCashreviewIcon size={14} />,
    tone: "outline",
    href: "#",
  },
  {
    key: "invite",
    label: "친구초대 이벤트",
    icon: <GenietConfettiIcon size={14} />,
    tone: "tinted",
    href: "#",
  },
];

const meta: Meta = {
  title: "Components/AppBar",
  parameters: { layout: "fullscreen" },
  globals: { brand: "geniet" },
};
export default meta;
type Story = StoryObj;

export const GenietDesktop: Story = {
  name: "Geniet/Desktop (Figma 77:2 — Search/Menu 2단)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 77:2 — 1920 × 172. Search Header(54h, logo + 검색 pill + NEW chip + 쿠폰상점·마이페이지·로그인 액션) + Menu Header(58h, 음식 카테고리 + GNB + 캐시리뷰/친구초대 CTA).",
      },
    },
  },
  render: () => (
    <GenietAppBar
      variant="desktop"
      logo={{
        src: b.logo.headerPc.src,
        alt: "Geniet",
        href: "/",
        width: b.logo.headerPc.width,
        height: b.logo.headerPc.height,
      }}
      pcMaxWidth={b.header.pcMaxWidth}
      gnbItems={b.header.gnb.items}
      activeKey="home"
      actionButtons={actionButtons}
      searchPlaceholder={b.header.searchBar?.placeholder}
      searchWidth={b.header.searchBar?.width}
      trendingKeywords={b.header.trending}
      ctaButtons={ctaButtons}
    />
  ),
};

export const GenietMobile: Story = {
  name: "Geniet/Mobile (Figma 77:2 — Row1+Row2 102h)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 77:2 (header/mo · 360 × 102). Row1(50h) logo + 포인트 chip + user icon · Row2(52h) hamburger + 검색 input. mobile 카피는 PC와 다름.",
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <GenietAppBar
        variant="mobile"
        logo={{
          src: b.logo.headerMobile.src,
          alt: "Geniet",
          href: "/",
          height: b.logo.headerMobile.height,
        }}
        mobileHeight={b.header.mobileHeight}
        mobileSearchPlaceholder="음식명, 칼로리, 영양성분, 음식 리뷰 검색"
        pointChip={{ amount: "34,300", href: "#" }}
      />
    </div>
  ),
};

export const GenietWebview: Story = {
  name: "Geniet/Webview",
  render: () => (
    <GenietAppBar
      variant="webview"
      webviewTitle={b.header.webviewTitle}
      mobileHeight={b.header.mobileHeight}
    />
  ),
};
