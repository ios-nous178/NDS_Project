import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "@nudge-design/icons";
import { IconCatalog } from "@nudge-design/catalog";
import iconCatalog from "../../../../metadata/iconCatalog.json";

/**
 * Foundations/Icons — 전체 아이콘 카탈로그.
 *
 * 분류·그리드·검색·복사 로직은 docs `/components/icons` 와 **단일 공유 컴포넌트**
 * (`@nudge-design/catalog` 의 `IconCatalog`)를 쓴다. 데이터(프로젝트 prefix 분류·kebab·
 * CashwalkBiz 카테고리)는 `metadata/iconCatalog.json` SSOT 에서 온다.
 * storybook 관례: 컴포넌트명 복사(copyMode="name").
 */
const meta: Meta<typeof IconCatalog> = {
  title: "Foundations/Icons",
  component: IconCatalog,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "> **Figma Iconography(379:490) 정합 완료** — 모든 아이콘은 24×24 viewBox / currentColor 규약으로 통일되어 있습니다.",
          "",
          `총 **${iconCatalog.icons.length}개** 아이콘. 클릭하면 컴포넌트 이름이 클립보드에 복사됩니다.`,
          "",
          "프로젝트별 아이콘은 prefix 로 구분됩니다 — prefix 없는 base 셋은 **NudgeEAP**, `CashwalkBiz*` / `Geniet*` / `Trost*` / `Runmile*` 는 각 프로젝트 전용, `Mockup*` (Bold/Linear) 는 mockup 전용 IconSax 셋입니다.",
          "",
          "패키지: `@nudge-design/icons` · 카테고리·사용 가이드는 [Docs · Icons](/components/icons)를 참고하세요.",
          "",
          "분류/그리드/검색/복사는 docs `/components/icons` 와 동일한 공유 컴포넌트(`@nudge-design/catalog`)를 쓰고, 데이터는 `metadata/iconCatalog.json` SSOT 입니다.",
        ].join("\n"),
      },
    },
  },
  args: {
    data: iconCatalog,
    mode: "all",
    copyMode: "name",
    iconSize: 24,
  },
};
export default meta;
type Story = StoryObj<typeof IconCatalog>;

export const All: Story = { name: "All" };

export const Size20: Story = {
  name: "Size 20",
  args: { iconSize: 20 },
};

export const OnDarkSurface: Story = {
  name: "On Dark Surface",
  args: { surface: "dark" },
};

export const UsageExamples: Story = {
  name: "Recipe/Examples",
  parameters: {
    docs: {
      description: {
        story:
          "currentColor 상속, size prop, aria 처리 같은 자주 쓰는 패턴 예시. 잘못된 사용은 빨간 배지로 표시됩니다.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 640 }}>
      <Block
        title="✓ currentColor 상속 (권장)"
        code={`<span style={{ color: "var(--nds-text-default)" }}>\n  <SearchIcon /> 검색\n</span>`}
      >
        <span
          style={{
            color: "var(--semantic-icon-brand-default)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
          }}
        >
          <Icons.SearchIcon size={20} /> 검색
        </span>
      </Block>

      <Block
        title="✓ Button 내부 — leftIcon/rightIcon"
        code={`<Button leftIcon={<SearchIcon />}>검색</Button>`}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--semantic-gap-default)",
            height: 48,
            padding: "0 var(--semantic-inset-card)",
            borderRadius: 8,
            background: "var(--semantic-bg-brand-default)",
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          <Icons.SearchIcon size={20} /> 검색
        </span>
      </Block>

      <Block
        title="✓ 아이콘만 있는 버튼 — aria-label 필수"
        code={`<button aria-label="검색"><SearchIcon /></button>`}
      >
        <button
          aria-label="검색"
          style={{
            width: 40,
            height: 40,
            border: "1px solid #D8D8D8",
            borderRadius: 8,
            background: "#fff",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#111111",
          }}
        >
          <Icons.SearchIcon size={20} />
        </button>
      </Block>

      <Block title="✗ Hex 직접 지정 — 토큰 우회" bad code={`<SearchIcon color="#111111" />`}>
        <span style={{ display: "inline-flex" }}>
          <Icons.SearchIcon size={20} color="#111111" />
        </span>
      </Block>
    </div>
  ),
};

function Block({
  title,
  code,
  bad,
  children,
}: {
  title: string;
  code: string;
  bad?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: `1px solid ${bad ? "#F4C8B8" : "#D6E4F0"}`,
        borderRadius: 8,
        padding: "var(--semantic-inset-card)",
        background: bad ? "#FFF7F4" : "#F8FBFE",
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          fontWeight: 700,
          fontSize: 13,
          color: bad ? "#B23A1A" : "#1D5BA0",
        }}
      >
        {title}
      </p>
      <div style={{ marginBottom: 12 }}>{children}</div>
      <pre
        style={{
          margin: 0,
          padding: "var(--semantic-inset-input)",
          background: "#0F1B2C",
          color: "#E6EEF8",
          borderRadius: 6,
          fontSize: 12,
          lineHeight: 1.5,
          overflowX: "auto",
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
        }}
      >
        {code}
      </pre>
    </div>
  );
}
