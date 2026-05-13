import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu, IconButton, Button } from "@nudge-eap/react";
import { MoreIcon } from "@nudge-eap/icons";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/DropdownMenu",
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
