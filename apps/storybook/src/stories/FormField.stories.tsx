import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  FormField,
  FormSection,
  Input,
  InputGroup,
  Select,
  Textarea,
  LikertScale,
  RadioGroup,
  RadioGroupItem,
} from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/Inputs/FormField",
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
      <FormField label="자기 소개" optional helper="상담사에게 전달할 내용을 적어주세요">
        {/* 카운터는 Textarea 자체 기능(maxLength)만 사용 — FormField counter 중복 제거 */}
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

function LabelLeftExample() {
  const [name, setName] = useState("");
  return (
    <div data-brand="cashwalk-biz" style={{ width: 600 }}>
      <FormField
        label="이름"
        labelPosition="left"
        helper="도움말이 노출됩니다."
        htmlFor="cashwalk-biz-admin-name"
      >
        <Input
          id="cashwalk-biz-admin-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="값을 입력하세요"
        />
      </FormField>
    </div>
  );
}

function CashwalkBizAdminTextFieldExample() {
  // CashwalkBiz Figma Section_TextField (3082:846) — Label=Left × {Typing, Error, Disabled, Complete}.
  const states = [
    {
      key: "default",
      caption: "Default",
      props: { placeholder: "값을 입력하세요" },
      helper: "도움말이 노출됩니다.",
    },
    {
      key: "typing",
      caption: "Typing",
      props: { defaultValue: "입력된 텍스트", autoFocus: true },
      helper: "도움말이 노출됩니다.",
    },
    {
      key: "error",
      caption: "Error",
      props: { defaultValue: "입력된 텍스트", error: true },
      error: "에러 메시지가 노출됩니다.",
    },
    {
      key: "disabled",
      caption: "Disabled",
      props: { placeholder: "값을 입력하세요", disabled: true },
      helper: "도움말이 노출됩니다.",
    },
    {
      key: "complete",
      caption: "Complete",
      props: { defaultValue: "입력된 텍스트", complete: true },
      helper: "도움말이 노출됩니다.",
    },
  ] as const;

  return (
    <div
      data-brand="cashwalk-biz"
      style={{ display: "flex", flexDirection: "column", gap: 20, width: 600 }}
    >
      {states.map((s) => (
        <div key={s.key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <FormField
            label="Label"
            labelPosition="left"
            required={s.key === "error"}
            helper={"helper" in s ? s.helper : undefined}
            error={"error" in s ? s.error : undefined}
            htmlFor={`cashwalk-biz-admin-${s.key}`}
          >
            <Input id={`cashwalk-biz-admin-${s.key}`} {...s.props} />
          </FormField>
          <span style={{ fontSize: 11, color: "#bbb", fontWeight: 700 }}>{s.caption}</span>
        </div>
      ))}
    </div>
  );
}

function AdminFormSectionExample() {
  // CashwalkBiz Figma "기본 정보" FormSection (3466:17405) 재현 — 카드 chrome(white·radius16·padding24)은
  // FormSection 컴포넌트가 data-brand cascade 로 소유(hex 직접 X). FormField 2개 density="admin" py-24 → 사이 48px.
  const [single, setSingle] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  return (
    <div data-brand="cashwalk-biz" style={{ width: 1000 }}>
      <FormSection title="기본 정보">
        <FormField label="Label" labelPosition="left" density="admin">
          <Select
            value={single}
            onValueChange={setSingle}
            options={[
              { value: "a", label: "옵션 A" },
              { value: "b", label: "옵션 B" },
            ]}
            placeholder="선택해 주세요"
          />
        </FormField>
        <FormField label="Label" labelPosition="left" density="admin">
          <InputGroup>
            <Select
              value={year}
              onValueChange={setYear}
              options={[
                { value: "2024", label: "2024" },
                { value: "2025", label: "2025" },
                { value: "2026", label: "2026" },
              ]}
              placeholder="년"
            />
            <Select
              value={month}
              onValueChange={setMonth}
              options={Array.from({ length: 12 }, (_, i) => ({
                value: String(i + 1),
                label: `${i + 1}월`,
              }))}
              placeholder="월"
            />
            <Select
              value={day}
              onValueChange={setDay}
              options={Array.from({ length: 31 }, (_, i) => ({
                value: String(i + 1),
                label: `${i + 1}일`,
              }))}
              placeholder="일"
            />
          </InputGroup>
        </FormField>
      </FormSection>
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

export const Basic: Story = { name: "State/기본", render: () => <BasicExample /> };
export const Error: Story = { name: "State/에러 상태", render: () => <ErrorExample /> };
export const WithCounter: Story = {
  tags: ["gallery"],
  name: "Variant/글자수 카운터",
  render: () => <CounterExample />,
};
export const WrappingLikert: Story = {
  tags: ["gallery"],
  name: "Recipe/LikertScale 감싸기",
  render: () => <LikertWrappedExample />,
};
export const WrappingRadio: Story = {
  name: "Recipe/RadioGroup 감싸기",
  render: () => <RadioWrappedExample />,
};
export const LabelLeft: Story = {
  name: "Recipe/라벨 좌측 (admin)",
  render: () => <LabelLeftExample />,
  parameters: {
    docs: {
      description: {
        story:
          'CashwalkBiz admin TextField 패턴. `labelPosition="left"` 라벨 좌측 고정 폼 (캐포비 brand 에서 입력 높이 48px cascade — size 미지정). 라벨 컬럼 너비 기본 180px (`labelWidth` 로 조정).',
      },
    },
  },
};
export const CashwalkBizAdminTextField: Story = {
  name: "Recipe/캐포비 admin · TextField 5 states",
  render: () => <CashwalkBizAdminTextFieldExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Figma CashwalkBiz Library `Section_TextField` (3082:846) 의 5개 state 재현. Label=Left + admin density (입력 48px) 조합.",
      },
    },
  },
};
export const CashwalkBizAdminFormSection: Story = {
  name: "Recipe/캐포비 admin · FormSection + InputGroup",
  render: () => <AdminFormSectionExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Figma CashwalkBiz Library `FormSection` (3466:17405) 재현. " +
          "FormField `density='admin'` 가 자체 py-24 를 부여해 stack 시 시각 48px 간격이 자동 형성됨. " +
          "두번째 FormField 안에서 `InputGroup` 으로 년/월/일 Select 3개를 gap 12 균등 분할.",
      },
    },
  },
};
