import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import {
  CheckboxTree,
  type CheckboxTreeNode,
  RegionRow,
  SelectedItemsPanel,
} from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta = {
  title: "Components/Controls/CheckboxTree",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("CheckboxTree"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* ─── 지역 데이터 (시/도 ▸ 시/군/구) ─── */

const REGIONS: CheckboxTreeNode[] = [
  {
    value: "gangwon",
    label: "강원도특별자치도",
    children: [
      { value: "gangneung", label: "강릉시" },
      { value: "goseong", label: "고성군" },
      { value: "donghae", label: "동해시" },
      { value: "samcheok", label: "삼척시" },
      { value: "sokcho", label: "속초시" },
      { value: "yanggu", label: "양구군" },
      { value: "yangyang", label: "양양군" },
    ],
  },
  {
    value: "gyeongnam",
    label: "경상남도",
    children: [
      { value: "changwon", label: "창원시" },
      { value: "jinju", label: "진주시" },
      { value: "gimhae", label: "김해시" },
      { value: "yangsan", label: "양산시" },
    ],
  },
  {
    value: "gyeongbuk",
    label: "경상북도",
    children: [
      { value: "pohang", label: "포항시" },
      { value: "gumi", label: "구미시" },
      { value: "gyeongju", label: "경주시" },
    ],
  },
  {
    value: "gwangju",
    label: "광주 광역시",
    children: [
      { value: "donggu-gj", label: "동구" },
      { value: "seogu-gj", label: "서구" },
      { value: "namgu-gj", label: "남구" },
    ],
  },
];

/** value(선택 leaf) → "시/도 > 시/군구" 라벨. 시/도 전체 선택이면 시/도명만. */
function describeSelection(
  nodes: CheckboxTreeNode[],
  value: string[],
): { key: string; label: string }[] {
  const set = new Set(value);
  const out: { key: string; label: string }[] = [];
  for (const province of nodes) {
    const children = province.children ?? [];
    const selectedChildren = children.filter((c) => set.has(c.value));
    if (selectedChildren.length === 0) continue;
    if (selectedChildren.length === children.length) {
      out.push({ key: province.value, label: province.label });
    } else {
      for (const c of selectedChildren) {
        out.push({ key: c.value, label: `${province.label} > ${c.label}` });
      }
    }
  }
  return out;
}

/* ─── 지역 선택 모달 (CheckboxTree + SelectedItemsPanel) ─── */

function RegionPickerDemo() {
  const [value, setValue] = useState<string[]>([
    "gangneung",
    "goseong",
    ...REGIONS[1].children!.map((c) => c.value),
  ]);
  const selectedItems = useMemo(() => describeSelection(REGIONS, value), [value]);

  const removeKey = (key: string) => {
    // key 가 시/도면 그 자식 전부 해제, 아니면 해당 leaf 만 해제
    const province = REGIONS.find((p) => p.value === key);
    const childVals = province?.children?.map((c) => c.value) ?? [key];
    setValue((prev) => prev.filter((v) => !childVals.includes(v)));
  };

  return (
    <div style={{ display: "flex", gap: 22, width: 864, alignItems: "stretch" }}>
      <div
        style={{
          flex: "0 0 422px",
          padding: 28,
          border: "1px solid var(--semantic-border-normal, #e5e5e5)",
          borderRadius: 16,
          boxSizing: "border-box",
        }}
      >
        <CheckboxTree
          nodes={REGIONS}
          value={value}
          onValueChange={setValue}
          searchPlaceholder="소재명으로 검색하기"
          defaultExpanded={["gangwon"]}
          style={{ ["--nds-checkbox-tree-max-height" as string]: "496px" }}
        />
      </div>

      <SelectedItemsPanel
        title="선택한 지역"
        count={selectedItems.length}
        onClear={() => setValue([])}
        showActions={Boolean(selectedItems.length)}
        style={{ flex: "0 0 422px" }}
      >
        {selectedItems.map((item) => (
          <RegionRow key={item.key} onRemove={() => removeKey(item.key)}>
            {item.label}
          </RegionRow>
        ))}
      </SelectedItemsPanel>
    </div>
  );
}

/* ─── 단독 트리 ─── */

function StandaloneTreeDemo() {
  const [value, setValue] = useState<string[]>(["gangneung"]);
  return (
    <div style={{ width: 366 }}>
      <CheckboxTree
        nodes={REGIONS}
        value={value}
        onValueChange={setValue}
        searchPlaceholder="지역명으로 검색"
        defaultExpanded={["gangwon"]}
        style={{ ["--nds-checkbox-tree-max-height" as string]: "420px" }}
      />
    </div>
  );
}

export const RegionPicker: Story = {
  name: "Variant/지역 선택 모달",
  render: () => <RegionPickerDemo />,
  parameters: { layout: "padded" },
};

export const Standalone: Story = {
  name: "State/단독 트리",
  render: () => <StandaloneTreeDemo />,
};

/* 갤러리용 컴팩트 트리 (2그룹 · 소수 항목) */
const COMPACT_NODES: CheckboxTreeNode[] = [
  {
    value: "notify",
    label: "알림 받기",
    children: [
      { value: "email", label: "이메일" },
      { value: "sms", label: "문자(SMS)" },
      { value: "push", label: "푸시 알림" },
    ],
  },
  {
    value: "privacy",
    label: "개인정보 동의",
    children: [
      { value: "marketing", label: "마케팅 활용" },
      { value: "thirdparty", label: "제3자 제공" },
    ],
  },
];

export const NoSelectAll: Story = {
  tags: ["gallery"],
  name: "State/전체선택 없음 + 검색 숨김",
  render: () => {
    const Harness = () => {
      const [value, setValue] = useState<string[]>(["email", "push"]);
      return (
        <div style={{ width: 248 }}>
          <CheckboxTree
            nodes={COMPACT_NODES}
            value={value}
            onValueChange={setValue}
            searchable={false}
            showSelectAll={false}
            defaultExpanded={["notify"]}
          />
        </div>
      );
    };
    return <Harness />;
  },
};

/* ─── Interaction Tests ─── */

export const ParentTogglesChildrenInteraction: Story = {
  name: "Interaction/부모 토글 → 자식 전체",
  render: () => <StandaloneTreeDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const gangneung = canvas.getByLabelText("강릉시");
    await expect(gangneung).toBeChecked();

    // 부모(강원도) 클릭 → 모든 자식 선택
    const gangwon = canvas.getByLabelText("강원도특별자치도");
    await user.click(gangwon);
    await expect(canvas.getByLabelText("동해시")).toBeChecked();
    await expect(canvas.getByLabelText("양양군")).toBeChecked();
    await expect(gangwon).toBeChecked();

    // 다시 클릭 → 모든 자식 해제
    await user.click(gangwon);
    await expect(canvas.getByLabelText("동해시")).not.toBeChecked();
    await expect(gangwon).not.toBeChecked();
  },
};

export const IndeterminateParentInteraction: Story = {
  name: "Interaction/부분 선택 시 부모 indeterminate",
  render: () => <StandaloneTreeDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gangwon = canvas.getByLabelText("강원도특별자치도") as HTMLInputElement;

    // 강릉시만 선택된 초기 상태 → 부모는 부분선택(mixed)
    await expect(gangwon).not.toBeChecked();
    await expect(gangwon.indeterminate).toBe(true);
  },
};

export const SearchFilterInteraction: Story = {
  name: "Interaction/검색 필터 + 자동 펼침",
  render: () => <StandaloneTreeDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const search = canvas.getByLabelText("지역명으로 검색");
    await user.type(search, "강릉");

    await expect(canvas.getByLabelText("강릉시")).toBeInTheDocument();
    // 매치되지 않은 다른 시/도는 사라짐
    await expect(canvas.queryByLabelText("포항시")).not.toBeInTheDocument();
  },
};

export const SelectAllInteraction: Story = {
  name: "Interaction/전체 선택",
  render: () => <StandaloneTreeDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const selectAll = canvas.getByLabelText("전체 선택");
    await user.click(selectAll);

    await expect(canvas.getByLabelText("강릉시")).toBeChecked();
    await expect(selectAll).toBeChecked();
  },
};
