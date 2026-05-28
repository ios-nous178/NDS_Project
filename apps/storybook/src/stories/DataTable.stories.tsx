/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, type DataTableColumn, type SortDirection } from "@nudge-design/react";

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

interface Med {
  id: string;
  name: string;
  dosage: string;
  taken: number;
  total: number;
  startedAt: string;
}

const meds: Med[] = [
  {
    id: "1",
    name: "졸로프트",
    dosage: "50mg / 1일 1회",
    taken: 28,
    total: 30,
    startedAt: "2026.04.10",
  },
  {
    id: "2",
    name: "라믹탈",
    dosage: "25mg / 1일 2회",
    taken: 56,
    total: 60,
    startedAt: "2026.03.21",
  },
  {
    id: "3",
    name: "멜라토닌",
    dosage: "3mg / 취침 전",
    taken: 12,
    total: 14,
    startedAt: "2026.04.25",
  },
];

const baseColumns: DataTableColumn<Med>[] = [
  { key: "name", title: "약 이름", sortable: true },
  { key: "dosage", title: "용량/주기" },
  {
    key: "taken",
    title: "복용",
    align: "right",
    sortable: true,
    render: (row) => `${row.taken} / ${row.total}`,
  },
  { key: "startedAt", title: "시작일", align: "right", sortable: true, hideOnCard: false },
];

export const Default: Story = {
  name: "State/Default",
  render: () => <DataTable columns={baseColumns} data={meds} rowKey={(r) => r.id} />,
};

export const Clickable: Story = {
  name: "State/Clickable Row",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={meds}
      rowKey={(r) => r.id}
      onRowClick={(row) => console.log("clicked", row.name)}
    />
  ),
};

export const WithSort: Story = {
  name: "Recipe/With Sort",
  render: () => {
    const [sortKey, setSortKey] = useState("startedAt");
    const [dir, setDir] = useState<SortDirection>("desc");
    const sorted = [...meds].sort((a, b) => {
      const av = (a as unknown as Record<string, string | number>)[sortKey];
      const bv = (b as unknown as Record<string, string | number>)[sortKey];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });
    return (
      <DataTable
        columns={baseColumns}
        data={sorted}
        rowKey={(r) => r.id}
        sortKey={sortKey}
        sortDirection={dir}
        onSort={(k, d) => {
          setSortKey(k);
          setDir(d);
        }}
      />
    );
  },
};

export const Empty: Story = {
  name: "State/Empty",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={[]}
      rowKey={(r) => r.id}
      emptyMessage="복용 중인 약이 없어요"
    />
  ),
};

export const Loading: Story = {
  name: "State/Loading",
  render: () => <DataTable columns={baseColumns} data={[]} rowKey={(r) => r.id} loading />,
};

export const ResponsiveCards: Story = {
  name: "Recipe/Responsive Cards (mobile)",
  parameters: { viewport: { defaultViewport: "mobile1" } },
  render: () => (
    <DataTable columns={baseColumns} data={meds} rowKey={(r) => r.id} responsive="cards" />
  ),
};
