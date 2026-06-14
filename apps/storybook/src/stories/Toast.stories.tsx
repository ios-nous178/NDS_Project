import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, waitFor, waitForElementToBeRemoved } from "storybook/test";
import { Toast, Button } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";
import { SheetPreview } from "./sheetPreview";

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

/* ─── Position in context (바텀시트 본문 박스 위 노출) ─── */

// Toast viewport 는 position:fixed portal 이라 카드 안에 직접 못 가둔다 → 바텀시트 본문 박스
// (SheetPreview)를 그대로 가져와 그 폭에 맞춰 하단에 정적 토스트를 띄운다. (실제 앱 맥락 재현)
export const PositionInContext: Story = {
  name: "바텀시트 본문 위 하단 노출",
  tags: ["gallery"],
  render: () => (
    <SheetPreview title="감정 기록" floating>
      {/* data-position=bottom 은 rounded-24 모양을 위해 유지하되, viewport 의 fixed 위치/96px
          여백은 인라인으로 무력화 — SheetPreview 의 하단 슬롯이 배치를 담당. */}
      <div
        className="nds-toast__viewport"
        data-position="bottom"
        style={{ position: "static", padding: 0, width: "100%" }}
      >
        <div className="nds-toast__item" role="status" style={{ maxWidth: "100%" }}>
          <span className="nds-toast__message">저장되었습니다</span>
        </div>
      </div>
    </SheetPreview>
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

