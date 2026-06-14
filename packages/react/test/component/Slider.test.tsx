import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Slider } from "../../src/Slider";

/**
 * Slider 는 네이티브 `<input type="range">` (암묵적 role="slider") 를 감싼 완전 제어
 * 컴포넌트다. 화면 값은 항상 `value` prop 에서 나오고, 조작은 `onValueChange(number)` 로만
 * 흘러나간다 (컴포넌트는 자체 onKeyDown 이 없고 키보드/드래그/클램프를 전부 브라우저에 위임).
 *
 * 주의: 브라우저는 ArrowRight/Left/Up/Down/Home/End 로 range 값을 step 단위로 바꾸고
 * change 이벤트를 발생시키지만, jsdom 은 이 네이티브 키 처리를 구현하지 않는다
 * (userEvent.keyboard("{ArrowRight}") 는 range input 값을 바꾸지 못함). 따라서 "키 입력 →
 * 값 변경" 의 결과(= 브라우저가 dispatch 하는 change 이벤트)는 fireEvent.change 로 재현한다.
 * 이는 컴포넌트의 실제 계약(change → onValueChange(Number) + 네이티브 min/max 클램프)을
 * 정직하게 검증한다. 순수 키보드로 검증 가능한 포커스/Tab 동작은 userEvent 로 검증한다.
 */
function SliderHarness(props: Partial<React.ComponentProps<typeof Slider>> = {}) {
  const [value, setValue] = useState<number>(props.value ?? 50);
  return (
    <Slider
      {...props}
      value={value}
      onValueChange={(v) => {
        setValue(v);
        props.onValueChange?.(v);
      }}
    />
  );
}

describe("Slider 사용자 시나리오", () => {
  it("슬라이더는 role=slider 로 노출되고 현재 값을 가진다", () => {
    render(<SliderHarness value={30} />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveValue("30");
  });

  it("오른쪽 한 스텝(ArrowRight 등가) 이동 시 값이 step 만큼 증가하고 콜백이 새 값으로 호출된다", () => {
    const onValueChange = vi.fn();
    render(<SliderHarness value={50} min={0} max={100} step={1} onValueChange={onValueChange} />);

    const slider = screen.getByRole("slider");
    // 브라우저가 ArrowRight 에서 dispatch 하는 change(value=51) 를 재현.
    fireEvent.change(slider, { target: { value: "51" } });

    expect(onValueChange).toHaveBeenCalledWith(51);
    expect(slider).toHaveValue("51");
  });

  it("왼쪽 한 스텝(ArrowLeft 등가) 이동 시 값이 step 만큼 감소한다", () => {
    const onValueChange = vi.fn();
    render(<SliderHarness value={50} min={0} max={100} step={1} onValueChange={onValueChange} />);

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "49" } });

    expect(onValueChange).toHaveBeenCalledWith(49);
    expect(slider).toHaveValue("49");
  });

  it("step 단위(5) 이동이 그대로 반영된다", () => {
    render(<SliderHarness value={60} min={0} max={100} step={5} />);
    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: "65" } });
    expect(slider).toHaveValue("65");

    fireEvent.change(slider, { target: { value: "60" } });
    expect(slider).toHaveValue("60");
  });

  it("Home(=min)/End(=max) 등가 점프가 반영된다", () => {
    render(<SliderHarness value={5} min={0} max={10} step={1} />);
    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: "0" } }); // Home → min
    expect(slider).toHaveValue("0");

    fireEvent.change(slider, { target: { value: "10" } }); // End → max
    expect(slider).toHaveValue("10");
  });

  it("연속 입력으로 값이 누적되어 갱신된다", () => {
    render(<SliderHarness value={0} min={0} max={10} step={1} />);
    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: "1" } });
    fireEvent.change(slider, { target: { value: "2" } });
    fireEvent.change(slider, { target: { value: "3" } });
    expect(slider).toHaveValue("3");
  });

  it("콜백은 항상 number 타입으로 값을 전달한다 (문자열 아님)", () => {
    const onValueChange = vi.fn();
    render(<SliderHarness value={50} min={0} max={100} onValueChange={onValueChange} />);

    fireEvent.change(screen.getByRole("slider"), { target: { value: "73" } });

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toBe(73);
    expect(typeof onValueChange.mock.calls[0][0]).toBe("number");
  });
});

describe("Slider 경계(min/max) 클램프", () => {
  it("max 를 넘는 값은 네이티브 클램프로 max 로 제한되고 콜백도 클램프된 값을 받는다", () => {
    const onValueChange = vi.fn();
    render(<SliderHarness value={5} min={0} max={10} step={1} onValueChange={onValueChange} />);

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "15" } });

    expect(slider).toHaveValue("10");
    expect(onValueChange).toHaveBeenCalledWith(10);
  });

  it("min 아래 값은 네이티브 클램프로 min 으로 제한된다", () => {
    const onValueChange = vi.fn();
    render(<SliderHarness value={5} min={0} max={10} step={1} onValueChange={onValueChange} />);

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "-5" } });

    expect(slider).toHaveValue("0");
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  it("음수 범위(min<0)에서도 값/클램프가 정상 동작한다", () => {
    render(<SliderHarness value={0} min={-5} max={5} step={1} />);
    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: "-1" } });
    expect(slider).toHaveValue("-1");

    fireEvent.change(slider, { target: { value: "-20" } }); // 범위 밖 → min
    expect(slider).toHaveValue("-5");
  });
});

describe("Slider 비활성(disabled)", () => {
  it("disabled 슬라이더는 disabled 속성을 가지며 사용자 조작이 차단된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SliderHarness value={50} disabled aria-label="비활성" onValueChange={onValueChange} />);

    const slider = screen.getByRole("slider");
    expect(slider).toBeDisabled();

    // userEvent 는 disabled 컨트롤의 상호작용을 (실제 브라우저처럼) 막는다.
    // 포커스/키보드 시도 모두 콜백을 발생시키지 못한다.
    await user.click(slider);
    await user.keyboard("{ArrowRight}");
    await user.type(slider, "9");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(slider).toHaveValue("50");
  });

  it("disabled 상태는 루트에 data-disabled=true 로 표시된다", () => {
    const { container } = render(<SliderHarness value={50} disabled />);
    const root = container.querySelector("[data-slot='root']");
    expect(root).toHaveAttribute("data-disabled", "true");
  });

  it("활성 상태의 루트는 data-disabled=false 다", () => {
    const { container } = render(<SliderHarness value={50} />);
    const root = container.querySelector("[data-slot='root']");
    expect(root).toHaveAttribute("data-disabled", "false");
  });
});

describe("Slider 접근성", () => {
  it("range input 의 aria-valuemin/valuemax/valuenow 가 현재 상태를 반영한다", () => {
    render(<SliderHarness value={40} min={0} max={100} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
    expect(slider).toHaveAttribute("aria-valuenow", "40");
  });

  it("값 변경 시 aria-valuenow 가 함께 갱신된다", () => {
    render(<SliderHarness value={40} min={0} max={100} />);
    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: "55" } });
    expect(slider).toHaveAttribute("aria-valuenow", "55");
  });

  it("aria-label 을 전달하면 접근 가능한 이름이 된다", () => {
    render(<SliderHarness value={50} aria-label="통증 정도" />);
    expect(screen.getByRole("slider", { name: "통증 정도" })).toBeInTheDocument();
  });

  it("id 를 지정하면 그대로 input 에 적용된다 (외부 label 연결용)", () => {
    render(<SliderHarness value={50} id="volume-slider" />);
    expect(screen.getByRole("slider")).toHaveAttribute("id", "volume-slider");
  });

  it("id 미지정 시 useId 로 안정적인 id 가 자동 생성된다", () => {
    render(<SliderHarness value={50} />);
    const slider = screen.getByRole("slider");
    expect(slider.id).toBeTruthy();
  });

  it("키보드 Tab 으로 포커스할 수 있다", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>이전</button>
        <SliderHarness value={50} aria-label="강도" />
      </>,
    );

    await user.tab(); // 버튼
    await user.tab(); // 슬라이더
    expect(screen.getByRole("slider", { name: "강도" })).toHaveFocus();
  });

  it("disabled 슬라이더는 Tab 순서에서 제외된다", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>이전</button>
        <SliderHarness value={50} aria-label="비활성 슬라이더" disabled />
        <button>다음</button>
      </>,
    );

    await user.tab(); // 이전 버튼
    expect(screen.getByRole("button", { name: "이전" })).toHaveFocus();

    await user.tab(); // disabled 슬라이더를 건너뛰고 다음 버튼으로
    expect(screen.getByRole("button", { name: "다음" })).toHaveFocus();
  });
});

describe("Slider 변형(라벨/값 표시)", () => {
  it("startLabel/endLabel 이 양 끝에 렌더링된다", () => {
    render(<SliderHarness value={3} min={0} max={10} startLabel="낮음" endLabel="높음" />);
    expect(screen.getByText("낮음")).toBeVisible();
    expect(screen.getByText("높음")).toBeVisible();
  });

  it("showValue 가 켜지면 현재 값이 텍스트로 표시되고 값 변경 시 갱신된다", () => {
    const { container } = render(<SliderHarness value={3} min={0} max={10} step={1} showValue />);

    const valueEl = container.querySelector("[data-slot='value']")!;
    expect(valueEl).toHaveTextContent("3");

    fireEvent.change(screen.getByRole("slider"), { target: { value: "4" } });
    expect(valueEl).toHaveTextContent("4");
  });

  it("formatValue 로 값 표시를 커스터마이즈할 수 있다", () => {
    const { container } = render(
      <SliderHarness
        value={60}
        min={0}
        max={100}
        step={5}
        showValue
        formatValue={(v) => `${v}%`}
      />,
    );
    const valueEl = container.querySelector("[data-slot='value']")!;
    expect(valueEl).toHaveTextContent("60%");
  });

  it("라벨/값 표시가 없으면 라벨 행 자체가 렌더링되지 않는다", () => {
    const { container } = render(<SliderHarness value={50} />);
    expect(container.querySelector("[data-slot='labels']")).not.toBeInTheDocument();
  });

  it("fill 너비가 현재 값의 백분율을 반영하고 값 변경 시 갱신된다", () => {
    const { container } = render(<SliderHarness value={25} min={0} max={100} />);
    const fill = container.querySelector(".nds-slider__fill") as HTMLElement;
    expect(fill.style.width).toBe("25%");

    fireEvent.change(screen.getByRole("slider"), { target: { value: "75" } });
    expect(fill.style.width).toBe("75%");
  });
});

describe("Slider 제어 흐름", () => {
  it("외부 버튼으로 값을 바꾸면 슬라이더와 fill 이 함께 갱신된다", async () => {
    const user = userEvent.setup();

    function ControlledSlider() {
      const [v, setV] = useState(20);
      return (
        <>
          <Slider value={v} min={0} max={100} onValueChange={setV} showValue />
          <button onClick={() => setV(80)}>80으로</button>
        </>
      );
    }

    const { container } = render(<ControlledSlider />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue("20");

    await user.click(screen.getByRole("button", { name: "80으로" }));
    expect(slider).toHaveValue("80");

    const fill = container.querySelector(".nds-slider__fill") as HTMLElement;
    expect(fill.style.width).toBe("80%");
  });

  it("ref 를 통해 프로그래밍적으로 포커스할 수 있다", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Slider ref={ref} value={50} onValueChange={() => {}} aria-label="포커스" />);

    ref.current?.focus();
    expect(screen.getByRole("slider", { name: "포커스" })).toHaveFocus();
  });
});
