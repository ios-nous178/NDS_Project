import React, { useMemo, useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Autocomplete, type AutocompleteOption } from "../../src/Autocomplete";

const MEDS: AutocompleteOption[] = [
  { value: "lexapro", label: "렉사프로", description: "에스시탈로프람 10mg" },
  { value: "zoloft", label: "졸로푸트", description: "설트랄린 50mg" },
  { value: "prozac", label: "프로작", description: "플루옥세틴 20mg" },
  { value: "paxil", label: "팍실", description: "파록세틴 20mg" },
];

// 한 글자로 여러 옵션을 매칭시켜 키보드 이동 순서를 결정적으로 검증하기 위한 영문 데이터.
const FRUITS: AutocompleteOption[] = [
  { value: "apple", label: "apple" },
  { value: "apricot", label: "apricot" },
  { value: "avocado", label: "avocado" },
  { value: "banana", label: "banana" },
];

/**
 * 옵션을 표시 텍스트로 찾는다.
 * 컴포넌트는 매칭 텍스트를 하이라이트 <span> 으로 쪼개 렌더하므로(예: <span>a</span>pple)
 * role=option 의 "accessible name" 계산이 jsdom 에서 비어버린다 → textContent 로 매칭한다.
 * (이 컴포넌트의 a11y 갭: option 에 별도 접근 가능 이름이 없음. a11yFindings 참조)
 */
function optionByText(text: string): HTMLElement {
  const match = screen.getAllByRole("option").find((o) => (o.textContent ?? "").includes(text));
  if (!match) throw new Error(`option with text "${text}" not found`);
  return match;
}

/**
 * 스토리북 Playground 와 동일하게 부모가 입력값으로 외부 필터링하는 controlled 하니스.
 * Autocomplete 는 options 를 직접 필터링하지 않고 전달받은 그대로 렌더한다.
 */
function AutocompleteHarness({
  all = MEDS,
  initial = "",
  ...props
}: Partial<React.ComponentProps<typeof Autocomplete>> & {
  all?: AutocompleteOption[];
  initial?: string;
}) {
  const [v, setV] = useState(initial);
  const filtered = useMemo(
    () => all.filter((m) => m.label.toLowerCase().includes(v.toLowerCase())),
    [all, v],
  );
  return (
    <Autocomplete
      label="약 검색"
      placeholder="약 이름 검색"
      value={v}
      onValueChange={setV}
      options={filtered}
      {...props}
    />
  );
}

describe("Autocomplete 사용자 시나리오", () => {
  it("입력하면 드롭다운이 열리고 일치하는 옵션만 필터링된다", async () => {
    const user = userEvent.setup();
    render(<AutocompleteHarness />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.type(input, "렉");

    // "렉" 으로 시작하는 렉사프로만 남는다
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    const opts = screen.getAllByRole("option");
    expect(opts).toHaveLength(1);
    expect(opts[0]).toHaveTextContent("렉사프로");
  });

  it("옵션을 클릭하면 값이 채워지고 onSelect 가 옵션과 함께 호출되며 목록이 닫힌다", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<AutocompleteHarness onSelect={onSelect} />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.type(input, "졸");

    await user.click(optionByText("졸로푸트"));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "zoloft", label: "졸로푸트" }),
    );
    // 선택 후 입력값이 라벨로 채워지고 목록은 닫힌다
    expect(input).toHaveValue("졸로푸트");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("ArrowDown 으로 첫 옵션을 활성화하고 Enter 로 선택한다", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<AutocompleteHarness all={FRUITS} onSelect={onSelect} />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.type(input, "a"); // apple/apricot/avocado 매칭

    await user.keyboard("{ArrowDown}");
    // 첫 옵션(apple)이 활성화되어 aria-activedescendant 가 가리킨다
    const apple = optionByText("apple");
    expect(input).toHaveAttribute("aria-activedescendant", apple.id);
    expect(apple).toHaveAttribute("data-active", "true");

    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "apple", label: "apple" }),
    );
    expect(input).toHaveValue("apple");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("ArrowDown 을 여러 번 누르면 활성 옵션이 아래로 이동하고 ArrowUp 으로 되돌아온다", async () => {
    const user = userEvent.setup();
    render(<AutocompleteHarness all={FRUITS} />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.type(input, "a"); // [apple, apricot, avocado]

    await user.keyboard("{ArrowDown}{ArrowDown}");
    // 두 번째 옵션(apricot)이 활성
    const apricot = optionByText("apricot");
    expect(input).toHaveAttribute("aria-activedescendant", apricot.id);
    expect(apricot).toHaveAttribute("data-active", "true");

    await user.keyboard("{ArrowUp}");
    // 다시 첫 번째(apple)
    const apple = optionByText("apple");
    expect(input).toHaveAttribute("aria-activedescendant", apple.id);
    expect(apple).toHaveAttribute("data-active", "true");
  });

  it("활성 옵션이 마지막에 도달하면 ArrowDown 이 그 위치에서 멈춘다", async () => {
    const user = userEvent.setup();
    render(<AutocompleteHarness all={FRUITS} />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.type(input, "ap"); // apple, apricot 2개 매칭

    expect(screen.getAllByRole("option")).toHaveLength(2);
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}");
    // 마지막(apricot) 에서 클램프 — 더 눌러도 넘어가지 않는다
    const last = optionByText("apricot");
    expect(input).toHaveAttribute("aria-activedescendant", last.id);
    expect(last).toHaveAttribute("data-active", "true");
  });

  it("Escape 를 누르면 목록이 닫히고 입력값은 유지된다", async () => {
    const user = userEvent.setup();
    render(<AutocompleteHarness />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.type(input, "프");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveValue("프"); // 값은 그대로
  });

  it("바깥을 클릭하면 목록이 닫힌다", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <AutocompleteHarness />
        <button type="button">바깥</button>
      </div>,
    );

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.type(input, "팍");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "바깥" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("입력값이 minQueryLength 미만이면 목록이 열리지 않는다", async () => {
    const user = userEvent.setup();
    render(<AutocompleteHarness all={FRUITS} minQueryLength={2} />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.type(input, "a"); // 1자 → 미만
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await user.type(input, "p"); // "ap" → 2자 충족
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });
});

describe("Autocomplete 접근성", () => {
  it("입력은 combobox 역할이며 aria-autocomplete='list' 와 aria-controls 가 설정된다", () => {
    render(<AutocompleteHarness />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    // aria-controls 가 리스트박스 id 를 가리킨다
    expect(input).toHaveAttribute("aria-controls");
  });

  it("닫힌 상태에서는 aria-expanded=false, 열린 상태에서는 true 가 된다", async () => {
    const user = userEvent.setup();
    render(<AutocompleteHarness />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    expect(input).toHaveAttribute("aria-expanded", "false");

    await user.type(input, "렉");
    expect(input).toHaveAttribute("aria-expanded", "true");
    // aria-controls 가 실제 listbox 의 id 와 일치한다
    expect(input.getAttribute("aria-controls")).toBe(screen.getByRole("listbox").id);
  });

  it("입력값과 라벨이 정확히 일치하는 옵션만 aria-selected=true 로 표시된다", async () => {
    const user = userEvent.setup();
    // 옵션을 필터링하지 않고 고정 노출하는 하니스 — value 가 한 옵션 라벨과 정확히 같은 상태를
    // 만들면서 다른 옵션도 함께 보이게 한다(substring 필터로는 동시 노출 불가).
    function FixedHarness() {
      const [v, setV] = useState("apple");
      return <Autocomplete label="약 검색" value={v} onValueChange={setV} options={FRUITS} />;
    }
    render(<FixedHarness />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.click(input); // 포커스로 열림 (value 길이 >= minQueryLength)

    const apple = optionByText("apple");
    expect(apple).toHaveAttribute("aria-selected", "true");

    // 라벨이 다른 옵션은 선택 표시되지 않는다
    expect(optionByText("apricot")).toHaveAttribute("aria-selected", "false");
    expect(optionByText("banana")).toHaveAttribute("aria-selected", "false");
  });

  it("label 이 htmlFor 로 combobox 입력과 연결된다", () => {
    render(<AutocompleteHarness />);
    // getByLabelText 가 동작한다는 것은 label↔input 연결을 의미한다
    expect(screen.getByLabelText("약 검색")).toHaveAttribute("role", "combobox");
  });

  it("ref 로 입력에 프로그래밍적으로 포커스할 수 있다", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(
      <Autocomplete ref={ref} label="약 검색" value="" onValueChange={() => {}} options={[]} />,
    );

    ref.current?.focus();
    expect(screen.getByRole("combobox", { name: "약 검색" })).toHaveFocus();
  });
});

describe("Autocomplete 엣지/변형", () => {
  it("loading 중에는 옵션 대신 로딩 메시지가 보인다", async () => {
    const user = userEvent.setup();
    render(<AutocompleteHarness all={FRUITS} loading initial="a" />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.click(input);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("불러오는 중...")).toBeInTheDocument();
    // 로딩 중에는 옵션이 렌더되지 않는다
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  it("매칭 결과가 없으면 emptyMessage 가 표시된다", async () => {
    const user = userEvent.setup();
    render(<AutocompleteHarness emptyMessage="검색 결과가 없어요" />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.type(input, "zzz"); // 어떤 라벨에도 없음

    expect(screen.getByText("검색 결과가 없어요")).toBeInTheDocument();
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  it("disabled 입력은 타이핑/포커스가 막혀 목록이 열리지 않는다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Autocomplete
        label="약 검색"
        value=""
        onValueChange={onValueChange}
        options={MEDS}
        disabled
      />,
    );

    const input = screen.getByRole("combobox", { name: "약 검색" });
    expect(input).toBeDisabled();

    await user.type(input, "렉");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("error 상태이면 입력에 data-error='true' 가 설정된다", () => {
    render(<AutocompleteHarness error />);
    expect(screen.getByRole("combobox", { name: "약 검색" })).toHaveAttribute("data-error", "true");
  });

  it("highlight=true 이면 매칭 텍스트가 별도 span 으로 강조된다", async () => {
    const user = userEvent.setup();
    render(<AutocompleteHarness all={FRUITS} />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.type(input, "ap"); // apple/apricot 매칭

    const option = optionByText("apple");
    const mark = within(option).getByText("ap");
    expect(mark).toHaveClass("nds-autocomplete__highlight");
  });

  it("마우스를 옵션 위에 올리면 그 옵션이 활성화된다", async () => {
    const user = userEvent.setup();
    render(<AutocompleteHarness all={FRUITS} />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.type(input, "a");

    const apricot = optionByText("apricot");
    await user.hover(apricot);

    expect(apricot).toHaveAttribute("data-active", "true");
    expect(input).toHaveAttribute("aria-activedescendant", apricot.id);
  });

  it("옵션의 description 보조 설명이 함께 렌더된다", async () => {
    const user = userEvent.setup();
    render(<AutocompleteHarness />);

    const input = screen.getByRole("combobox", { name: "약 검색" });
    await user.type(input, "렉");

    expect(screen.getByText("에스시탈로프람 10mg")).toBeInTheDocument();
  });
});
