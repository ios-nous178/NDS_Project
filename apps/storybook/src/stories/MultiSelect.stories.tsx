import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { MultiSelect, type MultiSelectOption } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta = {
  title: "Components/Controls/MultiSelect",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: getComponentDocsDescription("MultiSelect"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* ─── 광고 옵션 ─── */

const ADS: MultiSelectOption[] = [
  { value: "a", label: "캠페인 A 타겟팅" },
  { value: "b", label: "캠페인 B 리타겟" },
  { value: "c", label: "캠페인 C 포커싱" },
  { value: "d", label: "캠페인 D 리텐션" },
  { value: "e", label: "캠페인 E 신규" },
  { value: "f", label: "캠페인 F (종료)", disabled: true },
];

/** 드롭다운이 아래로 펼쳐지므로 여유 높이 확보용 래퍼 */
function Frame({ children }: { children: React.ReactNode }) {
  return <div style={{ width: 280, minHeight: 360 }}>{children}</div>;
}

export const Default: Story = {
  name: "State/기본 (닫힌 드롭다운)",
  render: () => {
    const Harness = () => {
      const [v, setV] = useState<string[]>([]);
      return (
        <Frame>
          <MultiSelect
            options={ADS}
            value={v}
            onValueChange={setV}
            placeholder="모든 광고"
            searchPlaceholder="광고명으로 검색"
          />
        </Frame>
      );
    };
    return <Harness />;
  },
};

export const Expanded: Story = {
  name: "State/펼침 (패널)",
  render: () => {
    const Harness = () => {
      const [v, setV] = useState<string[]>(["a", "c"]);
      return (
        <div style={{ width: 392, minHeight: 560 }}>
          <MultiSelect
            options={ADS}
            value={v}
            onValueChange={setV}
            placeholder="모든 광고"
            searchPlaceholder="광고명으로 검색하기"
          />
        </div>
      );
    };
    return <Harness />;
  },
  play: async ({ canvasElement }) => {
    // 패널을 열어둔 채 정지 — 새 구조(테두리 검색 / 전체선택 배경 / 우측 hug 푸터) 시각 확인용
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    await user.click(canvas.getByRole("button", { name: /모든 광고|개 선택/ }));
    await expect(canvas.getByRole("button", { name: "적용" })).toBeInTheDocument();
  },
};

export const Prefilled: Story = {
  tags: ["gallery"],
  name: "State/선택됨 (요약 표시)",
  render: () => {
    const Harness = () => {
      const [v, setV] = useState<string[]>(["a", "c"]);
      return (
        <Frame>
          <MultiSelect
            options={ADS}
            value={v}
            onValueChange={setV}
            placeholder="모든 광고"
            searchPlaceholder="광고명으로 검색"
          />
        </Frame>
      );
    };
    return <Harness />;
  },
};

export const Error: Story = {
  name: "State/에러",
  render: () => {
    const Harness = () => {
      const [v, setV] = useState<string[]>([]);
      return (
        <Frame>
          <MultiSelect
            options={ADS}
            value={v}
            onValueChange={setV}
            placeholder="광고를 선택하세요"
            error
          />
        </Frame>
      );
    };
    return <Harness />;
  },
};

export const Disabled: Story = {
  name: "State/비활성",
  render: () => (
    <Frame>
      <MultiSelect
        options={ADS}
        value={["a"]}
        onValueChange={() => undefined}
        placeholder="모든 광고"
        disabled
      />
    </Frame>
  ),
};

/* ─── Interaction Tests ─── */

export const OpenSelectApplyInteraction: Story = {
  name: "Interaction/열기 → 선택 → 적용",
  render: () => {
    const Harness = () => {
      const [v, setV] = useState<string[]>([]);
      return (
        <Frame>
          <MultiSelect
            options={ADS}
            value={v}
            onValueChange={setV}
            placeholder="모든 광고"
            searchPlaceholder="광고명으로 검색"
          />
        </Frame>
      );
    };
    return <Harness />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    // 닫힌 상태: 트리거에 placeholder
    const trigger = canvas.getByRole("button", { name: /모든 광고/ });
    await user.click(trigger);

    // 옵션 선택 (draft)
    await user.click(await canvas.findByText("캠페인 B 리타겟"));
    await user.click(canvas.getByText("캠페인 D 리텐션"));

    // 적용 전엔 트리거 요약이 그대로 (draft 만 변경)
    await expect(canvas.getByRole("button", { name: /모든 광고/ })).toBeInTheDocument();

    // 적용 → onValueChange 반영 → 요약 "2개 선택"
    await user.click(canvas.getByRole("button", { name: "적용" }));
    await expect(canvas.getByRole("button", { name: /2개 선택/ })).toBeInTheDocument();
  },
};

export const CancelDiscardsDraftInteraction: Story = {
  name: "Interaction/취소 → 초안 폐기",
  render: () => {
    const Harness = () => {
      const [v, setV] = useState<string[]>(["a"]);
      return (
        <Frame>
          <MultiSelect options={ADS} value={v} onValueChange={setV} placeholder="모든 광고" />
        </Frame>
      );
    };
    return <Harness />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    // 시작: 1개 선택
    await user.click(canvas.getByRole("button", { name: /1개 선택/ }));
    // 초안에서 하나 더 체크
    await user.click(canvas.getByText("캠페인 C 포커싱"));
    // 취소 → 초안 폐기, 적용값 유지(1개)
    await user.click(canvas.getByRole("button", { name: "취소" }));
    await expect(canvas.getByRole("button", { name: /1개 선택/ })).toBeInTheDocument();
  },
};
