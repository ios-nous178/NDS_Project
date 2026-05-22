import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TrostFooter } from "@nudge-eap/react";

const meta: Meta = {
  title: "Components/Footer",
  parameters: { layout: "fullscreen" },
  globals: { brand: "trost" },
};
export default meta;
type Story = StoryObj;

export const TrostWeb: Story = {
  name: "Trost/Web Desktop (surface='web', 다크 푸터)",
  parameters: {
    docs: {
      description: {
        story:
          "Trost 데스크톱 다크 푸터. SNS / 앱 다운로드 / 회사 정보 / 약관 링크 슬롯을 prop 으로 받습니다. width >= 1024 에서만 노출됩니다.",
      },
    },
  },
  render: () => <TrostFooter surface="web" />,
};
