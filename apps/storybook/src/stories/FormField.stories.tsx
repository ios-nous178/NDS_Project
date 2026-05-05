import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  FormField,
  Input,
  Textarea,
  LikertScale,
  RadioGroup,
  RadioGroupItem,
} from "@nudge-eap/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/FormField",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("FormField"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function BasicExample() {
  const [name, setName] = useState("");
  return (
    <div style={{ width: 360 }}>
      <FormField label="이름" required helper="실명을 입력해주세요">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" />
      </FormField>
    </div>
  );
}

function ErrorExample() {
  const [email, setEmail] = useState("not-an-email");
  const isValid = /\S+@\S+\.\S+/.test(email);
  return (
    <div style={{ width: 360 }}>
      <FormField
        label="이메일"
        required
        error={!isValid ? "올바른 이메일 형식이 아닙니다" : undefined}
      >
        <Input value={email} onChange={(e) => setEmail(e.target.value)} error={!isValid} />
      </FormField>
    </div>
  );
}

function CounterExample() {
  const [text, setText] = useState("");
  const max = 200;
  return (
    <div style={{ width: 480 }}>
      <FormField
        label="자기 소개"
        optional
        helper="상담사에게 전달할 내용을 적어주세요"
        counter={`${text.length} / ${max}`}
      >
        <Textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={max} rows={4} />
      </FormField>
    </div>
  );
}

function LikertWrappedExample() {
  const [value, setValue] = useState<string | number>();
  return (
    <div style={{ width: 480 }}>
      <FormField
        label="Q1"
        description="지난 2주 동안, 매사에 흥미나 즐거움이 거의 없었다."
        required
      >
        <LikertScale
          name="phq-q1"
          value={value}
          onValueChange={setValue}
          options={[
            { value: "0", label: "전혀" },
            { value: "1", label: "며칠" },
            { value: "2", label: "절반\n이상" },
            { value: "3", label: "거의\n매일" },
          ]}
        />
      </FormField>
    </div>
  );
}

function RadioWrappedExample() {
  const [value, setValue] = useState("video");
  return (
    <div style={{ width: 360 }}>
      <FormField label="상담 방식" required helper="원하는 상담 방식을 선택해주세요">
        <RadioGroup name="counsel-mode" value={value} onValueChange={setValue}>
          <RadioGroupItem value="face" label="대면" />
          <RadioGroupItem value="video" label="화상" />
          <RadioGroupItem value="chat" label="채팅" />
        </RadioGroup>
      </FormField>
    </div>
  );
}

export const Basic: Story = { name: "기본", render: () => <BasicExample /> };
export const Error: Story = { name: "에러 상태", render: () => <ErrorExample /> };
export const WithCounter: Story = { name: "글자수 카운터", render: () => <CounterExample /> };
export const WrappingLikert: Story = {
  name: "LikertScale 감싸기",
  render: () => <LikertWrappedExample />,
};
export const WrappingRadio: Story = {
  name: "RadioGroup 감싸기",
  render: () => <RadioWrappedExample />,
};
