import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu, IconButton, Button } from "@nudge-design/react";
import { MoreIcon } from "@nudge-design/icons";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/Overlay/DropdownMenu",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("DropdownMenu"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* ─── Overview ─── 첫 화면 = 열린 메뉴(클릭 불필요). 갤러리 프리뷰로도 재사용(정적 인라인). */
export const Overview: Story = {
  name: "Overview",
  tags: ["gallery"],
  render: () => (
    <div style={{ position: "relative", width: 160 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #ECECEC", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: 18 }}>⋯</div>
      <div style={{ marginTop: 6, width: 140, background: "#fff", border: "1px solid #ECECEC", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
        <div style={{ padding: "8px 14px", fontSize: 13, color: "#111" }}>편집</div>
        <div style={{ padding: "8px 14px", fontSize: 13, color: "#111" }}>공유</div>
        <div style={{ height: 1, background: "#F0F0F0", margin: "4px 0" }} aria-hidden />
        <div style={{ padding: "8px 14px", fontSize: 13, color: "#D04A3F" }}>삭제</div>
      </div>
    </div>
  ),
};

function MoreActionsExample() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", width: 320 }}>
      <DropdownMenu
        align="end"
        items={[
          { key: "edit", label: "수정", onSelect: () => alert("수정") },
          { key: "share", label: "공유", onSelect: () => alert("공유") },
          { key: "archive", label: "보관", onSelect: () => alert("보관"), disabled: true },
          { key: "delete", label: "삭제", onSelect: () => alert("삭제"), danger: true },
        ]}
      >
        <IconButton
          icon={
            <MoreIcon size={20} color="var(--semantic-icon-normal-default)" aria-hidden="true" />
          }
          aria-label="더보기"
        />
      </DropdownMenu>
    </div>
  );
}

function ButtonTriggerExample() {
  return (
    <DropdownMenu
      items={[
        { key: "all", label: "전체 다운로드" },
        { key: "filtered", label: "필터된 항목만" },
        { key: "selected", label: "선택된 항목만" },
      ]}
    >
      <Button variant="outlined">내보내기</Button>
    </DropdownMenu>
  );
}

function GroupedExample() {
  return (
    <DropdownMenu
      align="end"
      minWidth={220}
      groups={[
        {
          key: "actions",
          label: "액션",
          items: [
            { key: "edit", label: "수정" },
            { key: "duplicate", label: "복제" },
          ],
        },
        {
          key: "share",
          label: "공유",
          items: [
            { key: "link", label: "링크 복사", trailing: "⌘C" },
            { key: "email", label: "이메일로 보내기" },
          ],
        },
        {
          key: "danger",
          items: [{ key: "delete", label: "삭제", danger: true }],
        },
      ]}
    >
      <IconButton icon={<MoreIcon />} aria-label="더보기" />
    </DropdownMenu>
  );
}

export const Basic: Story = { name: "더보기 액션", render: () => <MoreActionsExample /> };
export const ButtonTrigger: Story = { name: "버튼 트리거", render: () => <ButtonTriggerExample /> };
export const Grouped: Story = { name: "그룹화", render: () => <GroupedExample /> };
