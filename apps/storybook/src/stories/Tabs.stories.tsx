import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Tabs, type TabsProps } from "@nudge-eap/react";
import { colors } from "@nudge-eap/tokens";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<TabsProps> = {
  title: "Components/Tabs",
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
      options: ["line", "pill", "square"],
    },
    fullWidth: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<TabsProps>;

const storyFrameStyle: React.CSSProperties = { width: 360 };
const panelStyle: React.CSSProperties = { padding: 20 };

const sampleItems = [
  { key: "all", title: "전체", content: <div style={panelStyle}>전체 콘텐츠</div> },
  { key: "counsel", title: "상담", content: <div style={panelStyle}>상담 콘텐츠</div> },
  { key: "challenge", title: "챌린지", content: <div style={panelStyle}>챌린지 콘텐츠</div> },
];

function TabsDemo({ variant = "line" }: { variant?: "line" | "pill" | "square" }) {
  const [activeKey, setActiveKey] = useState("all");

  return (
    <div style={storyFrameStyle}>
      <Tabs
        items={sampleItems}
        activeKey={activeKey}
        onTabChange={setActiveKey}
        variant={variant}
      />
    </div>
  );
}

export const LineVariant: Story = {
  name: "State/Line",
  render: () => <TabsDemo variant="line" />,
};

export const PillVariant: Story = {
  name: "State/Pill",
  render: () => <TabsDemo variant="pill" />,
};

export const SquareVariant: Story = {
  name: "State/Square",
  render: () => <TabsDemo variant="square" />,
};

function ManyTabsDemo() {
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
    <div style={storyFrameStyle}>
      <Tabs items={items} activeKey={activeKey} onTabChange={setActiveKey} variant="pill" />
    </div>
  );
}

export const ManyTabs: Story = {
  name: "State/Scrollable Pill Tabs",
  render: () => <ManyTabsDemo />,
};

function CompoundAPIDemo() {
  const [activeKey, setActiveKey] = useState("address");

  return (
    <div style={storyFrameStyle}>
      <Tabs.Root activeKey={activeKey} onTabChange={setActiveKey} variant="line">
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

function WebViewSlideTabDemo() {
  const categories = [
    { key: "0", title: "전체", content: <div style={panelStyle}>전체 콘텐츠</div> },
    { key: "1", title: "마음챙김", content: <div style={panelStyle}>마음챙김 콘텐츠</div> },
    { key: "2", title: "수면", content: <div style={panelStyle}>수면 콘텐츠</div> },
    { key: "3", title: "집중", content: <div style={panelStyle}>집중 콘텐츠</div> },
  ];
  const [activeKey, setActiveKey] = useState("0");

  return (
    <div style={storyFrameStyle}>
      <Tabs items={categories} activeKey={activeKey} onTabChange={setActiveKey} variant="line" />
    </div>
  );
}

export const WebViewSlideTabExample: Story = {
  name: "Recipe/WebView SlideTab Migration",
  render: () => <WebViewSlideTabDemo />,
};

function FlatVsCompoundParityDemo() {
  const [flatActiveKey, setFlatActiveKey] = useState("all");
  const [compoundActiveKey, setCompoundActiveKey] = useState("all");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 360px))",
        gap: 24,
        alignItems: "start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <strong>Flat API</strong>
        <Tabs
          items={sampleItems}
          activeKey={flatActiveKey}
          onTabChange={setFlatActiveKey}
          variant="line"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <strong>Compound API</strong>
        <Tabs.Root activeKey={compoundActiveKey} onTabChange={setCompoundActiveKey} variant="line">
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
  name: "QA/Flat Vs Compound Parity",
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: () => <FlatVsCompoundParityDemo />,
};

function TabsOnlyWithoutPanelsDemo() {
  const items = [
    { key: "address", title: "주소 검색" },
    { key: "center", title: "센터 검색" },
    { key: "expert", title: "전문가 찾기" },
  ];
  const [activeKey, setActiveKey] = useState("address");

  return (
    <div style={storyFrameStyle}>
      <Tabs items={items} activeKey={activeKey} onTabChange={setActiveKey} variant="line" />
    </div>
  );
}

export const TabsOnlyWithoutPanels: Story = {
  name: "QA/Tabs Only Without Panels",
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: () => <TabsOnlyWithoutPanelsDemo />,
};

function LongLabelsOverflowDemo() {
  const items = [
    { key: "all", title: "전체 프로그램 보기" },
    { key: "mind", title: "마음챙김과 감정 조절" },
    { key: "sleep", title: "수면 회복과 생활 리듬" },
    { key: "focus", title: "집중력 회복과 업무 몰입" },
    { key: "relation", title: "관계 스트레스와 소통" },
  ];
  const [activeKey, setActiveKey] = useState("all");

  return (
    <div style={storyFrameStyle}>
      <Tabs items={items} activeKey={activeKey} onTabChange={setActiveKey} variant="pill" />
    </div>
  );
}

export const LongLabelsOverflow: Story = {
  name: "QA/Long Labels Overflow",
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: () => <LongLabelsOverflowDemo />,
};

function KeyboardNavigationReviewDemo() {
  const [activeKey, setActiveKey] = useState("all");

  return (
    <div style={{ ...storyFrameStyle, display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ margin: 0, color: colors.neutral[700], fontSize: 14, lineHeight: "20px" }}>
        Tab으로 활성 탭에 포커스한 뒤 Enter 또는 Space로 전환을 확인합니다. 좌우 화살표 이동과 aria
        연결은 컴포넌트 테스트로 보강이 필요한 항목입니다.
      </p>
      <Tabs items={sampleItems} activeKey={activeKey} onTabChange={setActiveKey} variant="line" />
    </div>
  );
}

export const KeyboardNavigationReview: Story = {
  name: "QA/Keyboard Navigation Review",
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: () => <KeyboardNavigationReviewDemo />,
};

/* ─── Interaction Tests ─── */

export const TabSwitchInteraction: Story = {
  name: "Interaction/Tab Switch",
  render: () => <TabsDemo variant="line" />,
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
  render: () => <TabsDemo variant="line" />,
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
