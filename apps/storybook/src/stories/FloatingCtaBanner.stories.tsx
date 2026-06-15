import type { Meta, StoryObj } from "@storybook/react";
import { FloatingCtaBanner } from "@nudge-design/react";
import { GenietSaladIcon } from "@nudge-design/icons/multicolor";
import React from "react";

const meta: Meta<typeof FloatingCtaBanner> = {
  title: "Components/Display/FloatingCtaBanner",
  component: FloatingCtaBanner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "페이지 하단 sticky CTA 배너. pill 모양 (radius 100) + brand border 1px + shadow. " +
          "좌측 아이콘(선택) + 캡션(보조) + 강조 CTA 텍스트 + 우측 chevron. " +
          "`floating=true` (기본) 시 `position: fixed` 로 화면 하단 중앙 고정.",
      },
    },
  },
  argTypes: {
    size: { control: { type: "radio" }, options: ["pc", "mobile"] },
    floating: { control: "boolean" },
    showArrow: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof FloatingCtaBanner>;

/* ─── Overview ─── 첫 화면 = 대표 예시 + 주요 variant. 갤러리 프리뷰로도 그대로 재사용. */

export const Overview: Story = {
  name: "Overview",
  tags: ["gallery"],
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
      <FloatingCtaBanner
        caption="찾는 항목이 없나요?"
        ctaText="직접 추가하기"
        leadingIcon={<GenietSaladIcon size={32} />}
        size="mobile"
        floating={false}
      />
      <FloatingCtaBanner
        caption="더 빠르게 시작하세요"
        ctaText="지금 신청하기"
        size="mobile"
        floating={false}
      />
      <FloatingCtaBanner
        caption="더 알아보기"
        ctaText="자세히 보기"
        size="mobile"
        floating={false}
        showArrow={false}
      />
    </div>
  ),
};

/* ─── 개별 State ─── */

export const Default: Story = {
  name: "State/Default (PC)",
  args: {
    caption: "찾는 항목이 없나요?",
    ctaText: "직접 추가하기",
    leadingIcon: <GenietSaladIcon size={32} />,
    size: "pc",
    floating: false,
  },
};

export const Mobile: Story = {
  name: "State/Mobile",
  args: {
    caption: "찾는 항목이 없나요?",
    ctaText: "직접 추가하기",
    leadingIcon: <GenietSaladIcon size={32} />,
    size: "mobile",
    floating: false,
  },
};

export const NoArrow: Story = {
  name: "State/No Arrow",
  args: {
    caption: "더 알아보기",
    ctaText: "자세히 보기",
    size: "pc",
    floating: false,
    showArrow: false,
  },
};

export const NoIcon: Story = {
  name: "State/No Icon",
  args: { caption: "더 빠르게 만나보세요", ctaText: "지금 신청하기", size: "pc", floating: false },
};

/* ─── Recipe: 페이지 하단 floating 시연 (단순 목록 위) ─── */

function FloatingShowcase() {
  return (
    <div
      style={{
        position: "relative",
        width: 360,
        height: 360,
        padding: 20,
        borderRadius: 12,
        background: "var(--semantic-bg-page-default, #fafafa)",
        overflow: "hidden",
        border: "1px dashed var(--semantic-border-subtle-default, #ececec)",
        boxSizing: "border-box",
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            height: 52,
            marginBottom: 8,
            borderRadius: 8,
            background: "#fff",
            border: "1px solid #ececec",
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
            color: "#999",
            fontSize: 14,
          }}
        >
          목록 항목 #{i}
        </div>
      ))}
      <FloatingCtaBanner
        caption="찾는 항목이 없나요?"
        ctaText="직접 추가하기"
        leadingIcon={<GenietSaladIcon size={32} />}
        size="mobile"
        floating
        style={{ position: "absolute" }}
        bottomOffset={16}
      />
    </div>
  );
}

export const FloatingOverContent: Story = {
  name: "Recipe/Floating Over Content",
  render: () => <FloatingShowcase />,
};
