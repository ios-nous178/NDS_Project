import type { Meta, StoryObj } from "@storybook/react";
import { TextButton } from "@nudge-design/react";
import { ChevronRightIcon } from "@nudge-design/icons";

const meta: Meta<typeof TextButton> = {
  title: "Components/Display/TextButton",
  component: TextButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof TextButton>;

export const Variants: Story = {
  name: "Variant/Size & Icon",
  tags: ["gallery"],
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <TextButton size="large">더보기 (large)</TextButton>
      <TextButton size="medium">더보기 (medium)</TextButton>
      <TextButton size="medium" rightIcon={<ChevronRightIcon size={16} />}>
        전체보기
      </TextButton>
      <TextButton size="medium" disabled>
        비활성
      </TextButton>
    </div>
  ),
};
