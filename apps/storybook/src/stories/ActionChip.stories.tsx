import type { Meta, StoryObj } from "@storybook/react";
import { ActionChip } from "@nudge-design/react";
import { DownloadIcon, EditIcon, InfoIcon } from "@nudge-design/icons";
import React from "react";

const meta: Meta<typeof ActionChip> = {
  title: "Components/ActionChip",
  component: ActionChip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "TextField helper/description 영역 옆에 붙는 작은 보조 액션 chip. " +
          "아이콘(14px) + 라벨(12px Medium). bg neutral subtle, radius 6, padding 6/2. 사용처에서 icon prop 에 적절한 아이콘을 import 해서 넘긴다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActionChip>;

/* ─── Example: 예시 이미지 ─── */

export const Example: Story = {
  name: "Example (예시 이미지)",
  args: {
    icon: <InfoIcon width={14} height={14} />,
    label: "예시 이미지",
  },
};

/* ─── Edit ─── */

export const Edit: Story = {
  name: "Edit (수정)",
  args: {
    icon: <EditIcon width={14} height={14} />,
    label: "수정",
  },
};

/* ─── Download ─── */

export const Download: Story = {
  name: "Download (다운로드)",
  args: {
    icon: <DownloadIcon width={14} height={14} />,
    label: "다운로드",
  },
};

/* ─── 텍스트만 (아이콘 없이) ─── */

export const TextOnly: Story = {
  name: "Variant/Text Only",
  args: { label: "텍스트만" },
};

/* ─── Disabled ─── */

export const Disabled: Story = {
  name: "State/Disabled",
  args: {
    icon: <DownloadIcon width={14} height={14} />,
    label: "다운로드",
    disabled: true,
  },
};

/* ─── ActionChip Group ─── */

export const Group: Story = {
  name: "Group (helper 영역 예시)",
  render: () => (
    <div style={{ display: "inline-flex", gap: 8 }}>
      <ActionChip icon={<InfoIcon width={14} height={14} />} label="예시 이미지" />
      <ActionChip icon={<EditIcon width={14} height={14} />} label="수정" />
      <ActionChip icon={<DownloadIcon width={14} height={14} />} label="다운로드" />
    </div>
  ),
};
