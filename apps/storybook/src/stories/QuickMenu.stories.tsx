import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect, fn } from "storybook/test";
import { QuickMenu } from "@nudge-design/react";
import { CommentIcon, SearchIcon, CounselIcon } from "@nudge-design/icons";

const meta: Meta<typeof QuickMenu> = {
  title: "Components/Navigation/QuickMenu",
  component: QuickMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "PC 화면 우측 고정 영역에서 자주 쓰는 전역 액션 2~4개(3개 권장)를 빠르게 노출하는 컴포넌트. " +
          "항상 보이는 navigation 을 보완한다. 모바일/태블릿(<1024)에서는 노출하지 않고 하단 Tab Bar 로 대체한다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuickMenu>;

const ICON = 32;
const ITEMS = [
  { key: "counsel", label: "바로 상담하기", icon: <CommentIcon size={ICON} /> },
  { key: "search", label: "상담사 찾기", icon: <SearchIcon size={ICON} /> },
  { key: "room", label: "내 상담방", icon: <CounselIcon size={ICON} /> },
];

export const Playground: Story = {
  args: {
    items: ITEMS.map((it) => ({ ...it, onClick: fn() })),
    onTopClick: fn(),
  },
  render: (args) => <QuickMenu {...args} />,
};

export const Default: Story = {
  name: "Anatomy/기본 (3 items + TOP)",
  render: () => <QuickMenu items={ITEMS} />,
};

export const TwoItems: Story = {
  name: "Variant/2 items",
  render: () => <QuickMenu items={ITEMS.slice(0, 2)} />,
};

export const FourItems: Story = {
  name: "Variant/4 items (최대)",
  render: () => (
    <QuickMenu
      items={[...ITEMS, { key: "more", label: "더보기", icon: <CommentIcon size={ICON} /> }]}
    />
  ),
};

export const NoTop: Story = {
  name: "Variant/TOP 버튼 없음",
  render: () => <QuickMenu items={ITEMS} showTop={false} />,
};

export const IconOnly: Story = {
  name: "State/라벨 없음 (비권장 — 식별성 저하)",
  render: () => <QuickMenu items={ITEMS.map((it) => ({ ...it, showLabel: false }))} />,
};

export const Interaction: Story = {
  name: "Test/클릭 이벤트",
  args: {
    items: ITEMS.map((it) => ({ ...it, onClick: fn() })),
    onTopClick: fn(),
  },
  render: (args) => <QuickMenu {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("바로 상담하기"));
    await expect(args.items[0].onClick).toHaveBeenCalled();
    await userEvent.click(canvas.getByText("TOP"));
    await expect(args.onTopClick).toHaveBeenCalled();
  },
};
