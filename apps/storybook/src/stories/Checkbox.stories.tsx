import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Checkbox, CheckboxGroup, Radio, RadioGroup, RadioGroupItem } from "@nudge-eap/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta = {
  title: "Components/Checkbox & Radio",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Checkbox"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function CheckboxExample() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);

  return (
    <CheckboxGroup>
      <Checkbox checked={a} onCheckedChange={setA} label="심리상담 동의" />
      <Checkbox checked={b} onCheckedChange={setB} label="개인정보 처리 동의" />
      <Checkbox checked={c} onCheckedChange={setC} label="마케팅 수신 동의 (선택)" />
    </CheckboxGroup>
  );
}

function CheckboxHorizontalExample() {
  const [items, setItems] = useState<Record<string, boolean>>({
    stress: true,
    sleep: false,
    relation: false,
  });

  const toggle = (key: string) => setItems((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <CheckboxGroup layout="horizontal" gap={20}>
      <Checkbox checked={items.stress} onCheckedChange={() => toggle("stress")} label="스트레스" />
      <Checkbox checked={items.sleep} onCheckedChange={() => toggle("sleep")} label="수면" />
      <Checkbox
        checked={items.relation}
        onCheckedChange={() => toggle("relation")}
        label="대인관계"
      />
    </CheckboxGroup>
  );
}

function CheckboxDisabledExample() {
  return (
    <CheckboxGroup>
      <Checkbox checked={true} label="동의함 (변경 불가)" disabled />
      <Checkbox checked={false} label="비활성화된 항목" disabled />
    </CheckboxGroup>
  );
}

function RadioGroupExample() {
  const [value, setValue] = useState("face");

  return (
    <RadioGroup name="counsel-type" value={value} onValueChange={setValue}>
      <RadioGroupItem value="face" label="대면 상담" />
      <RadioGroupItem value="video" label="화상 상담" />
      <RadioGroupItem value="chat" label="채팅 상담" />
      <RadioGroupItem value="phone" label="전화 상담" />
    </RadioGroup>
  );
}

function RadioHorizontalExample() {
  const [value, setValue] = useState("male");

  return (
    <RadioGroup name="gender" value={value} onValueChange={setValue} layout="horizontal" gap={24}>
      <RadioGroupItem value="male" label="남성" />
      <RadioGroupItem value="female" label="여성" />
      <RadioGroupItem value="other" label="기타" />
    </RadioGroup>
  );
}

function StandaloneRadioExample() {
  const [selected, setSelected] = useState("a");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Radio
        name="standalone"
        checked={selected === "a"}
        onCheckedChange={() => setSelected("a")}
        label="옵션 A"
      />
      <Radio
        name="standalone"
        checked={selected === "b"}
        onCheckedChange={() => setSelected("b")}
        label="옵션 B"
      />
    </div>
  );
}

export const CheckboxVertical: Story = {
  name: "State/Checkbox Vertical",
  render: () => <CheckboxExample />,
};

export const CheckboxHorizontal: Story = {
  name: "State/Checkbox Horizontal",
  render: () => <CheckboxHorizontalExample />,
};

export const CheckboxDisabled: Story = {
  name: "State/Checkbox Disabled",
  render: () => <CheckboxDisabledExample />,
};

export const RadioGroupVertical: Story = {
  name: "State/Radio Group Vertical",
  render: () => <RadioGroupExample />,
};

export const RadioGroupHorizontal: Story = {
  name: "State/Radio Group Horizontal",
  render: () => <RadioHorizontalExample />,
};

export const StandaloneRadio: Story = {
  name: "State/Radio Standalone",
  render: () => <StandaloneRadioExample />,
};

/* ─── Interaction Tests ─── */

export const CheckboxToggleInteraction: Story = {
  name: "Interaction/Checkbox Toggle",
  render: () => <CheckboxExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const checkbox = canvas.getByLabelText("개인정보 처리 동의");
    await expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    await expect(checkbox).toBeChecked();

    await user.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};

export const RadioSwitchInteraction: Story = {
  name: "Interaction/Radio Switch",
  render: () => <RadioGroupExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const faceRadio = canvas.getByLabelText("대면 상담");
    await expect(faceRadio).toBeChecked();

    const chatRadio = canvas.getByLabelText("채팅 상담");
    await user.click(chatRadio);
    await expect(chatRadio).toBeChecked();
    await expect(faceRadio).not.toBeChecked();
  },
};

export const DisabledCheckboxInteraction: Story = {
  name: "Interaction/Disabled Checkbox",
  render: () => <CheckboxDisabledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const disabledChecked = canvas.getByLabelText("동의함 (변경 불가)");
    await expect(disabledChecked).toBeDisabled();
    await expect(disabledChecked).toBeChecked();
  },
};

export const KeyboardToggleInteraction: Story = {
  name: "Interaction/Keyboard Space Toggle",
  render: () => <CheckboxExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const checkbox = canvas.getByLabelText("마케팅 수신 동의 (선택)");
    await expect(checkbox).not.toBeChecked();

    checkbox.focus();
    await user.keyboard(" ");
    await expect(checkbox).toBeChecked();

    await user.keyboard(" ");
    await expect(checkbox).not.toBeChecked();
  },
};

export const RadioGroupExclusivityInteraction: Story = {
  name: "Interaction/Radio Group Exclusivity",
  render: () => <RadioGroupExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const face = canvas.getByLabelText("대면 상담");
    const video = canvas.getByLabelText("화상 상담");
    const chat = canvas.getByLabelText("채팅 상담");
    const phone = canvas.getByLabelText("전화 상담");

    await expect(face).toBeChecked();

    await user.click(video);
    await expect(video).toBeChecked();
    await expect(face).not.toBeChecked();
    await expect(chat).not.toBeChecked();
    await expect(phone).not.toBeChecked();

    await user.click(phone);
    await expect(phone).toBeChecked();
    await expect(video).not.toBeChecked();
  },
};

export const DisabledRadioInGroupInteraction: Story = {
  name: "Interaction/Disabled Radio In Group Skipped",
  render: () => {
    const DisabledGroupHarness = () => {
      const [value, setValue] = useState("a");
      return (
        <RadioGroup name="disabled-test" value={value} onValueChange={setValue}>
          <RadioGroupItem value="a" label="활성 옵션" />
          <RadioGroupItem value="b" label="비활성 옵션" disabled />
          <RadioGroupItem value="c" label="다른 활성 옵션" />
        </RadioGroup>
      );
    };
    return <DisabledGroupHarness />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const active = canvas.getByLabelText("활성 옵션");
    const disabled = canvas.getByLabelText("비활성 옵션");

    await expect(active).toBeChecked();
    await expect(disabled).toBeDisabled();

    // 비활성 라디오를 클릭해도 값이 변하지 않아야 함
    await user.click(disabled);
    await expect(active).toBeChecked();
    await expect(disabled).not.toBeChecked();
  },
};

export const CheckboxGroupMultipleSelectionInteraction: Story = {
  name: "Interaction/Checkbox Group Multiple Selection",
  render: () => <CheckboxExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const privacy = canvas.getByLabelText("개인정보 처리 동의");
    const service = canvas.getByLabelText("서비스 이용 약관 동의");

    // 체크박스는 라디오와 달리 여러 개 동시 선택 가능
    await user.click(privacy);
    await user.click(service);

    await expect(privacy).toBeChecked();
    await expect(service).toBeChecked();

    // 하나만 해제해도 다른 건 유지
    await user.click(privacy);
    await expect(privacy).not.toBeChecked();
    await expect(service).toBeChecked();
  },
};
