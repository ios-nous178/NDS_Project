import type { Meta, StoryObj } from "@storybook/react";
import { PopularPosts } from "@nudge-eap/react";
import type { PopularPostsItem, PopularPostsTab } from "@nudge-eap/react";
import React, { useState } from "react";

const sampleTabs: PopularPostsTab[] = [
  { key: "realtime", label: "실시간" },
  { key: "weekly", label: "주간" },
  { key: "monthly", label: "월간" },
  { key: "comments", label: "댓글순" },
  { key: "likes", label: "추천순" },
];

const sampleItems: PopularPostsItem[] = [
  { id: 1, title: "아침대용으로 간단한 오트밀라떼", count: 1024 },
  { id: 2, title: "근육 이완이나 자극에 폼롤러 추천합니다", count: 2 },
  { id: 3, title: "체중이 저절로 감량되는 핸드 메이드 요거트 만들기", count: 23 },
  { id: 4, title: "아침식사 에그토마토", count: 342 },
  { id: 5, title: "만보 걷기 하고 들어가는 길 비오네요", count: 23 },
  { id: 6, title: "[운동기록] 오늘 첫 PT 다녀왔어요", count: 12 },
  { id: 7, title: "화요일 아침", count: 8 },
  { id: 8, title: "저는 주로 이런 스트레칭을 가끔해요", count: 4 },
  { id: 9, title: "부담없는 탄단지 골고루 아침", count: 31 },
  { id: 10, title: "오늘 많이 걸었네요", count: 15 },
];

const meta: Meta<typeof PopularPosts> = {
  title: "Components/PopularPosts",
  component: PopularPosts,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "사이드바에 위치하는 커뮤니티 인기글 랭킹 모듈. Header(제목 + 더보기) + Tabs(기간/정렬) + 10개 행 리스트 의 3단 레이어. " +
          "Rank 는 두 자리 zero-padded(`01`~`10`), Count 는 `[N]` / 999 초과는 `[+999]` 로 표기.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PopularPosts>;

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: 353 }}>{children}</div>
);

/* ─── State: Default (실시간 active) ─── */

function DefaultStory() {
  const [active, setActive] = useState("realtime");
  return (
    <Frame>
      <PopularPosts
        tabs={sampleTabs}
        activeTabKey={active}
        onTabChange={setActive}
        items={sampleItems}
        onMoreClick={() => console.log("more")}
        onItemClick={(item, rank) => console.log("click", rank, item)}
      />
    </Frame>
  );
}

export const Default: Story = {
  name: "State/Default",
  render: () => <DefaultStory />,
};

/* ─── State: 탭 없음 ─── */

export const NoTabs: Story = {
  name: "State/No Tabs",
  render: () => (
    <Frame>
      <PopularPosts items={sampleItems} onMoreClick={() => console.log("more")} />
    </Frame>
  ),
};

/* ─── State: 더보기 없음 ─── */

function NoMoreStory() {
  const [active, setActive] = useState("realtime");
  return (
    <Frame>
      <PopularPosts
        tabs={sampleTabs}
        activeTabKey={active}
        onTabChange={setActive}
        items={sampleItems}
      />
    </Frame>
  );
}

export const NoMore: Story = {
  name: "State/No More",
  render: () => <NoMoreStory />,
};

/* ─── State: 적은 항목 ─── */

function FewItemsStory() {
  const [active, setActive] = useState("weekly");
  return (
    <Frame>
      <PopularPosts
        title="이번 주 BEST"
        tabs={sampleTabs}
        activeTabKey={active}
        onTabChange={setActive}
        items={sampleItems.slice(0, 3)}
        onMoreClick={() => {}}
      />
    </Frame>
  );
}

export const FewItems: Story = {
  name: "State/Few Items",
  render: () => <FewItemsStory />,
};

/* ─── Variant: Count formats ─── */

export const CountVariants: Story = {
  name: "Variant/Count Formats",
  render: () => (
    <Frame>
      <PopularPosts
        title="댓글 수 포맷"
        items={[
          { id: 1, title: "댓글 0개 — [0]", count: 0 },
          { id: 2, title: "한 자릿수 — [8]", count: 8 },
          { id: 3, title: "두 자릿수 — [23]", count: 23 },
          { id: 4, title: "세 자릿수 — [342]", count: 342 },
          { id: 5, title: "999 초과 — [+999]", count: 1234 },
        ]}
      />
    </Frame>
  ),
};

/* ─── Variant: 긴 제목 truncate ─── */

export const LongTitles: Story = {
  name: "Variant/Long Titles (truncate)",
  render: () => (
    <Frame>
      <PopularPosts
        title="긴 제목"
        items={[
          {
            id: 1,
            title:
              "체중이 저절로 감량되는 핸드 메이드 요거트 만들기 — 한 줄 truncate 확인용 긴 제목",
            count: 23,
          },
          {
            id: 2,
            title: "직장 다니면서 매일 운동하기 쉽지 않은데 어떻게들 시간 내시나요 다들 대단해요",
            count: 8,
          },
          { id: 3, title: "짧은 제목", count: 1 },
        ]}
        onMoreClick={() => {}}
      />
    </Frame>
  ),
};
