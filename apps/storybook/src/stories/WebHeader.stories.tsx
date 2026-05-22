import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { WebHeader } from "@nudge-eap/react";
import { getBrandFixture } from "../brand-fixtures";

/**
 * WebHeader 는 brand-agnostic 컴포넌트 — 토큰 (--semantic-primary-* / --semantic-text-*) 이
 * 자동으로 브랜드별 색을 적용. 로고/메뉴 콘텐츠만 props 로 주입.
 *
 * Figma: 96:25923 (80px h, 1200px max-width, GNB + 로고 + 앱다운로드/로그인).
 */
const meta: Meta = {
  title: "Components/WebHeader",
  component: WebHeader,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

function WebHeaderDemo({ brand }: { brand: "nudge-eap" | "geniet" }) {
  const b = getBrandFixture(brand);
  return (
    <WebHeader position="static">
      <WebHeader.Logo
        href="/"
        src={b.logo.headerPc.src}
        alt={brand}
        width={b.logo.headerPc.width}
        height={b.logo.headerPc.height}
      />
      <WebHeader.Menu items={b.header.gnb.items} activeKey="home" />
      <WebHeader.Actions>
        <WebHeader.AppDownloadButton href="#">앱 다운로드</WebHeader.AppDownloadButton>
        <WebHeader.AuthButton authState="login" href="#" />
      </WebHeader.Actions>
    </WebHeader>
  );
}

export const NudgeEAP: Story = {
  name: "NudgeEAP/Default",
  render: () => <WebHeaderDemo brand="nudge-eap" />,
};

/* Trost 는 2단 (EAP 배너 + utility + tabs) 컴파운드라
 * 단일-tier 인 brand-agnostic WebHeader 와 1:1 매핑되지 않습니다.
 * 트로스트 풀 구성은 WebHeader.Trost.stories.tsx (TrostWebHeader) 참조. */

export const Geniet: Story = {
  name: "Geniet/Default",
  render: () => <WebHeaderDemo brand="geniet" />,
};
