import React, { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiSelect, type MultiSelectOption } from "../../src/MultiSelect";

const ADS: MultiSelectOption[] = [
  { value: "a", label: "캠페인 A 타겟팅" },
  { value: "b", label: "캠페인 B 리타겟" },
  { value: "c", label: "캠페인 C 포커싱" },
  { value: "d", label: "캠페인 D 리텐션" },
  { value: "e", label: "캠페인 E 신규" },
  { value: "f", label: "캠페인 F (종료)", disabled: true },
];

function MultiSelectHarness(props: Partial<React.ComponentProps<typeof MultiSelect>> = {}) {
  const [value, setValue] = useState<string[]>(props.value ?? []);
  return (
    <MultiSelect
      options={ADS}
      placeholder="모든 광고"
      searchPlaceholder="광고명으로 검색"
      {...props}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        props.onValueChange?.(next);
      }}
    />
  );
}

/** 트리거 버튼을 가져온다 — 트리거의 접근 가능한 이름은 요약 텍스트(placeholder 또는 "N개 선택"). */
const getTrigger = (name: RegExp = /모든 광고/) => screen.getByRole("button", { name });

/** 열린 드롭다운 패널 (role=group, aria-label=placeholder). */
const getPanel = () => screen.getByRole("group", { name: "모든 광고" });

describe("MultiSelect 사용자 시나리오", () => {
  it("닫힌 상태에서 트리거에 placeholder 요약이 보이고 패널은 없다", () => {
    render(<MultiSelectHarness />);

    expect(getTrigger()).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("트리거 클릭으로 패널이 열리고 옵션 체크박스가 보인다", async () => {
    const user = userEvent.setup();
    render(<MultiSelectHarness />);

    await user.click(getTrigger());

    expect(getPanel()).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "캠페인 A 타겟팅" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "캠페인 E 신규" })).toBeInTheDocument();
  });

  it("열린 상태에서 트리거를 다시 클릭하면 패널이 닫힌다 (토글)", async () => {
    const user = userEvent.setup();
    render(<MultiSelectHarness />);

    const trigger = getTrigger();
    await user.click(trigger);
    expect(getPanel()).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("옵션을 체크하면 초안(draft)만 바뀌고 트리거 요약은 적용 전까지 그대로다", async () => {
    const user = userEvent.setup();
    render(<MultiSelectHarness />);

    await user.click(getTrigger());

    const optionB = screen.getByRole("checkbox", { name: "캠페인 B 리타겟" });
    const optionD = screen.getByRole("checkbox", { name: "캠페인 D 리텐션" });
    expect(optionB).not.toBeChecked();

    await user.click(optionB);
    await user.click(optionD);

    // 초안이 반영돼 체크됨
    expect(optionB).toBeChecked();
    expect(optionD).toBeChecked();
    // 적용 전이므로 트리거 요약은 여전히 placeholder
    expect(getTrigger()).toBeInTheDocument();
    // 패널 내 카운터도 초안 기준 "2개 선택"
    expect(within(getPanel()).getByText("2개 선택")).toBeInTheDocument();
  });

  it("적용 버튼을 누르면 초안이 commit 되고 onValueChange 가 옵션 순서대로 발화한다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MultiSelectHarness onValueChange={onValueChange} />);

    await user.click(getTrigger());
    // 입력 순서를 뒤집어 체크 → commit 은 options 순서(b 먼저)로 정렬돼야 한다
    await user.click(screen.getByRole("checkbox", { name: "캠페인 D 리텐션" }));
    await user.click(screen.getByRole("checkbox", { name: "캠페인 B 리타겟" }));
    await user.click(screen.getByRole("button", { name: "적용" }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(["b", "d"]);
    // 패널이 닫히고 요약이 "2개 선택"으로 갱신된다
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /2개 선택/ })).toBeInTheDocument();
  });

  it("취소 버튼을 누르면 초안이 폐기되고 적용값이 유지된다 (onValueChange 미발화)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MultiSelectHarness value={["a"]} onValueChange={onValueChange} />);

    // 시작: 1개 선택
    expect(getTrigger(/1개 선택/)).toBeInTheDocument();
    await user.click(getTrigger(/1개 선택/));

    // 초안에서 하나 더 체크
    await user.click(screen.getByRole("checkbox", { name: "캠페인 C 포커싱" }));
    // 취소 → 초안 폐기
    await user.click(screen.getByRole("button", { name: "취소" }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(getTrigger(/1개 선택/)).toBeInTheDocument();

    // 다시 열면 초안이 적용값(a 만)으로 리셋돼 C 는 체크 해제 상태
    await user.click(getTrigger(/1개 선택/));
    expect(screen.getByRole("checkbox", { name: "캠페인 A 타겟팅" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "캠페인 C 포커싱" })).not.toBeChecked();
  });

  it("전체선택 체크박스로 활성 옵션을 모두 초안에 담고, 다시 누르면 해제한다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MultiSelectHarness onValueChange={onValueChange} />);

    await user.click(getTrigger());
    const selectAll = screen.getByRole("checkbox", { name: "전체선택 / 해제" });

    // 전체선택 → 비활성(disabled) 옵션 F 를 제외한 5개가 초안에
    await user.click(selectAll);
    expect(within(getPanel()).getByText("5개 선택")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "캠페인 A 타겟팅" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "캠페인 F (종료)" })).not.toBeChecked();

    // 적용 → 비활성 제외 5개가 순서대로 commit
    await user.click(screen.getByRole("button", { name: "적용" }));
    expect(onValueChange).toHaveBeenCalledWith(["a", "b", "c", "d", "e"]);
  });

  it("검색어로 옵션을 필터링하고, 매치 없으면 빈 메시지를 보여준다", async () => {
    const user = userEvent.setup();
    render(<MultiSelectHarness />);

    await user.click(getTrigger());
    const search = screen.getByRole("searchbox", { name: "광고명으로 검색" });

    await user.type(search, "리타겟");
    // 매치되는 옵션만 남는다
    expect(screen.getByRole("checkbox", { name: "캠페인 B 리타겟" })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "캠페인 A 타겟팅" })).not.toBeInTheDocument();

    // 매치 없는 검색어 → 빈 메시지
    await user.clear(search);
    await user.type(search, "없는광고명zzz");
    expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
  });
});

describe("MultiSelect 접근성", () => {
  it("트리거에 aria-haspopup=listbox 와 aria-expanded 가 열림 상태를 반영한다", async () => {
    const user = userEvent.setup();
    render(<MultiSelectHarness />);

    const trigger = getTrigger();
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(getTrigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("error 상태에서 트리거에 aria-invalid 가 설정된다", () => {
    render(<MultiSelectHarness error />);
    expect(getTrigger()).toHaveAttribute("aria-invalid", "true");
  });

  it("error 가 아니면 트리거에 aria-invalid 가 없다", () => {
    render(<MultiSelectHarness />);
    expect(getTrigger()).not.toHaveAttribute("aria-invalid");
  });

  it("드롭다운 패널은 role=group + placeholder 를 aria-label 로 노출한다", async () => {
    const user = userEvent.setup();
    render(<MultiSelectHarness />);

    await user.click(getTrigger());
    const panel = getPanel();
    expect(panel).toHaveAttribute("role", "group");
    expect(panel).toHaveAttribute("aria-label", "모든 광고");
  });

  it("Escape 키로 패널이 닫힌다", async () => {
    const user = userEvent.setup();
    render(<MultiSelectHarness />);

    await user.click(getTrigger());
    expect(getPanel()).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("Escape 로 닫으면 초안이 폐기된다 (취소와 동일)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MultiSelectHarness value={["a"]} onValueChange={onValueChange} />);

    await user.click(getTrigger(/1개 선택/));
    await user.click(screen.getByRole("checkbox", { name: "캠페인 C 포커싱" }));
    await user.keyboard("{Escape}");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(getTrigger(/1개 선택/)).toBeInTheDocument();
  });

  it("바깥 영역을 클릭하면 패널이 닫히고 초안이 폐기된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <div>
        <button type="button">바깥 버튼</button>
        <MultiSelectHarness value={["a"]} onValueChange={onValueChange} />
      </div>,
    );

    await user.click(getTrigger(/1개 선택/));
    await user.click(screen.getByRole("checkbox", { name: "캠페인 C 포커싱" }));
    // 바깥 클릭 → dismiss
    await user.click(screen.getByRole("button", { name: "바깥 버튼" }));

    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(getTrigger(/1개 선택/)).toBeInTheDocument();
  });
});

describe("MultiSelect 엣지/변형", () => {
  it("disabled 트리거는 비활성이며 클릭해도 패널이 열리지 않는다", async () => {
    const user = userEvent.setup();
    render(<MultiSelectHarness value={["a"]} disabled />);

    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("비활성 옵션은 aria-disabled 가 아닌 native disabled 로 클릭이 무시된다", async () => {
    const user = userEvent.setup();
    render(<MultiSelectHarness />);

    await user.click(getTrigger());
    const disabledOption = screen.getByRole("checkbox", { name: "캠페인 F (종료)" });
    expect(disabledOption).toBeDisabled();

    await user.click(disabledOption);
    expect(disabledOption).not.toBeChecked();
  });

  it("searchable=false 면 검색창이 렌더되지 않는다", async () => {
    const user = userEvent.setup();
    render(<MultiSelectHarness searchable={false} />);

    await user.click(getTrigger());
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    // 옵션은 그대로 보인다
    expect(screen.getByRole("checkbox", { name: "캠페인 A 타겟팅" })).toBeInTheDocument();
  });

  it("formatSummary 로 트리거 요약 텍스트를 커스터마이즈한다", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelectHarness
        value={["a", "c"]}
        formatSummary={(count, total) => `${count}/${total} 광고`}
      />,
    );

    expect(screen.getByRole("button", { name: /2\/6 광고/ })).toBeInTheDocument();

    // 적용 흐름에서도 formatSummary 가 유지된다
    await user.click(screen.getByRole("button", { name: /2\/6 광고/ }));
    await user.click(screen.getByRole("checkbox", { name: "캠페인 E 신규" }));
    await user.click(screen.getByRole("button", { name: "적용" }));
    expect(screen.getByRole("button", { name: /3\/6 광고/ })).toBeInTheDocument();
  });

  it("커스텀 라벨(applyLabel/cancelLabel/selectAllLabel)이 반영된다", async () => {
    const user = userEvent.setup();
    render(<MultiSelectHarness applyLabel="확정" cancelLabel="닫기" selectAllLabel="모두 선택" />);

    await user.click(getTrigger());
    expect(screen.getByRole("button", { name: "확정" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "닫기" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "모두 선택" })).toBeInTheDocument();
  });
});
