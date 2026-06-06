import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "@nudge-design/react";

const meta: Meta<typeof Pagination> = {
  title: "Components/Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    totalPages: { control: { type: "number", min: 1, max: 100 } },
    siblings: { control: { type: "number", min: 0, max: 3 } },
    showArrows: { control: "boolean" },
  },
  args: { totalPages: 20, siblings: 1, showArrows: true },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function PaginationExample(props: React.ComponentProps<typeof Pagination>) {
  const [page, setPage] = useState(props.page ?? 1);
  return <Pagination {...props} page={page} onPageChange={setPage} />;
}

export const Playground: Story = {
  render: (args) => <PaginationExample {...args} page={1} />,
};

export const FewPages: Story = {
  name: "Recipe/페이지 적음",
  render: () => <PaginationExample page={2} totalPages={5} onPageChange={() => {}} />,
};

export const ManyPages: Story = {
  name: "Recipe/페이지 많음",
  render: () => (
    <PaginationExample page={10} totalPages={50} siblings={2} onPageChange={() => {}} />
  ),
};

export const NoArrows: Story = {
  name: "Recipe/화살표 없음",
  render: () => (
    <PaginationExample page={3} totalPages={10} showArrows={false} onPageChange={() => {}} />
  ),
};
