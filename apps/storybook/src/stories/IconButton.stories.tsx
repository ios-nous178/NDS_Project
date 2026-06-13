import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "@nudge-design/react";
import { SearchIcon, CloseIcon, MoreIcon, ShareIcon } from "@nudge-design/icons";

const meta: Meta<typeof IconButton> = {
  title: "Components/Display/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Sizes: Story = {
  name: "Variant/Size Scale",
  tags: ["gallery"],
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <IconButton size="x-large" aria-label="검색 (x-large)" icon={<SearchIcon size={28} />} />
      <IconButton size="large" aria-label="검색 (large)" icon={<SearchIcon size={24} />} />
      <IconButton size="medium" aria-label="검색 (medium)" icon={<SearchIcon size={20} />} />
      <IconButton size="small" aria-label="검색 (small)" icon={<SearchIcon size={16} />} />
    </div>
  ),
};

export const CommonActions: Story = {
  name: "Recipe/헤더 유틸 액션",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <IconButton aria-label="검색" icon={<SearchIcon size={24} />} />
      <IconButton aria-label="공유" icon={<ShareIcon size={24} />} />
      <IconButton aria-label="더보기" icon={<MoreIcon size={24} />} />
      <IconButton aria-label="닫기" icon={<CloseIcon size={24} />} />
    </div>
  ),
};
