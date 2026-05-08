import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Autocomplete, type AutocompleteOption } from "@nudge-eap/react";

const ALL_MEDICATIONS: AutocompleteOption[] = [
  { value: "lexapro", label: "렉사프로", description: "에스시탈로프람 10mg" },
  { value: "zoloft", label: "졸로푸트", description: "설트랄린 50mg" },
  { value: "prozac", label: "프로작", description: "플루옥세틴 20mg" },
  { value: "wellbutrin", label: "웰부트린", description: "부프로피온 150mg" },
  { value: "paxil", label: "팍실", description: "파록세틴 20mg" },
  { value: "cymbalta", label: "심발타", description: "둘록세틴 30mg" },
];

const meta: Meta<typeof Autocomplete> = {
  title: "Components/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

export const Playground: Story = {
  render: function Render() {
    const [v, setV] = useState("");
    const filtered = useMemo(
      () => ALL_MEDICATIONS.filter((m) => m.label.toLowerCase().includes(v.toLowerCase())),
      [v],
    );
    return (
      <div style={{ width: 360 }}>
        <Autocomplete
          label="복용 중인 약"
          placeholder="약 이름 검색"
          value={v}
          onValueChange={setV}
          options={filtered}
          fullWidth
        />
      </div>
    );
  },
};

export const Loading: Story = {
  name: "State/로딩",
  render: function Render() {
    const [v, setV] = useState("렉");
    return (
      <div style={{ width: 360 }}>
        <Autocomplete
          label="약 검색"
          value={v}
          onValueChange={setV}
          options={[]}
          loading
          fullWidth
        />
      </div>
    );
  },
};

export const Empty: Story = {
  name: "State/결과 없음",
  render: function Render() {
    const [v, setV] = useState("xxx");
    return (
      <div style={{ width: 360 }}>
        <Autocomplete
          label="약 검색"
          value={v}
          onValueChange={setV}
          options={[]}
          emptyMessage="검색 결과가 없어요. 다른 키워드를 시도해보세요."
          fullWidth
        />
      </div>
    );
  },
};

export const MinQuery: Story = {
  name: "Recipe/최소 입력 길이 2",
  render: function Render() {
    const [v, setV] = useState("");
    const filtered = useMemo(
      () => ALL_MEDICATIONS.filter((m) => m.label.toLowerCase().includes(v.toLowerCase())),
      [v],
    );
    return (
      <div style={{ width: 360 }}>
        <Autocomplete
          label="2자 이상 입력하면 검색됩니다"
          placeholder="검색"
          value={v}
          onValueChange={setV}
          options={filtered}
          minQueryLength={2}
          fullWidth
        />
      </div>
    );
  },
};

export const NoHighlight: Story = {
  name: "Variant/하이라이트 끔",
  render: function Render() {
    const [v, setV] = useState("");
    const filtered = useMemo(
      () => ALL_MEDICATIONS.filter((m) => m.label.toLowerCase().includes(v.toLowerCase())),
      [v],
    );
    return (
      <div style={{ width: 360 }}>
        <Autocomplete
          value={v}
          onValueChange={setV}
          options={filtered}
          highlight={false}
          fullWidth
        />
      </div>
    );
  },
};
