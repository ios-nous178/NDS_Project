import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dim } from "../../src/Dim";

/**
 * Dim 은 표현용 백드롭 primitive. 강도(data-type)·애니메이션 토글·백드롭 클릭 닫기 동작을 검증.
 */
describe("Dim", () => {
  it("기본값 type=default · animated · aria-hidden 으로 렌더된다", () => {
    render(<Dim data-testid="dim" />);
    const dim = screen.getByTestId("dim");
    expect(dim.className).toContain("nds-dim");
    expect(dim.getAttribute("data-type")).toBe("default");
    expect(dim.getAttribute("data-animated")).toBe("true");
    expect(dim.getAttribute("aria-hidden")).toBe("true");
  });

  it("type 강도 변형을 data-type 으로 반영한다", () => {
    render(<Dim data-testid="dim" type="strong" />);
    expect(screen.getByTestId("dim").getAttribute("data-type")).toBe("strong");
  });

  it("animated=false 면 data-animated 가 없다", () => {
    render(<Dim data-testid="dim" animated={false} />);
    expect(screen.getByTestId("dim").hasAttribute("data-animated")).toBe(false);
  });

  it("백드롭 클릭 시 onClose 를 호출한다", () => {
    const onClose = vi.fn();
    render(<Dim data-testid="dim" onClose={onClose} />);
    fireEvent.click(screen.getByTestId("dim"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("onClick 이 preventDefault 하면 onClose 를 호출하지 않는다", () => {
    const onClose = vi.fn();
    render(
      <Dim data-testid="dim" onClose={onClose} onClick={(event) => event.preventDefault()} />,
    );
    fireEvent.click(screen.getByTestId("dim"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
