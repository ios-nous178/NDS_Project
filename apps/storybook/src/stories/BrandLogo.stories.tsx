import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BrandLogo } from "@nudge-design/react";

const meta: Meta<typeof BrandLogo> = {
  title: "Brands/BrandLogo",
  component: BrandLogo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "브랜드 대표 로고를 컴포넌트로 박는 표준 진입점. base64 data URI 가 내장돼 단일 HTML/오프라인에서도 안 깨진다. `<nds-sidebar brand>` / `<nds-brand-header brand>` 가 주입하는 것과 동일한 로고 SSOT. raw `<img>`/SVG 직접 조립 금지 — brand chrome 이 없는 화면(예: 캐포비 어드민 온보딩 카드)에서 35KB base64 를 손으로 붙이지 않고 로고를 넣을 때 쓴다.",
      },
    },
  },
  argTypes: {
    brand: {
      control: "radio",
      options: ["trost", "geniet", "nudge-eap", "cashwalk-biz", "runmile"],
    },
    height: { control: { type: "number" } },
    href: { control: "text" },
  },
  args: { brand: "cashwalk-biz", height: 40 },
};

export default meta;
type Story = StoryObj<typeof BrandLogo>;

export const Playground: Story = { render: (args) => <BrandLogo {...args} /> };

export const AllBrands: Story = {
  name: "Variant/전 브랜드",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-wide)" }}>
      {(["trost", "geniet", "nudge-eap", "cashwalk-biz", "runmile"] as const).map((b) => (
        <BrandLogo key={b} brand={b} height={40} />
      ))}
    </div>
  ),
};

export const OnboardingCard: Story = {
  name: "Recipe/캐포비 어드민 온보딩 카드",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--semantic-bg-surface-subtle)",
      }}
    >
      <div
        style={{
          width: 480,
          padding: 48,
          background: "var(--semantic-bg-surface-default)",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        <BrandLogo brand="cashwalk-biz" height={40} />
        <div style={{ color: "var(--semantic-text-subtle)" }}>로그인 폼이 들어갈 자리</div>
      </div>
    </div>
  ),
};
