import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "@nudge-design/react";

/**
 * `<Header>` — 옛 `AppBar` + `WebHeader` 의 통합 base.
 *
 * variant:
 *   - compact     : 모바일 56px flex (옛 AppBar default)
 *   - webview     : 56px, title 절대중앙 + back left (옛 AppBar webview)
 *   - transparent : 56px, 배경 투명 (옛 AppBar transparent)
 *   - web         : 데스크탑 80px grid 3열, max-width 1200 (옛 WebHeader)
 *
 * 브랜드 색은 토큰(--semantic-*)이 자동 적용. 로고/메뉴 콘텐츠만 props 로 주입.
 */
const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Header>;

/* ─── Compact (옛 AppBar) ─── */

export const CompactMobile: Story = {
  tags: ["gallery"],
  name: "Base/Mobile",
  args: {
    variant: "compact",
    position: "static",
    leftSlot: (
      <Header.Logo
        src="https://placehold.co/120x24?text=Logo"
        alt="Logo"
        style={{ height: 24, width: "auto" }}
      />
    ),
    rightSlot: <Header.AuthMenu items={[{ key: "login", label: "로그인" }]} separator="none" />,
  },
};

export const Webview: Story = {
  name: "Base/Webview",
  args: {
    variant: "webview",
    position: "static",
    title: "페이지 타이틀",
    leftSlot: <Header.BackButton />,
  },
};

export const CompactElevated: Story = {
  name: "Base/Mobile (Elevated)",
  args: {
    variant: "compact",
    position: "static",
    elevated: true,
    leftSlot: (
      <Header.Logo
        src="https://placehold.co/120x24?text=Logo"
        alt="Logo"
        style={{ height: 24, width: "auto" }}
      />
    ),
  },
};

export const CompactTwoTier: Story = {
  name: "Base/2단 컴파운드",
  render: () => (
    <Header
      variant="compact"
      position="static"
      style={
        {
          "--nds-app-bar-height": "auto",
          "--nds-app-bar-padding-x": "0",
          "--nds-app-bar-border-bottom": "none",
          flexDirection: "column",
        } as React.CSSProperties
      }
    >
      <Header.MainBar maxWidth={1080}>
        <Header.Logo
          src="https://placehold.co/90x36?text=Logo"
          alt="Logo"
          href="/"
          width={90}
          height={36}
        />
        <Header.SearchBar placeholder="검색어를 입력하세요" />
        <Header.AuthMenu items={[{ key: "login", label: "로그인" }]} separator="none" />
      </Header.MainBar>
      <Header.Divider />
      <Header.NavBar maxWidth={1080} height={56}>
        <Header.Menu
          items={[
            { key: "home", label: "홈", href: "#" },
            { key: "feature", label: "기능", href: "#" },
            { key: "about", label: "소개", href: "#" },
          ]}
          activeKey="home"
        />
      </Header.NavBar>
      <Header.Divider />
    </Header>
  ),
};

/* ─── Web (데스크탑 80px, grid 3열: 로고 | 메뉴 | 액션) ─── */

export const Web: Story = {
  name: "Base/Web (데스크탑)",
  render: () => (
    <Header variant="web">
      <Header.Logo
        src="https://placehold.co/140x32?text=Logo"
        alt="Logo"
        href="/"
        style={{ height: 32, width: "auto" }}
      />
      <Header.Menu
        items={[
          { key: "home", label: "홈", href: "#" },
          { key: "features", label: "기능", href: "#" },
          { key: "pricing", label: "요금", href: "#" },
          { key: "blog", label: "블로그", href: "#" },
        ]}
        activeKey="home"
      />
      <Header.Actions>
        <Header.AppDownloadButton href="#">앱 다운로드</Header.AppDownloadButton>
        <Header.AuthButton authState="logout" href="#" />
      </Header.Actions>
    </Header>
  ),
};

/*
 * 브랜드 완성형 헤더(로고·메뉴·CTA 가 브랜드별로 박힌 것)는 목업 전용
 * `nds-brand-chrome`(`<nds-brand-header brand="..." surface="web">`)으로 렌더된다 —
 * 공개 react 패키지의 브랜드 chrome 컴포넌트는 제거됨. 사용 가이드는 MCP
 * `get_guide({ topic: 'component:BrandHeader' })`. 위 스토리들은 브랜드-무관 base `Header` 데모.
 */
