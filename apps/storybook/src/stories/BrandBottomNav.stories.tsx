import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NdsTag, BrandScope } from "./_ndsTag";

/**
 * 브랜드 완성형 모바일 하단 탭 — 목업 전용 html `<nds-brand-bottom-nav brand active-key>`.
 * 5탭(라벨/아이콘/색)이 BRAND_DATA 에서 자동 렌더. cashwalk-biz 는 웹 전용이라 bottom-nav 없음.
 */
const meta: Meta = {
  title: "Brands/BottomNav",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const BRANDS = ["nudge-eap", "trost", "geniet", "runmile"] as const;

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

export const All: Story = {
  name: "모바일 5탭 (4브랜드)",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
      {BRANDS.map((brand) => (
        <div key={brand}>
          <p style={labelStyle}>{brand}</p>
          <div
            style={{
              width: 360,
              border: "1px solid var(--semantic-border-subtle-default, #eee)",
              borderRadius: 12,
              overflow: "hidden",
              height: 72,
              // bottom-nav 내부 tab-bar 는 position:fixed — transform 으로 이 프레임을
              // 고정요소의 containing block 으로 만들어 미리보기 안에 가둔다.
              transform: "translateZ(0)",
              position: "relative",
            }}
          >
            <BrandScope brand={brand}>
              <NdsTag tag="nds-brand-bottom-nav" attrs={{ brand, "active-key": "home" }} />
            </BrandScope>
          </div>
        </div>
      ))}
    </div>
  ),
};
