import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CardVisual, type CardVisualBrand } from "@nudge-eap/react";

const meta: Meta<typeof CardVisual> = {
  title: "Components/CardVisual",
  component: CardVisual,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    brand: {
      control: "select",
      options: ["visa", "master", "amex", "kakao", "naver", "samsung", "shinhan", "kb", "generic"],
    },
  },
  args: {
    brand: "shinhan",
    number: "1234",
    holder: "MIN JI KIM",
    expiry: "12/27",
  },
};

export default meta;
type Story = StoryObj<typeof CardVisual>;

export const Playground: Story = { render: (args) => <CardVisual {...args} /> };

export const Brands: Story = {
  name: "Variant/모든 브랜드",
  render: () => (
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--gap-loose)" }}
    >
      {(
        [
          "visa",
          "master",
          "amex",
          "shinhan",
          "kb",
          "kakao",
          "naver",
          "samsung",
        ] as CardVisualBrand[]
      ).map((b) => (
        <CardVisual key={b} brand={b} number="1234" holder="HONG GILDONG" expiry="06/28" />
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  name: "Recipe/별명 라벨",
  render: () => (
    <CardVisual brand="kakao" number="5678" holder="MIN JI" expiry="03/29" label="용돈 카드" />
  ),
};

export const Disabled: Story = {
  name: "State/만료/정지",
  render: () => (
    <CardVisual brand="visa" number="9999" holder="HONG" expiry="01/24" disabled label="만료됨" />
  ),
};

export const Empty: Story = {
  name: "Edge/등록 전 (빈 카드)",
  render: () => <CardVisual />,
};
