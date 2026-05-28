import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, fn } from "storybook/test";
import { Button } from "@nudge-design/react";
import { LockIcon, CommentIcon } from "@nudge-design/icons";
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
      options: ["primary", "secondary", "assistive"],
    },
    shape: { control: "radio", options: ["default", "pill"] },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    children: "확인",
    variant: "solid",
    size: "lg",
    color: "primary",
    shape: "default",
    disabled: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

/* ─── Figma Spec (508:6962 / 171:8385) ─── */

const SPEC_ROWS: Array<{
  size: string;
  height: string;
  font: string;
  paddingX: string;
  icon: string;
  gap: string;
}> = [
  { size: "xl", height: "52px", font: "16 / 24px", paddingX: "16px", icon: "20px", gap: "8px" },
  {
    size: "lg (기본)",
    height: "48px",
    font: "16 / 24px",
    paddingX: "16px",
    icon: "20px",
    gap: "var(--gap-default)",
  },
  { size: "md", height: "44px", font: "15 / 22px", paddingX: "24px", icon: "20px", gap: "8px" },
  { size: "sm", height: "42px", font: "14 / 20px", paddingX: "16px", icon: "20px", gap: "8px" },
  { size: "xs", height: "38px", font: "13 / 18px", paddingX: "16px", icon: "18px", gap: "6px" },
  { size: "field", height: "48px", font: "15 / 22px", paddingX: "16px", icon: "20px", gap: "8px" },
];

export const FigmaSpec: Story = {
  name: "Spec/✓ Figma Synced (508:6962)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 컴포넌트 세트(508:6962) 및 라이브러리 노드(171:8385) 실측 기반 사이즈/패딩/아이콘 매트릭스. `sizing.button.{size}` 토큰이 단일 source of truth입니다.",
      },
    },
  },
  render: () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "var(--gap-loose)", minWidth: 520 }}
    >
      <table
        style={{
          borderCollapse: "collapse",
          fontFamily: "Pretendard, sans-serif",
          fontSize: 13,
        }}
      >
        <thead>
          <tr style={{ background: "#F5F5F5" }}>
            <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
              Size
            </th>
            <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
              Height
            </th>
            <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
              Font / Line
            </th>
            <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
              Padding-X
            </th>
            <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
              Icon
            </th>
            <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
              Gap
            </th>
          </tr>
        </thead>
        <tbody>
          {SPEC_ROWS.map((row) => (
            <tr key={row.size}>
              <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5", fontWeight: 600 }}>
                {row.size}
              </td>
              <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5" }}>{row.height}</td>
              <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5" }}>{row.font}</td>
              <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5" }}>{row.paddingX}</td>
              <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5" }}>{row.icon}</td>
              <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5" }}>{row.gap}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ margin: 0, fontSize: 12, color: "#666", lineHeight: 1.6 }}>
        Color × Variant 매트릭스: <code>primary</code>, <code>secondary</code>,
        <code> assistive</code> × <code>solid</code>, <code>outlined</code>, <code>soft</code>,
        <code> outlined-sub</code> 조합이 정합 완료되었습니다. 자세한 색상은 아래
        <strong> State/Variant Color Matrix</strong>를 확인하세요.
      </p>
    </div>
  ),
};

export const ColorMatrix: Story = {
  name: "Spec/Color × Variant Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-wide)" }}>
      {(["primary", "secondary", "assistive"] as const).map((color) => (
        <div key={color}>
          <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 14 }}>{color}</p>
          <div style={{ display: "flex", gap: "var(--gap-comfortable)", flexWrap: "wrap" }}>
            <Button color={color} variant="solid">
              Solid
            </Button>
            <Button color={color} variant="outlined">
              Outlined
            </Button>
            <Button color={color} variant="soft">
              Soft
            </Button>
            <Button color={color} variant="outlined-sub">
              Outlined-sub
            </Button>
            <Button color={color} variant="solid" disabled>
              Disabled
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
};

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
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-wide)" }}>
      <div>
        <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 14 }}>Solid</p>
        <div style={{ display: "flex", gap: "var(--gap-comfortable)", alignItems: "center" }}>
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
        <div style={{ display: "flex", gap: "var(--gap-comfortable)", alignItems: "center" }}>
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
        <div style={{ display: "flex", gap: "var(--gap-comfortable)", alignItems: "center" }}>
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
        <div style={{ display: "flex", gap: "var(--gap-comfortable)", alignItems: "center" }}>
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--gap-comfortable)",
        alignItems: "flex-start",
      }}
    >
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
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-loose)" }}>
      <div style={{ display: "flex", gap: "var(--gap-comfortable)", alignItems: "center" }}>
        <Button>Enabled</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div style={{ display: "flex", gap: "var(--gap-comfortable)", alignItems: "center" }}>
        <Button color="secondary">Enabled</Button>
        <Button color="secondary" disabled>
          Disabled
        </Button>
      </div>
      <div style={{ display: "flex", gap: "var(--gap-comfortable)", alignItems: "center" }}>
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
    <div style={{ display: "flex", width: 480, gap: "var(--gap-comfortable)" }}>
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
    <div
      style={{
        display: "flex",
        width: 360,
        flexDirection: "column",
        gap: "var(--gap-comfortable)",
      }}
    >
      <Button color="primary" fullWidth>
        참여하기
      </Button>
      <Button color="primary" fullWidth leftIcon={<LockIcon size={18} color="currentColor" />}>
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
    <div style={{ display: "flex", alignItems: "center", gap: "var(--gap-comfortable)" }}>
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
  parameters: {
    docs: {
      description: {
        story:
          "아이콘은 `currentColor` 로 그려서 브랜드/variant 별 텍스트 색을 자동 상속한다. " +
          "캐포비 처럼 primary text 가 검정(#000)인 브랜드에서도 흰 아이콘이 노란 배경 위에 떠 보이는 문제를 막는다.",
      },
    },
  },
  render: () => (
    <div
      style={{
        display: "flex",
        width: 360,
        flexDirection: "column",
        gap: "var(--gap-comfortable)",
      }}
    >
      <Button leftIcon={<CommentIcon size={18} color="currentColor" />} fullWidth>
        앱에서 상담하기
      </Button>
      <Button
        variant="outlined"
        rightIcon={<span>→</span>}
        labelClassName="button-story-label"
        slotProps={{
          label: { style: { letterSpacing: "-0.02em" } },
          rightIcon: { style: { color: "currentColor", fontWeight: 700 } },
        }}
      >
        더보기
      </Button>
    </div>
  ),
};

/* ─── Pill shape (Figma 3098:1032 ButtonGuide) ─────────
   Default / Pill 의 차이는 border-radius 만 — 색·크기·padding 동일.
   Pill = 모달 액션, BottomCTA, 격식 컨텍스트용. */

/* Figma 의 "Neutral" 라벨은 DS 네이밍으로 "Secondary" 와 동일. 코드 식별자도
   color="secondary" 를 사용하므로 스토리 라벨도 Secondary 로 통일한다. */
const PILL_COLOR_ROWS: Array<{
  label: string;
  color: "primary" | "secondary" | "assistive";
  variant: "solid" | "outlined" | "soft";
}> = [
  { label: "Pill · Solid Primary", color: "primary", variant: "solid" },
  { label: "Pill · Solid Secondary", color: "secondary", variant: "solid" },
  { label: "Pill · Weak Secondary", color: "assistive", variant: "soft" },
  { label: "Pill · Outlined Primary", color: "primary", variant: "outlined" },
  { label: "Pill · Outlined Secondary", color: "secondary", variant: "outlined" },
];

export const ShapePillMatrix: Story = {
  name: "Shape/Pill (5 variants × 3 states)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma ButtonGuide 3098:1032 의 5종 Pill 패턴 (Solid Primary / Solid Secondary / Weak Secondary / " +
          "Outlined Primary / Outlined Secondary) × Default · Hover · Disabled. " +
          "Figma 라벨의 'Neutral' 은 DS 네이밍으로 'Secondary' 와 동일 슬롯. " +
          "`shape='pill'` 만 추가하면 radius 만 9999px 로 바뀌고 color×variant 매트릭스는 그대로 적용된다.",
      },
    },
  },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px repeat(3, auto)",
        alignItems: "center",
        gap: "16px 24px",
        fontFamily: "Pretendard, sans-serif",
        fontSize: 12,
        color: "#666",
      }}
    >
      <div />
      <div style={{ fontWeight: 700, color: "#111" }}>Default</div>
      <div style={{ fontWeight: 700, color: "#111" }}>Hover (마우스 올리기)</div>
      <div style={{ fontWeight: 700, color: "#111" }}>Disabled</div>
      {PILL_COLOR_ROWS.map((row) => (
        <React.Fragment key={row.label}>
          <div>{row.label}</div>
          <Button shape="pill" color={row.color} variant={row.variant}>
            확인
          </Button>
          <Button shape="pill" color={row.color} variant={row.variant}>
            Hover
          </Button>
          <Button shape="pill" color={row.color} variant={row.variant} disabled>
            확인
          </Button>
        </React.Fragment>
      ))}
    </div>
  ),
};

export const ShapeComparison: Story = {
  name: "Shape/Default vs Pill",
  parameters: {
    docs: {
      description: {
        story:
          "동일 color/variant/size 에서 `shape` 만 다르게 한 비교. " +
          "기본 admin 액션은 `default` (radius 8), 모달·BottomCTA·격식 컨텍스트는 `pill` (radius full).",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Button shape="default">기본 (radius 8)</Button>
      <Button shape="pill">Pill (radius full)</Button>
      <Button shape="default" variant="outlined">
        기본 outlined
      </Button>
      <Button shape="pill" variant="outlined">
        Pill outlined
      </Button>
    </div>
  ),
};

export const InputWithFieldButton: Story = {
  name: "Recipe/Input With Field Button",
  render: () => (
    <div style={{ display: "flex", gap: "var(--gap-default)", alignItems: "center", width: 328 }}>
      <div
        style={{
          flex: 1,
          height: 48,
          border: "1px solid #D8D8D8",
          borderRadius: 8,
          padding: "0 var(--inset-card)",
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
