import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MediaCard, Avatar } from "@nudge-design/react";

const meta: Meta<typeof MediaCard> = {
  title: "Components/Display/MediaCard",
  component: MediaCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "이미지 위 / 콘텐츠 아래 세로형 카드. 슬롯 기반(image · imageOverlay · eyebrow · title · body · footer) + 별점 헬퍼. " +
          "콘텐츠 카드, 후기 카드, 상담사 카드, 강의 카드 등 '미디어 + 메타' 패턴 전반에 사용.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MediaCard>;

const img = (seed: string, w = 320, h = 240) => (
  <img src={`https://picsum.photos/seed/${seed}/${w}/${h}`} alt="" />
);

const MetaRow = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      color: "var(--nds-text-subtle)",
    }}
  >
    {children}
  </span>
);

/* ─── State: Default ─── */

export const Default: Story = {
  name: "State/Default",
  render: () => (
    <div style={{ width: 280 }}>
      <MediaCard
        image={img("media-default")}
        eyebrow="아임닭"
        title="닭 무침"
        body="아침 다이어트 식단으로 자주 먹어요. 잡내가 거의 없고 담백해서 부담 없이 먹기 좋아요."
        rating={4.5}
        footer={
          <>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Avatar name="가나다라" size="xs" />
              <span style={{ fontSize: 13 }}>가나다라</span>
            </span>
            <MetaRow>
              조회수 999.9만<span aria-hidden>·</span>26.01.28
            </MetaRow>
          </>
        }
        onCardClick={() => {}}
      />
    </div>
  ),
};

/* ─── State: With Image Overlay ─── */

export const WithImageOverlay: Story = {
  tags: ["gallery"],
  name: "State/With Image Overlay",
  render: () => (
    <div style={{ width: 280 }}>
      <MediaCard
        image={
          <img
            src="https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=320&h=240&fit=crop"
            alt=""
          />
        }
        imageOverlay="999+"
        title="비빔밥 모음전"
        body="아침 다이어트 식단으로 자주 먹어요. 잡내가 거의 없고 담백해서 부담 없이 먹기 좋아요."
        rating={5}
        footer={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Avatar name="가나다라" size="xs" />
            <span style={{ fontSize: 13 }}>가나다라</span>
          </span>
        }
        onCardClick={() => {}}
      />
    </div>
  ),
};

/* ─── Layout: Grid (4-up) ─── */

export const Grid4Up: Story = {
  name: "Recipe/Grid 4-up (desktop)",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        width: 1100,
      }}
    >
      {["a", "b", "c", "d"].map((seed) => (
        <MediaCard
          key={seed}
          image={img(`grid-${seed}`)}
          imageOverlay={seed === "b" ? "999+" : undefined}
          eyebrow="아임닭"
          title="닭볶음탕"
          body="잡내가 거의 없고 담백해서 부담 없이 먹기 좋아요. 양념이 과하지 않아서 팬에 살짝 구워도 김."
          rating={4.5}
          footer={
            <>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Avatar name="가나다라" size="xs" />
                <span style={{ fontSize: 13 }}>가나다라</span>
              </span>
              <MetaRow>
                조회수 999.9만<span aria-hidden>·</span>26.01.28
              </MetaRow>
            </>
          }
        />
      ))}
    </div>
  ),
};

/* ─── Layout: Horizontal scroll (mobile) ─── */

export const HorizontalScroll: Story = {
  name: "Recipe/Horizontal scroll (mobile)",
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 12,
        overflowX: "auto",
        width: 360,
        padding: 4,
      }}
    >
      {["x", "y", "z"].map((seed) => (
        <div key={seed} style={{ flex: "0 0 160px" }}>
          <MediaCard
            image={img(`scroll-${seed}`, 200, 240)}
            imageAspectRatio="5 / 6"
            eyebrow="어쩌구"
            title="닭볶음탕"
            body="잡내가 거의 없고 담백해서 부담 없이 먹기 좋아요."
            rating={4.5}
          />
        </div>
      ))}
    </div>
  ),
};

/* ─── Edge: 최소 props ─── */

export const Minimal: Story = {
  name: "Edge/Minimal (image + title)",
  render: () => (
    <div style={{ width: 240 }}>
      <MediaCard image={img("minimal")} title="간단한 카드" />
    </div>
  ),
};

/* ─── Edge: 16:9 영상 썸네일 ─── */

export const VideoAspect: Story = {
  name: "Edge/16:9 video thumbnail",
  render: () => (
    <div style={{ width: 320 }}>
      <MediaCard
        image={img("video-thumb", 320, 180)}
        imageAspectRatio="16 / 9"
        imageOverlay="02:13"
        eyebrow="명상 가이드"
        title="5분 호흡으로 긴장 풀기"
        body="자기 전 짧게 따라할 수 있는 호흡 가이드. 입문자에게 추천합니다."
      />
    </div>
  ),
};
