import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ShareSheet, Button } from "@nudge-eap/react";

const meta: Meta<typeof ShareSheet> = {
  title: "Components/ShareSheet",
  component: ShareSheet,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ShareSheet>;

export const Playground: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>공유하기</Button>
        <ShareSheet
          open={open}
          onClose={() => setOpen(false)}
          title="이 콘텐츠 공유"
          description="친구와 함께 마음챙김 가이드를 공유해보세요."
          targets={[
            {
              key: "kakao",
              label: "카카오톡",
              icon: "💬",
              bg: "#FEE500",
              onClick: () => alert("카카오 공유"),
            },
            { key: "sms", label: "메시지", icon: "📱", bg: "#A2D2FF", onClick: () => alert("SMS") },
            {
              key: "email",
              label: "이메일",
              icon: "✉️",
              bg: "#FFE3D8",
              onClick: () => alert("이메일"),
            },
            {
              key: "save",
              label: "이미지로 저장",
              icon: "📥",
              bg: "#E8E2FA",
              onClick: () => alert("저장"),
            },
          ]}
          link="https://app.nudge.health/contents/abc123"
        />
      </div>
    );
  },
};

export const NoLink: Story = {
  name: "Edge/링크 없이",
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>공유</Button>
        <ShareSheet
          open={open}
          onClose={() => setOpen(false)}
          targets={[
            {
              key: "kakao",
              label: "카카오톡",
              icon: "💬",
              bg: "#FEE500",
              onClick: () => undefined,
            },
            { key: "more", label: "더보기", icon: "···", bg: "#F2F4F6", onClick: () => undefined },
          ]}
        />
      </div>
    );
  },
};
