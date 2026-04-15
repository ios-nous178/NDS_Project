import React, { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "../../src/Modal";

function ModalHarness(props: Partial<React.ComponentProps<typeof Modal>> = {}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>열기</button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="테스트 모달"
        confirmText="확인"
        onConfirm={(close) => close()}
        closeText="취소"
        {...props}
      >
        본문 콘텐츠
      </Modal>
    </>
  );
}

describe("Modal", () => {
  it("renders into a portal on document.body when open", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog.closest("body")).toBe(document.body);
  });

  it("closes on ESC key", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    await user.click(screen.getByText("열기"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when overlay is clicked", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    await user.click(screen.getByText("열기"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const root = screen.getByRole("dialog").closest("[data-slot='root']")!;
    const overlay = within(root as HTMLElement).getByText(
      (_content, element) => element?.getAttribute("data-slot") === "overlay",
    );
    await user.click(overlay);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does NOT close on overlay click when isMaskClose=false", async () => {
    const user = userEvent.setup();
    render(<ModalHarness isMaskClose={false} />);

    await user.click(screen.getByText("열기"));
    const root = screen.getByRole("dialog").closest("[data-slot='root']")!;
    const overlay = within(root as HTMLElement).getByText(
      (_content, element) => element?.getAttribute("data-slot") === "overlay",
    );
    await user.click(overlay);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("traps focus within the dialog (Tab cycling)", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("dialog");
    const buttons = within(dialog).getAllByRole("button");
    const lastButton = buttons[buttons.length - 1];
    const firstButton = buttons[0];

    lastButton.focus();
    expect(lastButton).toHaveFocus();

    await user.tab();
    expect(firstButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(lastButton).toHaveFocus();
  });

  it("restores focus to the trigger after closing", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    const trigger = screen.getByText("열기");
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });

  it("locks body scroll when open and restores when closed", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    expect(document.body.style.overflow).not.toBe("hidden");

    await user.click(screen.getByText("열기"));
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("sets correct aria attributes", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");

    const labelId = dialog.getAttribute("aria-labelledby")!;
    expect(document.getElementById(labelId)?.textContent).toBe("테스트 모달");
  });

  it("closes when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    await user.click(screen.getByText("열기"));
    await user.click(screen.getByText("취소"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onConfirm and closes when the confirm button is clicked", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    await user.click(screen.getByText("열기"));
    await user.click(screen.getByText("확인"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Modal 브랜치 커버리지: Flat API 옵션 조합", () => {
  it("mask=false이면 오버레이가 렌더링되지 않는다", async () => {
    const user = userEvent.setup();
    render(<ModalHarness mask={false} />);

    await user.click(screen.getByText("열기"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='overlay']")).not.toBeInTheDocument();
  });

  it("closable=true이면 닫기(✕) 버튼이 표시되고 클릭으로 닫힌다", async () => {
    const user = userEvent.setup();
    render(<ModalHarness closable={true} />);

    await user.click(screen.getByText("열기"));
    const closeBtn = screen.getByRole("button", { name: "모달 닫기" });
    expect(closeBtn).toBeInTheDocument();

    await user.click(closeBtn);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("showModalButtonGroup=false이면 푸터가 렌더링되지 않는다", async () => {
    const user = userEvent.setup();
    render(<ModalHarness showModalButtonGroup={false} />);

    await user.click(screen.getByText("열기"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='footer']")).not.toBeInTheDocument();
  });

  it("onConfirm만 있고 onClose가 없으면 확인 버튼만 표시된다", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();

    function ConfirmOnly() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Modal
            open={open}
            onConfirm={(close) => {
              onConfirm();
              close();
            }}
            confirmText="확인"
          >
            본문
          </Modal>
        </>
      );
    }

    render(<ConfirmOnly />);
    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("dialog");
    const buttons = within(dialog).getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent("확인");

    await user.click(buttons[0]);
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("title 없이 closable만 있으면 헤더에 제목 없이 닫기 버튼만 표시된다", async () => {
    const user = userEvent.setup();
    render(<ModalHarness title={undefined} closable={true} />);

    await user.click(screen.getByText("열기"));

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "모달 닫기" })).toBeInTheDocument();
  });

  it("title과 closable 모두 없으면 헤더가 렌더링되지 않는다", async () => {
    const user = userEvent.setup();
    render(<ModalHarness title={undefined} closable={false} />);

    await user.click(screen.getByText("열기"));
    expect(document.querySelector("[data-slot='header']")).not.toBeInTheDocument();
  });

  it("maxWidth를 설정하면 CSS 변수로 적용된다", async () => {
    const user = userEvent.setup();
    render(<ModalHarness maxWidth={500} />);

    await user.click(screen.getByText("열기"));
    const content = screen.getByRole("dialog");
    expect(content.style.getPropertyValue("--nds-modal-max-width")).toBe("500px");
  });
});

describe("Modal 브랜치 커버리지: Compound API", () => {
  it("Header에 children을 전달하면 커스텀 제목이 렌더링된다", async () => {
    const user = userEvent.setup();

    function CompoundModal() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Modal.Root open={open} onClose={() => setOpen(false)}>
            <Modal.Overlay />
            <Modal.Content>
              <Modal.Header closable>
                <span>커스텀 헤더</span>
              </Modal.Header>
              <Modal.Body>본문</Modal.Body>
              <Modal.Footer onConfirm={(close) => close()} confirmText="OK" />
            </Modal.Content>
          </Modal.Root>
        </>
      );
    }

    render(<CompoundModal />);
    await user.click(screen.getByText("열기"));

    expect(screen.getByText("커스텀 헤더")).toBeVisible();
    expect(screen.getByRole("button", { name: "모달 닫기" })).toBeInTheDocument();
  });

  it("Footer에 children을 전달하면 커스텀 푸터가 렌더링된다 (data-layout=custom)", async () => {
    const user = userEvent.setup();
    const onCustom = vi.fn();

    function CompoundModal() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Modal.Root open={open} onClose={() => setOpen(false)}>
            <Modal.Content>
              <Modal.Body>본문</Modal.Body>
              <Modal.Footer>
                <button onClick={onCustom}>커스텀 버튼</button>
              </Modal.Footer>
            </Modal.Content>
          </Modal.Root>
        </>
      );
    }

    render(<CompoundModal />);
    await user.click(screen.getByText("열기"));

    const footer = document.querySelector("[data-slot='footer']")!;
    expect(footer).toHaveAttribute("data-layout", "custom");

    await user.click(screen.getByText("커스텀 버튼"));
    expect(onCustom).toHaveBeenCalledOnce();
  });

  it("Footer에 onClose만 있고 onConfirm이 없으면 취소 버튼만 표시된다", async () => {
    const user = userEvent.setup();

    function CompoundModal() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Modal.Root open={open} onClose={() => setOpen(false)}>
            <Modal.Content>
              <Modal.Body>본문</Modal.Body>
              <Modal.Footer onClose={() => setOpen(false)} closeText="닫기" />
            </Modal.Content>
          </Modal.Root>
        </>
      );
    }

    render(<CompoundModal />);
    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("dialog");
    const buttons = within(dialog).getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent("닫기");

    await user.click(buttons[0]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Content에 aria-label을 설정하면 aria-labelledby 대신 사용된다", async () => {
    const user = userEvent.setup();

    function CompoundModal() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Modal.Root open={open} onClose={() => setOpen(false)}>
            <Modal.Content aria-label="접근성 라벨">
              <Modal.Body>본문</Modal.Body>
            </Modal.Content>
          </Modal.Root>
        </>
      );
    }

    render(<CompoundModal />);
    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-label", "접근성 라벨");
    expect(dialog).not.toHaveAttribute("aria-labelledby");
  });

  it("포커스 가능한 요소가 없으면 Tab 시 콘텐츠 자체에 포커스가 유지된다", async () => {
    const user = userEvent.setup();

    function CompoundModal() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Modal.Root open={open} onClose={() => setOpen(false)}>
            <Modal.Content>
              <Modal.Body>포커스 가능한 요소 없음</Modal.Body>
            </Modal.Content>
          </Modal.Root>
        </>
      );
    }

    render(<CompoundModal />);
    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveFocus();

    await user.tab();
    expect(dialog).toHaveFocus();
  });
});

describe("Modal 브랜치 커버리지: slotProps & className 전달", () => {
  it("Flat API의 각 className/style prop이 슬롯에 적용된다", async () => {
    const user = userEvent.setup();
    render(
      <ModalHarness
        className="root-cls"
        overlayClassName="overlay-cls"
        contentClassName="content-cls"
        headerClassName="header-cls"
        bodyClassName="body-cls"
        footerClassName="footer-cls"
      />,
    );

    await user.click(screen.getByText("열기"));

    expect(document.querySelector("[data-slot='root']")!.className).toContain("root-cls");
    expect(document.querySelector("[data-slot='overlay']")!.className).toContain("overlay-cls");
    expect(document.querySelector("[data-slot='content']")!.className).toContain("content-cls");
    expect(document.querySelector("[data-slot='header']")!.className).toContain("header-cls");
    expect(document.querySelector("[data-slot='body']")!.className).toContain("body-cls");
    expect(document.querySelector("[data-slot='footer']")!.className).toContain("footer-cls");
  });

  it("slotProps로 header titleClassName이 적용된다", async () => {
    const user = userEvent.setup();
    render(
      <ModalHarness
        slotProps={{
          header: { titleClassName: "my-title" },
        }}
      />,
    );

    await user.click(screen.getByText("열기"));
    const heading = screen.getByRole("heading", { name: "테스트 모달" });
    expect(heading.className).toContain("my-title");
  });
});
