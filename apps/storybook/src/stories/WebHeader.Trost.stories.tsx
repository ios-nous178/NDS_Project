import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  TrostWebHeader,
  TrostEAPBanner,
  TrostUtilityHeader,
  TrostSearchForm,
  TrostLoginSection,
  TrostAppDownloadButton,
  TrostTabNavigation,
} from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

import trostLogo from "../../public/brand-logos/trost-logo.svg";
import nudgeEapSymbol from "../../public/brand-logos/nudge-eap/nudge-eap-symbol.png";

/**
 * Trost 데스크톱 웹 헤더 — `TrostWebHeader` (TrostDesktopHeader alias).
 *
 * Zeplin zpl.io/Dp775xl 정합:
 *   • Rectangle 2613 → TrostEAPBanner (상단 50px 띠, "기업 전용 멘탈케어" + "넛지EAP 이용해 보기" CTA)
 *   • Path           → TrostUtilityHeader 의 로고 슬롯 (Trost. 워드마크)
 *   • Rectangle 2522 → TrostSearchForm 의 input 배경 (yellow border, radius 9999)
 *   • TabNavigation  → 홈/커뮤니티/오늘의 명언·성경/전문 심리상담/심리검사/약물치료
 *
 * 레퍼런스 스크린샷: packages/mcp/references/trost-web-home.png
 *   (MCP 외부 노출 — get_guide({ topic: 'component:TrostWebHeader' }).references)
 */
const meta: Meta = {
  title: "Components/Header",
  component: TrostWebHeader,
  parameters: { layout: "fullscreen" },
  globals: { brand: "trost" },
};
export default meta;
type Story = StoryObj;

const trostFx = getBrandFixture("trost");

const TROST_TABS = [
  { tabName: "홈", tabUrl: "/" },
  { tabName: "커뮤니티", tabUrl: "/community", isNew: true },
  { tabName: "오늘의 명언/성경", tabUrl: "/quotes" },
  { tabName: "전문 심리상담", tabUrl: "/counsel" },
  { tabName: "심리검사", tabUrl: "/test" },
  { tabName: "약물치료", tabUrl: "/medicine" },
];

export const TrostWebHeaderDesktop: Story = {
  name: "TrostWebHeader/Desktop (Zeplin Dp775xl)",
  parameters: {
    docs: {
      description: {
        story:
          "Trost 웹 데스크톱 홈 헤더. 상단 EAP 배너(Rectangle 2613) + 유틸리티 헤더(로고 Path · 검색바 Rectangle 2522 · 로그인 · 앱 다운로드) + 탭 네비게이션 3단 컴파운드. width >= 1024 에서만 노출.",
      },
    },
  },
  render: () => (
    <TrostWebHeader
      banner={<TrostEAPBanner eapLogoSrc={nudgeEapSymbol} />}
      utility={
        <TrostUtilityHeader
          logoHref="/"
          logoSrc={trostLogo}
          searchSlot={
            <TrostSearchForm
              placeholder={trostFx.header.searchBar?.placeholder}
              onSearch={(keyword) => console.log("[trost search]", keyword)}
              width={trostFx.header.searchBar?.width}
            />
          }
          loginSlot={
            <TrostLoginSection
              user={null}
              onLoginClick={() => console.log("[trost login]")}
              onPartnerSignupClick={() => console.log("[trost partner signup]")}
              logoutHref="/logout"
            />
          }
          appDownloadSlot={<TrostAppDownloadButton />}
        />
      }
      tabs={<TrostTabNavigation tabs={TROST_TABS} currentPath="/" />}
    />
  ),
};

export const TrostWebHeaderLoggedIn: Story = {
  name: "TrostWebHeader/Desktop — Logged in",
  render: () => (
    <TrostWebHeader
      banner={<TrostEAPBanner eapLogoSrc={nudgeEapSymbol} />}
      utility={
        <TrostUtilityHeader
          logoHref="/"
          logoSrc={trostLogo}
          searchSlot={
            <TrostSearchForm
              placeholder={trostFx.header.searchBar?.placeholder}
              onSearch={(keyword) => console.log("[trost search]", keyword)}
              width={trostFx.header.searchBar?.width}
            />
          }
          loginSlot={
            <TrostLoginSection
              user={{ name: "정민" }}
              onLoginClick={() => undefined}
              onPartnerSignupClick={() => undefined}
              logoutHref="/logout"
            />
          }
          appDownloadSlot={<TrostAppDownloadButton />}
        />
      }
      tabs={<TrostTabNavigation tabs={TROST_TABS} currentPath="/community" />}
    />
  ),
};
