import React, { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimePicker } from "../../src/TimePicker";

// jsdom 은 scrollIntoView 를 구현하지 않는다. TimePicker 는 패널이 열릴 때 선택된
// 옵션을 가운데로 스크롤하려고 호출하므로, 테스트 환경에서만 no-op 으로 폴리필한다.
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

/**
 * 컨트롤드 래퍼 — TimePicker 는 value/onValueChange 가 필수인 제어 컴포넌트라
 * 실제 사용처(스토리북 Playground)처럼 상태를 들고 있는 하니스로 감싼다.
 * onValueChange 스파이를 받아 콜백 인자도 함께 검증한다.
 */
function TimePickerHarness({
  spy,
  initial = "09:00",
  ...props
}: { spy?: (v: string) => void; initial?: string } & Partial<
  React.ComponentProps<typeof TimePicker>
>) {
  const [value, setValue] = useState(initial);
  return (
    <TimePicker
      label="알림 시각"
      value={value}
      onValueChange={(v) => {
        setValue(v);
        spy?.(v);
      }}
      {...props}
    />
  );
}

const openPanel = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: "알림 시각" }));
  return screen.getByRole("dialog", { name: "시간 선택" });
};

describe("TimePicker 사용자 시나리오", () => {
  it("트리거에 현재 선택된 시각이 표시된다", () => {
    render(<TimePickerHarness initial="09:00" />);
    expect(screen.getByRole("button", { name: "알림 시각" })).toHaveTextContent("09:00");
  });

  it("미선택(잘못된 값)이면 placeholder 가 표시된다", () => {
    render(
      <TimePicker label="시각" value="" onValueChange={() => undefined} placeholder="시간 선택" />,
    );
    expect(screen.getByRole("button", { name: "시각" })).toHaveTextContent("시간 선택");
  });

  it("트리거를 클릭하면 시/분 두 컬럼이 있는 패널이 열린다", async () => {
    const user = userEvent.setup();
    render(<TimePickerHarness />);

    const dialog = await openPanel(user);

    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole("listbox", { name: "시" })).toBeInTheDocument();
    expect(within(dialog).getByRole("listbox", { name: "분" })).toBeInTheDocument();
  });

  it("시를 선택하면 분은 유지된 채 value 가 갱신되고 콜백이 호출된다", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<TimePickerHarness initial="09:30" step={60 * 5} spy={spy} />);

    const hourList = within(await openPanel(user)).getByRole("listbox", { name: "시" });
    await user.click(within(hourList).getByRole("option", { name: "11" }));

    // 분(30)은 유지하고 시만 11 로 → "11:30"
    expect(spy).toHaveBeenCalledWith("11:30");
    expect(screen.getByRole("button", { name: "알림 시각" })).toHaveTextContent("11:30");
  });

  it("분을 선택하면 시는 유지된 채 value 가 갱신되고 콜백이 호출된다", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<TimePickerHarness initial="09:00" step={60 * 5} spy={spy} />);

    const minuteList = within(await openPanel(user)).getByRole("listbox", { name: "분" });
    await user.click(within(minuteList).getByRole("option", { name: "45" }));

    expect(spy).toHaveBeenCalledWith("09:45");
    expect(screen.getByRole("button", { name: "알림 시각" })).toHaveTextContent("09:45");
  });

  it("옵션을 선택해도 패널은 열린 채로 유지되어 연속 선택이 가능하다", async () => {
    const user = userEvent.setup();
    render(<TimePickerHarness initial="09:00" />);

    const dialog = await openPanel(user);
    await user.click(within(dialog).getByRole("option", { name: "13" }));

    // Select 와 달리 TimePicker 는 선택 후에도 패널을 닫지 않는다(시·분 연속 선택용).
    expect(screen.getByRole("dialog", { name: "시간 선택" })).toBeInTheDocument();
  });

  it("열린 패널의 트리거를 다시 클릭하면 토글로 닫힌다", async () => {
    const user = userEvent.setup();
    render(<TimePickerHarness />);

    const trigger = screen.getByRole("button", { name: "알림 시각" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("패널 바깥을 클릭하면 닫힌다", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <TimePickerHarness />
        <button type="button">바깥</button>
      </div>,
    );

    await openPanel(user);
    await user.click(screen.getByRole("button", { name: "바깥" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("프리셋 칩을 클릭하면 패널을 열지 않고 즉시 해당 값으로 세팅된다", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(
      <TimePickerHarness
        initial="18:00"
        spy={spy}
        presets={[{ label: "자정까지", value: "23:59" }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "자정까지" }));

    expect(spy).toHaveBeenCalledWith("23:59");
    expect(screen.getByRole("button", { name: "알림 시각" })).toHaveTextContent("23:59");
    // 프리셋은 패널을 열지 않는 빠른 액션이다.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("TimePicker 접근성", () => {
  it("트리거는 dialog 팝업 의미와 라벨, 펼침 상태를 노출한다", async () => {
    const user = userEvent.setup();
    render(<TimePickerHarness />);

    const trigger = screen.getByRole("button", { name: "알림 시각" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("선택된 시/분 옵션이 aria-selected=true 로 표시된다", async () => {
    const user = userEvent.setup();
    render(<TimePickerHarness initial="11:15" step={60 * 5} />);

    const dialog = await openPanel(user);
    const hourList = within(dialog).getByRole("listbox", { name: "시" });
    const minuteList = within(dialog).getByRole("listbox", { name: "분" });

    expect(within(hourList).getByRole("option", { name: "11" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(within(minuteList).getByRole("option", { name: "15" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    // 비선택 옵션은 false
    expect(within(hourList).getByRole("option", { name: "10" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("Escape 로 패널을 닫고 포커스를 트리거로 되돌린다", async () => {
    const user = userEvent.setup();
    render(<TimePickerHarness />);

    const trigger = screen.getByRole("button", { name: "알림 시각" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("패널은 포털로 body 직속에 렌더된다", async () => {
    const user = userEvent.setup();
    render(<TimePickerHarness />);

    const dialog = await openPanel(user);
    expect(dialog.closest("body")).toBe(document.body);
  });
});

describe("TimePicker 엣지/변형", () => {
  it("disabled 면 트리거가 비활성이고 클릭해도 패널이 열리지 않는다", async () => {
    const user = userEvent.setup();
    render(<TimePickerHarness disabled />);

    const trigger = screen.getByRole("button", { name: "알림 시각" });
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("step(분 단위)에 따라 분 옵션 개수가 달라진다 (5분=12개, 1분=60개)", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TimePickerHarness step={60 * 5} />);

    let minuteList = within(await openPanel(user)).getByRole("listbox", { name: "분" });
    expect(within(minuteList).getAllByRole("option")).toHaveLength(12);
    unmount();

    render(<TimePickerHarness step={60} />);
    minuteList = within(await openPanel(user)).getByRole("listbox", { name: "분" });
    expect(within(minuteList).getAllByRole("option")).toHaveLength(60);
  });

  it("min~max 범위 밖의 분 옵션은 비활성화되어 선택할 수 없다", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<TimePickerHarness initial="10:00" min="09:00" max="18:00" step={60 * 5} spy={spy} />);

    const dialog = await openPanel(user);
    const hourList = within(dialog).getByRole("listbox", { name: "시" });

    // 09 시 이전(08 시)은 범위 밖 → 비활성
    expect(within(hourList).getByRole("option", { name: "08" })).toBeDisabled();
    // 18 시 까지 허용 → 18 시는 활성
    expect(within(hourList).getByRole("option", { name: "18" })).not.toBeDisabled();

    // 비활성 옵션 클릭은 값 변경을 일으키지 않는다
    await user.click(within(hourList).getByRole("option", { name: "08" }));
    expect(spy).not.toHaveBeenCalled();
  });

  it("범위를 벗어난 시 선택 시 해당 시의 첫 유효 분으로 보정된다", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    // 현재 09:00, 09 시는 09:30 부터 허용 → 09 시 선택하면 분이 30 으로 보정
    render(<TimePickerHarness initial="10:00" min="09:30" max="18:00" step={60 * 5} spy={spy} />);

    const hourList = within(await openPanel(user)).getByRole("listbox", { name: "시" });
    await user.click(within(hourList).getByRole("option", { name: "09" }));

    expect(spy).toHaveBeenCalledWith("09:30");
  });

  it("helperText 와 error 상태가 함께 렌더된다", () => {
    const { container } = render(
      <TimePicker
        label="시작 시간"
        value="22:00"
        onValueChange={() => undefined}
        error
        helperText="22시 이후는 선택할 수 없어요"
      />,
    );

    const helper = screen.getByText("22시 이후는 선택할 수 없어요");
    expect(helper).toBeVisible();
    expect(container.querySelector("[data-slot='field']")).toHaveAttribute("data-error", "true");
  });
});
