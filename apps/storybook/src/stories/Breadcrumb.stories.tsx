import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "@nudge-design/react";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Playground: Story = {
  args: {
    items: [
      { label: "홈", href: "/" },
      { label: "심리검사", href: "/test" },
      { label: "스트레스 검사" },
    ],
  },
};

export const TwoLevels: Story = {
  name: "Variant/2단계",
  args: {
    items: [{ label: "홈", href: "/" }, { label: "마이페이지" }],
  },
};

export const FourLevels: Story = {
  name: "Variant/4단계",
  args: {
    items: [
      { label: "홈", href: "/" },
      { label: "카테고리", href: "/category" },
      { label: "하위 카테고리", href: "/category/sub" },
      { label: "상세" },
    ],
  },
};

export const CustomSeparator: Story = {
  name: "Variant/커스텀 구분자",
  tags: ["gallery"],
  args: {
    items: [
      { label: "홈", href: "/" },
      { label: "카테고리", href: "/category" },
      { label: "상세" },
    ],
    separator: ">",
  },
};
