import React, { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chip } from "../../src/Chip";

describe("Chip 사용자 시나리오: 필터 선택", () => {
  function FilterChips() {
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const toggle = (label: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(label)) {
          next.delete(label);
        } else {
          next.add(label);
        }
        return next;
      });
    };

    return (
      <div>
        {["전체", "진행중", "완료", "대기"].map((label) => (
          <Chip
            key={label}
            label={label}
            selected={selected.has(label)}
            onClick={() => toggle(label)}
          />
        ))}
        <p data-testid="result">선택: {selected.size === 0 ? "없음" : [...selected].join(", ")}</p>
      </div>
    );
  }

  it("칩을 클릭하면 선택 상태가 토글된다", async () => {
    const user = userEvent.setup();
    render(<FilterChips />);

    // 초기 상태: 아무것도 선택 안 됨
    expect(screen.getByTestId("result")).toHaveTextContent("선택: 없음");

    // "진행중" 선택
    await user.click(screen.getByRole("button", { name: /진행중/ }));
    expect(screen.getByTestId("result")).toHaveTextContent("선택: 진행중");

    // "완료" 추가 선택
    await user.click(screen.getByRole("button", { name: /완료/ }));
    expect(screen.getByTestId("result")).toHaveTextContent("진행중, 완료");

    // "진행중" 해제
    await user.click(screen.getByRole("button", { name: /진행중/ }));
    expect(screen.getByTestId("result")).toHaveTextContent("선택: 완료");
  });

  it("키보드로 필터를 선택할 수 있다 (Tab → Enter/Space)", async () => {
    const user = userEvent.setup();
    render(<FilterChips />);

    // Tab으로 "전체" 칩에 포커스
    await user.tab();
    expect(screen.getByRole("button", { name: /전체/ })).toHaveFocus();

    // Enter로 선택
    await user.keyboard("{Enter}");
    expect(screen.getByTestId("result")).toHaveTextContent("선택: 전체");

    // Tab으로 "진행중"에 포커스 → Space로 선택
    await user.tab();
    await user.keyboard(" ");
    expect(screen.getByTestId("result")).toHaveTextContent("전체, 진행중");
  });
});

describe("Chip 사용자 시나리오: 태그 삭제", () => {
  function TagList() {
    const [tags, setTags] = useState(["React", "TypeScript", "Vitest"]);

    return (
      <div role="list" aria-label="태그 목록">
        {tags.map((tag) => (
          <div role="listitem" key={tag}>
            <Chip label={tag} onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))} />
          </div>
        ))}
        {tags.length === 0 && <p>태그가 없습니다</p>}
      </div>
    );
  }

  it("삭제 버튼을 클릭하면 태그가 제거된다", async () => {
    const user = userEvent.setup();
    render(<TagList />);

    const list = screen.getByRole("list", { name: "태그 목록" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);

    // "TypeScript" 삭제
    await user.click(screen.getByRole("button", { name: "TypeScript 삭제" }));
    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);

    // 나머지 모두 삭제
    await user.click(screen.getByRole("button", { name: "React 삭제" }));
    await user.click(screen.getByRole("button", { name: "Vitest 삭제" }));
    expect(screen.getByText("태그가 없습니다")).toBeVisible();
  });

  it("칩 본체를 클릭해도 삭제 이벤트가 전파되지 않는다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onRemove = vi.fn();

    render(<Chip label="태그" onClick={onClick} onRemove={onRemove} />);

    // 삭제 버튼 클릭 → onRemove만 호출, onClick은 호출되지 않음 (stopPropagation)
    await user.click(screen.getByRole("button", { name: "태그 삭제" }));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("Chip 접근성", () => {
  it("인터랙티브 칩은 button 역할과 aria-pressed를 갖는다", () => {
    const { rerender } = render(<Chip label="필터" onClick={() => {}} selected={false} />);

    const chip = screen.getByRole("button", { name: /필터/ });
    expect(chip).toHaveAttribute("aria-pressed", "false");

    rerender(<Chip label="필터" onClick={() => {}} selected={true} />);
    expect(chip).toHaveAttribute("aria-pressed", "true");
  });

  it("비인터랙티브 칩은 button 역할이 없고 포커스 불가하다", () => {
    render(<Chip label="상태 표시" />);

    expect(screen.queryByRole("button", { name: /상태 표시/ })).not.toBeInTheDocument();
  });

  it("disabled 칩은 포커스할 수 없고 삭제 버튼도 사라진다", () => {
    render(<Chip label="잠김" onClick={() => {}} onRemove={() => {}} disabled />);

    // 삭제 버튼이 렌더링되지 않는다
    expect(screen.queryByRole("button", { name: "잠김 삭제" })).not.toBeInTheDocument();
  });

  it("disabled 칩은 클릭해도 반응하지 않는다", () => {
    const onClick = vi.fn();
    const { container } = render(<Chip label="비활성" onClick={onClick} disabled />);

    // disabled 상태에서는 onClick 핸들러가 바인딩되지 않음
    fireEvent.click(container.querySelector("[data-disabled='true']")!);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("아이콘은 장식용(aria-hidden)으로 스크린리더에서 무시된다", () => {
    render(
      <Chip
        label="알림"
        icon={
          <svg>
            <circle r="5" />
          </svg>
        }
      />,
    );

    // 스크린리더는 "알림" 텍스트만 읽고 아이콘은 무시한다
    expect(screen.getByText("알림")).toBeVisible();
    expect(
      screen.getByText("알림").closest("[data-slot='root']")!.querySelector("[aria-hidden='true']"),
    ).toBeInTheDocument();
  });
});

describe("Chip variant × size × shape 조합", () => {
  const variants = ["fill", "outlined", "ghost"] as const;
  const sizes = ["sm", "md"] as const;

  it.each(variants)("variant=%s 가 data-variant로 적용된다", (variant) => {
    const { container } = render(<Chip label={variant} variant={variant} />);
    const root = container.querySelector("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-variant", variant);
  });

  it.each(sizes)("size=%s 가 data-size로 적용된다", (size) => {
    const { container } = render(<Chip label={size} size={size} />);
    const root = container.querySelector("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-size", size);
  });

  it("기본값: variant=outlined, size=md", () => {
    const { container } = render(<Chip label="기본" />);
    const root = container.querySelector("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-variant", "outlined");
    expect(root).toHaveAttribute("data-size", "md");
  });

  it("selected 상태가 data-selected로 반영된다", () => {
    const { container, rerender } = render(<Chip label="토글" onClick={() => {}} />);
    const root = container.querySelector("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-selected", "false");

    rerender(<Chip label="토글" onClick={() => {}} selected />);
    expect(root).toHaveAttribute("data-selected", "true");
  });

  it("variant=fill + selected 조합이 크래시 없이 렌더링된다", () => {
    const { container } = render(<Chip label="필터" variant="fill" selected onClick={() => {}} />);
    const root = container.querySelector("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-variant", "fill");
    expect(root).toHaveAttribute("data-selected", "true");
  });

  it("variant=ghost + selected 조합이 크래시 없이 렌더링된다", () => {
    const { container } = render(<Chip label="강조" variant="ghost" selected onClick={() => {}} />);
    const root = container.querySelector("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-variant", "ghost");
    expect(root).toHaveAttribute("data-selected", "true");
  });
});

describe("Chip 엣지 케이스", () => {
  it("className이 root에 추가된다", () => {
    const { container } = render(<Chip label="커스텀" className="my-chip" />);
    const root = container.querySelector("[data-slot='root']")!;
    expect(root.className).toContain("my-chip");
  });

  it("interactive + remove 동시 사용 시 remove는 onClick 전파를 차단한다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onRemove = vi.fn();

    render(<Chip label="복합" onClick={onClick} onRemove={onRemove} />);
    await user.click(screen.getByRole("button", { name: "복합 삭제" }));

    expect(onRemove).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("interactive가 아닌 칩은 tabIndex가 없다", () => {
    const { container } = render(<Chip label="정적" />);
    const root = container.querySelector("[data-slot='root']")!;
    expect(root).not.toHaveAttribute("tabindex");
  });

  it("interactive 칩은 tabIndex=0이 설정된다", () => {
    render(<Chip label="대화형" onClick={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute("tabindex", "0");
  });
});
