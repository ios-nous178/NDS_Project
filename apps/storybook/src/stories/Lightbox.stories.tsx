import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Lightbox } from "@nudge-eap/react";

const meta: Meta<typeof Lightbox> = {
  title: "Components/Lightbox",
  component: Lightbox,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Lightbox>;

const PHOTOS = [
  {
    src: "https://picsum.photos/seed/park/1200/800",
    alt: "공원",
    caption: "공원에서 본 풍경 — 2026.05.07",
  },
  { src: "https://picsum.photos/seed/sea/1200/800", alt: "바다", caption: "주말 여행" },
  { src: "https://picsum.photos/seed/cafe/1200/800", alt: "카페" },
];

export const Playground: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [idx, setIdx] = useState(0);
    return (
      <div>
        <div style={{ display: "flex", gap: 8 }}>
          {PHOTOS.map((p, i) => (
            <img
              key={i}
              src={p.src}
              alt={p.alt}
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
                cursor: "zoom-in",
              }}
              onClick={() => {
                setIdx(i);
                setOpen(true);
              }}
            />
          ))}
        </div>
        <Lightbox
          open={open}
          images={PHOTOS}
          index={idx}
          onIndexChange={setIdx}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const SingleImage: Story = {
  name: "Recipe/단일 이미지 (네비 없음)",
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button onClick={() => setOpen(true)}>이미지 열기</button>
        <Lightbox open={open} images={[PHOTOS[0]]} onClose={() => setOpen(false)} />
      </div>
    );
  },
};
