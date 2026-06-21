import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, within } from "storybook/test";
import { Card, Button, type CardProps } from "@nudge-design/react";
import { StarIcon } from "@nudge-design/icons";
import { colors } from "@nudge-design/tokens";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<CardProps> = {
  title: "Components/Display/Card",
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

// variant 을 카드별로 나눠 카탈로그가 각 프리뷰에 storyName 라벨을 달도록 한다.
// outlined = 보더로 분리 / flat = 보더·그림자 없음 → 회색 surface 위에 얹어야 카드로 읽힘.
export const GalleryOutlined: Story = {
  name: "variant=outlined (보더로 분리)",
  tags: ["gallery"],
  render: () => (
    <div style={{ width: 220 }}>
      <Card
        variant="outlined"
        title="주간 리포트"
        description="이번 주 활동 요약"
        metadata="3분 전 업데이트"
      />
    </div>
  ),
};

export const GalleryFlat: Story = {
  name: "variant=flat (surface 위 그룹)",
  tags: ["gallery"],
  render: () => (
    // flat 은 보더/그림자가 없어 흰 배경에선 안 보인다 — 회색 그룹 surface 위에 올려 대비를 준다.
    <div
      style={{
        width: 220,
        padding: 12,
        background: colors.neutral[100],
        borderRadius: 12,
      }}
    >
      <Card
        variant="flat"
        title="새 소식"
        description="업데이트된 내용이 있어요"
        cta={
          <Button size="sm" variant="outlined">
            보기
          </Button>
        }
      />
    </div>
  ),
};

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
            <StarIcon size={14} color="var(--semantic-icon-status-caution)" />
            <span>4.9</span>
          </>
        }
      >
        따뜻한 공감과 전문적 기법으로 함께 해결책을 찾아갑니다.
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
            <StarIcon size={14} color="var(--semantic-icon-status-caution)" />
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
                color: colors.pink[500],
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

// ─── Trost container card (Figma 5123:136) — platform 프리셋 + elevation + 헤더 아이콘 행 + body divider ───
// platform="pc": padding 28 / radius 16 / title 20 / subtitle 14. elevation 으로 outline↔elevated 전환.
export const TrostContainerPc: Story = {
  name: "Trost/Container Card (PC · outline & elevated)",
  parameters: {
    docs: {
      description: {
        story:
          "Trost container card (PC). platform='pc' 가 padding 28 / radius 16 / title 20 / subtitle 14 을 자동 적용. icon 을 주면 리딩 아이콘 + (title/subtitle) 정보 컬럼 헤더 행으로 렌더. showDivider 로 헤더↔본문 hairline. elevation='outline'(보더) ↔ 'elevated'(shadow E2 + 보더 제거) 비교.",
      },
    },
  },
  render: () => (
    <div data-project="trost" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div style={{ width: 440 }}>
        <Card
          platform="pc"
          elevation="outline"
          icon={<StarIcon size={24} color="var(--semantic-icon-point-default)" />}
          title="이번 주 마음 리포트"
          subtitle="지난 7일 감정 기록 요약"
          showDivider
        >
          꾸준한 기록이 쌓이고 있어요. 평균 기분 점수가 지난주보다 12% 올랐습니다.
        </Card>
      </div>
      <div style={{ width: 440 }}>
        <Card
          platform="pc"
          elevation="elevated"
          icon={<StarIcon size={24} color="var(--semantic-icon-point-default)" />}
          title="이번 주 마음 리포트"
          subtitle="지난 7일 감정 기록 요약"
          showDivider
        >
          꾸준한 기록이 쌓이고 있어요. 평균 기분 점수가 지난주보다 12% 올랐습니다.
        </Card>
      </div>
    </div>
  ),
};

// platform="mobile": padding 20 / radius 14 / title 17 / subtitle 13.
export const TrostContainerMobile: Story = {
  name: "Trost/Container Card (Mobile)",
  parameters: {
    docs: {
      description: {
        story:
          "Trost container card (Mobile). platform='mobile' 가 padding 20 / radius 14 / title 17 / subtitle 13 을 자동 적용. Mobile 은 elevation='outline'(보더) 권장.",
      },
    },
  },
  render: () => (
    <div data-project="trost" style={{ width: 328 }}>
      <Card
        platform="mobile"
        elevation="outline"
        icon={<StarIcon size={24} color="var(--semantic-icon-point-default)" />}
        title="오늘의 마음 체크"
        subtitle="2분이면 충분해요"
        showDivider
      >
        지금 기분을 기록하면 주간 리포트에 반영됩니다.
      </Card>
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
