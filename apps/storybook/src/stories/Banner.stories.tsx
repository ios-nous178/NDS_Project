import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "@nudge-design/react";

const meta: Meta<typeof Banner> = {
  title: "Components/Display/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Filled: Story = {
  name: "Variant/Filled",
  tags: ["gallery"],
  args: {
    title: "새로운 기능이 출시되었습니다",
    description: "지금 바로 확인해 보세요.",
    actionLabel: "자세히 보기",
  },
};

export const Outlined: Story = {
  name: "Variant/Outlined",
  args: {
    variant: "outlined",
    title: "심리검사를 받아보세요",
    description: "스트레스 자가진단 테스트가 추가되었습니다.",
    actionLabel: "검사 시작",
  },
};

export const WithImage: Story = {
  name: "Recipe/이미지 포함",
  tags: ["gallery"],
  args: {
    title: "앱에서 더 많은 기능을 만나보세요",
    description: "다운로드하고 모든 서비스를 이용하세요.",
    actionLabel: "앱 다운로드",
    imageSrc: "https://placehold.co/106x130?text=App",
    imageWidth: 106,
    imageHeight: 130,
  },
};

export const Closable: Story = {
  name: "Recipe/닫기 가능",
  args: {
    title: "공지사항",
    description: "서비스 점검이 예정되어 있습니다.",
    closable: true,
  },
};

export const ImageBanner: Story = {
  name: "Variant/Image",
  args: {
    variant: "image",
    fullImageSrc: "https://placehold.co/360x96?text=Download+Banner",
    imageAlt: "다운로드 배너",
    href: "#",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};
