/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Radio, RadioGroup, RadioGroupItem } from "@nudge-design/react";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<typeof Radio> = {
  title: "Components/Controls/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  name: "State/Default",
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Radio checked={checked} onCheckedChange={setChecked} label="동의합니다" />;
  },
};

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => <Radio checked label="선택 불가" disabled />,
};

export const AllStates: Story = {
  tags: ["gallery"],
  name: "State/All States",
  render: () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-comfortable)" }}
    >
      <Radio checked={false} onCheckedChange={() => undefined} label="Default (Unselected)" />
      <Radio checked onCheckedChange={() => undefined} label="Selected" />
      <Radio checked={false} disabled label="Disabled (Unselected)" />
      <Radio checked disabled label="Disabled (Selected)" />
    </div>
  ),
};

export const VerticalGroup: Story = {
  name: "Variant/Vertical Group",
  render: () => {
    const [value, setValue] = useState("daily");
    return (
      <div style={{ width: 280 }}>
        <RadioGroup name="frequency" value={value} onValueChange={setValue}>
          <RadioGroupItem value="daily" label="매일" />
          <RadioGroupItem value="weekly" label="매주" />
          <RadioGroupItem value="monthly" label="매월" />
        </RadioGroup>
      </div>
    );
  },
};

export const HorizontalGroup: Story = {
  name: "Variant/Horizontal Group",
  render: () => {
    const [value, setValue] = useState("yes");
    return (
      <RadioGroup name="agree" value={value} onValueChange={setValue} layout="horizontal">
        <RadioGroupItem value="yes" label="예" />
        <RadioGroupItem value="no" label="아니오" />
        <RadioGroupItem value="maybe" label="모르겠음" />
      </RadioGroup>
    );
  },
};

export const Standalone: Story = {
  name: "State/Standalone",
  render: () => {
    const [selected, setSelected] = useState("a");
    return (
      <div
        style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-comfortable)" }}
      >
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
  },
};

/* ─── Interaction Tests ─── */

function CounselTypeGroup() {
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

export const SwitchInteraction: Story = {
  name: "Interaction/Switch",
  render: () => <CounselTypeGroup />,
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

export const GroupExclusivityInteraction: Story = {
  name: "Interaction/Group Exclusivity",
  render: () => <CounselTypeGroup />,
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

export const DisabledInGroupInteraction: Story = {
  name: "Interaction/Disabled In Group Skipped",
  render: () => {
    const [value, setValue] = useState("a");
    return (
      <RadioGroup name="disabled-test" value={value} onValueChange={setValue}>
        <RadioGroupItem value="a" label="활성 옵션" />
        <RadioGroupItem value="b" label="비활성 옵션" disabled />
        <RadioGroupItem value="c" label="다른 활성 옵션" />
      </RadioGroup>
    );
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
