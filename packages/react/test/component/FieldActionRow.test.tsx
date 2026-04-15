import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FieldActionRow } from "../../src/FieldActionRow";

describe("FieldActionRow 사용자 시나리오: 인증번호 입력", () => {
  function VerificationForm() {
    const [code, setCode] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [verified, setVerified] = useState(false);

    const handleRequest = () => {
      setSent(true);
      setError("");
    };

    const handleVerify = () => {
      if (code === "123456") {
        setVerified(true);
        setError("");
      } else {
        setError("인증번호가 일치하지 않습니다");
      }
    };

    if (verified) return <p>인증 완료</p>;

    return (
      <FieldActionRow
        field={
          <input
            aria-label="인증번호"
            placeholder="인증번호 6자리"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        }
        action={
          <button onClick={sent ? handleVerify : handleRequest}>
            {sent ? "인증 확인" : "인증 요청"}
          </button>
        }
        timer={sent ? "02:58" : undefined}
        error={!!error}
        helperText={error || (sent ? "인증번호가 발송되었습니다" : undefined)}
      />
    );
  }

  it("인증 요청 → 코드 입력 → 인증 확인 전체 플로우", async () => {
    const user = userEvent.setup();
    render(<VerificationForm />);

    // 1단계: 인증 요청 버튼 클릭
    await user.click(screen.getByRole("button", { name: "인증 요청" }));

    // 타이머와 안내 메시지가 표시된다
    expect(screen.getByText("02:58")).toBeVisible();
    expect(screen.getByText("인증번호가 발송되었습니다")).toBeVisible();

    // 2단계: 잘못된 인증번호 입력
    const input = screen.getByRole("textbox", { name: "인증번호" });
    await user.type(input, "000000");
    await user.click(screen.getByRole("button", { name: "인증 확인" }));

    expect(screen.getByText("인증번호가 일치하지 않습니다")).toBeVisible();

    // 3단계: 올바른 인증번호 입력
    await user.clear(input);
    await user.type(input, "123456");
    await user.click(screen.getByRole("button", { name: "인증 확인" }));

    expect(screen.getByText("인증 완료")).toBeVisible();
  });
});

describe("FieldActionRow 사용자 시나리오: 이메일 인증", () => {
  it("Compound API로 입력 + 버튼 + 도움말을 자유롭게 배치한다", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();

    render(
      <FieldActionRow.Root>
        <FieldActionRow.Row>
          <FieldActionRow.Field>
            <input aria-label="이메일" placeholder="이메일 주소" />
          </FieldActionRow.Field>
          <FieldActionRow.Action>
            <button onClick={onSend}>발송</button>
          </FieldActionRow.Action>
        </FieldActionRow.Row>
        <FieldActionRow.Helper>회사 이메일만 입력 가능합니다</FieldActionRow.Helper>
      </FieldActionRow.Root>,
    );

    // 이메일을 입력하고 발송 버튼을 클릭한다
    await user.type(screen.getByRole("textbox", { name: "이메일" }), "test@company.com");
    await user.click(screen.getByRole("button", { name: "발송" }));

    expect(screen.getByRole("textbox", { name: "이메일" })).toHaveValue("test@company.com");
    expect(onSend).toHaveBeenCalledOnce();
    expect(screen.getByText("회사 이메일만 입력 가능합니다")).toBeVisible();
  });
});

describe("FieldActionRow 접근성", () => {
  it("에러 상태에서 도움 텍스트가 사용자에게 보인다", () => {
    render(
      <FieldActionRow
        field={<input aria-label="코드" />}
        action={<button>확인</button>}
        error
        helperText="유효하지 않은 코드입니다"
      />,
    );

    expect(screen.getByText("유효하지 않은 코드입니다")).toBeVisible();
  });

  it("input과 버튼 사이를 Tab으로 이동할 수 있다", async () => {
    const user = userEvent.setup();

    render(
      <FieldActionRow field={<input aria-label="인증번호" />} action={<button>확인</button>} />,
    );

    await user.tab();
    expect(screen.getByRole("textbox", { name: "인증번호" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "확인" })).toHaveFocus();
  });

  it("타이머 만료 시 시각적으로 구분된다", () => {
    const { container } = render(
      <FieldActionRow
        field={<input aria-label="코드" />}
        action={<button>재요청</button>}
        timer="00:00"
        timerExpired
      />,
    );

    expect(screen.getByText("00:00")).toBeVisible();
    // 만료된 타이머는 expired 상태를 가진다
    const timer = container.querySelector("[data-expired='true']");
    expect(timer).toHaveTextContent("00:00");
  });
});
