import React from "react";
import { render, screen, act } from "@testing-library/react";
import { DSHighlightProvider, DSMark, useDSHighlight } from "../../src/DSHighlight";

/**
 * DSHighlight는 개발자 전용 디버깅 도구이다.
 * 사용자(개발자)가 모드를 순환하고, 영역을 등록하는 시나리오를 테스트한다.
 */
describe("DSHighlight 사용 시나리오", () => {
  it("cycle()을 호출하면 모드가 off → area → component → all → off 순환한다", () => {
    const modes: string[] = [];

    function ModeTracker() {
      const { mode, cycle } = useDSHighlight();
      modes.push(mode);
      return <button onClick={cycle}>모드 전환</button>;
    }

    render(
      <DSHighlightProvider>
        <ModeTracker />
      </DSHighlightProvider>,
    );

    const button = screen.getByRole("button", { name: "모드 전환" });

    // off → area
    act(() => button.click());
    // area → component
    act(() => button.click());
    // component → all
    act(() => button.click());
    // all → off
    act(() => button.click());

    expect(modes).toEqual(["off", "area", "component", "all", "off"]);
  });

  it("DSMark로 감싼 영역의 자식 콘텐츠가 정상 렌더링된다", () => {
    render(
      <DSHighlightProvider>
        <DSMark label="헤더 영역">
          <nav>
            <a href="/home">홈</a>
            <a href="/about">소개</a>
          </nav>
        </DSMark>
      </DSHighlightProvider>,
    );

    expect(screen.getByRole("navigation")).toBeVisible();
    expect(screen.getByRole("link", { name: "홈" })).toBeVisible();
    expect(screen.getByRole("link", { name: "소개" })).toBeVisible();
  });

  it("Ctrl+Shift+D 키보드 단축키로 모드를 전환할 수 있다", () => {
    function ModeDisplay() {
      const { mode } = useDSHighlight();
      return <span data-testid="mode">{mode}</span>;
    }

    render(
      <DSHighlightProvider>
        <ModeDisplay />
      </DSHighlightProvider>,
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("off");

    // Ctrl+Shift+D 시뮬레이션
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "D",
          ctrlKey: true,
          shiftKey: true,
          bubbles: true,
        }),
      );
    });

    expect(screen.getByTestId("mode")).toHaveTextContent("area");
  });
});
