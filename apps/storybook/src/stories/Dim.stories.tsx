import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Dim, type DimType } from "@nudge-design/react";

const meta: Meta<typeof Dim> = {
  title: "Components/Overlay/Dim",
  component: Dim,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    type: { control: "select", options: ["subtle", "default", "strong"] },
    animated: { control: "boolean" },
  },
  args: { type: "default", animated: true },
};

export default meta;
type Story = StoryObj<typeof Dim>;

/* Dim 은 position:fixed 라 데모/갤러리에서는 bounded 박스 안에 가두기 위해
   inline style 로 position:absolute 를 덮어쓴다(inline > :where() specificity 0). */
const BOX: React.CSSProperties = {
  position: "relative",
  width: 220,
  height: 150,
  borderRadius: 8,
  overflow: "hidden",
  background: "#fff",
  border: "1px solid #ECECEC",
};

function PreviewBox({ type, label }: { type: DimType; label: string }) {
  return (
    <div style={BOX}>
      <div style={{ padding: 12, fontSize: 13, color: "#666" }}>뒤쪽 콘텐츠</div>
      <Dim type={type} style={{ position: "absolute" }} />
      <span
        style={{
          position: "absolute",
          left: 12,
          bottom: 10,
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export const Overview: Story = {
  tags: ["gallery"],
  name: "Overview",
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <PreviewBox type="subtle" label="Subtle · α0.2" />
      <PreviewBox type="default" label="Default · α0.4" />
      <PreviewBox type="strong" label="Strong · α0.7" />
    </div>
  ),
};

export const Playground: Story = {
  render: (args) => (
    <div style={BOX}>
      <div style={{ padding: 12, fontSize: 13, color: "#666" }}>뒤쪽 콘텐츠</div>
      <Dim {...args} style={{ position: "absolute" }} />
    </div>
  ),
};

export const ClickToClose: Story = {
  name: "Behavior/Click to close",
  render: function ClickToCloseStory() {
    const [open, setOpen] = useState(true);
    return (
      <div style={BOX}>
        <button type="button" onClick={() => setOpen(true)}>
          오버레이 열기
        </button>
        {open && (
          <Dim
            data-testid="dim"
            type="default"
            style={{ position: "absolute" }}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("백드롭 클릭 시 onClose 로 닫힌다", async () => {
      await userEvent.click(canvas.getByTestId("dim"));
      await expect(canvas.queryByTestId("dim")).toBeNull();
    });
  },
};
