import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, waitFor, waitForElementToBeRemoved } from "storybook/test";
import { Toast, Button } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const { Provider: ToastProvider, useToast } = Toast;

const meta: Meta = {
  title: "Components/Feedback/Toast",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Toast"),
      },
    },
  },
  decorators: [
    // 스토리별 parameters 로 position/maxCount 를 받는 단일 Provider — 중첩 Provider(=viewport 2개) 방지.
    (Story, ctx) => (
      <ToastProvider
        position={ctx.parameters.toastPosition ?? "bottom"}
        maxCount={ctx.parameters.toastMaxCount ?? 1}
      >
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj;

/* ─── Default ─── */

function DefaultToastExample() {
  const { toast } = useToast();

  return <Button onClick={() => toast("저장되었습니다")}>토스트 표시</Button>;
}

export const Default: Story = {
  name: "State/Default",
  render: () => <DefaultToastExample />,
};

/* ─── Position = Shape (Top: PC pill · Bottom: 모바일 rounded 24) ─── */

function BottomShapeExample() {
  const { toast } = useToast();
  return <Button onClick={() => toast("저장되었습니다")}>하단 · rounded 24</Button>;
}

export const BottomShape: Story = {
  tags: ["gallery"],
  name: "State/Bottom (모바일 · rounded 24)",
  render: () => <BottomShapeExample />,
};

function TopShapeExample() {
  const { toast } = useToast();
  return <Button onClick={() => toast("저장되었습니다")}>상단 · pill</Button>;
}

export const TopShape: Story = {
  name: "State/Top (PC · pill)",
  parameters: { toastPosition: "top" },
  render: () => <TopShapeExample />,
};

/* ─── Multiline ─── */

function MultilineExample() {
  const { toast } = useToast();

  return (
    <Button onClick={() => toast("상담 예약이 완료되었습니다\n확인 메일을 보내드렸습니다")}>
      멀티라인 토스트
    </Button>
  );
}

export const Multiline: Story = {
  name: "State/Multiline",
  render: () => <MultilineExample />,
};

/* ─── Custom Duration ─── */

function CustomDurationExample() {
  const { toast } = useToast();

  return (
    <div style={{ display: "flex", gap: "var(--semantic-gap-default)", flexWrap: "wrap" }}>
      <Button onClick={() => toast("1초 후 사라집니다", { duration: 1000 })}>1초</Button>
      <Button onClick={() => toast("5초 후 사라집니다", { duration: 5000 })}>5초</Button>
      <Button onClick={() => toast("10초 후 사라집니다", { duration: 10000 })}>10초</Button>
    </div>
  );
}

export const CustomDuration: Story = {
  name: "State/Custom Duration",
  render: () => <CustomDurationExample />,
};

/* ─── Top Position ─── */

function TopPositionExample() {
  return (
    <ToastProvider position="top">
      <TopPositionInner />
    </ToastProvider>
  );
}

function TopPositionInner() {
  const { toast } = useToast();
  return <Button onClick={() => toast("상단에 표시됩니다")}>상단 토스트</Button>;
}

export const TopPosition: Story = {
  name: "State/Top Position",
  render: () => <TopPositionExample />,
};

/* ─── Stacking (연속 호출) ─── */

function StackingExample() {
  const { toast } = useToast();
  let count = 0;

  return (
    <div style={{ display: "flex", gap: "var(--semantic-gap-default)" }}>
      <Button
        onClick={() => {
          count++;
          toast(`알림 ${count}`);
        }}
      >
        연속 호출 (최대 3개)
      </Button>
    </div>
  );
}

export const Stacking: Story = {
  tags: ["gallery"],
  name: "Recipe/Stacking Max Count (opt-in)",
  // 기본값은 1개 교체 — maxCount 를 올려야 스택된다.
  parameters: { toastMaxCount: 3 },
  render: () => <StackingExample />,
};

/* ─── Feedback Flow (실무 시나리오) ─── */

function FeedbackFlowExample() {
  const { toast } = useToast();

  return (
    <div style={{ display: "flex", gap: "var(--semantic-gap-default)" }}>
      <Button onClick={() => toast("프로필이 저장되었습니다")}>프로필 저장</Button>
      <Button variant="soft" onClick={() => toast("상담 일정이 확정되었습니다")}>
        일정 확정
      </Button>
    </div>
  );
}

export const FeedbackFlow: Story = {
  name: "Recipe/Feedback Flow",
  render: () => <FeedbackFlowExample />,
};

/* ─── Interaction Tests ─── */

export const ToastAppearInteraction: Story = {
  name: "Interaction/Toast Appears On Click",
  render: () => <DefaultToastExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "토스트 표시" }));
    await expect(within(document.body).getByText("저장되었습니다")).toBeInTheDocument();
  },
};

export const ToastTopShapeInteraction: Story = {
  name: "Interaction/Top Pill Appears",
  parameters: { toastPosition: "top" },
  render: () => <TopShapeExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "상단 · pill" }));
    await expect(within(document.body).getByText("저장되었습니다")).toBeInTheDocument();
  },
};

export const ToastFeedbackFlowInteraction: Story = {
  name: "Interaction/Feedback Flow",
  render: () => <FeedbackFlowExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "프로필 저장" }));
    await expect(within(document.body).getByText("프로필이 저장되었습니다")).toBeInTheDocument();
  },
};

/* ─── Edge Case Tests ─── */

export const ToastAutoDismissEdge: Story = {
  name: "Edge/Auto Dismiss After Duration",
  render: function Render() {
    const { toast } = useToast();
    return <Button onClick={() => toast("1초 후 사라짐", { duration: 1000 })}>짧은 토스트</Button>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "짧은 토스트" }));
    const toastEl = within(document.body).getByText("1초 후 사라짐");
    await expect(toastEl).toBeInTheDocument();

    await waitForElementToBeRemoved(() => within(document.body).queryByText("1초 후 사라짐"), {
      timeout: 3000,
    });
  },
};

export const ToastStackingLimitEdge: Story = {
  name: "Edge/Stacking Limit",
  render: function Render() {
    const { toast } = useToast();
    let count = 0;

    return (
      <Button
        onClick={() => {
          count++;
          toast(`메시지 ${count}`, { duration: 5000 });
        }}
      >
        연속 호출
      </Button>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const button = canvas.getByRole("button", { name: "연속 호출" });

    await user.click(button);
    await user.click(button);
    await user.click(button);
    await user.click(button);
    await user.click(button);

    await waitFor(() => {
      const toasts = within(document.body).queryAllByText(/^메시지 \d+$/);
      expect(toasts.length).toBeLessThanOrEqual(3);
    });
  },
};
