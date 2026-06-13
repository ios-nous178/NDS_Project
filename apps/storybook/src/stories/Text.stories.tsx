import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "@nudge-design/react";

const VARIANTS = [
  "display1",
  "display2",
  "display3",
  "headline1",
  "headline2",
  "headline3",
  "headline4",
  "headline5",
  "body1",
  "body2",
  "body3",
  "caption1",
  "caption2",
  "label",
] as const;

const TONES = [
  "strong",
  "normal",
  "subtle",
  "muted",
  "disabled",
  "inverse",
  "brand",
  "brandStrong",
  "statusSuccess",
  "statusError",
  "statusCaution",
  "statusInfo",
] as const;

const meta: Meta<typeof Text> = {
  title: "Components/Display/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "타이포 primitive. `variant`(타입 스케일)·`tone`(시맨틱 색)·`weight` 를 토큰에서만 받아 임의의 텍스트에 거는 얇은 컴포넌트 — DS 의 공용 타이포 SSOT(`.nds-text-*`)를 소비한다. Heading 의 body 짝: '제목+설명 묶음'은 Heading, '한 덩이 텍스트(본문·라벨·메타·캡션)'는 Text. `expandable` 로 길면 '더보기/접기' 토글(구 ExpandableText 흡수).",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    tone: { control: "select", options: TONES },
    weight: { control: "select", options: [undefined, "regular", "medium", "semibold", "bold"] },
    as: { control: "select", options: ["span", "p", "div", "label", "strong", "em", "small"] },
    maxLines: { control: { type: "number", min: 1, max: 10 } },
    expandable: { control: "boolean" },
    expandLabel: { control: "text" },
    collapseLabel: { control: "text" },
    hideCollapse: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    variant: "body1",
    tone: "normal",
    as: "p",
    children: "마음까지 건강한 업무환경을 만들어요.",
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Overview: Story = {
  tags: ["gallery"],
  name: "Overview",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 260 }}>
      <Text variant="headline3" tone="strong" weight="bold" as="p">
        오늘의 마음 케어
      </Text>
      <Text variant="body2" tone="normal" as="p">
        전문가가 추천하는 맞춤 콘텐츠를 만나보세요.
      </Text>
      <Text variant="caption1" tone="subtle" as="p">
        2026.06.14 · 조회 1,204
      </Text>
      <Text variant="body3" tone="statusError" as="p">
        입력한 정보를 다시 확인해 주세요.
      </Text>
    </div>
  ),
};

export const Playground: Story = {};

export const Scale: Story = {
  name: "Variant/Scale ramp",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {VARIANTS.map((v) => (
        <Text key={v} variant={v} tone="strong" as="p">
          {v} — 마음까지 건강한 업무환경
        </Text>
      ))}
    </div>
  ),
};

export const Tone: Story = {
  name: "Variant/Tones",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {TONES.map((t) => (
        <Text
          key={t}
          variant="body1"
          tone={t}
          as="p"
          style={
            t === "inverse"
              ? { background: "var(--semantic-bg-inverse-default)", padding: "2px 8px" }
              : undefined
          }
        >
          {t} — 오늘 하루도 수고했어요
        </Text>
      ))}
    </div>
  ),
};

export const Weight: Story = {
  name: "Variant/Weights",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {(["regular", "medium", "semibold", "bold"] as const).map((w) => (
        <Text key={w} variant="headline5" weight={w} tone="strong" as="p">
          {w} — 마음까지 건강한 업무환경
        </Text>
      ))}
    </div>
  ),
};

export const Clamp: Story = {
  name: "Variant/maxLines clamp (CSS only)",
  render: () => (
    <div style={{ width: 260 }}>
      <Text variant="body2" tone="normal" as="p" maxLines={2}>
        EAP 서비스는 업무와 일상에서 생기는 스트레스, 대인관계, 번아웃 같은 마음의 어려움을 전문
        상담사와 함께 풀어가도록 돕습니다. 이 문장은 두 줄에서 말줄임으로 잘립니다.
      </Text>
    </div>
  ),
};

export const Expandable: Story = {
  name: "Variant/expandable (더보기/접기)",
  args: {
    variant: "body3",
    tone: "normal",
    as: "p",
    expandable: true,
    maxLines: 3,
    children:
      "EAP 서비스는 업무와 일상에서 생기는 스트레스, 대인관계의 어려움, 번아웃, 수면 문제 등 다양한 마음의 어려움을 전문 상담사와 함께 다룹니다. 기본 3줄로 접혀 있다가 '더보기'를 누르면 전체가 펼쳐지고, 다시 '접기'로 돌아갑니다. 텍스트가 짧으면 토글은 자동으로 숨겨집니다.",
  },
};

export const ExpandableTerms: Story = {
  name: "Variant/expandable · hideCollapse (약관)",
  args: {
    variant: "caption1",
    tone: "subtle",
    as: "p",
    expandable: true,
    maxLines: 2,
    hideCollapse: true,
    expandLabel: "이용약관 전문 보기",
    children:
      "제1조(목적) 본 약관은 회사가 제공하는 EAP 서비스의 이용과 관련하여 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다. 제2조(정의) ① '서비스'란 회사가 제공하는 일체의 멘탈케어 서비스를 말합니다. 한 번 펼치면 접기 버튼은 표시되지 않습니다.",
  },
};
