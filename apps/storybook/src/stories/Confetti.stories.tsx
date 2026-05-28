import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Confetti, Button } from "@nudge-design/react";

const meta: Meta<typeof Confetti> = {
  title: "Components/Confetti",
  component: Confetti,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Confetti>;

export const Playground: Story = {
  render: function Render() {
    const [active, setActive] = useState(false);
    return (
      <div>
        <Button onClick={() => setActive(true)}>축하! 🎉</Button>
        <Confetti active={active} onComplete={() => setActive(false)} />
      </div>
    );
  },
};

export const ChallengeComplete: Story = {
  name: "Recipe/챌린지 완료",
  render: function Render() {
    const [active, setActive] = useState(false);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--gap-loose)",
        }}
      >
        <h2>🎯 14일 챌린지 달성!</h2>
        <p style={{ color: "#666" }}>꾸준한 기록으로 큰 변화를 만들었어요.</p>
        <Button onClick={() => setActive(true)}>축하 효과 다시 보기</Button>
        <Confetti active={active} onComplete={() => setActive(false)} />
      </div>
    );
  },
};

export const CustomColors: Story = {
  name: "Variant/사용자 색상 팔레트",
  render: function Render() {
    const [active, setActive] = useState(false);
    return (
      <div>
        <Button onClick={() => setActive(true)}>파스텔 톤 발사</Button>
        <Confetti
          active={active}
          colors={["#FFB6C1", "#B5EAD7", "#C7CEEA", "#FFD3B6", "#FFAAA5"]}
          onComplete={() => setActive(false)}
        />
      </div>
    );
  },
};
