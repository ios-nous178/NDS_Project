import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, fn } from "storybook/test";
import { Button } from "@nudge-eap/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Button"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["solid", "outlined", "soft", "outlined-sub"],
    },
    size: { control: "radio", options: ["xl", "lg", "md", "sm", "xs", "field"] },
    color: {
      control: "radio",
      options: ["primary", "secondary"],
    },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    children: "확인",
    variant: "solid",
    size: "lg",
    color: "primary",
    disabled: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Default: Story = {
  name: "State/Default",
  args: {
    children: "확인",
  },
};

export const Disabled: Story = {
  name: "State/Disabled",
  args: {
    children: "비활성",
    disabled: true,
  },
};

export const Secondary: Story = {
  name: "State/Secondary",
  args: {
    children: "보조 액션",
    color: "secondary",
  },
};

export const Outlined: Story = {
  name: "State/Outlined",
  args: {
    children: "다음에 하기",
    variant: "outlined",
  },
};

export const WithLeftIcon: Story = {
  name: "State/With Left Icon",
  args: {
    children: "상담 예약하기",
    leftIcon: <span aria-hidden="true">+</span>,
  },
};

export const FullWidth: Story = {
  name: "State/Full Width",
  args: {
    children: "전체 너비 버튼",
    fullWidth: true,
  },
  decorators: [
    (StoryComponent) => (
      <div style={{ width: 320 }}>
        <StoryComponent />
      </div>
    ),
  ],
};

/* ─── Variant × Color 조합 ─── */

export const VariantMatrix: Story = {
  name: "State/Variant Color Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 14 }}>Solid</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button variant="solid" color="primary">
            Primary
          </Button>
          <Button variant="solid" color="secondary">
            Secondary
          </Button>
          <Button variant="solid" color="primary" disabled>
            Disabled (P)
          </Button>
          <Button variant="solid" color="secondary" disabled>
            Disabled (S)
          </Button>
        </div>
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 14 }}>Soft</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button variant="soft" color="primary">
            Primary
          </Button>
          <Button variant="soft" color="primary" disabled>
            Disabled
          </Button>
        </div>
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 14 }}>Outlined</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button variant="outlined" color="primary">
            Primary
          </Button>
          <Button variant="outlined" color="primary" disabled>
            Disabled
          </Button>
        </div>
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 14 }}>
          Outlined-sub (Medium weight)
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button variant="outlined-sub" color="primary">
            Primary
          </Button>
          <Button variant="outlined-sub" color="primary" disabled>
            Disabled
          </Button>
        </div>
      </div>
    </div>
  ),
};

/* ─── 사이즈 스케일 ─── */

export const SizeScale: Story = {
  name: "State/Size Scale",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <Button size="xl">XL (56px)</Button>
      <Button size="lg">LG (48px)</Button>
      <Button size="md">MD (44px)</Button>
      <Button size="sm">SM (42px)</Button>
      <Button size="xs">XS (38px)</Button>
      <Button size="field">Field (48px)</Button>
    </div>
  ),
};

/* ─── State (enabled / disabled / hover) ─── */

export const StateComparison: Story = {
  name: "State/Comparison",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Button>Enabled</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Button color="secondary">Enabled</Button>
        <Button color="secondary" disabled>
          Disabled
        </Button>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Button variant="outlined">Enabled</Button>
        <Button variant="outlined" disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
};

/* ─── 실 사용 예시 ─── */

export const HomePageActionButtons: Story = {
  name: "Recipe/Homepage Action Buttons",
  render: () => (
    <div style={{ display: "flex", width: 480, gap: 12 }}>
      <Button size="xl" fullWidth>
        상담 예약하기
      </Button>
      <Button size="xl" variant="outlined" fullWidth>
        다음에 하기
      </Button>
    </div>
  ),
};

export const WebviewChallengeButtons: Story = {
  name: "Recipe/WebView Challenge Buttons",
  render: () => (
    <div style={{ display: "flex", width: 360, flexDirection: "column", gap: 12 }}>
      <Button color="primary" fullWidth>
        참여하기
      </Button>
      <Button color="primary" fullWidth leftIcon={<span>🔒</span>}>
        인증하고 참여하기
      </Button>
      <Button variant="soft" color="primary" fullWidth>
        참여중
      </Button>
      <Button color="secondary" fullWidth>
        참여 완료
      </Button>
      <Button color="primary" disabled fullWidth>
        참여마감
      </Button>
    </div>
  ),
};

export const HeaderAndUtilityButtons: Story = {
  name: "Recipe/Header And Utility Buttons",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Button size="xs">로그인</Button>
      <Button size="sm" variant="outlined">
        필터 초기화
      </Button>
      <Button size="sm" variant="outlined-sub">
        보조 액션
      </Button>
      <Button size="md" color="secondary">
        저장
      </Button>
    </div>
  ),
};

export const WithIconsAndSlots: Story = {
  name: "Recipe/With Icons And Slots",
  render: () => (
    <div style={{ display: "flex", width: 360, flexDirection: "column", gap: 12 }}>
      <Button leftIcon={<span>💬</span>} fullWidth>
        앱에서 상담하기
      </Button>
      <Button
        variant="outlined"
        rightIcon={<span>→</span>}
        labelClassName="button-story-label"
        slotProps={{
          label: { style: { letterSpacing: "-0.02em" } },
          rightIcon: { style: { color: "#017EE4", fontWeight: 700 } },
        }}
      >
        더보기
      </Button>
    </div>
  ),
};

export const InputWithFieldButton: Story = {
  name: "Recipe/Input With Field Button",
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center", width: 328 }}>
      <div
        style={{
          flex: 1,
          height: 48,
          border: "1px solid #D8D8D8",
          borderRadius: 8,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          fontSize: 15,
          color: "#999",
          fontFamily: "Pretendard, sans-serif",
        }}
      >
        TEXT
      </div>
      <Button size="field">Btn</Button>
    </div>
  ),
};

/* ─── Interaction Tests ─── */

export const ClickInteraction: Story = {
  name: "Interaction/Click",
  args: {
    children: "클릭 테스트",
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const button = canvas.getByRole("button", { name: "클릭 테스트" });

    await user.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const DisabledInteraction: Story = {
  name: "Interaction/Disabled Blocks Click",
  args: {
    children: "비활성 버튼",
    disabled: true,
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const button = canvas.getByRole("button", { name: "비활성 버튼" });

    await expect(button).toBeDisabled();
    await user.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const KeyboardInteraction: Story = {
  name: "Interaction/Keyboard Enter Space",
  args: {
    children: "키보드 테스트",
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const button = canvas.getByRole("button", { name: "키보드 테스트" });

    await user.tab();
    await expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(1);

    await user.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const KeyboardWithIconInteraction: Story = {
  name: "Interaction/Keyboard With Icon",
  args: {
    children: "아이콘 버튼",
    leftIcon: <span aria-hidden="true">+</span>,
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const button = canvas.getByRole("button", { name: "아이콘 버튼" });

    await user.tab();
    await expect(button).toHaveFocus();
    await user.keyboard("{Enter}");

    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
