import React, { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Carousel } from "../../src/Carousel";

/* ─── Helpers ─── */

/**
 * Carousel 은 React.Children.toArray(children) 로 슬라이드를 센다.
 * fragment 래퍼 컴포넌트는 자식 하나로 취급되므로,
 * 반드시 형제 엘리먼트 배열을 직접 spread 해서 넘겨야 한다.
 */
const SLIDES = [
  <div key="1">슬라이드 일</div>,
  <div key="2">슬라이드 이</div>,
  <div key="3">슬라이드 삼</div>,
];

/** 활성 슬라이드 = aria-hidden="false" 인 슬라이드 group */
function activeSlideText() {
  const groups = screen.getAllByRole("group", { hidden: true });
  const visible = groups.filter((g) => g.getAttribute("aria-hidden") === "false");
  return visible.map((g) => g.textContent).join("|");
}

/** dots tablist 의 활성 탭 인덱스 (data-active="true") */
function activeDotIndex() {
  const dots = screen.getAllByRole("tab");
  return dots.findIndex((d) => d.getAttribute("data-active") === "true");
}

/* ─── 사용자 시나리오 ─── */

describe("Carousel 사용자 시나리오", () => {
  it("다음 버튼을 누르면 활성 슬라이드가 앞으로 이동한다", async () => {
    const user = userEvent.setup();
    render(<Carousel>{SLIDES}</Carousel>);

    expect(activeSlideText()).toBe("슬라이드 일");

    await user.click(screen.getByRole("button", { name: "다음" }));
    expect(activeSlideText()).toBe("슬라이드 이");

    await user.click(screen.getByRole("button", { name: "다음" }));
    expect(activeSlideText()).toBe("슬라이드 삼");
  });

  it("이전 버튼을 누르면 활성 슬라이드가 뒤로 이동한다", async () => {
    const user = userEvent.setup();
    render(<Carousel>{SLIDES}</Carousel>);

    // 두 칸 전진 후
    await user.click(screen.getByRole("button", { name: "다음" }));
    await user.click(screen.getByRole("button", { name: "다음" }));
    expect(activeSlideText()).toBe("슬라이드 삼");

    // 이전으로 한 칸 후퇴
    await user.click(screen.getByRole("button", { name: "이전" }));
    expect(activeSlideText()).toBe("슬라이드 이");
  });

  it("인디케이터(dot)를 클릭하면 해당 슬라이드로 점프한다", async () => {
    const user = userEvent.setup();
    render(<Carousel>{SLIDES}</Carousel>);

    expect(activeDotIndex()).toBe(0);

    await user.click(screen.getByRole("tab", { name: "3번 슬라이드로 이동" }));
    expect(activeSlideText()).toBe("슬라이드 삼");
    expect(activeDotIndex()).toBe(2);
  });

  it("활성 인디케이터만 aria-selected=true / data-active=true 로 표시된다", async () => {
    const user = userEvent.setup();
    render(<Carousel>{SLIDES}</Carousel>);

    await user.click(screen.getByRole("tab", { name: "2번 슬라이드로 이동" }));

    const dots = screen.getAllByRole("tab");
    expect(dots[1]).toHaveAttribute("aria-selected", "true");
    expect(dots[1]).toHaveAttribute("data-active", "true");
    // 나머지는 비활성
    expect(dots[0]).toHaveAttribute("aria-selected", "false");
    expect(dots[2]).toHaveAttribute("aria-selected", "false");
  });

  it("첫 슬라이드에서 이전 버튼은 비활성, 마지막 슬라이드에서 다음 버튼이 비활성된다 (loop 아님)", async () => {
    const user = userEvent.setup();
    render(<Carousel>{SLIDES}</Carousel>);

    // 시작점: 이전은 disabled, 다음은 활성
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled();

    // 끝까지 이동
    await user.click(screen.getByRole("button", { name: "다음" }));
    await user.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getByRole("button", { name: "다음" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "이전" })).toBeEnabled();
  });

  it("비활성된 다음 버튼은 클릭해도 슬라이드가 이동하지 않는다", async () => {
    const user = userEvent.setup();
    render(<Carousel>{SLIDES}</Carousel>);

    await user.click(screen.getByRole("button", { name: "다음" }));
    await user.click(screen.getByRole("button", { name: "다음" }));
    expect(activeSlideText()).toBe("슬라이드 삼");

    // 마지막에서 disabled 버튼 클릭 → 변화 없음
    await user.click(screen.getByRole("button", { name: "다음" }));
    expect(activeSlideText()).toBe("슬라이드 삼");
  });

  it("loop=true 면 마지막 다음에서 첫 슬라이드로 순환하고 버튼은 항상 활성이다", async () => {
    const user = userEvent.setup();
    render(<Carousel loop>{SLIDES}</Carousel>);

    // loop 면 양 끝에서도 disabled 아님
    expect(screen.getByRole("button", { name: "이전" })).toBeEnabled();

    // 시작에서 이전 → 마지막으로 순환
    await user.click(screen.getByRole("button", { name: "이전" }));
    expect(activeSlideText()).toBe("슬라이드 삼");

    // 마지막에서 다음 → 첫번째로 순환
    await user.click(screen.getByRole("button", { name: "다음" }));
    expect(activeSlideText()).toBe("슬라이드 일");
  });
});

/* ─── controlled / uncontrolled ─── */

describe("Carousel controlled vs uncontrolled", () => {
  it("uncontrolled: 내부 상태로 슬라이드가 이동한다", async () => {
    const user = userEvent.setup();
    render(<Carousel>{SLIDES}</Carousel>);

    await user.click(screen.getByRole("button", { name: "다음" }));
    expect(activeSlideText()).toBe("슬라이드 이");
  });

  it("controlled: activeIndex prop 이 활성 슬라이드를 제어하고 onActiveIndexChange 가 호출된다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function Controlled() {
      const [idx, setIdx] = useState(0);
      return (
        <Carousel
          activeIndex={idx}
          onActiveIndexChange={(i) => {
            onChange(i);
            setIdx(i);
          }}
        >
          {SLIDES}
        </Carousel>
      );
    }

    render(<Controlled />);
    expect(activeSlideText()).toBe("슬라이드 일");

    await user.click(screen.getByRole("button", { name: "다음" }));
    expect(onChange).toHaveBeenCalledWith(1);
    expect(activeSlideText()).toBe("슬라이드 이");

    await user.click(screen.getByRole("tab", { name: "3번 슬라이드로 이동" }));
    expect(onChange).toHaveBeenLastCalledWith(2);
    expect(activeSlideText()).toBe("슬라이드 삼");
  });

  it("controlled: onActiveIndexChange 만 있고 외부 state 가 갱신 안 되면 활성 슬라이드는 고정된다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Carousel activeIndex={0} onActiveIndexChange={onChange}>
        {SLIDES}
      </Carousel>,
    );

    await user.click(screen.getByRole("button", { name: "다음" }));
    // 콜백은 의도된 인덱스로 호출되지만
    expect(onChange).toHaveBeenCalledWith(1);
    // 부모가 activeIndex 를 안 바꿨으므로 화면은 그대로다 (controlled)
    expect(activeSlideText()).toBe("슬라이드 일");
  });
});

/* ─── 접근성 ─── */

describe("Carousel 접근성", () => {
  it("좌우 내비게이션 버튼에 접근 가능한 이름(aria-label)이 있다", () => {
    render(<Carousel>{SLIDES}</Carousel>);

    expect(screen.getByRole("button", { name: "이전" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음" })).toBeInTheDocument();
  });

  it("각 슬라이드는 role=group + aria-roledescription=slide + 위치 라벨을 가진다", () => {
    render(<Carousel>{SLIDES}</Carousel>);

    const groups = screen.getAllByRole("group", { hidden: true });
    expect(groups).toHaveLength(3);
    expect(groups[0]).toHaveAttribute("aria-roledescription", "slide");
    expect(groups[0]).toHaveAttribute("aria-label", "1 / 3");
    expect(groups[2]).toHaveAttribute("aria-label", "3 / 3");
  });

  it("비활성 슬라이드는 aria-hidden=true 로 스크린리더에서 숨겨진다", async () => {
    const user = userEvent.setup();
    render(<Carousel>{SLIDES}</Carousel>);

    const groups = screen.getAllByRole("group", { hidden: true });
    expect(groups[0]).toHaveAttribute("aria-hidden", "false");
    expect(groups[1]).toHaveAttribute("aria-hidden", "true");

    await user.click(screen.getByRole("button", { name: "다음" }));
    expect(groups[0]).toHaveAttribute("aria-hidden", "true");
    expect(groups[1]).toHaveAttribute("aria-hidden", "false");
  });

  it("dot 인디케이터는 role=tablist / tab 구조로 노출된다", () => {
    render(<Carousel>{SLIDES}</Carousel>);

    const tablist = screen.getByRole("tablist");
    const dots = within(tablist).getAllByRole("tab");
    expect(dots).toHaveLength(3);
    expect(dots[0]).toHaveAttribute("aria-label", "1번 슬라이드로 이동");
  });

  it("키보드 Tab 으로 내비게이션/인디케이터 버튼에 접근하고 Enter 로 작동한다", async () => {
    const user = userEvent.setup();
    render(<Carousel>{SLIDES}</Carousel>);

    // 시작점에서 이전은 disabled → Tab 은 '다음' 버튼으로 간다
    await user.tab();
    expect(screen.getByRole("button", { name: "다음" })).toHaveFocus();

    // 포커스된 버튼을 Enter 로 작동
    await user.keyboard("{Enter}");
    expect(activeSlideText()).toBe("슬라이드 이");
  });
});

/* ─── 엣지 / 변형 ─── */

describe("Carousel 엣지/변형", () => {
  it("indicator=counter 면 현재/전체 카운터가 표시되고 dot tablist 는 없다", async () => {
    const user = userEvent.setup();
    render(<Carousel indicator="counter">{SLIDES}</Carousel>);

    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "다음" }));
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("indicator=none 이면 dot/counter 인디케이터가 렌더링되지 않는다", () => {
    render(<Carousel indicator="none">{SLIDES}</Carousel>);

    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.queryByText("1 / 3")).not.toBeInTheDocument();
  });

  it("showArrows=false 면 좌우 내비게이션 버튼이 렌더링되지 않는다", () => {
    render(<Carousel showArrows={false}>{SLIDES}</Carousel>);

    expect(screen.queryByRole("button", { name: "이전" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "다음" })).not.toBeInTheDocument();
  });

  it("슬라이드가 1개면 화살표/인디케이터가 모두 숨겨진다", () => {
    render(
      <Carousel>
        <div>단일 슬라이드</div>
      </Carousel>,
    );

    expect(screen.queryByRole("button", { name: "이전" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "다음" })).not.toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByText("단일 슬라이드")).toBeInTheDocument();
  });

  it("step=2 면 한 번에 두 슬라이드씩 이동한다", async () => {
    const user = userEvent.setup();
    render(
      <Carousel step={2}>
        <div>A</div>
        <div>B</div>
        <div>C</div>
        <div>D</div>
      </Carousel>,
    );

    expect(activeDotIndex()).toBe(0);
    await user.click(screen.getByRole("button", { name: "다음" }));
    expect(activeDotIndex()).toBe(2);
  });
});
