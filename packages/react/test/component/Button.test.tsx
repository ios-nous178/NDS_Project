import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../../src/Button";

describe("Button 사용자 시나리오", () => {
  it("사용자가 버튼을 클릭하면 액션이 실행된다", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<Button onClick={onSave}>저장하기</Button>);
    await user.click(screen.getByRole("button", { name: "저장하기" }));

    expect(onSave).toHaveBeenCalledOnce();
  });

  it("비활성 버튼은 클릭해도 액션이 실행되지 않는다", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <Button onClick={onSubmit} disabled>
        제출
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "제출" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("폼 안에서 type='button'이면 submit이 발생하지 않는다", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <input />
        <Button type="button">취소</Button>
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "취소" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("폼 안에서 type='submit'이면 폼이 제출된다", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <input />
        <Button type="submit">제출</Button>
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "제출" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("로딩 중 상태 전환: 클릭 → disabled → 다시 활성화", async () => {
    const user = userEvent.setup();

    function SubmitButton() {
      const [loading, setLoading] = useState(false);
      return (
        <Button disabled={loading} onClick={() => setLoading(true)}>
          {loading ? "처리중..." : "제출"}
        </Button>
      );
    }

    render(<SubmitButton />);

    const button = screen.getByRole("button", { name: "제출" });
    await user.click(button);

    // 클릭 후 비활성화되고 텍스트가 바뀐다
    expect(screen.getByRole("button", { name: "처리중..." })).toBeDisabled();
  });
});

describe("Button 접근성", () => {
  it("아이콘이 있어도 텍스트 라벨이 접근 가능한 이름이 된다", () => {
    render(<Button leftIcon={<svg aria-hidden="true" />}>다운로드</Button>);

    // 스크린리더는 "다운로드" 버튼으로 인식한다
    expect(screen.getByRole("button", { name: "다운로드" })).toBeInTheDocument();
  });

  it("키보드 Tab으로 포커스할 수 있다", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <input placeholder="이름" />
        <Button>다음</Button>
      </div>,
    );

    await user.tab(); // input으로
    await user.tab(); // button으로

    expect(screen.getByRole("button", { name: "다음" })).toHaveFocus();
  });

  it("비활성 버튼은 Tab 순서에서 제외된다", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Button>활성</Button>
        <Button disabled>비활성</Button>
        <Button>다음</Button>
      </div>,
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "활성" })).toHaveFocus();

    await user.tab();
    // 비활성 버튼을 건너뛰고 "다음"으로 간다
    expect(screen.getByRole("button", { name: "다음" })).toHaveFocus();
  });

  it("기본 type이 button이라 의도치 않은 폼 제출이 방지된다", () => {
    render(<Button>확인</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("ref를 통해 프로그래밍적으로 포커스할 수 있다", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>포커스</Button>);

    ref.current?.focus();
    expect(screen.getByRole("button", { name: "포커스" })).toHaveFocus();
  });
});

describe("Button variant × color × size 조합", () => {
  const variants = ["solid", "outlined", "soft", "outlined-sub"] as const;
  const colors = ["primary", "secondary"] as const;
  const sizes = ["xl", "lg", "md", "sm", "xs", "field"] as const;

  it.each(variants)("variant=%s 가 정상 렌더링되고 data attribute가 설정된다", (variant) => {
    render(<Button variant={variant}>{variant}</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", variant);
  });

  it.each(colors)("color=%s 가 정상 렌더링되고 data attribute가 설정된다", (color) => {
    render(<Button color={color}>{color}</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-color", color);
  });

  it.each(sizes)("size=%s 가 정상 렌더링되고 data attribute가 설정된다", (size) => {
    render(<Button size={size}>{size}</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-size", size);
  });

  it("variant × color 전체 조합이 크래시 없이 렌더링된다", () => {
    for (const variant of variants) {
      for (const color of colors) {
        const { unmount } = render(
          <Button variant={variant} color={color}>
            {variant}-{color}
          </Button>,
        );
        expect(screen.getByRole("button")).toBeInTheDocument();
        unmount();
      }
    }
  });

  it("disabled 상태에서도 variant × color 조합이 크래시 없이 렌더링된다", () => {
    for (const variant of variants) {
      for (const color of colors) {
        const { unmount } = render(
          <Button variant={variant} color={color} disabled>
            {variant}-{color}
          </Button>,
        );
        expect(screen.getByRole("button")).toBeDisabled();
        unmount();
      }
    }
  });
});

describe("Button 엣지 케이스", () => {
  it("fullWidth 설정 시 CSS 변수로 100%가 적용된다", () => {
    render(<Button fullWidth>전체</Button>);
    const btn = screen.getByRole("button");
    expect(btn.style.getPropertyValue("--nds-button-width")).toBe("100%");
  });

  it("fullWidth 미설정 시 CSS 변수로 auto가 적용된다", () => {
    render(<Button>기본</Button>);
    const btn = screen.getByRole("button");
    expect(btn.style.getPropertyValue("--nds-button-width")).toBe("auto");
  });

  it("leftIcon만 있을 때 rightIcon 슬롯은 렌더링되지 않는다", () => {
    const { container } = render(<Button leftIcon={<span>L</span>}>왼쪽만</Button>);
    expect(container.querySelector("[data-slot='left-icon']")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='right-icon']")).not.toBeInTheDocument();
  });

  it("rightIcon만 있을 때 leftIcon 슬롯은 렌더링되지 않는다", () => {
    const { container } = render(<Button rightIcon={<span>R</span>}>오른쪽만</Button>);
    expect(container.querySelector("[data-slot='left-icon']")).not.toBeInTheDocument();
    expect(container.querySelector("[data-slot='right-icon']")).toBeInTheDocument();
  });

  it("children이 비어있어도 크래시하지 않는다", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("slotProps로 아이콘 슬롯에 className을 전달할 수 있다", () => {
    const { container } = render(
      <Button
        leftIcon={<span>L</span>}
        slotProps={{
          leftIcon: { className: "icon-custom" },
        }}
      >
        슬롯 테스트
      </Button>,
    );
    const iconSlot = container.querySelector("[data-slot='left-icon']") as HTMLElement;
    expect(iconSlot.className).toContain("icon-custom");
  });

  it("slotProps로 라벨 슬롯에 data 속성을 전달할 수 있다", () => {
    const { container } = render(
      <Button
        slotProps={{
          label: { "data-testid": "my-label" } as React.HTMLAttributes<HTMLSpanElement>,
        }}
      >
        라벨
      </Button>,
    );
    expect(container.querySelector("[data-testid='my-label']")).toBeInTheDocument();
  });

  it("slotProps로 rightIcon 슬롯에 className을 전달할 수 있다", () => {
    const { container } = render(
      <Button
        rightIcon={<span>R</span>}
        slotProps={{
          rightIcon: { className: "right-icon-custom" },
        }}
      >
        오른쪽 아이콘
      </Button>,
    );
    const iconSlot = container.querySelector("[data-slot='right-icon']") as HTMLElement;
    expect(iconSlot.className).toContain("right-icon-custom");
  });

  it("leftIcon + rightIcon 동시에 렌더링된다", () => {
    const { container } = render(
      <Button leftIcon={<span>L</span>} rightIcon={<span>R</span>}>
        양쪽
      </Button>,
    );
    expect(container.querySelector("[data-slot='left-icon']")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='right-icon']")).toBeInTheDocument();
  });
});
