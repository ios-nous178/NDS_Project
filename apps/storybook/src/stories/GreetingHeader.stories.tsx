import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GreetingHeader, MoodSelector, IconButton, Avatar } from "@nudge-design/react";
import { PushIcon } from "@nudge-design/icons";

const meta: Meta<typeof GreetingHeader> = {
  title: "Components/GreetingHeader",
  component: GreetingHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof GreetingHeader>;

export const Playground: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <GreetingHeader
        name="민지"
        greeting="좋은 아침이에요"
        question="오늘 기분은 어때요?"
        trailing={
          <IconButton
            aria-label="알림"
            icon={<PushIcon size={20} color="var(--semantic-icon-normal-default)" />}
          />
        }
      />
    </div>
  ),
};

export const WithMoodSelector: Story = {
  name: "Recipe/MoodSelector 진입",
  render: function Render() {
    const [mood, setMood] = React.useState<string | undefined>();
    return (
      <div style={{ width: 480 }}>
        <GreetingHeader
          name="민지"
          greeting="안녕하세요"
          question="오늘 기분을 한 번 기록해볼까요?"
          actions={<MoodSelector value={mood} onValueChange={setMood} />}
        />
      </div>
    );
  },
};

export const PrimaryTone: Story = {
  name: "Variant/primary 톤",
  render: () => (
    <div style={{ width: 480 }}>
      <GreetingHeader
        name="민지"
        greeting="안녕하세요"
        question="오늘 하루도 평온하게 보내세요"
        trailing={<Avatar name="민지" size="lg" />}
        tone="primary"
      />
    </div>
  ),
};

export const Minimal: Story = {
  name: "Edge/이름만",
  render: () => (
    <div style={{ width: 480 }}>
      <GreetingHeader name="민지" />
    </div>
  ),
};
