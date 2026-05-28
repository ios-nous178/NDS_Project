import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, waitFor, waitForElementToBeRemoved } from "storybook/test";
import { Toast, Button } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const { Provider: ToastProvider, useToast } = Toast;

const meta: Meta = {
  title: "Components/Toast",
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
    (Story) => (
      <ToastProvider>
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

/* ─── All Variants ─── */

function VariantsExample() {
  const { toast } = useToast();

  return (
    <div style={{ display: "flex", gap: "var(--semantic-gap-default)", flexWrap: "wrap" }}>
      <Button onClick={() => toast("기본 메시지입니다")}>Default</Button>
      <Button variant="soft" onClick={() => toast("저장이 완료되었습니다", { variant: "success" })}>
        Success
      </Button>
      <Button variant="soft" onClick={() => toast("오류가 발생했습니다", { variant: "error" })}>
        Error
      </Button>
      <Button variant="soft" onClick={() => toast("새 소식이 있습니다", { variant: "info" })}>
        Info
      </Button>
    </div>
  );
}

export const Variants: Story = {
  name: "State/Variants",
  render: () => <VariantsExample />,
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
  return (
    <Button onClick={() => toast("상단에 표시됩니다", { variant: "info" })}>상단 토스트</Button>
  );
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
          toast(`알림 ${count}`, {
            variant: ["default", "success", "error", "info"][count % 4] as
              | "default"
              | "success"
              | "error"
              | "info",
          });
        }}
      >
        연속 호출 (최대 3개)
      </Button>
    </div>
  );
}

export const Stacking: Story = {
  name: "Recipe/Stacking Max Count",
  render: () => <StackingExample />,
};

/* ─── With Action ─── */

function WithActionExample() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast("상담 예약이 취소되었습니다", {
          action: {
            label: "되돌리기",
            onClick: () => alert("되돌리기 실행"),
          },
        })
      }
    >
      액션 토스트
    </Button>
  );
}

export const WithAction: Story = {
  name: "Recipe/With Action",
  render: () => <WithActionExample />,
};

/* ─── Error + Action (실패 후 재시도) ─── */

function ErrorWithActionExample() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast("저장에 실패했습니다", {
          variant: "error",
          action: {
            label: "다시 시도",
            onClick: () => alert("재시도 실행"),
          },
        })
      }
    >
      에러 + 액션 토스트
    </Button>
  );
}

export const ErrorWithAction: Story = {
  name: "Recipe/Error With Action",
  render: () => <ErrorWithActionExample />,
};

/* ─── Success Flow (실무 시나리오) ─── */

function SuccessFlowExample() {
  const { toast } = useToast();

  return (
    <div style={{ display: "flex", gap: "var(--semantic-gap-default)" }}>
      <Button onClick={() => toast("프로필이 저장되었습니다", { variant: "success" })}>
        프로필 저장
      </Button>
      <Button
        variant="soft"
        onClick={() =>
          toast("상담 일정이 확정되었습니다", {
            variant: "success",
            action: { label: "일정 보기", onClick: () => alert("일정 페이지로 이동") },
          })
        }
      >
        일정 확정
      </Button>
    </div>
  );
}

export const SuccessFlow: Story = {
  name: "Recipe/Success Flow",
  render: () => <SuccessFlowExample />,
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

export const ToastVariantsInteraction: Story = {
  name: "Interaction/Toast Variants",
  render: () => <VariantsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "Error" }));
    await expect(within(document.body).getByText("오류가 발생했습니다")).toBeInTheDocument();
  },
};

export const ToastActionInteraction: Story = {
  name: "Interaction/Toast Action Button",
  render: () => <WithActionExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "액션 토스트" }));
    await expect(within(document.body).getByText("상담 예약이 취소되었습니다")).toBeInTheDocument();

    const actionButton = within(document.body).getByRole("button", { name: "되돌리기" });
    await expect(actionButton).toBeInTheDocument();
  },
};

export const ToastSuccessFlowInteraction: Story = {
  name: "Interaction/Success Flow",
  render: () => <SuccessFlowExample />,
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
