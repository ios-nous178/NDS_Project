/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ConsentChecklist } from "@nudge-design/react";

const meta: Meta<typeof ConsentChecklist> = {
  title: "Components/ConsentChecklist",
  component: ConsentChecklist,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ConsentChecklist>;

const items = [
  {
    key: "service",
    label: "서비스 이용약관",
    required: true,
    detail:
      "본 약관은 NudgeEAP가 제공하는 멘탈케어 서비스 이용에 관한 권리·의무를 정합니다. 회원은 서비스 이용 시 본 약관을 준수해야 합니다.",
  },
  {
    key: "privacy",
    label: "개인정보 수집·이용",
    required: true,
    detail:
      "수집 항목: 이름, 이메일, 휴대폰번호. 이용 목적: 서비스 제공·상담 매칭. 보관 기간: 회원 탈퇴 시까지.",
  },
  {
    key: "sensitive",
    label: "민감정보(검사 결과) 수집·이용",
    required: true,
    detail: "심리검사 결과는 민감정보로 분리 저장되며, 회원 동의 없이 제3자에게 제공되지 않습니다.",
  },
  {
    key: "marketing",
    label: "마케팅 정보 수신",
    required: false,
    detail: "프로모션·이벤트 정보를 이메일/문자로 받아보실 수 있어요. 언제든 해지 가능합니다.",
  },
];

export const Default: Story = {
  name: "State/Default",
  render: () => {
    const [v, setV] = useState<string[]>([]);
    return (
      <div style={{ width: 480 }}>
        <ConsentChecklist items={items} value={v} onValueChange={setV} />
      </div>
    );
  },
};

export const Prefilled: Story = {
  name: "State/Required Prefilled",
  render: () => {
    const [v, setV] = useState<string[]>(["service", "privacy", "sensitive"]);
    return (
      <div style={{ width: 480 }}>
        <ConsentChecklist items={items} value={v} onValueChange={setV} />
      </div>
    );
  },
};
