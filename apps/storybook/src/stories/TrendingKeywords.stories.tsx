import type { Meta, StoryObj } from "@storybook/react";
import { TrendingKeywords } from "@nudge-design/react";
import type { TrendingKeywordItem } from "@nudge-design/react";
import React, { useState } from "react";

const sampleItems: TrendingKeywordItem[] = [
  { rank: 1, trend: "up", keyword: "우울증 자가진단" },
  { rank: 2, trend: "new", keyword: "직장인 스트레스 해소법" },
  { rank: 3, trend: "same", keyword: "수면 명상" },
  { rank: 4, trend: "down", keyword: "불안 증상" },
  { rank: 5, trend: "up", keyword: "MBTI 성격 유형 검사" },
  { rank: 6, trend: "same", keyword: "번아웃 자가 체크" },
  { rank: 7, trend: "new", keyword: "직장 내 괴롭힘 상담" },
  { rank: 8, trend: "down", keyword: "부부 갈등 상담" },
  { rank: 9, trend: "up", keyword: "자존감 높이는 방법" },
  { rank: 10, trend: "same", keyword: "ASMR 힐링 사운드" },
];

const meta: Meta<typeof TrendingKeywords> = {
  title: "Components/TrendingKeywords",
  component: TrendingKeywords,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "인기 검색어 슬라이더 + 드롭다운 컴포넌트. 자동 회전하는 슬라이더를 클릭하면 전체 순위 목록이 드롭다운으로 표시됩니다. 트로스트 헤더의 인기검색어 UI에서 파생되었습니다.",
      },
    },
  },
  argTypes: {
    autoplayDelay: {
      control: { type: "range", min: 1000, max: 5000, step: 500 },
      description: "자동 슬라이드 간격 (ms)",
    },
    title: {
      control: "text",
      description: "드롭다운 제목",
    },
    timestamp: {
      control: "text",
      description: "기준 시간 텍스트",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TrendingKeywords>;

/* ─── State: 기본 ─── */

export const Default: Story = {
  name: "State/Default",
  args: {
    items: sampleItems,
    title: "인기 검색어",
    timestamp: "09:00 기준",
    autoplayDelay: 2000,
  },
};

/* ─── State: 적은 항목 ─── */

export const FewItems: Story = {
  name: "State/Few Items",
  args: {
    items: sampleItems.slice(0, 3),
    title: "인기 검색어",
    timestamp: "12:00 기준",
  },
};

/* ─── State: 긴 키워드 ─── */

export const LongKeywords: Story = {
  name: "State/Long Keywords",
  args: {
    items: [
      { rank: 1, trend: "new", keyword: "직장인을 위한 스트레스 관리 프로그램 추천 2024년 최신판" },
      { rank: 2, trend: "up", keyword: "온라인 심리 상담 비용 비교 및 무료 상담 신청 방법 안내" },
      { rank: 3, trend: "same", keyword: "수면장애 극복하기" },
    ],
    title: "인기 검색어",
    timestamp: "15:00 기준",
  },
};

/* ─── State: 느린 자동 재생 ─── */

export const SlowAutoplay: Story = {
  name: "State/Slow Autoplay",
  args: {
    items: sampleItems,
    title: "인기 검색어",
    autoplayDelay: 4000,
  },
};

/* ─── State: 빈 목록 ─── */

export const Empty: Story = {
  name: "State/Empty",
  args: {
    items: [],
    title: "인기 검색어",
  },
};

/* ─── Recipe: 클릭 이벤트 핸들링 ─── */

function TrendingKeywordsWithClickHandler() {
  const [clicked, setClicked] = useState<TrendingKeywordItem | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-wide)" }}>
      <TrendingKeywords
        items={sampleItems}
        title="인기 검색어"
        timestamp="09:00 기준"
        onKeywordClick={(item) => setClicked(item)}
      />
      {clicked && (
        <div
          style={{
            padding: "var(--semantic-inset-card)",
            borderRadius: 8,
            background: "#f5f5f5",
            fontFamily: "'Pretendard', sans-serif",
            fontSize: 14,
          }}
        >
          <strong>클릭된 키워드:</strong> {clicked.keyword} (#{clicked.rank}, {clicked.trend})
        </div>
      )}
    </div>
  );
}

export const WithClickHandler: Story = {
  name: "Recipe/Click Handler",
  render: () => <TrendingKeywordsWithClickHandler />,
};

/* ─── Recipe: 커스텀 제목 ─── */

export const CustomTitle: Story = {
  name: "Recipe/Custom Title",
  args: {
    items: [
      { rank: 1, trend: "up", keyword: "다이어트 식단" },
      { rank: 2, trend: "new", keyword: "단백질 보충제 추천" },
      { rank: 3, trend: "same", keyword: "간헐적 단식" },
      { rank: 4, trend: "down", keyword: "홈트레이닝" },
      { rank: 5, trend: "up", keyword: "체중 감량 후기" },
    ],
    title: "실시간 인기",
    timestamp: "방금 전 업데이트",
    autoplayDelay: 1500,
  },
};
