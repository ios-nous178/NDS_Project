import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OnlineIndicator, Avatar } from "@nudge-design/react";

const meta: Meta<typeof OnlineIndicator> = {
  title: "Components/OnlineIndicator",
  component: OnlineIndicator,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    status: { control: "radio", options: ["online", "away", "busy", "offline"] },
    showLabel: { control: "boolean" },
  },
  args: { status: "online", showLabel: true },
};

export default meta;
type Story = StoryObj<typeof OnlineIndicator>;

export const Playground: Story = { render: (args) => <OnlineIndicator {...args} /> };

export const Statuses: Story = {
  name: "Variant/모든 상태",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-default)" }}>
      <OnlineIndicator status="online" showLabel />
      <OnlineIndicator status="away" showLabel />
      <OnlineIndicator status="busy" showLabel />
      <OnlineIndicator status="offline" showLabel />
    </div>
  ),
};

export const OnAvatar: Story = {
  name: "Recipe/아바타 우하단 점",
  render: () => (
    <div style={{ display: "flex", gap: "var(--semantic-gap-wide)" }}>
      {(["online", "away", "busy", "offline"] as const).map((s) => (
        <div key={s} style={{ position: "relative", width: 56, height: 56 }}>
          <Avatar name={s} size="xl" />
          <span
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "#fff",
              borderRadius: 9999,
              padding: 2,
            }}
          >
            <OnlineIndicator status={s} size={12} />
          </span>
        </div>
      ))}
    </div>
  ),
};

export const InCounselorList: Story = {
  name: "Recipe/상담사 리스트",
  render: () => (
    <div
      style={{
        width: 320,
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-comfortable)",
      }}
    >
      {[
        { name: "김민지 상담사", status: "online" as const },
        { name: "이수영 상담사", status: "busy" as const },
        { name: "박지원 상담사", status: "away" as const },
        { name: "최서연 상담사", status: "offline" as const },
      ].map((c) => (
        <div
          key={c.name}
          style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-comfortable)" }}
        >
          <Avatar name={c.name} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{c.name}</div>
          </div>
          <OnlineIndicator status={c.status} showLabel />
        </div>
      ))}
    </div>
  ),
};
