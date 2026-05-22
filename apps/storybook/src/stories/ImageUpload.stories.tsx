import type { Meta, StoryObj } from "@storybook/react";
import { ImageUpload } from "@nudge-eap/react";
import React, { useState } from "react";

const meta: Meta<typeof ImageUpload> = {
  title: "Components/ImageUpload",
  component: ImageUpload,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "캐포비 admin 표준 ImageUpload — 150×150 preview + 업로드 버튼 + 사이즈 안내. " +
          "state(empty/uploaded/error) 별 시각 토큰: empty=neutral dashed, uploaded=solid border + 이미지, error=red dashed + helper 아이콘.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

const SAMPLE_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#FFE266"/><stop offset="100%" stop-color="#FFF6C6"/></linearGradient></defs><rect width="150" height="150" fill="url(#g)"/><rect x="40" y="55" width="70" height="50" rx="6" fill="rgba(255,255,255,0.6)"/></svg>`,
  );

/* ─── state=empty ─── */

export const Empty: Story = {
  name: "State/Empty",
  args: { state: "empty" },
};

/* ─── state=uploaded ─── */

export const Uploaded: Story = {
  name: "State/Uploaded",
  args: {
    state: "uploaded",
    imageUrl: SAMPLE_IMAGE,
    imageAlt: "샘플 이미지",
  },
};

/* ─── state=error ─── */

export const Error: Story = {
  name: "State/Error",
  args: { state: "error" },
};

/* ─── 인터랙티브 데모 ─── */

function InteractiveStory() {
  const [state, setState] = useState<"empty" | "uploaded" | "error">("empty");
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  return (
    <ImageUpload
      state={state}
      imageUrl={imageUrl}
      onFileSelect={(files) => {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = () => {
          setImageUrl(reader.result as string);
          setState("uploaded");
        };
        reader.readAsDataURL(file);
      }}
      onRemove={() => {
        setImageUrl(undefined);
        setState("empty");
      }}
    />
  );
}

export const Interactive: Story = {
  name: "Interactive (FileReader)",
  render: () => <InteractiveStory />,
};
