import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import {
  Button,
  CountdownTimer,
  FieldActionRow,
  type FieldActionRowProps,
  VerificationCodeInput,
} from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<FieldActionRowProps> = {
  title: "Components/Layout/FieldActionRow",
  component: FieldActionRow,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("FieldActionRow"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<FieldActionRowProps>;

const formatPhone = (v: string) => {
  const digits = v.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

function PhoneVerificationExample() {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div style={{ width: 360 }}>
      {/* label prop — 라벨은 한 줄 위, 입력+버튼은 인라인으로 컴포넌트가 정렬한다.
          (라벨을 손으로 버튼과 같은 줄에 욱여넣으면 버튼이 라벨 높이에 떠 어긋난다 — 그 회귀 방지.)
          전송 후 버튼 라벨은 [인증번호 받기] → [재전송] 으로 토글한다. */}
      <FieldActionRow
        label="휴대폰 번호"
        field={
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="010-0000-0000"
          />
        }
        action={
          <button
            type="button"
            disabled={phone.replace(/\D/g, "").length < 10}
            onClick={() => setSent(true)}
            style={{ minWidth: 114 }}
          >
            {sent ? "재전송" : "인증번호 받기"}
          </button>
        }
        actionTone="outline"
        helperText="'-' 없이 숫자만 입력해주세요"
      />
    </div>
  );
}

function VerificationCodeExample() {
  const [code, setCode] = useState("");

  return (
    <div style={{ width: 360 }}>
      <FieldActionRow
        field={
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="인증번호 입력"
          />
        }
        action={
          <button type="button" disabled={code.length < 6}>
            확인
          </button>
        }
        actionTone="solid"
        timer="02:58"
        helperText="문자로 전송된 인증번호를 입력해주세요"
      />
    </div>
  );
}

function ErrorStateExample() {
  return (
    <div style={{ width: 360 }}>
      <FieldActionRow
        field={<input type="tel" defaultValue="010-0000-0000" placeholder="010-0000-0000" />}
        action={
          <button type="button" disabled style={{ minWidth: 114 }}>
            인증번호 받기
          </button>
        }
        actionTone="outline"
        error
        helperText="유효하지 않은 번호입니다. 다시 확인해주세요."
      />
    </div>
  );
}

function SuccessStateExample() {
  return (
    <div style={{ width: 360 }}>
      <FieldActionRow
        field={<input type="text" defaultValue="123456" readOnly placeholder="인증번호 입력" />}
        action={
          <button type="button" disabled>
            확인
          </button>
        }
        actionTone="solid"
        success
        helperText="인증이 완료되었습니다"
      />
    </div>
  );
}

function ExpiredTimerExample() {
  return (
    <div style={{ width: 360 }}>
      <FieldActionRow
        field={
          <input type="text" inputMode="numeric" defaultValue="" placeholder="인증번호 입력" />
        }
        action={
          <button type="button" disabled>
            확인
          </button>
        }
        actionTone="solid"
        timer="00:00"
        timerExpired
        error
        helperText="인증 시간이 만료되었습니다. 인증번호를 다시 받아주세요."
      />
    </div>
  );
}

function FullFlowExample() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);

  return (
    <div
      style={{
        width: 360,
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-loose)",
      }}
    >
      <FieldActionRow
        field={
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="010-0000-0000"
            readOnly={sent}
          />
        }
        action={
          <button
            type="button"
            disabled={phone.replace(/\D/g, "").length < 10 || verified}
            onClick={() => setSent(true)}
            style={{ minWidth: 114 }}
          >
            {sent ? "재전송" : "인증번호 받기"}
          </button>
        }
        actionTone="outline"
      />
      {sent && (
        <FieldActionRow
          field={
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="인증번호 입력"
              readOnly={verified}
            />
          }
          action={
            <button
              type="button"
              disabled={code.length < 6 || verified}
              onClick={() => setVerified(true)}
            >
              확인
            </button>
          }
          actionTone="solid"
          timer={verified ? undefined : "02:58"}
          success={verified}
          helperText={verified ? "인증이 완료되었습니다" : "문자로 전송된 인증번호를 입력해주세요"}
        />
      )}
    </div>
  );
}

// 캐포비 본인인증 레이아웃(pattern:cashwalk-biz-verification):
//   별도 full-width 검정 [재전송] + 인라인 버튼 없는 코드 입력(FieldActionRow action 생략) +
//   tone="brand" 오렌지 타이머 + 하단 full-width 노랑 [다음].
function CashpobiVerificationExample() {
  const [code, setCode] = useState("");
  const endsAt = useMemo(() => Date.now() + 10 * 60 * 1000, []);
  return (
    <div
      data-brand="cashwalk-biz"
      style={{
        width: 400,
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-default)",
      }}
    >
      <Button color="neutral" fullWidth>
        인증번호 재전송
      </Button>
      <FieldActionRow
        field={
          <VerificationCodeInput value={code} onValueChange={setCode} length={6} autoFocus />
        }
        timer={<CountdownTimer endsAt={endsAt} format="mm:ss" tone="brand" expiredText="00:00" />}
      />
      <Button color="primary" fullWidth>
        다음
      </Button>
    </div>
  );
}

export const PhoneVerification: Story = {
  name: "State/Phone Verification",
  render: () => <PhoneVerificationExample />,
};

export const CashpobiVerification: Story = {
  tags: ["gallery"],
  name: "Recipe/CashwalkBiz 본인인증 (action 생략 + brand 타이머)",
  render: () => <CashpobiVerificationExample />,
};

export const VerificationCode: Story = {
  name: "State/Verification Code Timer",
  render: () => <VerificationCodeExample />,
};

export const ErrorState: Story = {
  name: "State/Error",
  render: () => <ErrorStateExample />,
};

export const SuccessState: Story = {
  name: "State/Success",
  render: () => <SuccessStateExample />,
};

export const ExpiredTimer: Story = {
  name: "State/Timer Expired",
  render: () => <ExpiredTimerExample />,
};

export const FullFlow: Story = {
  tags: ["gallery"],
  name: "Recipe/Full Verification Flow",
  render: () => <FullFlowExample />,
};

export const PhoneVerificationInteraction: Story = {
  name: "Interaction/Phone Verification Request",
  render: () => <PhoneVerificationExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const input = canvas.getByPlaceholderText("010-0000-0000");
    const actionButton = canvas.getByRole("button", { name: "인증번호 받기" });

    await expect(actionButton).toBeDisabled();
    await user.type(input, "01012345678");
    await expect(actionButton).toBeEnabled();

    await user.click(actionButton);
    await expect(canvas.getByRole("button", { name: "재전송" })).toBeInTheDocument();
  },
};

export const FullFlowInteraction: Story = {
  name: "Interaction/Full Verification Flow",
  render: () => <FullFlowExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const phoneInput = canvas.getByPlaceholderText("010-0000-0000");

    await user.type(phoneInput, "01012345678");
    await user.click(canvas.getByRole("button", { name: "인증번호 받기" }));

    const codeInput = canvas.getByPlaceholderText("인증번호 입력");
    await user.type(codeInput, "123456");
    await user.click(canvas.getByRole("button", { name: "확인" }));

    await expect(canvas.getByText("인증이 완료되었습니다")).toBeInTheDocument();
  },
};
