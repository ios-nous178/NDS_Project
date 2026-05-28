/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AttachmentItem } from "@nudge-design/react";

const meta: Meta<typeof AttachmentItem> = {
  title: "Components/AttachmentItem",
  component: AttachmentItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof AttachmentItem>;

const w = (children: React.ReactNode) => <div style={{ width: 480 }}>{children}</div>;

export const Pdf: Story = {
  name: "Type/PDF",
  render: () =>
    w(
      <AttachmentItem name="2026-04-10_PHQ9_결과.pdf" size={245760} href="#" onRemove={() => {}} />,
    ),
};

export const Image: Story = {
  name: "Type/Image",
  render: () => w(<AttachmentItem name="profile.png" size={1228800} onDownload={() => {}} />),
};

export const Document: Story = {
  name: "Type/Document",
  render: () => w(<AttachmentItem name="진단서.docx" size={51200} href="#" />),
};

export const Uploading: Story = {
  name: "State/Uploading (animated)",
  render: () => {
    const [p, setP] = useState(0);
    useEffect(() => {
      const id = setInterval(() => setP((v) => (v >= 100 ? 0 : v + 5)), 200);
      return () => clearInterval(id);
    }, []);
    return w(
      <AttachmentItem name="진단서_원본_2026.pdf" size={4194304} status="uploading" progress={p} />,
    );
  },
};

export const Error: Story = {
  name: "State/Error",
  render: () =>
    w(
      <AttachmentItem
        name="너무_큰_파일.pdf"
        size={52428800}
        status="error"
        errorMessage="크기 제한(10MB)을 초과했어요"
        onRemove={() => {}}
      />,
    ),
};

export const List: Story = {
  name: "Recipe/Multiple Attachments",
  render: () => (
    <div
      style={{ width: 480, display: "flex", flexDirection: "column", gap: "var(--gap-default)" }}
    >
      <AttachmentItem name="검사결과.pdf" size={245760} href="#" onRemove={() => {}} />
      <AttachmentItem name="처방전.png" size={1024000} href="#" onRemove={() => {}} />
      <AttachmentItem name="진단서.docx" size={51200} href="#" onRemove={() => {}} />
    </div>
  ),
};
