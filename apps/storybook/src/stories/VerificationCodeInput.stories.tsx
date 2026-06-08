/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, CountdownTimer, FieldActionRow, VerificationCodeInput } from "@nudge-design/react";

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
  name: "Recipe/인증 폼 (FieldActionRow 합성)",
  render: () => {
    const [v, setV] = useState("");
    // 타이머·확인 버튼은 VerificationCodeInput 이 아니라 FieldActionRow 가 책임진다.
    // 타이머는 FieldActionRow 가 필드 안(우측)에 렌더하고, 버튼은 필드 오른쪽 액션 슬롯.
    const endsAt = useMemo(() => Date.now() + 3 * 60 * 1000, []);
    return (
      <Frame>
        <FieldActionRow
          field={<VerificationCodeInput value={v} onValueChange={setV} autoFocus />}
          action={
            <Button color="secondary" size="field">
              확인
            </Button>
          }
          timer={<CountdownTimer endsAt={endsAt} expiredText="00:00" />}
          helperText="문자로 전송된 인증번호를 입력해주세요"
        />
      </Frame>
    );
  },
};
