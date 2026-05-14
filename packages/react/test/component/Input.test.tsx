import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../../src/Input";

describe("Input 사용자 시나리오: 로그인 폼", () => {
  function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: typeof errors = {};
      if (!email) newErrors.email = "이메일을 입력해주세요";
      if (!password) newErrors.password = "비밀번호를 입력해주세요";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setSubmitted(true);
    };

    if (submitted) return <p>로그인 성공</p>;

    return (
      <form onSubmit={handleSubmit}>
        <Input
          label="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          errorMessage={errors.email}
          placeholder="이메일을 입력하세요"
        />
        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          errorMessage={errors.password}
        />
        <button type="submit">로그인</button>
      </form>
    );
  }

  it("빈 상태로 제출하면 에러 메시지가 표시되고, 입력 후 로그인 성공", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    // 빈 상태로 제출
    await user.click(screen.getByRole("button", { name: "로그인" }));
    expect(screen.getByText("이메일을 입력해주세요")).toBeVisible();
    expect(screen.getByText("비밀번호를 입력해주세요")).toBeVisible();

    // 이메일, 비밀번호 입력
    await user.type(screen.getByLabelText("이메일"), "test@nudge.com");
    await user.type(screen.getByLabelText("비밀번호"), "password123");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(screen.getByText("로그인 성공")).toBeVisible();
  });
});

describe("Input 사용자 시나리오: controlled vs uncontrolled", () => {
  it("uncontrolled: defaultValue → 타이핑 → clear 전체 플로우", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<Input label="검색" defaultValue="초기값" clearable onClear={onClear} />);

    const input = screen.getByLabelText("검색");
    expect(input).toHaveValue("초기값");

    // 클리어
    await user.click(screen.getByRole("button", { name: "입력 삭제" }));
    expect(input).toHaveValue("");
    expect(onClear).toHaveBeenCalledOnce();

    // 클리어 후 포커스가 input으로 돌아온다
    expect(input).toHaveFocus();

    // 새로 타이핑
    await user.type(input, "새 검색어");
    expect(input).toHaveValue("새 검색어");
  });

  it("controlled: 외부 state로 값이 제어된다", async () => {
    const user = userEvent.setup();

    function ControlledInput() {
      const [value, setValue] = useState("제어됨");
      return (
        <>
          <Input label="이름" value={value} onChange={(e) => setValue(e.target.value)} />
          <button onClick={() => setValue("")}>초기화</button>
        </>
      );
    }

    render(<ControlledInput />);
    const input = screen.getByLabelText("이름");
    expect(input).toHaveValue("제어됨");

    // 타이핑
    await user.clear(input);
    await user.type(input, "새 이름");
    expect(input).toHaveValue("새 이름");

    // 외부 버튼으로 초기화
    await user.click(screen.getByRole("button", { name: "초기화" }));
    expect(input).toHaveValue("");
  });
});

describe("Input 사용자 시나리오: 클리어 버튼 조건", () => {
  it("값이 비어있으면 클리어 버튼이 나타나지 않는다", () => {
    render(<Input label="입력" clearable />);
    expect(screen.queryByRole("button", { name: "입력 삭제" })).not.toBeInTheDocument();
  });

  it("disabled 상태에서는 값이 있어도 클리어 버튼이 나타나지 않는다", () => {
    render(<Input label="입력" defaultValue="값 있음" clearable disabled />);
    expect(screen.queryByRole("button", { name: "입력 삭제" })).not.toBeInTheDocument();
  });

  it("readOnly 상태에서는 값이 있어도 클리어 버튼이 나타나지 않는다", () => {
    render(<Input label="입력" defaultValue="값 있음" clearable readOnly />);
    expect(screen.queryByRole("button", { name: "입력 삭제" })).not.toBeInTheDocument();
  });

  it("값이 있고 clearable=true이면 클리어 버튼이 나타난다", () => {
    render(<Input label="입력" defaultValue="검색어" clearable onClear={() => {}} />);
    expect(screen.getByRole("button", { name: "입력 삭제" })).toBeInTheDocument();
  });
});

describe("Input 사용자 시나리오: prefix/suffix", () => {
  it("prefix와 suffix가 입력 필드 양쪽에 렌더링된다", () => {
    const { container } = render(
      <Input label="금액" prefix={<span>₩</span>} suffix={<span>원</span>} />,
    );

    expect(screen.getByText("₩")).toBeVisible();
    expect(screen.getByText("원")).toBeVisible();
    expect(container.querySelector("[data-slot='prefix']")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='suffix']")).toBeInTheDocument();
  });
});

describe("Input 접근성", () => {
  it("label이 htmlFor로 input과 연결된다", () => {
    render(<Input label="이메일" placeholder="이메일을 입력하세요" />);
    expect(screen.getByLabelText("이메일")).toHaveAttribute("placeholder", "이메일을 입력하세요");
  });

  it("에러 상태에서 aria-invalid가 설정되고 에러 메시지가 role=alert이다", () => {
    render(<Input label="이름" errorMessage="필수 항목입니다" />);

    const input = screen.getByLabelText("이름");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("필수 항목입니다");
  });

  it("helperText가 aria-describedby로 input과 연결된다", () => {
    render(<Input label="비밀번호" helperText="8자 이상 입력해주세요" />);

    const input = screen.getByLabelText("비밀번호");
    const helper = screen.getByText("8자 이상 입력해주세요");
    expect(input).toHaveAttribute("aria-describedby", helper.id);
  });

  it("errorMessage가 helperText를 대체하여 표시된다", () => {
    render(<Input label="이름" helperText="도움말" errorMessage="에러입니다" />);

    expect(screen.getByText("에러입니다")).toBeVisible();
    expect(screen.queryByText("도움말")).not.toBeInTheDocument();
  });

  it("disabled input은 포커스할 수 없다", () => {
    render(<Input label="비활성" disabled />);
    expect(screen.getByLabelText("비활성")).toBeDisabled();
  });

  it("readOnly input은 편집할 수 없지만 포커스는 가능하다", async () => {
    const user = userEvent.setup();
    render(<Input label="읽기전용" defaultValue="수정불가" readOnly />);

    const input = screen.getByLabelText("읽기전용");
    expect(input).toHaveAttribute("readOnly");
    expect(input).toHaveValue("수정불가");

    await user.click(input);
    await user.type(input, "추가");
    // readOnly라 값이 바뀌지 않는다
    expect(input).toHaveValue("수정불가");
  });

  it("키보드 Tab으로 input → clear 버튼 순서로 이동한다", async () => {
    const user = userEvent.setup();
    render(<Input label="검색" defaultValue="테스트" clearable onClear={() => {}} />);

    await user.tab();
    expect(screen.getByLabelText("검색")).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "입력 삭제" })).toHaveFocus();
  });
});

describe("Input Compound API", () => {
  it("개별 서브컴포넌트로 자유로운 레이아웃을 구성한다", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    function CompoundInput() {
      const [value, setValue] = useState("compound");
      return (
        <Input.Root>
          <Input.Label>이름</Input.Label>
          <Input.Wrapper>
            <Input.Field value={value} onChange={(e) => setValue(e.target.value)} />
            {value && (
              <Input.ClearButton
                onClick={() => {
                  setValue("");
                  onClear();
                }}
              />
            )}
          </Input.Wrapper>
          <Input.Helper>도움말</Input.Helper>
        </Input.Root>
      );
    }

    render(<CompoundInput />);

    expect(screen.getByLabelText("이름")).toHaveValue("compound");
    await user.click(screen.getByRole("button", { name: "입력 삭제" }));
    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.getByText("도움말")).toBeVisible();
  });
});

describe("Input size 변형", () => {
  const sizes = ["default", "field"] as const;

  it.each(sizes)("size=%s 가 크래시 없이 렌더링된다", (size) => {
    const { container } = render(<Input label="테스트" size={size} />);
    const root = container.querySelector("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-size", size);
  });
});

describe("Input 브랜치 커버리지: slotProps & 엣지 케이스", () => {
  it("slotProps로 clearButton과 helper에 className이 적용된다", () => {
    const { container } = render(
      <Input
        label="검색"
        defaultValue="값"
        clearable
        onClear={() => {}}
        helperText="도움말"
        slotProps={{
          clearButton: { className: "clear-cls" },
          helper: { className: "helper-cls" },
          field: { className: "field-cls" },
        }}
      />,
    );

    expect(container.querySelector("[data-slot='clear']")!.className).toContain("clear-cls");
    expect(container.querySelector("[data-slot='helper']")!.className).toContain("helper-cls");
    expect(container.querySelector("[data-slot='field']")!.className).toContain("field-cls");
  });

  it("errorMessage가 있으면 helper에 error variant가 적용된다", () => {
    const { container } = render(<Input label="이름" errorMessage="필수 항목입니다" />);

    const helper = container.querySelector("[data-slot='helper']")!;
    expect(helper).toHaveAttribute("data-variant", "error");
    expect(helper).toHaveAttribute("role", "alert");
  });

  it("label 없이도 정상 렌더링된다", () => {
    render(<Input placeholder="검색어 입력" />);
    const input = document.querySelector("input")!;
    expect(input).toHaveAttribute("placeholder", "검색어 입력");
  });

  it("onFocus/onBlur 콜백이 호출된다", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    render(<Input label="포커스" onFocus={onFocus} onBlur={onBlur} />);

    await user.click(screen.getByLabelText("포커스"));
    expect(onFocus).toHaveBeenCalledOnce();

    await user.tab();
    expect(onBlur).toHaveBeenCalledOnce();
  });
});
