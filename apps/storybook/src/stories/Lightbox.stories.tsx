import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Lightbox } from "@nudge-design/react";

const meta: Meta<typeof Lightbox> = {
  title: "Components/Overlay/Lightbox",
  component: Lightbox,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Lightbox>;

/* ─── Overview ─── 첫 화면 = 열린 라이트박스(클릭 불필요). 갤러리 프리뷰로도 재사용(정적 인라인). */
export const Overview: Story = {
  name: "Overview",
  tags: ["gallery"],
  render: () => (
    <div style={{ position: "relative", width: 220, height: 140, borderRadius: 8, background: "#111", overflow: "hidden" }}>
      <span aria-hidden style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: 9999, background: "rgba(255,255,255,0.18)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✕</span>
      <span aria-hidden style={{ position: "absolute", top: "50%", left: 6, transform: "translateY(-50%)", width: 22, height: 22, borderRadius: 9999, background: "rgba(255,255,255,0.18)", color: "#fff", textAlign: "center", lineHeight: "22px", fontWeight: 700 }}>‹</span>
      <span aria-hidden style={{ position: "absolute", top: "50%", right: 6, transform: "translateY(-50%)", width: 22, height: 22, borderRadius: 9999, background: "rgba(255,255,255,0.18)", color: "#fff", textAlign: "center", lineHeight: "22px", fontWeight: 700 }}>›</span>
      <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 130, height: 80, borderRadius: 6, background: "#F4F4F4" }} />
      <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", padding: "3px 10px", borderRadius: 9999, background: "rgba(255,255,255,0.18)", color: "#fff", fontSize: 10, fontWeight: 600 }}>1 / 4</div>
    </div>
  ),
};

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
        <div style={{ display: "flex", gap: "var(--semantic-gap-default)" }}>
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
