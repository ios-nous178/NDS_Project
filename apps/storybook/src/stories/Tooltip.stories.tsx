import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "@nudge-design/react";
import { CashwalkBizQuestionIcon } from "@nudge-design/icons";

/**
 * Components/Tooltip — hover / focus 시 뜨는 보조 안내.
 *
 * 본문 길이/줄 수 제한 없음:
 *   - 짧은 힌트: `content` 에 문자열 (max-width 안에서 자동 줄바꿈 — 두 줄·여러 줄 허용)
 *   - 리치 안내(제목+불릿 등): `content` 에 ReactNode (캐포비 '권한 안내' 형태)
 * 다크 배경(surface.inverse) + 흰 텍스트 + 방향별 tail 공통.
 *
 * 단 (a) 사용자의 응답/결정이 필요하거나 (b) 한 화면을 채울 만큼 길면 Modal 을 쓸 것 — Tooltip 은 hover 보조 안내.
 */
const meta: Meta<typeof Tooltip> = {
  title: "Components/Overlay/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    placement: { control: "select", options: ["top", "bottom", "left", "right"] },
    delay: { control: "number" },
    disabled: { control: "boolean" },
  },
  args: { placement: "top", delay: 0, disabled: false },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

/* ─── Overview ─── 첫 화면 = 툴팁이 떠 있는 상태(클릭/hover 불필요). 갤러리 프리뷰로도 재사용(정적 인라인). */
export const Overview: Story = {
  name: "Overview",
  tags: ["gallery"],
  render: () => (
    <div style={{ position: "relative", paddingTop: 32, display: "inline-block" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", padding: "6px 10px", background: "#111", color: "#fff", borderRadius: 6, fontSize: 11, whiteSpace: "nowrap" }}>
        툴팁 내용
        <span aria-hidden style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 8, height: 8, background: "#111" }} />
      </div>
      <div style={{ display: "inline-block", padding: "6px 12px", border: "1px solid #D8D8D8", borderRadius: 8, fontSize: 13, color: "#111" }}>Hover</div>
    </div>
  ),
};

/** hover 없이도 보이도록 trigger 를 감싸 충분한 여백을 둔 미리보기 프레임. */
const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: 96, display: "inline-flex" }}>{children}</div>
);

const QuestionTrigger: React.FC = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 20,
      height: 20,
      color: "#999999",
      cursor: "help",
    }}
  >
    <CashwalkBizQuestionIcon size={18} />
  </span>
);

/* ─── 1. Playground ─── */

export const Playground: Story = {
  render: (args) => (
    <Frame>
      <Tooltip {...args} content="삭제하면 복구할 수 없어요">
        <QuestionTrigger />
      </Tooltip>
    </Frame>
  ),
};

/* ─── 2. 짧은 힌트 (단일/두 줄) ─── */

export const ShortHint: Story = {
  name: "Variant/짧은 힌트 (자동 줄바꿈)",
  render: () => (
    <Frame>
      <Tooltip
        placement="bottom"
        delay={0}
        content="광고할 브랜드가 아닌, 광고계정들을 운영할 팀이나 회사의 사업자등록번호를 입력해 주세요"
      >
        <QuestionTrigger />
      </Tooltip>
    </Frame>
  ),
};

/* ─── 3. 리치 안내 (제목 + 불릿) — 캐포비 권한 안내 ─── */

export const RichContent: Story = {
  name: "Variant/리치 안내 (제목+불릿)",
  parameters: {
    docs: {
      description: {
        story:
          "제목 + 불릿 멀티라인 리치 본문. content 에 ReactNode 를 넘기면 됨(HTML 은 `<template slot=\"content\">`). 캐포비 어드민 '권한 안내' 형태. (Figma 3001-51600)",
      },
    },
  },
  render: () => (
    <Frame>
      <Tooltip
        placement="bottom"
        delay={0}
        content={
          <div style={{ width: 314 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>권한 안내</p>
            <ul style={{ margin: "4px 0 0", paddingLeft: 22, listStyle: "disc" }}>
              <li>
                비즈니스 계정 : <strong>모든 광고 계정</strong>에 접근할 수 있으며, 광고 계정 생성
                및 수정 권한을 가집니다.
              </li>
              <li style={{ marginTop: 4 }}>
                일반 계정 : <strong>초대된 광고 계정</strong>에 한해 광고 조회 및 관리가 가능합니다.
              </li>
            </ul>
          </div>
        }
      >
        <QuestionTrigger />
      </Tooltip>
    </Frame>
  ),
};

/* ─── 4. Placement 4종 ─── */

export const Placements: Story = {
  name: "Variant/Placement (top/bottom/left/right)",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, auto)",
        gap: 96,
        padding: 96,
        justifyItems: "center",
      }}
    >
      {(["top", "bottom", "left", "right"] as const).map((p) => (
        <Tooltip key={p} placement={p} delay={0} content={`placement="${p}"`}>
          <QuestionTrigger />
        </Tooltip>
      ))}
    </div>
  ),
};
