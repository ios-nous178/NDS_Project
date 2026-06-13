import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChatComposer } from "@nudge-design/react";

const meta: Meta<typeof ChatComposer> = {
  title: "Components/Inputs/ChatComposer",
  component: ChatComposer,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ChatComposer>;

export const Playground: Story = {
  render: function Render() {
    const [v, setV] = useState("");
    const [history, setHistory] = useState<string[]>([]);
    return (
      <div style={{ width: 480, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <div
          style={{
            minHeight: 200,
            padding: "var(--semantic-inset-card)",
            background: "#FAFBFC",
            display: "flex",
            flexDirection: "column",
            gap: "var(--semantic-gap-default)",
          }}
        >
          {history.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: "flex-end",
                background: "var(--semantic-bg-brand-default)",
                color: "#fff",
                padding: "var(--semantic-inset-chip) var(--semantic-inset-input)",
                borderRadius: 12,
                maxWidth: "70%",
              }}
            >
              {m}
            </div>
          ))}
          {history.length === 0 && (
            <div
              style={{ color: "#999", textAlign: "center", padding: "var(--semantic-inset-modal)" }}
            >
              아직 메시지가 없어요
            </div>
          )}
        </div>
        <ChatComposer
          value={v}
          onValueChange={setV}
          onSubmit={(text) => {
            setHistory((h) => [...h, text]);
            setV("");
          }}
        />
      </div>
    );
  },
};

export const WithAttachAndMic: Story = {
  name: "Recipe/첨부 + 음성 버튼",
  render: function Render() {
    const [v, setV] = useState("");
    return (
      <div style={{ width: 480 }}>
        <ChatComposer
          value={v}
          onValueChange={setV}
          onSubmit={() => setV("")}
          onAttach={() => alert("첨부")}
          onMic={() => alert("음성 녹음 시작")}
        />
      </div>
    );
  },
};

export const WithQuickReplies: Story = {
  name: "Recipe/빠른 응답 칩",
  tags: ["gallery"],
  render: function Render() {
    const [v, setV] = useState("");
    return (
      <div style={{ width: 480 }}>
        <ChatComposer
          value={v}
          onValueChange={setV}
          onSubmit={() => setV("")}
          quickReplies={[
            { label: "괜찮아요", onClick: () => setV("괜찮아요") },
            { label: "힘들어요", onClick: () => setV("힘들어요") },
            { label: "더 이야기하고 싶어요", onClick: () => setV("더 이야기하고 싶어요") },
          ]}
        />
      </div>
    );
  },
};

export const WithMaxLength: Story = {
  name: "Recipe/글자수 제한",
  render: function Render() {
    const [v, setV] = useState("");
    return (
      <div style={{ width: 480 }}>
        <ChatComposer value={v} onValueChange={setV} onSubmit={() => setV("")} maxLength={200} />
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "State/비활성 (전송 중)",
  tags: ["gallery"],
  render: () => (
    <div style={{ width: 480 }}>
      <ChatComposer
        value="전송 중인 메시지..."
        onValueChange={() => undefined}
        onSubmit={() => undefined}
        disabled
      />
    </div>
  ),
};
