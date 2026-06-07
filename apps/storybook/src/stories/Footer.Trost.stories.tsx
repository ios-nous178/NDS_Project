import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TrostFooter } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("trost");

const meta: Meta = {
  title: "Brands/Trost/Footer",
  parameters: { layout: "fullscreen" },
  globals: { brand: "trost" },
};
export default meta;
type Story = StoryObj;

/* ─── 데스크톱 웹 푸터 (surface='web' · 다크 푸터) ─── */

export const TrostWeb: Story = {
  name: "Trost/Desktop",
  parameters: {
    docs: {
      description: {
        story:
          "Trost 데스크톱 다크 푸터. SNS / 앱 다운로드 / 회사 정보 / 약관 링크 슬롯을 prop 으로 받습니다. width >= 1024 에서만 노출됩니다.",
      },
    },
  },
  render: () => <TrostFooter surface="web" />,
};

/* ─── 앱 푸터 (surface='app') — 데스크톱 / 모바일 레이아웃 ─── */

export const TrostAppDesktop: Story = {
  name: "Trost/Desktop (앱 레이아웃)",
  render: () => (
    <TrostFooter
      surface="app"
      layout="desktop"
      links={b.footer.links}
      company={b.footer.company}
      extra={b.footer.extra}
      logo={{
        src: b.logo.footer.src,
        width: b.logo.footer.width,
        height: b.logo.footer.height,
      }}
    />
  ),
};

export const TrostAppMobile: Story = {
  name: "Trost/Mobile",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <TrostFooter
        surface="app"
        layout="mobile"
        links={b.footer.links}
        company={b.footer.company}
        extra={b.footer.extra}
      />
    </div>
  ),
};
