import React, { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DropdownMenu } from "../../src/DropdownMenu";

/* DropdownMenu 는 트리거(children) + 포털에 뜨는 role="menu" 패널로 구성된다.
 * 아이템은 role="menuitem" 버튼이며, 클릭하면 onSelect 후 메뉴가 자동으로 닫힌다.
 * 트리거에는 aria-haspopup="menu" / aria-expanded / aria-controls 가 주입된다. */

function MenuHarness(props: Partial<React.ComponentProps<typeof DropdownMenu>> = {}) {
  return (
    <DropdownMenu
      items={[
        { key: "edit", label: "수정" },
        { key: "share", label: "공유" },
        { key: "delete", label: "삭제", danger: true },
      ]}
      {...props}
    >
      <button>더보기</button>
    </DropdownMenu>
  );
}

describe("DropdownMenu 사용자 시나리오", () => {
  it("트리거를 클릭하면 메뉴가 열리고 아이템이 보인다", async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "더보기" }));

    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: "수정" })).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: "공유" })).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: "삭제" })).toBeInTheDocument();
  });

  it("트리거를 다시 클릭하면 메뉴가 토글되어 닫힌다", async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);

    const trigger = screen.getByRole("button", { name: "더보기" });
    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("아이템을 클릭하면 onSelect 가 실행되고 메뉴가 닫힌다", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onShare = vi.fn();

    render(
      <MenuHarness
        items={[
          { key: "edit", label: "수정", onSelect: onEdit },
          { key: "share", label: "공유", onSelect: onShare },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "더보기" }));
    await user.click(screen.getByRole("menuitem", { name: "수정" }));

    expect(onEdit).toHaveBeenCalledOnce();
    expect(onShare).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("Escape 를 누르면 메뉴가 닫히고 포커스가 트리거로 돌아온다", async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);

    const trigger = screen.getByRole("button", { name: "더보기" });
    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("패널 바깥을 클릭하면 메뉴가 닫힌다 (dismissable layer)", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <span data-testid="outside">바깥 영역</span>
        <MenuHarness />
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "더보기" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(screen.getByTestId("outside"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("트리거 본래의 onClick 핸들러도 함께 호출된다", async () => {
    const user = userEvent.setup();
    const ownClick = vi.fn();

    render(
      <DropdownMenu items={[{ key: "a", label: "항목" }]}>
        <button onClick={ownClick}>메뉴</button>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴" }));

    expect(ownClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});

describe("DropdownMenu 접근성", () => {
  it("트리거에 aria-haspopup='menu' 가 설정된다", () => {
    render(<MenuHarness />);
    expect(screen.getByRole("button", { name: "더보기" })).toHaveAttribute("aria-haspopup", "menu");
  });

  it("열림 상태가 aria-expanded 로 노출된다 (닫힘 false → 열림 true)", async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);

    const trigger = screen.getByRole("button", { name: "더보기" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("열리면 aria-controls 가 패널 id 를 가리키고, 닫히면 제거된다", async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);

    const trigger = screen.getByRole("button", { name: "더보기" });
    expect(trigger).not.toHaveAttribute("aria-controls");

    await user.click(trigger);
    const menu = screen.getByRole("menu");
    expect(trigger).toHaveAttribute("aria-controls", menu.id);
    expect(menu.id).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(trigger).not.toHaveAttribute("aria-controls");
  });

  it("문자열 라벨 그룹은 role='group' + aria-label 로 노출된다", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu
        groups={[
          {
            key: "actions",
            label: "액션",
            items: [
              { key: "edit", label: "수정" },
              { key: "dup", label: "복제" },
            ],
          },
        ]}
      >
        <button>더보기</button>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "더보기" }));

    const group = screen.getByRole("group", { name: "액션" });
    expect(group).toBeInTheDocument();
    expect(within(group).getAllByRole("menuitem")).toHaveLength(2);
  });
});

describe("DropdownMenu 비활성 아이템", () => {
  it("disabled 아이템은 disabled 속성을 가지며 클릭해도 onSelect 가 호출되지 않고 메뉴가 열린 채 유지된다", async () => {
    const user = userEvent.setup();
    const onArchive = vi.fn();

    render(
      <DropdownMenu
        items={[
          { key: "edit", label: "수정" },
          { key: "archive", label: "보관", onSelect: onArchive, disabled: true },
        ]}
      >
        <button>더보기</button>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "더보기" }));

    const disabledItem = screen.getByRole("menuitem", { name: "보관" });
    expect(disabledItem).toBeDisabled();
    expect(disabledItem).toHaveAttribute("data-disabled", "true");

    await user.click(disabledItem);
    // disabled 버튼이라 클릭이 무시되고 메뉴는 그대로 열려있다.
    expect(onArchive).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});

describe("DropdownMenu 엣지/변형", () => {
  it("groups 와 items 가 모두 없으면 빈 메뉴가 열린다 (크래시 없음)", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu items={[]}>
        <button>빈 메뉴</button>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "빈 메뉴" }));

    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(within(menu).queryAllByRole("menuitem")).toHaveLength(0);
  });

  it("danger 아이템에는 data-danger='true' 가 설정된다", async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);

    await user.click(screen.getByRole("button", { name: "더보기" }));

    expect(screen.getByRole("menuitem", { name: "삭제" })).toHaveAttribute("data-danger", "true");
    expect(screen.getByRole("menuitem", { name: "수정" })).toHaveAttribute("data-danger", "false");
  });

  it("leading/trailing 콘텐츠가 아이템 안에 렌더링된다", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu
        items={[
          {
            key: "copy",
            label: "링크 복사",
            leading: <span data-testid="lead">🔗</span>,
            trailing: "⌘C",
          },
        ]}
      >
        <button>더보기</button>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "더보기" }));

    const item = screen.getByRole("menuitem", { name: /링크 복사/ });
    expect(within(item).getByTestId("lead")).toBeInTheDocument();
    expect(within(item).getByText("⌘C")).toBeInTheDocument();
  });

  it("메뉴 패널은 포털을 통해 document.body 에 렌더된다", async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);

    await user.click(screen.getByRole("button", { name: "더보기" }));

    const menu = screen.getByRole("menu");
    expect(menu.closest("body")).toBe(document.body);
  });

  it("align='end' 는 패널 data-align 속성에 반영된다", async () => {
    const user = userEvent.setup();
    render(<MenuHarness align="end" />);

    await user.click(screen.getByRole("button", { name: "더보기" }));
    expect(screen.getByRole("menu")).toHaveAttribute("data-align", "end");
  });

  it("연속 사용: 열고 선택 후, 다시 열어 다른 아이템을 선택할 수 있다", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onShare = vi.fn();

    function Wrapper() {
      const [log, setLog] = useState<string[]>([]);
      return (
        <>
          <DropdownMenu
            items={[
              {
                key: "edit",
                label: "수정",
                onSelect: () => {
                  onEdit();
                  setLog((l) => [...l, "edit"]);
                },
              },
              {
                key: "share",
                label: "공유",
                onSelect: () => {
                  onShare();
                  setLog((l) => [...l, "share"]);
                },
              },
            ]}
          >
            <button>더보기</button>
          </DropdownMenu>
          <div data-testid="log">{log.join(",")}</div>
        </>
      );
    }

    render(<Wrapper />);
    const trigger = screen.getByRole("button", { name: "더보기" });

    await user.click(trigger);
    await user.click(screen.getByRole("menuitem", { name: "수정" }));
    expect(onEdit).toHaveBeenCalledOnce();

    await user.click(trigger);
    await user.click(screen.getByRole("menuitem", { name: "공유" }));
    expect(onShare).toHaveBeenCalledOnce();

    expect(screen.getByTestId("log")).toHaveTextContent("edit,share");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
