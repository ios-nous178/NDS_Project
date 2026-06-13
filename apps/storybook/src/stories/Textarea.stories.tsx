import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@nudge-design/react";

const meta: Meta<typeof Textarea> = {
  title: "Components/Inputs/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Filled: Story = {
  name: "Recipe/일기 입력 (글자수 카운터)",
  tags: ["gallery"],
  render: () => (
    <div style={{ width: 280 }}>
      <Textarea
        label="오늘의 기록"
        placeholder="오늘의 일기를 적어보세요"
        defaultValue="오늘은 상담이 잘 풀렸다. 마음이 한결 가벼워진 하루."
        minHeight={88}
        maxLength={200}
      />
    </div>
  ),
};

export const States: Story = {
  name: "State/기본 · 에러 · 비활성",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
      <Textarea label="기본" placeholder="내용을 입력하세요" minHeight={64} />
      <Textarea label="에러" defaultValue="필수 항목입니다" error minHeight={64} />
      <Textarea label="비활성" defaultValue="수정할 수 없습니다" disabled minHeight={64} />
    </div>
  ),
};
