import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TrostAppBar } from "@nudge-eap/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("trost");

const meta: Meta = {
  title: "Components/Header",
  parameters: { layout: "fullscreen" },
  globals: { brand: "trost" },
};
export default meta;
type Story = StoryObj;

export const TrostMobile: Story = {
  name: "TrostAppBar/Mobile",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <TrostAppBar
        variant="mobile"
        logo={{
          src: b.logo.headerMobile.src,
          alt: "Trost",
          href: "/",
          height: b.logo.headerMobile.height,
        }}
        mobileHeight={b.header.mobileHeight}
        authItems={b.header.auth.items}
      />
    </div>
  ),
};

/**
 * 홈 화면 헤더 — 2단 (로고/포인트/벨 + 검색). **모바일 웹 / 앱 인-웹뷰 홈 공용.**
 *
 * Row1: 로고 / 포인트 chip(에너지 코인 + 잔액 + P) / 알림 bell
 * Row2: 풀-width 검색 input (placeholder 카피는 Trost 모바일 홈 실측)
 *
 * 앱 sub 페이지(상세/결과)는 `variant='webview'` 별도 사용. 단순 logo+authItems
 * 단단 헤더는 위의 TrostMobile 스토리에서 fallback 으로 확인.
 */
export const TrostMobileHome: Story = {
  name: "TrostAppBar/Mobile Home (2단, 웹+앱 공용)",
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <TrostAppBar
        variant="mobile"
        logo={{
          src: b.logo.headerMobile.src,
          alt: "Trost",
          href: "/",
          height: b.logo.headerMobile.height,
        }}
        pointChip={{
          amount: "123,990",
          href: "/point",
        }}
        showNotificationBell
        onNotificationClick={() => {
          /* noop */
        }}
        mobileSearchPlaceholder="심리검사, 상담, 마음챙김을 검색해보세요."
      />
    </div>
  ),
};

export const TrostWebview: Story = {
  name: "TrostAppBar/Webview",
  render: () => (
    <TrostAppBar
      variant="webview"
      logo={{ src: b.logo.headerMobile.src }}
      webviewTitle={b.header.webviewTitle}
      mobileHeight={b.header.mobileHeight}
    />
  ),
};
