import React, { useEffect } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast } from "../../src/Toast";

const { Provider: ToastProvider, useToast } = Toast;

function ToastHarness({
  duration = 3000,
  action = false,
}: {
  duration?: number;
  action?: boolean;
}) {
  const { toast } = useToast();

  return (
    <button
      type="button"
      onClick={() =>
        toast("저장되었습니다", {
          duration,
          action: action ? { label: "되돌리기", onClick: vi.fn() } : undefined,
        })
      }
    >
      토스트 열기
    </button>
  );
}

describe("Toast 사용자 시나리오", () => {
  it("버튼 클릭 시 토스트 메시지가 나타난다", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "토스트 열기" }));
    expect(await screen.findByText("저장되었습니다")).toBeVisible();
  });

  it("설정된 시간이 지나면 토스트가 사라진다", async () => {
    vi.useFakeTimers();

    render(
      <ToastProvider duration={100}>
        <ToastHarness duration={100} />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "토스트 열기" }));
    expect(screen.getByText("저장되었습니다")).toBeVisible();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const toast = screen.getByRole("status");
    expect(toast).toHaveAttribute("data-exiting", "true");

    act(() => {
      fireEvent.animationEnd(toast);
    });

    expect(screen.queryByText("저장되었습니다")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("액션 버튼이 포함된 토스트를 표시할 수 있다", async () => {
    const user = userEvent.setup();

    function ActionToastHarness() {
      const { toast } = useToast();
      const onUndo = vi.fn();
      return (
        <>
          <button
            onClick={() =>
              toast("삭제되었습니다", { action: { label: "되돌리기", onClick: onUndo } })
            }
          >
            삭제
          </button>
          <span data-testid="undo-target" />
        </>
      );
    }

    render(
      <ToastProvider>
        <ActionToastHarness />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(await screen.findByText("삭제되었습니다")).toBeVisible();
    expect(screen.getByRole("button", { name: "되돌리기" })).toBeVisible();
  });

  it("여러 토스트를 연속으로 표시할 수 있다", async () => {
    const user = userEvent.setup();

    function MultiToastHarness() {
      const { toast } = useToast();
      return (
        <>
          <button onClick={() => toast("첫 번째")}>토스트 1</button>
          <button onClick={() => toast("두 번째")}>토스트 2</button>
        </>
      );
    }

    render(
      <ToastProvider>
        <MultiToastHarness />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "토스트 1" }));
    await user.click(screen.getByRole("button", { name: "토스트 2" }));

    expect(await screen.findByText("첫 번째")).toBeVisible();
    expect(await screen.findByText("두 번째")).toBeVisible();
  });
});

describe("Toast 브랜치 커버리지: 명령형 API", () => {
  it("showToast를 Provider 없이 호출하면 경고 메시지를 출력한다", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // globalToast가 null인 상태에서 호출
    Toast.show("테스트");

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("ToastProvider가 마운트되지 않았습니다"),
    );
    warnSpy.mockRestore();
  });

  it("setGlobalToast로 연결 후 showToast가 동작한다", async () => {
    const user = userEvent.setup();

    function ConnectedHarness() {
      const { toast } = useToast();
      useEffect(() => {
        Toast.setGlobalToast(toast);
      }, [toast]);
      return <button onClick={() => Toast.show("외부 호출")}>외부 토스트</button>;
    }

    render(
      <ToastProvider>
        <ConnectedHarness />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "외부 토스트" }));
    expect(await screen.findByText("외부 호출")).toBeVisible();
  });
});

describe("Toast 접근성", () => {
  it("에러 토스트는 role=alert, aria-live=assertive로 즉시 읽힌다", async () => {
    const user = userEvent.setup();

    function ErrorHarness() {
      const { toast } = useToast();
      return <button onClick={() => toast("오류 발생", { variant: "error" })}>에러 토스트</button>;
    }

    render(
      <ToastProvider>
        <ErrorHarness />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "에러 토스트" }));

    const toastEl = await screen.findByText("오류 발생");
    const item = toastEl.closest('[data-slot="item"]')!;

    expect(item).toHaveAttribute("role", "alert");
    expect(item).toHaveAttribute("aria-live", "assertive");
  });

  it("일반 토스트는 role=status로 보조 기술에 공손하게 전달된다", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "토스트 열기" }));

    const toastEl = await screen.findByText("저장되었습니다");
    const item = toastEl.closest('[data-slot="item"]')!;

    expect(item).toHaveAttribute("role", "status");
  });

  it("토스트 내 액션 버튼이 키보드로 접근 가능하다", async () => {
    const user = userEvent.setup();

    function ActionHarness() {
      const { toast } = useToast();
      return (
        <button onClick={() => toast("완료", { action: { label: "확인", onClick: vi.fn() } })}>
          열기
        </button>
      );
    }

    render(
      <ToastProvider>
        <ActionHarness />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));
    const actionBtn = await screen.findByRole("button", { name: "확인" });
    expect(actionBtn).toBeVisible();
  });
});
