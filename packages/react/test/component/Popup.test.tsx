import React, { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popup } from "../../src/Popup";

function PopupHarness(props: Partial<React.ComponentProps<typeof Popup>> = {}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>열기</button>
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        title="확인 팝업"
        description="정말 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={() => setOpen(false)}
        cancelText="취소"
        onCancel={() => setOpen(false)}
        {...props}
      />
    </>
  );
}

describe("Popup", () => {
  it("renders into a portal when open", async () => {
    const user = userEvent.setup();
    render(<PopupHarness />);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();

    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog.closest("body")).toBe(document.body);
  });

  it("closes on ESC key", async () => {
    const user = userEvent.setup();
    render(<PopupHarness />);

    await user.click(screen.getByText("열기"));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("closes when overlay is clicked", async () => {
    const user = userEvent.setup();
    render(<PopupHarness />);

    await user.click(screen.getByText("열기"));

    const root = screen.getByRole("alertdialog").closest("[data-slot='root']")!;
    const overlay = root.querySelector("[data-slot='overlay']")!;
    await user.click(overlay);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("does NOT close on overlay click when isMaskClose=false", async () => {
    const user = userEvent.setup();
    render(<PopupHarness isMaskClose={false} />);

    await user.click(screen.getByText("열기"));

    const root = screen.getByRole("alertdialog").closest("[data-slot='root']")!;
    const overlay = root.querySelector("[data-slot='overlay']")!;
    await user.click(overlay);

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("traps focus within the dialog (Tab cycling)", async () => {
    const user = userEvent.setup();
    render(<PopupHarness />);

    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("alertdialog");
    const buttons = within(dialog).getAllByRole("button");
    const firstButton = buttons[0];
    const lastButton = buttons[buttons.length - 1];

    lastButton.focus();
    expect(lastButton).toHaveFocus();

    await user.tab();
    expect(firstButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(lastButton).toHaveFocus();
  });

  it("restores focus to the trigger after closing", async () => {
    const user = userEvent.setup();
    render(<PopupHarness />);

    const trigger = screen.getByText("열기");
    await user.click(trigger);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });

  it("locks body scroll when open and restores when closed", async () => {
    const user = userEvent.setup();
    render(<PopupHarness />);

    expect(document.body.style.overflow).not.toBe("hidden");

    await user.click(screen.getByText("열기"));
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("has correct aria attributes", async () => {
    const user = userEvent.setup();
    render(<PopupHarness />);

    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");

    const titleId = dialog.getAttribute("aria-labelledby")!;
    expect(document.getElementById(titleId)?.textContent).toBe("확인 팝업");

    const descId = dialog.getAttribute("aria-describedby")!;
    expect(document.getElementById(descId)?.textContent).toBe("정말 삭제하시겠습니까?");
  });

  it("calls onConfirm when the confirm button is clicked", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<PopupHarness onConfirm={onConfirm} />);

    await user.click(screen.getByText("열기"));
    await user.click(screen.getByText("삭제"));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when the cancel button is clicked", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<PopupHarness onCancel={onCancel} />);

    await user.click(screen.getByText("열기"));
    await user.click(screen.getByText("취소"));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

describe("Popup 브랜치 커버리지: Flat API 옵션 조합", () => {
  it("onCancel이 없으면 취소 버튼이 렌더링되지 않는다 (확인만 표시)", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    function ConfirmOnly() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Popup
            open={open}
            onClose={() => setOpen(false)}
            title="알림"
            description="처리되었습니다"
            confirmText="확인"
            onConfirm={() => {
              onConfirm();
              setOpen(false);
            }}
          />
        </>
      );
    }

    render(<ConfirmOnly />);
    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("alertdialog");
    const buttons = within(dialog).getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent("확인");

    await user.click(buttons[0]);
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("title 없이 description만 있으면 제목 없이 설명만 표시된다", async () => {
    const user = userEvent.setup();

    function DescOnly() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Popup
            open={open}
            onClose={() => setOpen(false)}
            description="설명만 있는 팝업"
            onConfirm={() => setOpen(false)}
          />
        </>
      );
    }

    render(<DescOnly />);
    await user.click(screen.getByText("열기"));

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("설명만 있는 팝업")).toBeVisible();
  });

  it("description 없이 title만 있으면 제목만 표시된다", async () => {
    const user = userEvent.setup();

    function TitleOnly() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Popup
            open={open}
            onClose={() => setOpen(false)}
            title="제목만 있는 팝업"
            onConfirm={() => setOpen(false)}
          />
        </>
      );
    }

    render(<TitleOnly />);
    await user.click(screen.getByText("열기"));

    expect(screen.getByRole("heading", { name: "제목만 있는 팝업" })).toBeVisible();
    expect(document.querySelector("[data-slot='description']")).not.toBeInTheDocument();
  });

  it("maxWidth를 설정하면 CSS 변수로 적용된다", async () => {
    const user = userEvent.setup();
    render(<PopupHarness maxWidth={500} />);

    await user.click(screen.getByText("열기"));
    const content = screen.getByRole("alertdialog");
    expect(content.style.getPropertyValue("--nds-popup-max-width")).toBe("500px");
  });

  it("maxWidth를 설정하지 않으면 CSS 변수가 설정되지 않는다", async () => {
    const user = userEvent.setup();
    render(<PopupHarness />);

    await user.click(screen.getByText("열기"));
    const content = screen.getByRole("alertdialog");
    expect(content.style.getPropertyValue("--nds-popup-max-width")).toBe("");
  });
});

describe("Popup 브랜치 커버리지: Compound API", () => {
  it("Compound API로 커스텀 팝업을 구성할 수 있다", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    function CompoundPopup() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Popup.Root open={open} onClose={() => setOpen(false)}>
            <Popup.Overlay />
            <Popup.Content>
              <Popup.TextInfo>
                <Popup.Title>커스텀 제목</Popup.Title>
                <Popup.Description>커스텀 설명</Popup.Description>
              </Popup.TextInfo>
              <Popup.Actions>
                <Popup.CancelButton onClick={() => setOpen(false)}>아니오</Popup.CancelButton>
                <Popup.ConfirmButton
                  onClick={() => {
                    onConfirm();
                    setOpen(false);
                  }}
                >
                  예
                </Popup.ConfirmButton>
              </Popup.Actions>
            </Popup.Content>
          </Popup.Root>
        </>
      );
    }

    render(<CompoundPopup />);
    await user.click(screen.getByText("열기"));

    expect(screen.getByRole("heading", { name: "커스텀 제목" })).toBeVisible();
    expect(screen.getByText("커스텀 설명")).toBeVisible();

    // 2개 버튼 → data-single="false"
    expect(document.querySelector("[data-slot='actions']")).toHaveAttribute("data-single", "false");

    await user.click(screen.getByText("예"));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("포커스 가능한 버튼이 없으면 Tab 시 content에 포커스가 유지된다", async () => {
    const user = userEvent.setup();

    function NoButtonPopup() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Popup.Root open={open} onClose={() => setOpen(false)}>
            <Popup.Content>
              <Popup.TextInfo>
                <Popup.Title>버튼 없음</Popup.Title>
              </Popup.TextInfo>
            </Popup.Content>
          </Popup.Root>
        </>
      );
    }

    render(<NoButtonPopup />);
    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveFocus();
  });

  it("Overlay의 isMaskClose=false이면 클릭해도 닫히지 않는다", async () => {
    const user = userEvent.setup();

    function NoClosePopup() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Popup.Root open={open} onClose={() => setOpen(false)}>
            <Popup.Overlay isMaskClose={false} />
            <Popup.Content>
              <Popup.TextInfo>
                <Popup.Title>닫기 불가</Popup.Title>
              </Popup.TextInfo>
            </Popup.Content>
          </Popup.Root>
        </>
      );
    }

    render(<NoClosePopup />);
    await user.click(screen.getByText("열기"));

    const overlay = document.querySelector("[data-slot='overlay']")!;
    await user.click(overlay);

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });
});

describe("Popup 브랜치 커버리지: slotProps", () => {
  it("slotProps로 각 슬롯에 className이 적용된다", async () => {
    const user = userEvent.setup();
    render(
      <PopupHarness
        slotProps={{
          root: { className: "root-cls" },
          overlay: { className: "overlay-cls" },
          content: { className: "content-cls" },
          textInfo: { className: "text-cls" },
          title: { className: "title-cls" },
          description: { className: "desc-cls" },
          actions: { className: "actions-cls" },
          cancelButton: { className: "cancel-cls" },
          confirmButton: { className: "confirm-cls" },
        }}
      />,
    );

    await user.click(screen.getByText("열기"));

    expect(document.querySelector("[data-slot='root']")!.className).toContain("root-cls");
    expect(document.querySelector("[data-slot='overlay']")!.className).toContain("overlay-cls");
    expect(document.querySelector("[data-slot='content']")!.className).toContain("content-cls");
    expect(document.querySelector("[data-slot='text-info']")!.className).toContain("text-cls");
    expect(document.querySelector("[data-slot='title']")!.className).toContain("title-cls");
    expect(document.querySelector("[data-slot='description']")!.className).toContain("desc-cls");
    expect(document.querySelector("[data-slot='actions']")!.className).toContain("actions-cls");
    expect(document.querySelector("[data-slot='cancel-button']")!.className).toContain(
      "cancel-cls",
    );
    expect(document.querySelector("[data-slot='confirm-button']")!.className).toContain(
      "confirm-cls",
    );
  });
});
