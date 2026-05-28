import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AddressSearch, type AddressResult, type AddressValue } from "@nudge-design/react";

const meta: Meta<typeof AddressSearch> = {
  title: "Components/AddressSearch",
  component: AddressSearch,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof AddressSearch>;

const MOCK: AddressResult[] = [
  {
    roadAddress: "서울특별시 강남구 테헤란로 123",
    jibunAddress: "서울특별시 강남구 역삼동 123-45",
    postalCode: "06234",
    meta: "서울 · 강남구",
  },
  {
    roadAddress: "서울특별시 강남구 테헤란로 234",
    jibunAddress: "서울특별시 강남구 역삼동 234-56",
    postalCode: "06241",
  },
  {
    roadAddress: "서울특별시 서초구 강남대로 100",
    postalCode: "06653",
  },
];

export const Playground: Story = {
  render: function Render() {
    const [q, setQ] = useState("");
    const [results, setResults] = useState<AddressResult[]>([]);
    const [value, setValue] = useState<AddressValue | null>(null);
    const [loading, setLoading] = useState(false);

    const search = async (query: string) => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      setResults(query.trim() ? MOCK.filter((m) => m.roadAddress.includes(query)) : []);
      setLoading(false);
    };

    return (
      <div style={{ width: 480 }}>
        <AddressSearch
          label="배송 주소"
          query={q}
          onQueryChange={setQ}
          onSearch={search}
          results={results}
          value={value}
          onValueChange={setValue}
          loading={loading}
          helperText="도로명 또는 지번을 입력하세요"
        />
      </div>
    );
  },
};

export const PreSelected: Story = {
  name: "State/이미 선택된 상태",
  render: function Render() {
    const [value, setValue] = useState<AddressValue | null>({
      address: MOCK[0],
      detail: "501호",
    });
    return (
      <div style={{ width: 480 }}>
        <AddressSearch
          label="주소"
          query=""
          onQueryChange={() => undefined}
          onSearch={() => undefined}
          results={[]}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};
