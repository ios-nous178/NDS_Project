import React, { useEffect, useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay } from "msw";
import { http, HttpResponse } from "msw";
import { FieldActionRow } from "../../src/FieldActionRow";
import { Snackbar } from "../../src/Snackbar";
import { server } from "../msw/server";

const { Provider: SnackbarProvider, useSnackbar } = Snackbar;
const INITIAL_TIMER_SECONDS = 3;

const formatSeconds = (seconds: number) => {
  const safeSeconds = Math.max(seconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

function VerificationFlow() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [helperText, setHelperText] = useState("휴대폰 번호를 입력해주세요");
  const [error, setError] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const { snackbar } = useSnackbar();

  useEffect(() => {
    if (!sent || verified || secondsLeft === null || secondsLeft <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current === null || current <= 1) {
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [sent, verified, secondsLeft]);

  useEffect(() => {
    if (!sent || verified || secondsLeft !== 0) {
      return;
    }

    setError(true);
    setHelperText("인증 시간이 만료되었습니다. 인증번호를 다시 받아주세요.");
    snackbar("인증 시간이 만료되었습니다", { variant: "error" });
  }, [secondsLeft, sent, verified, snackbar]);

  const handleRequestCode = async () => {
    setIsRequesting(true);
    const response = await fetch("/api/verification/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    setIsRequesting(false);

    if (!response.ok) {
      setError(true);
      setHelperText("인증번호 전송에 실패했습니다. 다시 시도해주세요.");
      snackbar("인증번호 전송에 실패했습니다", { variant: "error" });
      return;
    }

    setSent(true);
    setError(false);
    setCode("");
    setVerified(false);
    setSecondsLeft(INITIAL_TIMER_SECONDS);
    setHelperText("문자로 전송된 인증번호를 입력해주세요");
    snackbar("인증번호를 전송했습니다", { variant: "success" });
  };

  const handleVerify = async () => {
    if (secondsLeft === 0) {
      return;
    }

    setIsVerifying(true);
    const response = await fetch("/api/verification/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    setIsVerifying(false);

    if (!response.ok) {
      setError(true);
      setHelperText("인증번호가 올바르지 않습니다. 다시 확인해주세요.");
      snackbar("인증에 실패했습니다", {
        variant: "error",
        action: {
          label: "다시 시도",
          onClick: () => {
            void handleVerify();
          },
        },
      });
      return;
    }

    setVerified(true);
    setError(false);
    setSecondsLeft(null);
    setHelperText("인증이 완료되었습니다");
    snackbar("휴대폰 인증이 완료되었습니다", { variant: "success" });
  };

  return (
    <div>
      <FieldActionRow
        field={
          <input
            aria-label="휴대폰 번호"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="010-0000-0000"
            readOnly={sent}
          />
        }
        action={
          <button
            type="button"
            onClick={handleRequestCode}
            disabled={phone.replace(/\D/g, "").length < 10 || verified || isRequesting}
          >
            {isRequesting ? "전송 중..." : sent ? "재전송" : "인증번호 받기"}
          </button>
        }
        helperText={helperText}
        error={error}
      />

      {sent && (
        <FieldActionRow
          field={
            <input
              aria-label="인증번호"
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="인증번호 6자리"
              readOnly={verified}
            />
          }
          action={
            <button
              type="button"
              onClick={handleVerify}
              disabled={code.length < 6 || verified || isVerifying || secondsLeft === 0}
            >
              {isVerifying ? "확인 중..." : "확인"}
            </button>
          }
          actionTone="solid"
          timer={verified ? undefined : formatSeconds(secondsLeft ?? INITIAL_TIMER_SECONDS)}
          timerExpired={secondsLeft === 0}
          helperText={verified ? "인증이 완료되었습니다" : "문자로 전송된 인증번호를 입력해주세요"}
          success={verified}
          error={error && !verified}
        />
      )}
    </div>
  );
}

function renderVerificationFlow() {
  return render(
    <SnackbarProvider>
      <VerificationFlow />
    </SnackbarProvider>,
  );
}

describe("FieldActionRow integration", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("requests a verification code and completes verification with MSW-backed responses", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("/api/verification/request", () => HttpResponse.json({ ok: true })),
      http.post("/api/verification/confirm", () => HttpResponse.json({ ok: true })),
    );

    renderVerificationFlow();

    await user.type(screen.getByLabelText("휴대폰 번호"), "01012345678");
    await user.click(screen.getByRole("button", { name: "인증번호 받기" }));

    expect(await screen.findByText("인증번호를 전송했습니다")).toBeInTheDocument();
    expect(screen.getByLabelText("인증번호")).toBeInTheDocument();
    expect(screen.getAllByText("문자로 전송된 인증번호를 입력해주세요")).not.toHaveLength(0);

    await user.type(screen.getByLabelText("인증번호"), "123456");
    await user.click(screen.getByRole("button", { name: "확인" }));

    expect(await screen.findByText("휴대폰 인증이 완료되었습니다")).toBeInTheDocument();
    expect(screen.getAllByText("인증이 완료되었습니다")).not.toHaveLength(0);
  });

  it("shows an error toast and helper text when the request API fails", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("/api/verification/request", () =>
        HttpResponse.json({ message: "failed" }, { status: 500 }),
      ),
    );

    renderVerificationFlow();

    await user.type(screen.getByLabelText("휴대폰 번호"), "01012345678");
    await user.click(screen.getByRole("button", { name: "인증번호 받기" }));

    expect(await screen.findByText("인증번호 전송에 실패했습니다")).toBeInTheDocument();
    expect(
      screen.getByText("인증번호 전송에 실패했습니다. 다시 시도해주세요."),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("인증번호")).not.toBeInTheDocument();
  });

  it("keeps the request button disabled while the request API is pending", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("/api/verification/request", async () => {
        await delay(150);
        return HttpResponse.json({ ok: true });
      }),
    );

    renderVerificationFlow();

    await user.type(screen.getByLabelText("휴대폰 번호"), "01012345678");
    await user.click(screen.getByRole("button", { name: "인증번호 받기" }));

    expect(screen.getByRole("button", { name: "전송 중..." })).toBeDisabled();
    expect(await screen.findByText("인증번호를 전송했습니다")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "재전송" })).toBeEnabled();
  });

  it("shows verification failure state and retries from the toast action", async () => {
    const user = userEvent.setup();
    let confirmAttempts = 0;

    server.use(
      http.post("/api/verification/request", () => HttpResponse.json({ ok: true })),
      http.post("/api/verification/confirm", () => {
        confirmAttempts += 1;

        if (confirmAttempts === 1) {
          return HttpResponse.json({ message: "invalid code" }, { status: 400 });
        }

        return HttpResponse.json({ ok: true });
      }),
    );

    renderVerificationFlow();

    await user.type(screen.getByLabelText("휴대폰 번호"), "01012345678");
    await user.click(screen.getByRole("button", { name: "인증번호 받기" }));
    await screen.findByText("인증번호를 전송했습니다");

    await user.type(screen.getByLabelText("인증번호"), "123456");
    await user.click(screen.getByRole("button", { name: "확인" }));

    expect(await screen.findByText("인증에 실패했습니다")).toBeInTheDocument();
    expect(
      screen.getByText("인증번호가 올바르지 않습니다. 다시 확인해주세요."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다시 시도" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(await screen.findByText("휴대폰 인증이 완료되었습니다")).toBeInTheDocument();
    expect(screen.getAllByText("인증이 완료되었습니다")).not.toHaveLength(0);
    expect(confirmAttempts).toBe(2);
  });

  it("marks the verification step as expired after the timer runs out", async () => {
    vi.useFakeTimers();

    server.use(http.post("/api/verification/request", () => HttpResponse.json({ ok: true })));

    renderVerificationFlow();

    fireEvent.change(screen.getByLabelText("휴대폰 번호"), {
      target: { value: "01012345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: "인증번호 받기" }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByText("인증번호를 전송했습니다")).toBeInTheDocument();

    expect(screen.getByText("00:03")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("인증 시간이 만료되었습니다")).toBeInTheDocument();
    expect(
      screen.getByText("인증 시간이 만료되었습니다. 인증번호를 다시 받아주세요."),
    ).toBeInTheDocument();
    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "확인" })).toBeDisabled();
  });

  it("resets the verification input and timer when requesting a new code again", async () => {
    const user = userEvent.setup();

    server.use(http.post("/api/verification/request", () => HttpResponse.json({ ok: true })));

    renderVerificationFlow();

    await user.type(screen.getByLabelText("휴대폰 번호"), "01012345678");
    await user.click(screen.getByRole("button", { name: "인증번호 받기" }));
    await screen.findByText("인증번호를 전송했습니다");

    const codeInput = screen.getByLabelText("인증번호");
    await user.type(codeInput, "123456");
    expect(codeInput).toHaveValue("123456");

    await user.click(screen.getByRole("button", { name: "재전송" }));

    expect(await screen.findAllByText("인증번호를 전송했습니다")).not.toHaveLength(0);
    expect(screen.getByLabelText("인증번호")).toHaveValue("");
    expect(screen.getByText("00:03")).toBeInTheDocument();
  });
});
