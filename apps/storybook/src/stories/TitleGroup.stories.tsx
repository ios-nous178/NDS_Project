import type { Meta, StoryObj } from "@storybook/react";
import { TitleGroup } from "@nudge-design/react";

const meta: Meta<typeof TitleGroup> = {
  title: "Components/Layout/TitleGroup",
  component: TitleGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "헤딩 + 서브타이틀 표준 블록. `level` 한 prop 으로 폰트와 Gap/Title 토큰이 자동 결정되어 level↔gap 미스매치를 원천 차단한다. Figma TitleGapGuide 859:5614 (6 페이지 58건 실측) 기반.",
      },
    },
  },
  argTypes: {
    level: { control: "select", options: ["h1", "h2", "h3", "h4", "h5"] },
    title: { control: "text" },
    subtitle: { control: "text" },
  },
  args: {
    level: "h4",
    title: "바로 상담하기",
    subtitle: "급한 문제는 5분 내 바로 상담",
  },
};

export default meta;
type Story = StoryObj<typeof TitleGroup>;

export const Playground: Story = {};

export const H1: Story = {
  name: "Variant/H1 (Hero · 12px)",
  args: {
    level: "h1",
    title: "마음까지 건강한 업무환경",
    subtitle: "EAP 서비스는 업무와 일상에서 생기는 스트레스를 해결합니다",
  },
};

export const H2: Story = {
  name: "Variant/H2 (큰 섹션 · 12px)",
  args: {
    level: "h2",
    title: "오늘의 마음 케어",
    subtitle: "전문가가 추천하는 맞춤 콘텐츠를 만나보세요",
  },
};

export const H3: Story = {
  name: "Variant/H3 (페이지 헤더 · 12px)",
  args: {
    level: "h3",
    title: "심리 상담 시작하기",
    subtitle: "전문 상담사와 1:1로 마음 건강을 점검해 보세요",
  },
};

export const H4: Story = {
  name: "Variant/H4 ★ 카드 헤딩 (가장 자주 · 6px)",
  args: {
    level: "h4",
    title: "바로 상담하기",
    subtitle: "급한 문제는 5분 내 바로 상담",
  },
};

export const H5: Story = {
  name: "Variant/H5 ★ 서브 헤딩 (가장 자주 · 8px)",
  args: {
    level: "h5",
    title: "오늘의 루틴",
    subtitle: "전문가를 따라 스스로 마음건강을 관리하는 습관 만들기",
  },
};

export const TitleOnly: Story = {
  name: "Variant/Title only (subtitle 없음)",
  args: {
    level: "h3",
    title: "단독 헤딩",
    subtitle: undefined,
  },
};

export const AllLevels: Story = {
  name: "Variant/All Levels",
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
      <TitleGroup
        level="h1"
        title="마음까지 건강한 업무환경"
        subtitle="EAP 서비스는 업무와 일상에서 생기는 스트레스를 해결합니다"
      />
      <TitleGroup
        level="h2"
        title="오늘의 마음 케어"
        subtitle="전문가가 추천하는 맞춤 콘텐츠를 만나보세요"
      />
      <TitleGroup
        level="h3"
        title="심리 상담 시작하기"
        subtitle="전문 상담사와 1:1로 마음 건강을 점검해 보세요"
      />
      <TitleGroup level="h4" title="바로 상담하기" subtitle="급한 문제는 5분 내 바로 상담" />
      <TitleGroup
        level="h5"
        title="오늘의 루틴"
        subtitle="전문가를 따라 스스로 마음건강을 관리하는 습관 만들기"
      />
    </div>
  ),
};
