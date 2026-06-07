import React, { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ImageCropper, type ImageCropperHandle } from "@nudge-design/react";

const meta: Meta<typeof ImageCropper> = {
  title: "Components/Inputs/ImageCropper",
  component: ImageCropper,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ImageCropper>;

export const Playground: Story = {
  render: function Render() {
    const ref = useRef<ImageCropperHandle>(null);
    const [out, setOut] = useState<string | null>(null);
    return (
      <div>
        <ImageCropper
          ref={ref}
          src="https://picsum.photos/seed/avatar/600/600"
          shape="circle"
          label="프로필 사진을 자르세요"
        />
        <div
          style={{
            display: "flex",
            gap: "var(--semantic-gap-default)",
            marginTop: 12,
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setOut(ref.current?.toDataURL(200) ?? null)}
            style={{ padding: "8px 16px" }}
          >
            프로필 사진으로 저장
          </button>
        </div>
        {out && (
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <p style={{ margin: "0 0 6px", fontSize: 12, color: "#888" }}>저장 결과 (200×200):</p>
            <img
              src={out}
              alt="자른 결과"
              style={{ width: 100, height: 100, borderRadius: "50%" }}
            />
          </div>
        )}
      </div>
    );
  },
};

export const Square: Story = {
  name: "Variant/사각형 자르기",
  render: () => (
    <ImageCropper
      src="https://picsum.photos/seed/cover/800/600"
      shape="square"
      size={280}
      label="커버 이미지 자르기"
    />
  ),
};
