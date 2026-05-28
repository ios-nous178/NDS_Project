import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Snackbar } from "@nudge-design/react";

const meta: Meta<typeof Snackbar> = {
  title: "Components/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: { control: "radio", options: [undefined, "info", "success", "warning", "error"] },
    closable: { control: "boolean" },
  },
  args: { title: "변경사항이 저장됐어요" },
};

export default meta;
type Story = StoryObj<typeof Snackbar>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 480 }}>
      <Snackbar {...args} />
    </div>
  ),
};

export const WithAction: Story = {
  name: "Recipe/액션 버튼 (되돌리기)",
  render: function Render() {
    const [count, setCount] = useState(0);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-comfortable)" }}>
        <Snackbar
          title="감정 기록을 삭제했어요"
          actionLabel="되돌리기"
          onAction={() => setCount((c) => c + 1)}
        />
        <small>되돌리기 클릭: {count}회</small>
      </div>
    );
  },
};

export const Variants: Story = {
  name: "Variant/info success warning error",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--gap-comfortable)",
        width: 480,
      }}
    >
      <Snackbar variant="info" title="알려드려요" description="상담사 일정이 변경됐어요." />
      <Snackbar variant="success" title="저장 완료" description="다음 단계로 이동합니다." />
      <Snackbar variant="warning" title="주의" description="네트워크 연결이 불안정해요." />
      <Snackbar
        variant="error"
        title="저장 실패"
        description="잠시 후 다시 시도해주세요."
        actionLabel="다시 시도"
      />
    </div>
  ),
};

export const Closable: Story = {
  name: "State/닫기 버튼",
  render: function Render() {
    const [open, setOpen] = useState(true);
    if (!open) return <button onClick={() => setOpen(true)}>다시 표시</button>;
    return <Snackbar title="이 메시지는 닫을 수 있어요" closable onClose={() => setOpen(false)} />;
  },
};

export const DescriptionOnly: Story = {
  name: "Recipe/설명 없이",
  render: () => <Snackbar title="복사됐어요" />,
};
