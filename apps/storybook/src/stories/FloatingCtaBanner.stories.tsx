import type { Meta, StoryObj } from "@storybook/react";
import { FloatingCtaBanner } from "@nudge-design/react";
import React from "react";

/* ─── 좌측 일러스트 (간단한 인라인 SVG — 음식 컬러 일러스트 자리 ) ─── */

function SaladIllustration() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="24" cy="34" rx="20" ry="6" fill="#FFD58A" />
      <circle cx="14" cy="28" r="6" fill="#7BC96F" />
      <circle cx="22" cy="26" r="7" fill="#F76A6A" />
      <circle cx="32" cy="29" r="6" fill="#5BB0F7" />
      <path d="M20 22 L24 12 L28 22 Z" fill="#3CA86A" />
    </svg>
  );
}

const meta: Meta<typeof FloatingCtaBanner> = {
  title: "Components/FloatingCtaBanner",
  component: FloatingCtaBanner,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "페이지 하단 sticky CTA 배너. pill 모양 (radius 100) + brand border 1px + shadow. " +
          "좌측 일러스트 + 캡션(보조) + 강조 CTA 텍스트 + 우측 chevron. " +
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

/* ─── State: Default (PC · inline 미리보기) ─── */

export const Default: Story = {
  name: "State/Default (PC)",
  args: {
    caption: "찾는 음식이 없으신가요?",
    ctaText: "음식 직접 등록하러 가기",
    leadingIcon: <SaladIllustration />,
    size: "pc",
    floating: false,
    onClick: () => console.log("cta click"),
  },
};

/* ─── State: Mobile ─── */

export const Mobile: Story = {
  name: "State/Mobile",
  args: {
    caption: "찾는 음식이 없으신가요?",
    ctaText: "음식 직접 등록하러 가기",
    leadingIcon: <SaladIllustration />,
    size: "mobile",
    floating: false,
  },
};

/* ─── State: Arrow 숨김 ─── */

export const NoArrow: Story = {
  name: "State/No Arrow",
  args: {
    caption: "찾는 음식이 없으신가요?",
    ctaText: "음식 직접 등록하러 가기",
    leadingIcon: <SaladIllustration />,
    size: "pc",
    floating: false,
    showArrow: false,
  },
};

/* ─── State: Icon 없음 ─── */

export const NoIcon: Story = {
  name: "State/No Icon",
  args: {
    caption: "더 빠르게 만나보세요",
    ctaText: "지금 신청하기",
    size: "pc",
    floating: false,
  },
};

/* ─── Recipe: 페이지 하단 floating 시연 ─── */

function FloatingShowcase({ size }: { size: "pc" | "mobile" }) {
  const isPc = size === "pc";
  return (
    <div
      style={{
        position: "relative",
        width: isPc ? 960 : 360,
        height: 520,
        padding: 24,
        borderRadius: 12,
        background: "var(--semantic-bg-page-default, #fafafa)",
        overflow: "hidden",
        border: "1px dashed var(--semantic-border-subtle-default, #ececec)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: 12, color: "#666", fontSize: 13 }}>
        <strong>검색 결과 페이지 미리보기</strong> — 배너가 컨테이너 하단에 floating 으로 떠 있음
      </div>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          style={{
            height: 56,
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
          음식 검색 결과 #{i}
        </div>
      ))}
      <FloatingCtaBanner
        caption="찾는 음식이 없으신가요?"
        ctaText="음식 직접 등록하러 가기"
        leadingIcon={<SaladIllustration />}
        size={size}
        floating
        style={{ position: "absolute" }}
        bottomOffset={isPc ? 24 : 16}
      />
    </div>
  );
}

export const FloatingOverContent: Story = {
  name: "Recipe/Floating Over Content (PC)",
  render: () => <FloatingShowcase size="pc" />,
};

export const FloatingMobileOverContent: Story = {
  name: "Recipe/Floating Over Content (Mobile)",
  render: () => <FloatingShowcase size="mobile" />,
};
