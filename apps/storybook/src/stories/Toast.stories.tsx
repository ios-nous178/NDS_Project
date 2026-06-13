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

/* ─── Overview (gallery) ─── */

// 갤러리용 정적 프리뷰 — Toast 는 portal·자동소멸이라 트리거 버튼만 두면 카드에 아무것도 안 보인다.
// 열린 토스트 UI 자체를 nds-toast__item / __message 클래스로 인라인 정적 렌더(viewport 는 position:fixed 라 제외).
export const Overview: Story = {
  name: "Overview",
  parameters: { layout: "padded" },
  render: () => (
    <div className="nds-toast__item" role="status">
      <span className="nds-toast__message">저장되었습니다</span>
    </div>
  ),
};

/* ─── Helpers reused by interaction tests ─── */

function DefaultToastExample() {
  const { toast } = useToast();
  return <Button onClick={() => toast("저장되었습니다")}>토스트 표시</Button>;
}

function TopShapeExample() {
  const { toast } = useToast();
  return <Button onClick={() => toast("저장되었습니다")}>상단 · pill</Button>;
}

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

/* ─── Position in context (실제 화면 위 노출 위치) ─── */

// Toast viewport 는 position:fixed portal 이라 프레임 안에 가둘 수 없다 → 정적 nds-toast 마크업으로
// 화면 어디에 어떤 모양으로 뜨는지(상단 pill / 하단 rounded 24)만 보여준다. (position = shape)
function ToastFrame({
  label,
  position,
  message,
}: {
  label: string;
  position: "top" | "bottom";
  message: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <span style={frameLabel}>{label}</span>
      <div style={phoneFrame}>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }} aria-hidden>
          <div style={{ height: 12, width: 128, borderRadius: 4, background: "#E8E8E8" }} />
          <div style={{ height: 56, borderRadius: 10, background: "#F3F4F6" }} />
          <div style={{ height: 56, borderRadius: 10, background: "#F3F4F6" }} />
        </div>
        <div
          className="nds-toast__viewport"
          data-position={position}
          style={{ position: "absolute" }}
        >
          <div className="nds-toast__item" role="status">
            <span className="nds-toast__message">{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const PositionInContext: Story = {
  name: "State/노출 위치 (화면 위)",
  tags: ["gallery"],
  render: () => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ToastFrame label="하단 노출 (rounded 24)" position="bottom" message="저장되었습니다" />
    </div>
  ),
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

/* ─── styles ─── */

const phoneFrame: React.CSSProperties = {
  position: "relative",
  width: 260,
  height: 380,
  borderRadius: 28,
  border: "8px solid #1F2937",
  background: "#FFF",
  overflow: "hidden",
  boxSizing: "border-box",
};

const frameLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#666",
};
