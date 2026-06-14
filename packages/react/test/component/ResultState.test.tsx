import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultState } from "../../src/ResultState";

describe("ResultState 사용자 시나리오", () => {
  it("데이터가 없을 때 안내 메시지와 액션 버튼이 보인다", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(
      <ResultState
        title="등록된 일정이 없습니다"
        description="새로운 일정을 추가해보세요"
        action={<button onClick={onAdd}>일정 추가</button>}
      />,
    );

    // 사용자가 빈 화면에서 안내를 읽는다
    expect(screen.getByRole("heading", { name: "등록된 일정이 없습니다" })).toBeVisible();
    expect(screen.getByText("새로운 일정을 추가해보세요")).toBeVisible();

    // 액션 버튼을 클릭한다
    await user.click(screen.getByRole("button", { name: "일정 추가" }));
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it("줄바꿈이 포함된 설명이 올바르게 표시된다", () => {
    render(
      <ResultState
        title="검색 결과 없음"
        description={"검색어를 확인해주세요\n다른 키워드로 시도해보세요"}
      />,
    );

    // <br>로 분리되어 렌더링되므로 부분 텍스트 매칭 사용
    const description = screen.getByText(/검색어를 확인해주세요/);
    expect(description).toBeVisible();
    expect(description).toHaveTextContent("다른 키워드로 시도해보세요");
  });

  it("Compound API로 커스텀 빈 상태 화면을 구성할 수 있다", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ResultState.Root>
        <ResultState.Icon>
          <svg role="img" aria-label="에러 아이콘">
            <circle r="10" />
          </svg>
        </ResultState.Icon>
        <ResultState.Title>문제가 발생했습니다</ResultState.Title>
        <ResultState.Description>잠시 후 다시 시도해주세요</ResultState.Description>
        <ResultState.Action>
          <button onClick={onRetry}>다시 시도</button>
        </ResultState.Action>
      </ResultState.Root>,
    );

    expect(screen.getByRole("heading", { name: "문제가 발생했습니다" })).toBeVisible();
    expect(screen.getByText("잠시 후 다시 시도해주세요")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe("ResultState 접근성", () => {
  it("제목이 heading(h3) 요소로 문서 구조에 포함된다", () => {
    render(<ResultState title="비어 있음" />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("비어 있음");
  });

  it("장식용 아이콘은 스크린리더에서 숨겨진다 (aria-hidden)", () => {
    const { container } = render(<ResultState title="테스트" />);

    // 기본 아이콘(SVG)이 들어있는 아이콘 영역이 aria-hidden
    const iconWrapper = container.querySelector("[aria-hidden='true']");
    expect(iconWrapper).toBeInTheDocument();
    expect(iconWrapper?.querySelector("svg")).toBeInTheDocument();
  });

  it("액션 버튼이 키보드로 접근 가능하다", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();

    render(
      <ResultState
        title="프로젝트 없음"
        action={<button onClick={onCreate}>프로젝트 만들기</button>}
      />,
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "프로젝트 만들기" })).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onCreate).toHaveBeenCalledOnce();
  });
});

describe("ResultState 엣지 케이스 & slotProps", () => {
  it("minHeight가 숫자로 설정되면 px 단위의 CSS 변수가 적용된다", () => {
    const { container } = render(<ResultState title="높이" minHeight={400} />);
    const root = container.querySelector("[data-slot='root']") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-result-state-min-height")).toBe("400px");
  });

  it("minHeight가 문자열로 설정되면 그대로 CSS 변수에 적용된다", () => {
    const { container } = render(<ResultState title="높이" minHeight="50vh" />);
    const root = container.querySelector("[data-slot='root']") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-result-state-min-height")).toBe("50vh");
  });

  it("title만 제공하면 description과 action이 렌더링되지 않는다", () => {
    const { container } = render(<ResultState title="제목만" />);
    expect(container.querySelector("[data-slot='description']")).not.toBeInTheDocument();
    expect(container.querySelector("[data-slot='action']")).not.toBeInTheDocument();
  });

  it("description만 제공하면 title이 렌더링되지 않는다", () => {
    const { container } = render(<ResultState description="설명만" />);
    expect(container.querySelector("[data-slot='title']")).not.toBeInTheDocument();
    expect(screen.getByText("설명만")).toBeVisible();
  });

  it("아무 props 없이도 기본 아이콘과 함께 크래시 없이 렌더링된다", () => {
    const { container } = render(<ResultState />);
    expect(container.querySelector("[data-slot='root']")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='icon'] svg")).toBeInTheDocument();
  });

  it("slotProps로 각 슬롯에 className을 전달할 수 있다", () => {
    const { container } = render(
      <ResultState
        title="슬롯"
        description="설명"
        action={<button>액션</button>}
        slotProps={{
          root: { className: "root-custom" },
          icon: { className: "icon-custom" },
          title: { className: "title-custom" },
          description: { className: "desc-custom" },
          action: { className: "action-custom" },
        }}
      />,
    );

    expect(container.querySelector("[data-slot='root']")!.className).toContain("root-custom");
    expect(container.querySelector("[data-slot='icon']")!.className).toContain("icon-custom");
    expect(container.querySelector("[data-slot='title']")!.className).toContain("title-custom");
    expect(container.querySelector("[data-slot='description']")!.className).toContain(
      "desc-custom",
    );
    expect(container.querySelector("[data-slot='action']")!.className).toContain("action-custom");
  });

  it("className과 style이 root에 직접 적용된다", () => {
    const { container } = render(
      <ResultState title="스타일" className="my-empty" style={{ padding: 32 }} />,
    );
    const root = container.querySelector("[data-slot='root']") as HTMLElement;
    expect(root.className).toContain("my-empty");
    expect(root).toHaveStyle({ padding: "32px" });
  });
});
