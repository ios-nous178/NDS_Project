import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Snackbar } from "../../src/Snackbar";

// 액션(되돌리기/다시시도)·닫기 버튼은 Toast 가 아니라 Snackbar 의 책임이다.
// (Toast 는 인터랙션 없는 일시 메시지 전용 — Toast/Snackbar 분리)
const { Provider: SnackbarProvider, useSnackbar } = Snackbar;

describe("Snackbar 액션 시나리오", () => {
  it("액션 버튼이 포함된 스낵바를 표시하고 클릭하면 콜백이 실행된다", async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();

    function ActionHarness() {
      const { snackbar } = useSnackbar();
      return (
        <button
          onClick={() =>
            snackbar("삭제되었습니다", { action: { label: "되돌리기", onClick: onUndo } })
          }
        >
          삭제
        </button>
      );
    }

    render(
      <SnackbarProvider>
        <ActionHarness />
      </SnackbarProvider>,
    );

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(await screen.findByText("삭제되었습니다")).toBeVisible();
    const undoBtn = screen.getByRole("button", { name: "되돌리기" });
    expect(undoBtn).toBeVisible();

    await user.click(undoBtn);
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it("스낵바 내 액션 버튼이 키보드로 접근 가능하다", async () => {
    const user = userEvent.setup();

    function ActionHarness() {
      const { snackbar } = useSnackbar();
      return (
        <button onClick={() => snackbar("완료", { action: { label: "확인", onClick: vi.fn() } })}>
          열기
        </button>
      );
    }

    render(
      <SnackbarProvider>
        <ActionHarness />
      </SnackbarProvider>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));
    const actionBtn = await screen.findByRole("button", { name: "확인" });
    expect(actionBtn).toBeVisible();

    actionBtn.focus();
    expect(actionBtn).toHaveFocus();
  });
});
