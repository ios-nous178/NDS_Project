import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "../../src/DatePicker";

/**
 * clear(×) ↔ 캘린더 아이콘 겹침 방지 — DS 는 swap 설계다: allowClear + value 면 트리거에
 * data-clearable="true" 가 붙고 CSS 가 캘린더 아이콘을 숨겨 그 자리에 × 를 놓는다(겹침 방지).
 * 이 wiring(× 렌더 ⇔ data-clearable)이 리팩터로 어긋나면 둘이 겹친다 — react 면도 회귀 고정.
 */
describe("DatePicker — clearable swap (× ↔ 캘린더 아이콘 겹침 방지)", () => {
  const triggerOf = (c: HTMLElement) =>
    c.querySelector('[data-slot="trigger"]') as HTMLButtonElement;

  it("allowClear + value → data-clearable=true · × 버튼 렌더", () => {
    const { container } = render(
      <DatePicker allowClear value={new Date(2026, 4, 25)} onChange={() => {}} onClear={() => {}} />,
    );
    expect(triggerOf(container).dataset.clearable).toBe("true");
    expect(screen.getByLabelText("날짜 지우기")).toBeInTheDocument();
  });

  it("값 없으면 × 미렌더 · data-clearable=false (캘린더 아이콘만)", () => {
    const { container } = render(<DatePicker allowClear value={undefined} onChange={() => {}} />);
    expect(triggerOf(container).dataset.clearable).toBe("false");
    expect(screen.queryByLabelText("날짜 지우기")).toBeNull();
  });

  it("allowClear 없으면 값이 있어도 × 미렌더", () => {
    const { container } = render(
      <DatePicker value={new Date(2026, 4, 25)} onChange={() => {}} />,
    );
    expect(triggerOf(container).dataset.clearable).toBe("false");
    expect(screen.queryByLabelText("날짜 지우기")).toBeNull();
  });

  it("disabled 면 × 미렌더(data-clearable=false)", () => {
    const { container } = render(
      <DatePicker allowClear disabled value={new Date(2026, 4, 25)} onChange={() => {}} />,
    );
    expect(triggerOf(container).dataset.clearable).toBe("false");
    expect(screen.queryByLabelText("날짜 지우기")).toBeNull();
  });

  it("× 클릭 → onClear 호출", async () => {
    const onClear = vi.fn();
    render(
      <DatePicker allowClear value={new Date(2026, 4, 25)} onChange={() => {}} onClear={onClear} />,
    );
    await userEvent.click(screen.getByLabelText("날짜 지우기"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
