import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Tabs, type TabsProps } from "@nudge-design/react";
import { colors } from "@nudge-design/tokens";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<TabsProps> = {
  title: "Components/Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Tabs"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["line", "chip"],
    },
    size: {
      control: "radio",
      options: ["mobile", "pc"],
    },
    tone: {
      control: "radio",
      options: ["neutral", "color"],
    },
    fullWidth: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<TabsProps>;

const mobileFrame: React.CSSProperties = { width: 390 };
const pcFrame: React.CSSProperties = { width: 720 };
const panelStyle: React.CSSProperties = { padding: "var(--semantic-inset-card-large)" };

/* ────────────────────────────────────────────
 * Showcase wrapper
 * ──────────────────────────────────────────── */

function ShowcaseSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-loose)",
        padding: "var(--semantic-inset-modal) 0",
        borderTop: `1px solid ${colors.neutral[100]}`,
      }}
    >
      <header>
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{title}</h3>
        {description && (
          <p style={{ fontSize: 14, color: colors.neutral[700], margin: "4px 0 0" }}>
            {description}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}

function PlatformLabel({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        color: colors.neutral[700],
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: colors.neutral[900],
        }}
      />
      {text}
    </div>
  );
}

/* ════════════════════════════════════════════
 * Default story — 컨트롤로 조작 가능
 * ════════════════════════════════════════════ */

const sampleItems = [
  { key: "all", title: "전체", content: <div style={panelStyle}>전체 콘텐츠</div> },
  { key: "counsel", title: "상담", content: <div style={panelStyle}>상담 콘텐츠</div> },
  { key: "challenge", title: "챌린지", content: <div style={panelStyle}>챌린지 콘텐츠</div> },
];

function PlaygroundDemo({ variant, size, tone }: Pick<TabsProps, "variant" | "size" | "tone">) {
  const [activeKey, setActiveKey] = useState("all");
  const frame = size === "mobile" ? mobileFrame : pcFrame;
  return (
    <div style={frame}>
      <Tabs
        items={sampleItems}
        activeKey={activeKey}
        onTabChange={setActiveKey}
        variant={variant}
        size={size}
        tone={tone}
      />
    </div>
  );
}

export const Playground: Story = {
  args: {
    variant: "line",
    size: "pc",
    tone: "neutral",
  },
  render: (args) => <PlaygroundDemo variant={args.variant} size={args.size} tone={args.tone} />,
};

/* ════════════════════════════════════════════
 * Overview — 3가지 유형 한눈에 보기
 * ════════════════════════════════════════════ */

function OverviewCard({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: "var(--semantic-inset-card-large)",
        background: colors.neutral[50],
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-default)",
      }}
    >
      <span
        style={{
          alignSelf: "flex-start",
          padding: "3px var(--semantic-inset-chip)",
          background: colors.neutral["00"],
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          color: colors.neutral[700],
        }}
      >
        {badge}
      </span>
      <h4 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h4>
      <p style={{ fontSize: 13, color: colors.neutral[700], margin: 0, lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}

export const Overview: Story = {
  name: "Recipe/Overview",
  parameters: { layout: "padded" },
  render: () => (
    <div
      style={{ display: "flex", gap: "var(--semantic-gap-loose)", width: "100%", maxWidth: 1200 }}
    >
      <OverviewCard
        badge="Mobile"
        title="Line Type"
        description="App · Web · Mobile 하단 밑줄(언더라인)로 활성 탭을 표시. Neutral과 Color 두 가지 스타일 지원."
      />
      <OverviewCard
        badge="Mobile / PC"
        title="Chip Type"
        description="App · Web · Mobile & PC 알약(Pill) 형태의 필터 탭. 콘텐츠 카테고리 분류에 주로 사용."
      />
    </div>
  ),
};

/* ════════════════════════════════════════════
 * Line Type
 * ════════════════════════════════════════════ */

function LineDemo({ size, tone }: { size: "mobile" | "pc"; tone: "neutral" | "color" }) {
  const items =
    tone === "color"
      ? [
          { key: "work", title: "직장" },
          { key: "love", title: "연애" },
          { key: "family", title: "가족" },
          { key: "relation", title: "대인관계" },
          { key: "anxiety", title: "불안장애" },
        ]
      : [
          { key: "intro", title: "전문가 소개" },
          { key: "interview", title: "전문가 인터뷰" },
          { key: "review", title: "리뷰" },
          { key: "faq", title: "자주 묻는 질문" },
        ];
  const [active, setActive] = useState(items[0].key);
  return (
    <div style={size === "mobile" ? mobileFrame : pcFrame}>
      <Tabs
        items={items}
        activeKey={active}
        onTabChange={setActive}
        variant="line"
        size={size}
        tone={tone}
      />
      <p style={{ marginTop: 8, fontSize: 12, color: colors.neutral[500] }}>
        높이 {size === "mobile" ? "50px · Padding 14·16px" : "56px · Padding 16·20px"} · Body3
      </p>
    </div>
  );
}

export const LineNeutral: Story = {
  name: "Variant/Line · Neutral (Mobile + PC)",
  parameters: { layout: "padded" },
  render: () => (
    <ShowcaseSection
      title="Line · Neutral"
      description="콘텐츠 영역의 탭 전환에 사용하며 하단 밑줄로 현재 선택 상태를 표시합니다. 활성 탭은 진한 텍스트로 강조됩니다."
    >
      <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
        <PlatformLabel text="Mobile" />
        <LineDemo size="mobile" tone="neutral" />
      </div>
      <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
        <PlatformLabel text="PC" />
        <LineDemo size="pc" tone="neutral" />
      </div>
    </ShowcaseSection>
  ),
};

export const LineColor: Story = {
  name: "Variant/Line · Color (Brand)",
  parameters: { layout: "padded" },
  render: () => (
    <ShowcaseSection
      title="Line · Color (Brand)"
      description="브랜드 컬러로 활성 탭을 강조하는 변형. 카테고리 분류에 주로 사용합니다."
    >
      <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
        <PlatformLabel text="Mobile" />
        <LineDemo size="mobile" tone="color" />
      </div>
      <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
        <PlatformLabel text="PC" />
        <LineDemo size="pc" tone="color" />
      </div>
    </ShowcaseSection>
  ),
};

/* ════════════════════════════════════════════
 * Chip Type
 * ════════════════════════════════════════════ */

function ChipDemo({ size, tone }: { size: "mobile" | "pc"; tone: "neutral" | "color" }) {
  const mobileItems = [
    { key: "all", title: "전체" },
    { key: "work", title: "직장" },
    { key: "love", title: "연애" },
    { key: "family", title: "가족" },
    { key: "anxiety", title: "불안장애" },
    { key: "relation", title: "대인관계" },
  ];
  const pcItems = [
    { key: "all", title: "인간관계" },
    { key: "work", title: "직장" },
    { key: "love", title: "연애" },
    { key: "family", title: "가족" },
    { key: "anxiety", title: "불안ㆍ스트레스" },
    { key: "trauma", title: "트라우마" },
  ];
  const items = size === "mobile" ? mobileItems : pcItems;
  const [active, setActive] = useState(items[0].key);
  return (
    <div style={size === "mobile" ? mobileFrame : pcFrame}>
      <Tabs
        items={items}
        activeKey={active}
        onTabChange={setActive}
        variant="chip"
        size={size}
        tone={tone}
        fullWidth={false}
      />
      <p style={{ marginTop: 8, fontSize: 12, color: colors.neutral[500] }}>
        {size === "mobile"
          ? "높이 36px · Padding 7·12px · Caption1 · Radius/Full"
          : "높이 44px · Padding 10·16px · Body3 · Radius/Full"}
      </p>
    </div>
  );
}

export const ChipNeutral: Story = {
  name: "Variant/Chip · Neutral",
  parameters: { layout: "padded" },
  render: () => (
    <ShowcaseSection
      title="Chip · Neutral"
      description="알약(Pill) 형태의 필터 탭. Neutral 톤은 다크 톤(슬레이트 배경)으로 활성 상태를 표시합니다."
    >
      <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
        <PlatformLabel text="Mobile" />
        <ChipDemo size="mobile" tone="neutral" />
      </div>
      <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
        <PlatformLabel text="PC" />
        <ChipDemo size="pc" tone="neutral" />
      </div>
    </ShowcaseSection>
  ),
};

export const ChipColor: Story = {
  name: "Variant/Chip · Color (Brand)",
  parameters: { layout: "padded" },
  render: () => (
    <ShowcaseSection
      title="Chip · Color (Brand)"
      description="브랜드 컬러로 활성 칩을 강조하는 변형. 카테고리 분류에 주로 사용합니다."
    >
      <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
        <PlatformLabel text="Mobile" />
        <ChipDemo size="mobile" tone="color" />
      </div>
      <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
        <PlatformLabel text="PC" />
        <ChipDemo size="pc" tone="color" />
      </div>
    </ShowcaseSection>
  ),
};

/* ════════════════════════════════════════════
 * Segmented Control
 * ════════════════════════════════════════════ */

function SegmentedDemo({ size }: { size: "mobile" | "pc" }) {
  const [value, setValue] = useState("all");
  return (
    <div style={{ width: size === "pc" ? 520 : 280 }}>
      <Tabs
        variant="segment"
        size={size}
        activeKey={value}
        onTabChange={setValue}
        items={[
          { key: "all", title: "전체" },
          { key: "risk", title: "고위험군" },
          { key: "counsel", title: "상담" },
        ]}
      />
    </div>
  );
}

export const Segmented: Story = {
  name: "Variant/Segment",
  parameters: { layout: "padded" },
  render: () => (
    <ShowcaseSection
      title="Segment"
      description="연결된 회색 트랙 위 균등 분할 단일선택(뷰/기간/상태 토글). 구 SegmentedControl 을 흡수한 variant='segment' — 콘텐츠 패널 전환이 아니라 값 토글에 사용합니다."
    >
      <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
          <PlatformLabel text="Mobile (36px)" />
          <SegmentedDemo size="mobile" />
        </div>
        <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
          <PlatformLabel text="PC (40px)" />
          <SegmentedDemo size="pc" />
        </div>
      </div>
    </ShowcaseSection>
  ),
};

/* ════════════════════════════════════════════
 * States — Default / Active / Hover / Disabled
 * ════════════════════════════════════════════ */

function StateDemoFrame({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: "var(--semantic-inset-card)",
        background: colors.neutral["00"],
        border: `1px solid ${colors.neutral[100]}`,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-comfortable)",
      }}
    >
      <div style={{ minHeight: 48 }}>{children}</div>
      <div>
        <strong style={{ fontSize: 14 }}>{title}</strong>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: colors.neutral[700] }}>{description}</p>
      </div>
    </div>
  );
}

function MiniLineTab({ state }: { state: "default" | "active" | "hover" | "disabled" }) {
  const items =
    state === "disabled"
      ? [
          { key: "a", title: "탭 항목", disabled: true },
          { key: "b", title: "탭 항목" },
        ]
      : [
          { key: "a", title: "탭 항목" },
          { key: "b", title: "탭 항목" },
        ];
  return (
    <div style={{ width: 200 }} data-state={state}>
      <Tabs
        items={items}
        activeKey={state === "active" || state === "hover" ? "a" : "b"}
        onTabChange={() => undefined}
        variant="line"
        size="pc"
        tone="neutral"
      />
    </div>
  );
}

export const States: Story = {
  name: "Recipe/States",
  parameters: { layout: "padded" },
  render: () => (
    <ShowcaseSection
      title="States"
      description="각 탭 타입의 상태(State)별 시각적 처리 방식입니다. Line/Chip은 네 가지 상태(Default/Active/Hover/Disabled)를 지원합니다."
    >
      <div style={{ display: "flex", gap: "var(--semantic-gap-loose)", flexWrap: "wrap" }}>
        <StateDemoFrame
          title="Default"
          description="선택되지 않은 기본 상태. 텍스트 Muted, 하단 얇은 구분선."
        >
          <MiniLineTab state="default" />
        </StateDemoFrame>
        <StateDemoFrame
          title="Active / Selected"
          description="현재 선택된 탭. 텍스트 강조, 하단 3px 인디케이터."
        >
          <MiniLineTab state="active" />
        </StateDemoFrame>
        <StateDemoFrame title="Hover" description="마우스 오버 상태(PC). 배경 Subtle 처리.">
          <MiniLineTab state="hover" />
        </StateDemoFrame>
        <StateDemoFrame title="Disabled" description="비활성화 상태. 텍스트 연하게, 인터랙션 불가.">
          <MiniLineTab state="disabled" />
        </StateDemoFrame>
      </div>
    </ShowcaseSection>
  ),
};

/* ════════════════════════════════════════════
 * Size & Specs Table
 * ════════════════════════════════════════════ */

function SpecTable({
  rows,
}: {
  rows: { type: string; height: string; padding: string; radius: string; font: string }[];
}) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 13,
        background: colors.neutral["00"],
        border: `1px solid ${colors.neutral[100]}`,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <thead>
        <tr style={{ background: colors.neutral[50] }}>
          {["유형", "높이", "Padding H·V", "Radius", "Font"].map((h) => (
            <th
              key={h}
              style={{
                padding: "10px var(--semantic-inset-input)",
                textAlign: "left",
                fontWeight: 600,
                fontSize: 12,
                color: colors.neutral[700],
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.type} style={{ borderTop: `1px solid ${colors.neutral[100]}` }}>
            <td style={{ padding: "10px 12px" }}>{row.type}</td>
            <td style={{ padding: "10px 12px" }}>{row.height}</td>
            <td style={{ padding: "10px 12px" }}>{row.padding}</td>
            <td style={{ padding: "10px 12px" }}>{row.radius}</td>
            <td style={{ padding: "10px 12px" }}>{row.font}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const SizeSpecs: Story = {
  name: "Recipe/Size & Specs",
  parameters: { layout: "padded" },
  render: () => (
    <ShowcaseSection
      title="Size & Specs"
      description="플랫폼(Mobile / PC)에 따라 탭의 높이, Padding, 폰트 크기가 다르게 적용됩니다."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--semantic-gap-loose)",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-default)" }}
        >
          <PlatformLabel text="Mobile" />
          <SpecTable
            rows={[
              {
                type: "Line / Neutral",
                height: "50px",
                padding: "16·14px",
                radius: "—",
                font: "Body3 Regular/Bold",
              },
              {
                type: "Line / Color",
                height: "50px",
                padding: "16·14px",
                radius: "—",
                font: "Body3 Regular/Bold",
              },
              {
                type: "Chip",
                height: "36px",
                padding: "7·var(--semantic-inset-input)",
                radius: "Radius/Full",
                font: "Caption1 Regular/Bold",
              },
            ]}
          />
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-default)" }}
        >
          <PlatformLabel text="PC" />
          <SpecTable
            rows={[
              {
                type: "Line / Neutral",
                height: "56px",
                padding: "20·var(--semantic-inset-card)",
                radius: "—",
                font: "Body3 Regular/Bold",
              },
              {
                type: "Chip",
                height: "44px",
                padding: "10·var(--semantic-inset-card)",
                radius: "Radius/Full",
                font: "Body3 Regular/Bold",
              },
            ]}
          />
        </div>
      </div>
    </ShowcaseSection>
  ),
};

/* ════════════════════════════════════════════
 * DO / Don't
 * ════════════════════════════════════════════ */

function GuideCard({
  variant,
  title,
  items,
}: {
  variant: "do" | "dont";
  title: string;
  items: string[];
}) {
  const isDo = variant === "do";
  return (
    <div
      style={{
        flex: 1,
        padding: "var(--semantic-inset-card-large)",
        borderRadius: 12,
        background: isDo ? "#EAF8F0" : "#FCEEEE",
        border: `1px solid ${isDo ? "#9BD9B3" : "#F0B1B1"}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--semantic-gap-default)",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: isDo ? "#1F9D55" : "#D44848",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {isDo ? "✓" : "✕"}
        </span>
        <strong style={{ fontSize: 14 }}>{title}</strong>
      </div>
      <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item) => (
          <li key={item} style={{ fontSize: 13, color: colors.neutral[800], lineHeight: 1.6 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const DoDont: Story = {
  name: "Recipe/DO & Don't",
  parameters: { layout: "padded" },
  render: () => (
    <ShowcaseSection title="DO / Don't" description="Tabs 컴포넌트 사용 시 권장/지양 케이스입니다.">
      <div style={{ display: "flex", gap: "var(--semantic-gap-loose)" }}>
        <GuideCard
          variant="do"
          title="DO"
          items={[
            "같은 계층의 콘텐츠 전환에만 사용하세요",
            "플랫폼에 맞는 탭 유형을 선택하세요 (Line=밑줄·콘텐츠 전환, Chip=알약·카테고리 필터, Segment=연결 트랙·값 토글).",
            "Chip 탭은 콘텐츠 필터링·카테고리 분류에 사용하세요",
            "탭 레이블은 간결한 명사/동사구로 작성하세요",
          ]}
        />
        <GuideCard
          variant="dont"
          title="Don't"
          items={[
            "서로 다른 계층의 페이지 이동에 탭을 사용하지 마세요",
            "세그먼트형 단일 선택(값 토글)에는 variant='segment' 를, 콘텐츠 패널 전환에는 line/chip 을 사용하세요",
            "탭 유형을 한 화면에서 혼용하지 마세요",
            "탭 레이블에 긴 문장을 넣지 마세요 (2줄 이상 금지)",
          ]}
        />
      </div>
    </ShowcaseSection>
  ),
};

/* ════════════════════════════════════════════
 * Recipe: Compound API
 * ════════════════════════════════════════════ */

function CompoundAPIDemo() {
  const [activeKey, setActiveKey] = useState("address");

  return (
    <div style={mobileFrame}>
      <Tabs.Root
        activeKey={activeKey}
        onTabChange={setActiveKey}
        variant="line"
        size="mobile"
        tone="neutral"
      >
        <Tabs.List>
          <Tabs.Trigger tabKey="address">주소 검색</Tabs.Trigger>
          <Tabs.Trigger tabKey="center">센터 검색</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel tabKey="address">
          <div style={{ ...panelStyle, color: colors.neutral[700] }}>
            주소로 가까운 상담 센터를 찾아보세요.
          </div>
        </Tabs.Panel>
        <Tabs.Panel tabKey="center">
          <div style={{ ...panelStyle, color: colors.neutral[700] }}>
            센터 이름으로 검색할 수 있습니다.
          </div>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}

export const CompoundAPIExample: Story = {
  name: "Recipe/Compound API",
  render: () => <CompoundAPIDemo />,
};

/* ════════════════════════════════════════════
 * QA stories
 * ════════════════════════════════════════════ */

function FlatVsCompoundParityDemo() {
  const [flatActiveKey, setFlatActiveKey] = useState("all");
  const [compoundActiveKey, setCompoundActiveKey] = useState("all");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 360px))",
        gap: "var(--semantic-gap-wide)",
        alignItems: "start",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-comfortable)" }}
      >
        <strong>Flat API</strong>
        <Tabs
          items={sampleItems}
          activeKey={flatActiveKey}
          onTabChange={setFlatActiveKey}
          variant="line"
          size="mobile"
        />
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-comfortable)" }}
      >
        <strong>Compound API</strong>
        <Tabs.Root
          activeKey={compoundActiveKey}
          onTabChange={setCompoundActiveKey}
          variant="line"
          size="mobile"
        >
          <Tabs.List>
            <Tabs.Trigger tabKey="all">전체</Tabs.Trigger>
            <Tabs.Trigger tabKey="counsel">상담</Tabs.Trigger>
            <Tabs.Trigger tabKey="challenge">챌린지</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panel tabKey="all">
            <div style={panelStyle}>전체 콘텐츠</div>
          </Tabs.Panel>
          <Tabs.Panel tabKey="counsel">
            <div style={panelStyle}>상담 콘텐츠</div>
          </Tabs.Panel>
          <Tabs.Panel tabKey="challenge">
            <div style={panelStyle}>챌린지 콘텐츠</div>
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </div>
  );
}

export const FlatVsCompoundParity: Story = {
  name: "Interaction/Flat Vs Compound Parity",
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: () => <FlatVsCompoundParityDemo />,
};

function ManyChipsDemo() {
  const items = [
    { key: "all", title: "전체" },
    { key: "mental", title: "심리상담" },
    { key: "legal", title: "법률상담" },
    { key: "finance", title: "재무상담" },
    { key: "health", title: "건강상담" },
    { key: "family", title: "가족상담" },
    { key: "career", title: "경력상담" },
    { key: "stress", title: "스트레스" },
  ];
  const [activeKey, setActiveKey] = useState("all");
  return (
    <div style={mobileFrame}>
      <Tabs
        items={items}
        activeKey={activeKey}
        onTabChange={setActiveKey}
        variant="chip"
        size="mobile"
        fullWidth={false}
      />
    </div>
  );
}

export const ScrollableChips: Story = {
  name: "Interaction/Scrollable Chip Tabs",
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: () => <ManyChipsDemo />,
};

function KeyboardNavigationReviewDemo() {
  const [activeKey, setActiveKey] = useState("all");

  return (
    <div
      style={{
        ...mobileFrame,
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-comfortable)",
      }}
    >
      <p style={{ margin: 0, color: colors.neutral[700], fontSize: 14, lineHeight: "20px" }}>
        Tab으로 활성 탭에 포커스한 뒤 Enter 또는 Space로 전환을 확인합니다. 좌우 화살표 이동과 aria
        연결은 컴포넌트 테스트로 보강이 필요한 항목입니다.
      </p>
      <Tabs
        items={sampleItems}
        activeKey={activeKey}
        onTabChange={setActiveKey}
        variant="line"
        size="mobile"
      />
    </div>
  );
}

export const KeyboardNavigationReview: Story = {
  name: "Interaction/Keyboard Navigation Review",
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: () => <KeyboardNavigationReviewDemo />,
};

/* ─── Interaction Tests ─── */

export const TabSwitchInteraction: Story = {
  name: "Interaction/Tab Switch",
  render: () => <PlaygroundDemo variant="line" size="mobile" tone="neutral" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await expect(canvas.getByText("전체 콘텐츠")).toBeInTheDocument();

    const counselTab = canvas.getByRole("tab", { name: "상담" });
    await user.click(counselTab);
    await expect(canvas.getByText("상담 콘텐츠")).toBeInTheDocument();

    const challengeTab = canvas.getByRole("tab", { name: "챌린지" });
    await user.click(challengeTab);
    await expect(canvas.getByText("챌린지 콘텐츠")).toBeInTheDocument();
  },
};

export const TabKeyboardInteraction: Story = {
  name: "Interaction/Tab Keyboard Navigation",
  render: () => <PlaygroundDemo variant="line" size="mobile" tone="neutral" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const firstTab = canvas.getByRole("tab", { name: "전체" });
    await user.click(firstTab);
    await expect(firstTab).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "상담" })).toHaveFocus();
  },
};
