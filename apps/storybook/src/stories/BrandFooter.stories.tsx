import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NdsTag, BrandScope } from "./_ndsTag";

/**
 * 브랜드 완성형 푸터 — 목업 전용 html `<nds-brand-footer brand surface>`.
 * 각 브랜드는 **native footer surface 하나**만 가진다:
 *   · Web(데스크탑): nudge-eap · cashwalk-biz
 *   · App(모바일):  trost(dark) · geniet · runmile
 * 그래서 데스크탑 스토리에 app 전용 브랜드가 안 보이는 건 "미구현"이 아니라 surface 차이다.
 */
const meta: Meta = {
  title: "Brands/Footer",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const labelStyle: React.CSSProperties = {
  margin: "0 0 8px",
  padding: "0 16px",
  fontSize: 12,
  fontWeight: 700,
  color: "var(--semantic-text-subtle-default, #888)",
  fontFamily: "var(--font-family-default, sans-serif)",
  textTransform: "uppercase",
  letterSpacing: 0.4,
};

/** 브랜드별 푸터 (브랜드+native surface). 각 브랜드 색을 BrandScope 로 스코프. */
function FooterRow({ brand, surface }: { brand: string; surface: string }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={labelStyle}>
        {brand} · {surface}
      </p>
      <BrandScope brand={brand}>
        <NdsTag tag="nds-brand-footer" attrs={{ brand, surface }} />
      </BrandScope>
    </div>
  );
}

/** 데스크톱 웹 푸터가 있는 브랜드 (web 전용). */
export const Web: Story = {
  name: "Web (데스크탑) — nudge-eap · cashwalk-biz",
  render: () => (
    <div>
      <FooterRow brand="nudge-eap" surface="web" />
      <FooterRow brand="cashwalk-biz" surface="web" />
    </div>
  ),
};

/** 앱 푸터 (app 전용 — trost 는 dark). */
export const App: Story = {
  name: "App (모바일) — trost · geniet · runmile",
  render: () => (
    <div>
      <FooterRow brand="trost" surface="app" />
      <FooterRow brand="geniet" surface="app" />
      <FooterRow brand="runmile" surface="app" />
    </div>
  ),
};
