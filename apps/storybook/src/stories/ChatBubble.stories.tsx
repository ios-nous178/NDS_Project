import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChatBubble } from "@nudge-design/react";

const meta: Meta<typeof ChatBubble> = {
  title: "Components/ChatBubble",
  component: ChatBubble,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ChatBubble>;

const w = (children: React.ReactNode) => (
  <div style={{ width: 420, display: "flex", flexDirection: "column", gap: "var(--gap-tight)" }}>
    {children}
  </div>
);

export const Single: Story = {
  name: "State/Single Pair",
  render: () =>
    w(
      <>
        <ChatBubble role="them" name="박민지 상담사" time="오후 3:24" group="single">
          안녕하세요, 오늘 컨디션은 어떠세요?
        </ChatBubble>
        <ChatBubble role="me" time="오후 3:25" group="single" read>
          어제보다는 좋아요. 다만 잠을 잘 못 잤어요.
        </ChatBubble>
      </>,
    ),
};

export const Grouped: Story = {
  name: "State/Grouped Messages",
  render: () =>
    w(
      <>
        <ChatBubble role="them" name="박민지 상담사" group="first">
          좋아요, 그동안 어떻게 지냈는지 들려주실 수 있나요?
        </ChatBubble>
        <ChatBubble role="them" group="middle">
          최근 일주일 동안 가장 힘들었던 순간이 있었다면 그 얘기부터 해도 좋아요.
        </ChatBubble>
        <ChatBubble role="them" time="오후 3:26" group="last">
          편하신 만큼만 말씀해주세요.
        </ChatBubble>
        <ChatBubble role="me" group="first">
          요즘 회사 일이 너무 많아서 새벽까지 일하는 날이 많아요.
        </ChatBubble>
        <ChatBubble role="me" time="오후 3:30" group="last" read>
          쉬어도 회복이 잘 안 돼요.
        </ChatBubble>
      </>,
    ),
};
