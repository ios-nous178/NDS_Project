/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "@nudge-design/react";

const meta: Meta<typeof FileUpload> = {
  title: "Components/Inputs/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  name: "State/Default",
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div style={{ width: 480 }}>
        <FileUpload
          value={files}
          onValueChange={setFiles}
          description="JPG, PNG, PDF · 최대 10MB"
        />
      </div>
    );
  },
};

export const Multiple: Story = {
  name: "State/Multiple",
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div style={{ width: 480 }}>
        <FileUpload
          value={files}
          onValueChange={setFiles}
          multiple
          description="여러 파일 선택 가능"
        />
      </div>
    );
  },
};

export const ImageOnly: Story = {
  tags: ["gallery"],
  name: "Recipe/Image with Size Limit",
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    const [err, setErr] = useState<string | undefined>();
    return (
      <div style={{ width: 480 }}>
        <FileUpload
          value={files}
          onValueChange={(next) => {
            setErr(undefined);
            setFiles(next);
          }}
          accept="image/*"
          maxSize={5 * 1024 * 1024}
          onReject={(rejected, reason) => {
            if (reason === "size") {
              setErr(`크기 제한 초과: ${rejected.map((f) => f.name).join(", ")}`);
            }
          }}
          hint={
            <>
              프로필 이미지 — <strong>클릭</strong>하거나 끌어다 놓으세요
            </>
          }
          description="JPG, PNG · 최대 5MB"
          errorMessage={err}
        />
      </div>
    );
  },
};
