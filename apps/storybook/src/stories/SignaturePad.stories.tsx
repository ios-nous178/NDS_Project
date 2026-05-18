import React, { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SignaturePad, type SignaturePadHandle } from "@nudge-eap/react";

const meta: Meta<typeof SignaturePad> = {
  title: "Components/SignaturePad",
  component: SignaturePad,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof SignaturePad>;

export const Playground: Story = {
  render: function Render() {
    const [empty, setEmpty] = useState(true);
    return (
      <div style={{ width: 480 }}>
        <SignaturePad label="동의 서명" onChange={(d) => setEmpty(d === null)} />
        <p style={{ marginTop: 8, color: "#666", fontSize: 13 }}>
          상태: {empty ? "비어있음" : "서명됨"}
        </p>
      </div>
    );
  },
};

export const SaveOnSubmit: Story = {
  name: "Recipe/제출 시 dataURL 추출",
  render: function Render() {
    const ref = useRef<SignaturePadHandle>(null);
    const [savedUrl, setSavedUrl] = useState<string | null>(null);
    return (
      <div style={{ width: 480 }}>
        <SignaturePad ref={ref} label="서명" />
        <div style={{ display: "flex", gap: "var(--gap-default)", marginTop: 12 }}>
          <button
            type="button"
            onClick={() => setSavedUrl(ref.current?.toDataURL() ?? null)}
            style={{ padding: "8px 16px" }}
          >
            제출
          </button>
          <button
            type="button"
            onClick={() => ref.current?.clear()}
            style={{ padding: "8px 16px" }}
          >
            지우기
          </button>
        </div>
        {savedUrl && (
          <div style={{ marginTop: 12 }}>
            <p style={{ margin: 0, fontSize: 12, color: "#666" }}>저장된 서명:</p>
            <img
              src={savedUrl}
              alt="서명"
              style={{ border: "1px solid #ddd", marginTop: 4, maxWidth: 200 }}
            />
          </div>
        )}
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "State/Disabled (읽기 전용)",
  render: () => (
    <div style={{ width: 480 }}>
      <SignaturePad label="서명 (수정 불가)" disabled />
    </div>
  ),
};

export const HideControls: Story = {
  name: "Variant/컨트롤 숨김",
  render: () => (
    <div style={{ width: 480 }}>
      <SignaturePad hideControls placeholder="여기에 그려주세요" />
    </div>
  ),
};
