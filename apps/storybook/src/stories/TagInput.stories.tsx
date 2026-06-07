import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TagInput } from "@nudge-design/react";

const meta: Meta<typeof TagInput> = {
  title: "Components/Inputs/TagInput",
  component: TagInput,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Playground: Story = {
  render: function Render() {
    const [tags, setTags] = useState<string[]>(["수면", "스트레스"]);
    return (
      <div style={{ width: 360 }}>
        <TagInput
          label="관심사"
          value={tags}
          onValueChange={setTags}
          helperText="Enter 또는 , 로 구분해서 입력하세요"
          fullWidth
        />
      </div>
    );
  },
};

export const Empty: Story = {
  name: "State/빈 상태",
  render: function Render() {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div style={{ width: 360 }}>
        <TagInput
          label="키워드"
          value={tags}
          onValueChange={setTags}
          placeholder="ex. 수면, 우울, 불안"
          fullWidth
        />
      </div>
    );
  },
};

export const MaxTags: Story = {
  name: "Edge/최대 5개 제한",
  render: function Render() {
    const [tags, setTags] = useState<string[]>(["수면", "불안", "직장스트레스"]);
    return (
      <div style={{ width: 360 }}>
        <TagInput
          label="관심 주제 (최대 5개)"
          value={tags}
          onValueChange={setTags}
          maxTags={5}
          onMaxReached={() => alert("최대 5개까지 입력 가능해요")}
          fullWidth
        />
      </div>
    );
  },
};

export const WithError: Story = {
  name: "State/에러",
  render: function Render() {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div style={{ width: 360 }}>
        <TagInput
          label="필수 키워드"
          value={tags}
          onValueChange={setTags}
          error
          helperText="최소 1개 이상 입력해주세요"
          fullWidth
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => (
    <div style={{ width: 360 }}>
      <TagInput
        label="이전 기록 (수정 불가)"
        value={["수면", "스트레스"]}
        onValueChange={() => undefined}
        disabled
        fullWidth
      />
    </div>
  ),
};
