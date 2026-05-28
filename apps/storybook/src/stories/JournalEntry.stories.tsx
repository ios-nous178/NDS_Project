import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { JournalEntry } from "@nudge-design/react";

const meta: Meta<typeof JournalEntry> = {
  title: "Components/JournalEntry",
  component: JournalEntry,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof JournalEntry>;

export const Playground: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <JournalEntry
        date="2026-05-08"
        mood="🙂"
        title="오늘은 평온했다"
        body="회의가 별로 없는 하루. 팀 점심에서 이야기가 잘 통해서 기분이 좋았다. 저녁엔 가벼운 산책으로 마무리. 내일도 비슷하면 좋겠다."
        tags={["평온", "산책", "팀점심"]}
        footer="3분 전 기록"
      />
    </div>
  ),
};

export const NoTitle: Story = {
  name: "Recipe/제목 없이 본문만",
  render: () => (
    <div style={{ width: 480 }}>
      <JournalEntry date="오늘" mood="😐" body="딱히 특별한 일은 없었다. 그냥 평범한 하루." />
    </div>
  ),
};

export const WithThumbnail: Story = {
  name: "Recipe/우측 썸네일",
  render: () => (
    <div style={{ width: 480 }}>
      <JournalEntry
        date="2026-05-07"
        mood="😄"
        title="공원에서 본 풍경"
        body="햇살이 좋아서 한참 앉아 있었다. 사진을 한 장 남겼다."
        thumbnailSrc="https://picsum.photos/seed/park/200/200"
        tags={["산책", "사진"]}
      />
    </div>
  ),
};

export const ListExample: Story = {
  name: "Recipe/리스트 (클릭 가능)",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--gap-comfortable)",
        width: 480,
      }}
    >
      {[
        {
          date: "2026-05-08",
          mood: "🙂",
          body: "오늘은 평온한 하루였다. 회의도 적었고 점심도 만족스러웠다.",
          tags: ["평온"],
        },
        {
          date: "2026-05-07",
          mood: "😣",
          title: "발표가 부담된다",
          body: "내일 발표가 잡혀 있어 종일 신경이 쓰였다. 자기 전 호흡 가이드 한 번 해야겠다.",
          tags: ["불안", "발표"],
        },
        {
          date: "2026-05-06",
          mood: "😄",
          body: "오랜만에 친구를 만나서 카페에서 두 시간 떠들었다. 충전되는 느낌.",
          tags: ["관계", "휴식"],
        },
      ].map((e, i) => (
        <JournalEntry key={i} {...e} onClick={() => undefined} />
      ))}
    </div>
  ),
};

export const LongBody: Story = {
  name: "Edge/긴 본문 (3줄 클램프)",
  render: () => (
    <div style={{ width: 480 }}>
      <JournalEntry
        date="2026-05-05"
        mood="🤔"
        body={"오랜만에 마음을 가만히 들여다 보는 시간이었다. ".repeat(20)}
      />
    </div>
  ),
};
