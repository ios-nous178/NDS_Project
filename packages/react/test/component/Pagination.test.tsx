import React, { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../../src/Pagination";

/** 외부 state 로 page 를 제어하는 controlled 하네스 (스토리북 PaginationExample 미러) */
function PaginationHarness(props: Partial<React.ComponentProps<typeof Pagination>> = {}) {
  const [page, setPage] = useState(props.page ?? 1);
  return (
    <Pagination
      totalPages={props.totalPages ?? 5}
      {...props}
      page={page}
      onPageChange={(p) => {
        setPage(p);
        props.onPageChange?.(p);
      }}
    />
  );
}

describe("Pagination 사용자 시나리오", () => {
  it("페이지 번호를 클릭하면 onPageChange 가 그 페이지로 호출된다", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "3 페이지" }));
    expect(onPageChange).toHaveBeenCalledOnce();
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("다음 화살표는 현재 페이지 +1 로 이동한다", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "다음 페이지" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("이전 화살표는 현재 페이지 -1 로 이동한다", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination page={4} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "이전 페이지" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("현재 페이지 버튼을 다시 클릭하면 콜백이 호출되지 않는다 (no-op)", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "3 페이지" }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("controlled: 화살표로 이동하면 활성 페이지가 따라 움직인다", async () => {
    const user = userEvent.setup();
    render(<PaginationHarness page={2} totalPages={5} />);

    // 처음엔 2가 현재 페이지
    expect(screen.getByRole("button", { name: "2 페이지" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await user.click(screen.getByRole("button", { name: "다음 페이지" }));

    // 이제 3이 현재 페이지, 2는 더 이상 current 아님
    expect(screen.getByRole("button", { name: "3 페이지" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "2 페이지" })).not.toHaveAttribute("aria-current");
  });

  it("페이지 번호 클릭으로 점프한 뒤 화살표 이동까지 이어진다", async () => {
    const user = userEvent.setup();
    render(<PaginationHarness page={1} totalPages={5} />);

    await user.click(screen.getByRole("button", { name: "4 페이지" }));
    expect(screen.getByRole("button", { name: "4 페이지" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await user.click(screen.getByRole("button", { name: "이전 페이지" }));
    expect(screen.getByRole("button", { name: "3 페이지" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});

describe("Pagination 경계(disabled) 동작", () => {
  it("첫 페이지에서는 이전 화살표가 비활성화된다", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "이전 페이지" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "다음 페이지" })).toBeEnabled();
  });

  it("마지막 페이지에서는 다음 화살표가 비활성화된다", () => {
    render(<Pagination page={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "다음 페이지" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "이전 페이지" })).toBeEnabled();
  });

  it("비활성화된 이전 화살표는 클릭해도 콜백이 호출되지 않는다", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "이전 페이지" }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("비활성화된 다음 화살표는 클릭해도 콜백이 호출되지 않는다", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination page={5} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "다음 페이지" }));
    expect(onPageChange).not.toHaveBeenCalled();
  });
});

describe("Pagination 접근성", () => {
  it("nav 랜드마크가 aria-label 로 노출된다", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("navigation", { name: "페이지 네비게이션" })).toBeInTheDocument();
  });

  it("현재 페이지에만 aria-current='page' 가 부여된다", () => {
    render(<Pagination page={3} totalPages={5} onPageChange={() => {}} />);

    const nav = screen.getByRole("navigation", { name: "페이지 네비게이션" });
    const current = within(nav)
      .getAllByRole("button")
      .filter((b) => b.getAttribute("aria-current") === "page");

    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("3");
  });

  it("페이지 번호 버튼은 'N 페이지' 형태의 접근 가능한 이름을 가진다", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);

    expect(screen.getByRole("button", { name: "1 페이지" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5 페이지" })).toBeInTheDocument();
  });

  it("화살표 버튼은 텍스트가 없어도 aria-label 로 식별된다", () => {
    render(<Pagination page={2} totalPages={5} onPageChange={() => {}} />);

    expect(screen.getByRole("button", { name: "이전 페이지" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음 페이지" })).toBeInTheDocument();
  });

  it("키보드 Tab 으로 페이지 버튼에 포커스하고 Enter 로 이동할 수 있다", async () => {
    const user = userEvent.setup();
    render(<PaginationHarness page={1} totalPages={5} showArrows={false} />);

    // showArrows=false 라 첫 Tab 은 '1 페이지' 버튼
    await user.tab();
    expect(screen.getByRole("button", { name: "1 페이지" })).toHaveFocus();

    await user.tab();
    const second = screen.getByRole("button", { name: "2 페이지" });
    expect(second).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(second).toHaveAttribute("aria-current", "page");
  });

  it("비활성화된 화살표는 Tab 순서에서 제외된다", async () => {
    const user = userEvent.setup();
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);

    // 첫 페이지: 이전 화살표 disabled → 첫 Tab 은 '1 페이지' 로 간다
    await user.tab();
    expect(screen.getByRole("button", { name: "1 페이지" })).toHaveFocus();
  });
});

describe("Pagination 엣지/변형", () => {
  it("totalPages 가 0 이하면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(<Pagination page={1} totalPages={0} onPageChange={() => {}} />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("showArrows=false 면 화살표 버튼이 렌더되지 않는다", () => {
    render(<Pagination page={2} totalPages={5} showArrows={false} onPageChange={() => {}} />);

    expect(screen.queryByRole("button", { name: "이전 페이지" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "다음 페이지" })).not.toBeInTheDocument();
    // 페이지 번호 버튼은 여전히 존재
    expect(screen.getByRole("button", { name: "2 페이지" })).toBeInTheDocument();
  });

  it("페이지가 많으면 생략 부호(ellipsis)가 aria-hidden 으로 렌더된다", () => {
    const { container } = render(
      <Pagination page={10} totalPages={50} siblings={1} onPageChange={() => {}} />,
    );

    const ellipsis = container.querySelectorAll(".nds-pagination__ellipsis");
    expect(ellipsis.length).toBeGreaterThan(0);
    ellipsis.forEach((el) => {
      expect(el).toHaveAttribute("aria-hidden", "true");
    });

    // 첫/끝 페이지는 항상 노출된다
    expect(screen.getByRole("button", { name: "1 페이지" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "50 페이지" })).toBeInTheDocument();
  });

  it("siblings 수에 따라 현재 페이지 주변 형제 버튼이 더 노출된다", () => {
    const { rerender } = render(
      <Pagination page={10} totalPages={50} siblings={1} onPageChange={() => {}} />,
    );
    // siblings=1: 9,10,11 노출, 12 는 미노출
    expect(screen.getByRole("button", { name: "9 페이지" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "12 페이지" })).not.toBeInTheDocument();

    rerender(<Pagination page={10} totalPages={50} siblings={2} onPageChange={() => {}} />);
    // siblings=2: 8~12 노출
    expect(screen.getByRole("button", { name: "12 페이지" })).toBeInTheDocument();
  });

  it("totalPages 가 작으면 모든 페이지 번호가 ellipsis 없이 렌더된다", () => {
    const { container } = render(<Pagination page={2} totalPages={5} onPageChange={() => {}} />);

    for (let p = 1; p <= 5; p++) {
      expect(screen.getByRole("button", { name: `${p} 페이지` })).toBeInTheDocument();
    }
    expect(container.querySelectorAll(".nds-pagination__ellipsis")).toHaveLength(0);
  });
});
