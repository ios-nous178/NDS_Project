import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "@nudge-design/react";

/**
 * Brands/Runmile/Pagination — Figma 120:1234.
 *
 * Runmile 의 active 페이지 시각은 brand orange 가 아니라 gray800 fill (Toss 스타일).
 * base Pagination 의 `--nds-pagination-active-bg` / `-active-text` 토큰을 통해
 * brand-themes Runmile cssVars 에서 #4E5968 / white 로 override 한다.
 *
 * - PC: 1~10 표시
 * - Mobile: 1~5 표시 (siblings={1})
 */

const meta: Meta<typeof Pagination> = {
  title: "Brands/Runmile/Pagination",
  component: Pagination,
  parameters: { layout: "padded" },
  globals: { brand: "runmile" },
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Pc: Story = {
  name: "PC (1~10, active=1)",
  render: () => {
    function Demo() {
      const [page, setPage] = useState(1);
      return <Pagination page={page} totalPages={10} siblings={4} onPageChange={setPage} />;
    }
    return <Demo />;
  },
};

export const Mobile: Story = {
  name: "Mobile (1~5, active=1)",
  render: () => {
    function Demo() {
      const [page, setPage] = useState(1);
      return <Pagination page={page} totalPages={5} siblings={1} onPageChange={setPage} />;
    }
    return <Demo />;
  },
};

export const MiddleActive: Story = {
  name: "PC (active=5)",
  render: () => {
    function Demo() {
      const [page, setPage] = useState(5);
      return <Pagination page={page} totalPages={10} siblings={4} onPageChange={setPage} />;
    }
    return <Demo />;
  },
};
