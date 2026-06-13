import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "@nudge-design/react";

const meta: Meta<typeof Divider> = {
  title: "Components/Display/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    thickness: { control: "number" },
    spacing: { control: "number" },
  },
  args: { orientation: "horizontal" },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Overview: Story = {
  tags: ["gallery"],
  name: "Overview",
  render: () => (
    <div style={{ width: 240, fontSize: 14, color: "#1a1a1a" }}>
      <div style={{ fontWeight: 600 }}>섹션 제목</div>
      <Divider spacing={10} />
      <div style={{ color: "#666" }}>본문 내용이 여기에 들어갑니다.</div>
      <Divider thickness={6} color="#eee" spacing={12} />
      <div style={{ fontWeight: 600 }}>다음 섹션</div>
      <Divider spacing={10} />
      <div style={{ display: "flex", alignItems: "center", color: "#666" }}>
        <span>약관</span>
        <Divider orientation="vertical" />
        <span>개인정보</span>
        <Divider orientation="vertical" />
        <span>고객센터</span>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export const Horizontal: Story = {
  name: "Variant/Horizontal",
  render: () => (
    <div style={{ width: 300 }}>
      <p>위쪽 콘텐츠</p>
      <Divider spacing={12} />
      <p>아래쪽 콘텐츠</p>
    </div>
  ),
};

export const Vertical: Story = {
  name: "Variant/Vertical",
  render: () => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span>이용약관</span>
      <Divider orientation="vertical" />
      <span>개인정보처리방침</span>
      <Divider orientation="vertical" />
      <span>고객센터</span>
    </div>
  ),
};

export const ThickSection: Story = {
  name: "Recipe/섹션 구분선",
  render: () => (
    <div style={{ width: 300 }}>
      <p>섹션 A</p>
      <Divider thickness={8} color="#f5f5f5" />
      <p>섹션 B</p>
    </div>
  ),
};
