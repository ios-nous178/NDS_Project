import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { FieldActionRow, type FieldActionRowProps } from "@nudge-eap/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<FieldActionRowProps> = {
  title: "Components/FieldActionRow",
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
      <FieldActionRow
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
        helperText="휴대폰 번호를 입력해주세요"
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
            placeholder="인증번호 6자리"
            style={{ paddingRight: 60 }}
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
        field={<input type="text" defaultValue="123456" readOnly placeholder="인증번호 6자리" />}
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
          <input
            type="text"
            inputMode="numeric"
            defaultValue=""
            placeholder="인증번호 6자리"
            style={{ paddingRight: 60 }}
          />
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
    <div style={{ width: 360, display: "flex", flexDirection: "column", gap: "var(--gap-loose)" }}>
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
              placeholder="인증번호 6자리"
              readOnly={verified}
              style={{ paddingRight: 60 }}
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

function CompoundExample() {
  const [phone, setPhone] = useState("");

  return (
    <div style={{ width: 360 }}>
      <FieldActionRow.Root>
        <FieldActionRow.Row>
          <FieldActionRow.Field>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="010-0000-0000"
            />
          </FieldActionRow.Field>
          <FieldActionRow.Action tone="outline">
            <button
              type="button"
              disabled={phone.replace(/\D/g, "").length < 10}
              style={{ minWidth: 114 }}
            >
              인증번호 받기
            </button>
          </FieldActionRow.Action>
        </FieldActionRow.Row>
        <FieldActionRow.Helper>Compound API로 자유롭게 구성 가능합니다</FieldActionRow.Helper>
      </FieldActionRow.Root>
    </div>
  );
}

export const PhoneVerification: Story = {
  name: "State/Phone Verification",
  render: () => <PhoneVerificationExample />,
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
  name: "Recipe/Full Verification Flow",
  render: () => <FullFlowExample />,
};

export const Compound: Story = {
  name: "Recipe/Compound API",
  render: () => <CompoundExample />,
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

    const codeInput = canvas.getByPlaceholderText("인증번호 6자리");
    await user.type(codeInput, "123456");
    await user.click(canvas.getByRole("button", { name: "확인" }));

    await expect(canvas.getByText("인증이 완료되었습니다")).toBeInTheDocument();
  },
};
