import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, within } from "@storybook/test";
import { Card, Button, type CardProps } from "@nudge-eap/react";
import { colors } from "@nudge-eap/tokens";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<CardProps> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Card"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<CardProps>;

export const Outlined: Story = {
  name: "State/Outlined",
  render: () => (
    <div style={{ width: 300 }}>
      <Card
        variant="outlined"
        thumbnail={
          <div
            style={{
              width: "100%",
              height: "100%",
              background: colors.neutral[100],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.neutral[400],
            }}
          >
            282 x 180
          </div>
        }
        title="김상담 상담사님"
        subtitle="심리상담 전문"
        meta={
          <>
            <span style={{ color: colors.yellow[500] }}>★</span>
            <span>4.9</span>
          </>
        }
      >
        따뜻한 공감과 전문적 기법으로 함께 해결책을 찾아갑니다.
      </Card>
    </div>
  ),
};

export const Elevated: Story = {
  name: "State/Elevated",
  render: () => (
    <div style={{ width: 300 }}>
      <Card variant="elevated" title="스트레스 관리 프로그램" subtitle="4주 과정 · 주 1회">
        직장인을 위한 스트레스 관리 프로그램입니다. 전문 상담사와 함께 자신만의 관리법을 찾아보세요.
      </Card>
    </div>
  ),
};

export const Clickable: Story = {
  name: "State/Clickable",
  args: {
    onClick: fn(),
  },
  render: (args) => (
    <div style={{ width: 300 }}>
      <Card
        variant="outlined"
        clickable
        onClick={args.onClick}
        title="법률상담 안내"
        subtitle="무료 상담 가능"
      >
        근로계약, 임금체불 등 법률 관련 고민을 상담받으세요.
      </Card>
    </div>
  ),
};

export const WithFooter: Story = {
  name: "State/With Footer",
  render: () => (
    <div style={{ width: 300 }}>
      <Card
        variant="outlined"
        title="상담 예약"
        subtitle="다음 가능 시간: 내일 14:00"
        footer={
          <Button fullWidth size="sm">
            예약하기
          </Button>
        }
      >
        첫 상담은 무료로 진행됩니다.
      </Card>
    </div>
  ),
};

export const Flat: Story = {
  name: "State/Flat No Border",
  render: () => (
    <div style={{ width: 300 }}>
      <Card variant="flat" title="공지사항" subtitle="2024.03.15">
        4월 상담 예약이 오픈되었습니다.
      </Card>
    </div>
  ),
};

export const CompoundCounselorCard: Story = {
  name: "Recipe/Compound Counselor Card",
  render: () => (
    <div style={{ width: 282 }}>
      <Card.Root variant="outlined" clickable>
        <Card.Thumbnail aspectRatio="282 / 180">
          <div
            style={{
              width: "100%",
              height: "100%",
              background: colors.neutral[100],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: colors.neutral[400], fontSize: 14 }}>프로필 사진</span>
          </div>
        </Card.Thumbnail>
        <Card.Header>
          <div>
            <Card.Title>박민지 상담사님</Card.Title>
            <Card.Subtitle>심리상담 · 경력 8년</Card.Subtitle>
          </div>
          <Card.Meta>
            <span style={{ color: colors.yellow[500] }}>★</span>
            <span>4.8</span>
          </Card.Meta>
        </Card.Header>
        <Card.Body>
          <div style={{ borderTop: `1px solid ${colors.neutral[200]}`, paddingTop: 12 }}>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 14,
                fontWeight: 700,
                color: colors.magenta[500],
              }}
            >
              내담자 후기
            </p>
            <p style={{ margin: 0, fontSize: 14, color: colors.neutral[800] }}>
              처음 상담받았을 때 너무 긴장했는데 편안하게 이야기할 수 있었어요.
            </p>
          </div>
        </Card.Body>
      </Card.Root>
    </div>
  ),
};

export const ClickableInteraction: Story = {
  name: "Interaction/Clickable Card",
  args: {
    onClick: fn(),
  },
  render: (args) => (
    <div style={{ width: 300 }}>
      <Card
        variant="outlined"
        clickable
        onClick={args.onClick}
        title="법률상담 안내"
        subtitle="무료 상담 가능"
      >
        근로계약, 임금체불 등 법률 관련 고민을 상담받으세요.
      </Card>
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const cardTitle = canvas.getByText("법률상담 안내");
    const cardRoot = cardTitle.closest('[data-slot="root"]');

    await expect(cardRoot).toHaveAttribute("data-clickable", "true");
    if (!cardRoot) throw new Error("Card root not found");
    await user.click(cardRoot);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const KeyboardClickableInteraction: Story = {
  name: "Interaction/Keyboard Clickable",
  args: {
    onClick: fn(),
  },
  render: (args) => (
    <div style={{ width: 300 }}>
      <Card
        variant="outlined"
        clickable
        onClick={args.onClick}
        title="키보드 접근성"
        subtitle="Enter/Space로 클릭"
      >
        키보드로 카드를 선택할 수 있어야 합니다.
      </Card>
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const cardRoot = canvas.getByText("키보드 접근성").closest('[data-slot="root"]');

    if (!cardRoot) throw new Error("Card root not found");
    (cardRoot as HTMLElement).focus();
    await user.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const SlotContractInteraction: Story = {
  name: "Interaction/Slot Contract",
  render: () => (
    <div style={{ width: 300 }}>
      <Card
        variant="outlined"
        title="슬롯 검증"
        subtitle="서브타이틀"
        meta={<span data-testid="card-meta">★ 4.9</span>}
        footer={
          <Button fullWidth size="sm">
            예약하기
          </Button>
        }
      >
        바디 콘텐츠
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("슬롯 검증")).toBeInTheDocument();
    await expect(canvas.getByText("서브타이틀")).toBeInTheDocument();
    await expect(canvas.getByTestId("card-meta")).toHaveTextContent("★ 4.9");
    await expect(canvas.getByText("바디 콘텐츠")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "예약하기" })).toBeInTheDocument();
  },
};
