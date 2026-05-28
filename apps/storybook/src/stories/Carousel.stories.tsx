import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Carousel } from "@nudge-design/react";

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const Slide = ({ bg, label }: { bg: string; label: string }) => (
  <div
    style={{
      height: 200,
      background: bg,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 24,
      fontWeight: 700,
      borderRadius: 12,
    }}
  >
    {label}
  </div>
);

export const Playground: Story = {
  render: function Render() {
    const [idx, setIdx] = useState(0);
    return (
      <div style={{ width: 360 }}>
        <Carousel activeIndex={idx} onActiveIndexChange={setIdx}>
          <Slide bg="#5B7FF7" label="Slide 1" />
          <Slide bg="#F77F5B" label="Slide 2" />
          <Slide bg="#7FBF5B" label="Slide 3" />
        </Carousel>
      </div>
    );
  },
};

export const Autoplay: Story = {
  name: "Recipe/자동 재생",
  render: () => (
    <div style={{ width: 360 }}>
      <Carousel autoplay={2500} loop>
        <Slide bg="#5B7FF7" label="이벤트" />
        <Slide bg="#F77F5B" label="신규 콘텐츠" />
        <Slide bg="#7FBF5B" label="공지사항" />
      </Carousel>
    </div>
  ),
};

export const CounterIndicator: Story = {
  name: "Variant/카운터 인디케이터",
  render: () => (
    <div style={{ width: 360 }}>
      <Carousel indicator="counter">
        <Slide bg="#222" label="1" />
        <Slide bg="#444" label="2" />
        <Slide bg="#666" label="3" />
        <Slide bg="#888" label="4" />
      </Carousel>
    </div>
  ),
};

export const NoIndicator: Story = {
  name: "Variant/인디케이터 없음",
  render: () => (
    <div style={{ width: 360 }}>
      <Carousel indicator="none" showArrows={false}>
        <Slide bg="#5B7FF7" label="A" />
        <Slide bg="#F77F5B" label="B" />
      </Carousel>
    </div>
  ),
};

export const ContentCarousel: Story = {
  name: "Recipe/콘텐츠 카드 슬라이더",
  render: () => (
    <div style={{ width: 360 }}>
      <Carousel indicator="dots">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              padding: "var(--semantic-inset-modal)",
              background: "var(--semantic-bg-section-default)",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>오늘의 콘텐츠</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
              마음챙김 가이드 #{n}
            </div>
            <p style={{ margin: 0, color: "#444", lineHeight: 1.6 }}>
              하루 5분, 호흡과 함께 시작하는 마음챙김 루틴을 따라가 보세요.
            </p>
          </div>
        ))}
      </Carousel>
    </div>
  ),
};
