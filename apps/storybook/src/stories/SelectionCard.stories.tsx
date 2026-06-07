import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SelectionCard } from "@nudge-design/react";
import { MockupBoldBookIcon, MockupBoldMoonIcon, MockupBoldSunIcon } from "@nudge-design/icons";

const meta: Meta = {
  title: "Components/Controls/SelectionCard",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

export const SingleChoice: Story = {
  name: "Variant/단일 선택",
  render: function Render() {
    const [v, setV] = useState("chat");
    return (
      <div style={{ width: 360 }}>
        <SelectionCard.Group mode="single" value={v} onValueChange={setV}>
          <SelectionCard.Item
            value="chat"
            title="채팅 상담"
            description="텍스트 기반의 비대면 상담"
          />
          <SelectionCard.Item
            value="video"
            title="화상 상담"
            description="얼굴을 보며 진행하는 상담"
          />
          <SelectionCard.Item value="phone" title="전화 상담" description="가장 익숙한 음성 상담" />
        </SelectionCard.Group>
      </div>
    );
  },
};

export const MultipleChoice: Story = {
  name: "Variant/다중 선택",
  render: function Render() {
    const [vs, setVs] = useState<string[]>(["sleep"]);
    return (
      <div style={{ width: 360 }}>
        <SelectionCard.Group mode="multiple" values={vs} onValuesChange={setVs}>
          <SelectionCard.Item
            value="sleep"
            title="수면 문제"
            description="잠들기 어렵거나 자주 깸"
          />
          <SelectionCard.Item
            value="anxiety"
            title="불안"
            description="이유 없이 초조하고 긴장됨"
          />
          <SelectionCard.Item
            value="stress"
            title="스트레스"
            description="업무나 관계에서의 압박"
          />
          <SelectionCard.Item value="depress" title="우울" description="의욕이 없고 가라앉음" />
        </SelectionCard.Group>
      </div>
    );
  },
};

export const WithIcons: Story = {
  name: "Recipe/아이콘 포함",
  render: function Render() {
    const [v, setV] = useState("morning");
    return (
      <div style={{ width: 360 }}>
        <SelectionCard.Group mode="single" value={v} onValueChange={setV}>
          <SelectionCard.Item
            value="morning"
            title="아침 명상"
            description="하루를 시작하는 5분"
            icon={<MockupBoldSunIcon size={24} />}
          />
          <SelectionCard.Item
            value="lunch"
            title="점심 휴식"
            description="에너지 회복 호흡"
            icon={<MockupBoldBookIcon size={24} />}
          />
          <SelectionCard.Item
            value="night"
            title="잠들기 전"
            description="긴장 이완 가이드"
            icon={<MockupBoldMoonIcon size={24} />}
          />
        </SelectionCard.Group>
      </div>
    );
  },
};

export const Horizontal: Story = {
  name: "Recipe/가로 배치",
  render: function Render() {
    const [v, setV] = useState("low");
    return (
      <div style={{ width: 480 }}>
        <SelectionCard.Group mode="single" value={v} onValueChange={setV} layout="horizontal">
          <SelectionCard.Item value="low" title="낮음" />
          <SelectionCard.Item value="mid" title="보통" />
          <SelectionCard.Item value="high" title="높음" />
        </SelectionCard.Group>
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "State/비활성 옵션",
  render: function Render() {
    const [v, setV] = useState("plan-a");
    return (
      <div style={{ width: 360 }}>
        <SelectionCard.Group mode="single" value={v} onValueChange={setV}>
          <SelectionCard.Item value="plan-a" title="기본 플랜" description="월 무료" />
          <SelectionCard.Item
            value="plan-b"
            title="프리미엄"
            description="현재 가입 불가"
            disabled
          />
        </SelectionCard.Group>
      </div>
    );
  },
};
