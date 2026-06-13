/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  CountdownTimer,
  FormField,
  InputGroup,
  VerificationCodeInput,
} from "@nudge-design/react";

const meta: Meta<typeof VerificationCodeInput> = {
  title: "Components/Inputs/VerificationCodeInput",
  component: VerificationCodeInput,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof VerificationCodeInput>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 360 }}>{children}</div>
);

export const Default: Story = {
  name: "State/Default",
  render: () => {
    const [v, setV] = useState("");
    return (
      <Frame>
        <VerificationCodeInput value={v} onValueChange={setV} autoFocus />
      </Frame>
    );
  },
};

export const Length4: Story = {
  name: "State/4 Digits",
  render: () => {
    const [v, setV] = useState("");
    return (
      <Frame>
        <VerificationCodeInput length={4} value={v} onValueChange={setV} />
      </Frame>
    );
  },
};

export const Error: Story = {
  name: "State/Error",
  render: () => {
    const [v, setV] = useState("123");
    return (
      <Frame>
        <VerificationCodeInput value={v} onValueChange={setV} error />
      </Frame>
    );
  },
};

export const OnComplete: Story = {
  tags: ["gallery"],
  name: "Recipe/On Complete",
  render: () => {
    const [v, setV] = useState("");
    const [done, setDone] = useState<string | null>(null);
    return (
      <Frame>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--semantic-gap-comfortable)",
          }}
        >
          <VerificationCodeInput
            value={v}
            onValueChange={setV}
            onComplete={(value) => setDone(value)}
          />
          {done && (
            <span style={{ fontSize: 13, color: "var(--semantic-text-status-success)" }}>
              완성 → {done}
            </span>
          )}
        </div>
      </Frame>
    );
  },
};

export const InVerificationForm: Story = {
  tags: ["gallery"],
  name: "Recipe/인증 폼 (FormField + InputGroup 합성)",
  render: () => {
    const [v, setV] = useState("");
    // 인증행 합성: FormField(라벨/헬퍼) > InputGroup(코드 입력 + 확인 버튼).
    // 타이머는 코드 입력 우측에 겹쳐 배치 (pattern: cashwalk-biz-verification).
    const endsAt = useMemo(() => Date.now() + 3 * 60 * 1000, []);
    return (
      <Frame>
        <FormField helper="문자로 전송된 인증번호를 입력해주세요">
          <InputGroup align="start">
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <VerificationCodeInput value={v} onValueChange={setV} autoFocus />
              <CountdownTimer endsAt={endsAt} expiredText="00:00" style={timerInField} />
            </div>
            <Button color="primary" size="field">
              확인
            </Button>
          </InputGroup>
        </FormField>
      </Frame>
    );
  },
};

// 캐포비 본인인증 — 별도 full-width [재전송] + 인라인 버튼 없는 코드 입력 + brand 타이머 + 하단 [다음].
export const CashbizVerification: Story = {
  name: "Recipe/CashwalkBiz 본인인증",
  globals: { brand: "cashwalk-biz" },
  render: () => {
    const [code, setCode] = useState("");
    const endsAt = useMemo(() => Date.now() + 10 * 60 * 1000, []);
    return (
      <div
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
        <div style={{ position: "relative" }}>
          <VerificationCodeInput value={code} onValueChange={setCode} length={6} autoFocus />
          <CountdownTimer
            endsAt={endsAt}
            format="mm:ss"
            tone="brand"
            expiredText="00:00"
            style={timerInField}
          />
        </div>
        <Button color="primary" fullWidth>
          다음
        </Button>
      </div>
    );
  },
};

// 코드 입력 우측에 겹쳐 배치하는 타이머.
const timerInField: React.CSSProperties = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
};
