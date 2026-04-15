import React, { useState } from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BottomSheet } from "../../src/BottomSheet";

function BSHarness(props: Partial<React.ComponentProps<typeof BottomSheet>> = {}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>열기</button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="바텀시트 제목"
        closable
        {...props}
      >
        바텀시트 본문
      </BottomSheet>
    </>
  );
}

describe("BottomSheet", () => {
  it("renders into a portal when open", async () => {
    const user = userEvent.setup();
    render(<BSHarness />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog.closest("body")).toBe(document.body);
  });

  it("closes on ESC key (triggers closing animation)", async () => {
    const user = userEvent.setup();
    render(<BSHarness />);

    await user.click(screen.getByText("열기"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    // closing animation is triggered — data-closing="true" set on root
    const root = document.querySelector("[data-slot='root']");
    expect(root).toHaveAttribute("data-closing", "true");

    // simulate animationend to complete the close
    fireEvent.animationEnd(root!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when overlay is clicked", async () => {
    const user = userEvent.setup();
    render(<BSHarness />);

    await user.click(screen.getByText("열기"));

    const root = screen.getByRole("dialog").closest("[data-slot='root']")!;
    const overlay = root.querySelector("[data-slot='overlay']")!;
    await user.click(overlay);

    expect(root).toHaveAttribute("data-closing", "true");

    fireEvent.animationEnd(root);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does NOT close on overlay click when isMaskClose=false", async () => {
    const user = userEvent.setup();
    render(<BSHarness isMaskClose={false} />);

    await user.click(screen.getByText("열기"));

    const root = screen.getByRole("dialog").closest("[data-slot='root']")!;
    const overlay = root.querySelector("[data-slot='overlay']")!;
    await user.click(overlay);

    expect(root).toHaveAttribute("data-closing", "false");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("traps focus within the dialog", async () => {
    const user = userEvent.setup();
    render(<BSHarness />);

    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("dialog");
    const closeButton = within(dialog).getByLabelText("닫기");

    closeButton.focus();
    expect(closeButton).toHaveFocus();

    // Tab from last focusable should wrap to first
    await user.tab();
    await user.tab({ shift: true });
    expect(closeButton).toHaveFocus();
  });

  it("locks body scroll when open", async () => {
    const user = userEvent.setup();
    render(<BSHarness />);

    expect(document.body.style.overflow).not.toBe("hidden");

    await user.click(screen.getByText("열기"));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closes when the X button is clicked", async () => {
    const user = userEvent.setup();
    render(<BSHarness />);

    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("dialog");
    const closeBtn = within(dialog).getByLabelText("닫기");
    await user.click(closeBtn);

    const root = document.querySelector("[data-slot='root']");
    fireEvent.animationEnd(root!);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("has correct aria attributes", async () => {
    const user = userEvent.setup();
    render(<BSHarness />);

    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
  });
});

describe("BottomSheet 브랜치 커버리지: Flat API 옵션 조합", () => {
  it("mask=false이면 오버레이가 렌더링되지 않는다", async () => {
    const user = userEvent.setup();
    render(<BSHarness mask={false} />);

    await user.click(screen.getByText("열기"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='overlay']")).not.toBeInTheDocument();
  });

  it("showHandle=false이면 핸들이 렌더링되지 않는다", async () => {
    const user = userEvent.setup();
    render(<BSHarness showHandle={false} />);

    await user.click(screen.getByText("열기"));
    expect(document.querySelector("[data-slot='handle']")).not.toBeInTheDocument();
  });

  it("showHandle=true(기본값)이면 aria-hidden 핸들이 표시된다", async () => {
    const user = userEvent.setup();
    render(<BSHarness />);

    await user.click(screen.getByText("열기"));
    const handle = document.querySelector("[data-slot='handle']");
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute("aria-hidden", "true");
  });

  it("closable=false이면 닫기 버튼이 렌더링되지 않는다", async () => {
    const user = userEvent.setup();
    render(<BSHarness closable={false} />);

    await user.click(screen.getByText("열기"));
    expect(screen.queryByLabelText("닫기")).not.toBeInTheDocument();
  });

  it("title과 closable 모두 없으면 헤더가 렌더링되지 않는다", async () => {
    const user = userEvent.setup();
    render(<BSHarness title={undefined} closable={false} />);

    await user.click(screen.getByText("열기"));
    expect(document.querySelector("[data-slot='header']")).not.toBeInTheDocument();
  });

  it("footer가 없으면 푸터가 렌더링되지 않는다", async () => {
    const user = userEvent.setup();
    render(<BSHarness footer={undefined} />);

    await user.click(screen.getByText("열기"));
    expect(document.querySelector("[data-slot='footer']")).not.toBeInTheDocument();
  });

  it("footer가 있으면 푸터가 렌더링된다", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<BSHarness footer={<button onClick={onAction}>적용</button>} />);

    await user.click(screen.getByText("열기"));
    expect(document.querySelector("[data-slot='footer']")).toBeInTheDocument();

    await user.click(screen.getByText("적용"));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("maxWidth와 maxHeight가 CSS 변수로 적용된다", async () => {
    const user = userEvent.setup();
    render(<BSHarness maxWidth={400} maxHeight="60vh" />);

    await user.click(screen.getByText("열기"));
    const content = screen.getByRole("dialog");
    expect(content.style.getPropertyValue("--nds-bottom-sheet-max-width")).toBe("400px");
    expect(content.style.getPropertyValue("--nds-bottom-sheet-max-height")).toBe("60vh");
  });
});

describe("BottomSheet 브랜치 커버리지: Compound API", () => {
  it("Header에 children을 전달하면 커스텀 제목이 렌더링된다", async () => {
    const user = userEvent.setup();

    function CompoundBS() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <BottomSheet.Root open={open} onClose={() => setOpen(false)}>
            <BottomSheet.Content>
              <BottomSheet.Header closable>
                <span>커스텀 제목</span>
              </BottomSheet.Header>
              <BottomSheet.Body>본문</BottomSheet.Body>
            </BottomSheet.Content>
          </BottomSheet.Root>
        </>
      );
    }

    render(<CompoundBS />);
    await user.click(screen.getByText("열기"));

    expect(screen.getByText("커스텀 제목")).toBeVisible();
    expect(screen.getByRole("button", { name: "닫기" })).toBeInTheDocument();
  });

  it("Content에 aria-label을 설정하면 aria-labelledby 대신 사용된다", async () => {
    const user = userEvent.setup();

    function CompoundBS() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <BottomSheet.Root open={open} onClose={() => setOpen(false)}>
            <BottomSheet.Content aria-label="접근성 라벨">
              <BottomSheet.Body>본문</BottomSheet.Body>
            </BottomSheet.Content>
          </BottomSheet.Root>
        </>
      );
    }

    render(<CompoundBS />);
    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-label", "접근성 라벨");
    expect(dialog).not.toHaveAttribute("aria-labelledby");
  });

  it("포커스 가능한 요소가 없으면 content 자체에 포커스된다", async () => {
    const user = userEvent.setup();

    function CompoundBS() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <BottomSheet.Root open={open} onClose={() => setOpen(false)}>
            <BottomSheet.Content>
              <BottomSheet.Body>포커스 요소 없음</BottomSheet.Body>
            </BottomSheet.Content>
          </BottomSheet.Root>
        </>
      );
    }

    render(<CompoundBS />);
    await user.click(screen.getByText("열기"));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveFocus();
  });

  it("Header에 title도 children도 없으면 data-has-title=false", async () => {
    const user = userEvent.setup();

    function CompoundBS() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <BottomSheet.Root open={open} onClose={() => setOpen(false)}>
            <BottomSheet.Content>
              <BottomSheet.Header closable />
              <BottomSheet.Body>본문</BottomSheet.Body>
            </BottomSheet.Content>
          </BottomSheet.Root>
        </>
      );
    }

    render(<CompoundBS />);
    await user.click(screen.getByText("열기"));

    const header = document.querySelector("[data-slot='header']")!;
    expect(header).toHaveAttribute("data-has-title", "false");
  });
});

describe("BottomSheet 브랜치 커버리지: slotProps", () => {
  it("slotProps로 각 슬롯에 className이 적용된다", async () => {
    const user = userEvent.setup();
    render(
      <BSHarness
        footer={<button>액션</button>}
        slotProps={{
          root: { className: "root-cls" },
          overlay: { className: "overlay-cls" },
          content: { className: "content-cls" },
          handle: { className: "handle-cls" },
          header: { className: "header-cls" },
          body: { className: "body-cls" },
          footer: { className: "footer-cls" },
        }}
      />,
    );

    await user.click(screen.getByText("열기"));

    expect(document.querySelector("[data-slot='root']")!.className).toContain("root-cls");
    expect(document.querySelector("[data-slot='overlay']")!.className).toContain("overlay-cls");
    expect(document.querySelector("[data-slot='content']")!.className).toContain("content-cls");
    expect(document.querySelector("[data-slot='handle']")!.className).toContain("handle-cls");
    expect(document.querySelector("[data-slot='header']")!.className).toContain("header-cls");
    expect(document.querySelector("[data-slot='body']")!.className).toContain("body-cls");
    expect(document.querySelector("[data-slot='footer']")!.className).toContain("footer-cls");
  });
});
