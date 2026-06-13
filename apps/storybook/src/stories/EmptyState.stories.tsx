import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { EmptyState, Button, type EmptyStateProps } from "@nudge-design/react";
import { colors } from "@nudge-design/tokens";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<EmptyStateProps> = {
  title: "Components/Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("EmptyState"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<EmptyStateProps>;

function SearchEmptyIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="18" stroke="currentColor" strokeWidth="2" />
      <path d="M42 42L56 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 28H34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
      <path d="M32 20V36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="44" r="2" fill="currentColor" />
    </svg>
  );
}

function DefaultEmptyIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M22 32H42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 22V42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export const Default: Story = {
  name: "State/Default",
  render: () => (
    <div style={{ width: 360 }}>
      <EmptyState title="데이터가 없습니다" description="아직 등록된 내용이 없습니다." />
    </div>
  ),
};

export const SearchEmpty: Story = {
  name: "State/Search Empty",
  render: () => (
    <div style={{ width: 360 }}>
      <EmptyState
        icon={<SearchEmptyIcon />}
        title="검색 결과가 없습니다"
        description="다른 검색어로 다시 시도해보세요."
      />
    </div>
  ),
};

export const WithAction: Story = {
  tags: ["gallery"],
  name: "State/With Action",
  render: () => (
    <div style={{ width: 360 }}>
      <EmptyState
        icon={<ErrorIcon />}
        title="일시적인 오류가 발생했습니다"
        description={"잠시 후 다시 시도해주세요.\n문제가 계속되면 고객센터에 문의해주세요."}
        action={
          <Button variant="outlined" size="sm" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        }
      />
    </div>
  ),
};

export const ListEmpty: Story = {
  name: "State/List Empty WebView Style",
  render: () => (
    <div style={{ width: 360 }}>
      <EmptyState title="리스트가 없습니다." minHeight={360} />
    </div>
  ),
};

export const MinimalMessage: Story = {
  name: "State/Minimal Message Only",
  render: () => (
    <div style={{ width: 360 }}>
      <EmptyState description="등록된 쿠폰이 없습니다." />
    </div>
  ),
};

export const CompoundAPI: Story = {
  tags: ["gallery"],
  name: "Recipe/Compound API",
  render: () => (
    <div style={{ width: 360 }}>
      <EmptyState.Root minHeight={300}>
        <EmptyState.Icon>
          <img src="https://placehold.co/64x64/f5f5f5/999999?text=!" alt="empty" />
        </EmptyState.Icon>
        <EmptyState.Title>상담 내역이 없습니다</EmptyState.Title>
        <EmptyState.Description>
          첫 상담을 예약해보세요.
          <br />
          전문 상담사가 도와드립니다.
        </EmptyState.Description>
        <EmptyState.Action>
          <Button size="sm">상담 예약하기</Button>
        </EmptyState.Action>
      </EmptyState.Root>
    </div>
  ),
};

export const FlatVsCompoundParity: Story = {
  name: "Interaction/Flat Vs Compound Parity",
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 360px))",
        gap: "var(--semantic-gap-wide)",
        alignItems: "start",
      }}
    >
      <div style={{ width: 360 }}>
        <p style={{ marginTop: 0, color: colors.neutral[700], fontSize: 14 }}>Flat API</p>
        <p style={{ marginTop: 4, color: colors.neutral[500], fontSize: 12 }}>
          기본 아이콘이 자동으로 렌더링됩니다.
        </p>
        <EmptyState
          title="상담 내역이 없습니다"
          description={"첫 상담을 예약해보세요.\n전문 상담사가 도와드립니다."}
          action={<Button size="sm">상담 예약하기</Button>}
        />
      </div>
      <div style={{ width: 360 }}>
        <p style={{ marginTop: 0, color: colors.neutral[700], fontSize: 14 }}>Compound API</p>
        <p style={{ marginTop: 4, color: colors.neutral[500], fontSize: 12 }}>
          비교를 위해 동일한 기본 아이콘을 명시적으로 넣었습니다.
        </p>
        <EmptyState.Root minHeight={200}>
          <EmptyState.Icon>
            <DefaultEmptyIcon />
          </EmptyState.Icon>
          <EmptyState.Title>상담 내역이 없습니다</EmptyState.Title>
          <EmptyState.Description>
            첫 상담을 예약해보세요.
            {"\n"}
            전문 상담사가 도와드립니다.
          </EmptyState.Description>
          <EmptyState.Action>
            <Button size="sm">상담 예약하기</Button>
          </EmptyState.Action>
        </EmptyState.Root>
      </div>
    </div>
  ),
};

export const MultilineDescriptionReview: Story = {
  name: "Interaction/Multiline Description Review",
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: () => (
    <div style={{ width: 360, display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <p style={{ marginTop: 0, color: colors.neutral[700], fontSize: 14 }}>
          Flat API string description
        </p>
        <p style={{ marginTop: 4, color: colors.neutral[500], fontSize: 12 }}>
          문자열의 줄바꿈이 자동으로 렌더링됩니다.
        </p>
        <EmptyState
          title="일시적인 오류가 발생했습니다"
          description={"잠시 후 다시 시도해주세요.\n문제가 계속되면 고객센터에 문의해주세요."}
        />
      </div>
      <div>
        <p style={{ marginTop: 0, color: colors.neutral[700], fontSize: 14 }}>
          Compound API children with newline
        </p>
        <p style={{ marginTop: 4, color: colors.neutral[500], fontSize: 12 }}>
          비교를 위해 동일한 기본 아이콘과 줄바꿈 표현을 맞췄습니다.
        </p>
        <EmptyState.Root>
          <EmptyState.Icon>
            <DefaultEmptyIcon />
          </EmptyState.Icon>
          <EmptyState.Title>일시적인 오류가 발생했습니다</EmptyState.Title>
          <EmptyState.Description>
            잠시 후 다시 시도해주세요.
            {"\n"}
            문제가 계속되면 고객센터에 문의해주세요.
          </EmptyState.Description>
        </EmptyState.Root>
      </div>
    </div>
  ),
};

export const AccessibilityStructureReview: Story = {
  name: "Interaction/Accessibility Structure",
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 360px))",
        gap: "var(--semantic-gap-wide)",
        alignItems: "start",
      }}
    >
      <div style={{ width: 360 }}>
        <p style={{ marginTop: 0, color: colors.neutral[700], fontSize: 14 }}>Flat API</p>
        <EmptyState
          title="상담 내역이 없습니다"
          description={"첫 상담을 예약해보세요.\n전문 상담사가 도와드립니다."}
          action={<Button size="sm">상담 예약하기</Button>}
        />
      </div>
      <div style={{ width: 360 }}>
        <p style={{ marginTop: 0, color: colors.neutral[700], fontSize: 14 }}>Compound API</p>
        <EmptyState.Root>
          <EmptyState.Icon>
            <DefaultEmptyIcon />
          </EmptyState.Icon>
          <EmptyState.Title>상담 내역이 없습니다</EmptyState.Title>
          <EmptyState.Description>
            첫 상담을 예약해보세요.
            {"\n"}
            전문 상담사가 도와드립니다.
          </EmptyState.Description>
          <EmptyState.Action>
            <Button size="sm">상담 예약하기</Button>
          </EmptyState.Action>
        </EmptyState.Root>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const flatSection = canvas.getByText("Flat API").parentElement;
    const compoundSection = canvas.getByText("Compound API").parentElement;

    if (!flatSection || !compoundSection) {
      throw new Error("EmptyState accessibility review sections were not rendered.");
    }

    const flat = within(flatSection);
    const compound = within(compoundSection);

    await expect(
      flat.getByRole("heading", { level: 3, name: "상담 내역이 없습니다" }),
    ).toBeInTheDocument();
    const flatDescription = flatSection.querySelector('[data-slot="description"]');
    await expect(flatDescription).toHaveTextContent("첫 상담을 예약해보세요.");
    await expect(flatDescription).toHaveTextContent("전문 상담사가 도와드립니다.");
    await expect(flat.getByRole("button", { name: "상담 예약하기" })).toBeInTheDocument();

    await expect(
      compound.getByRole("heading", { level: 3, name: "상담 내역이 없습니다" }),
    ).toBeInTheDocument();
    const compoundDescription = compoundSection.querySelector('[data-slot="description"]');
    await expect(compoundDescription).toHaveTextContent("첫 상담을 예약해보세요.");
    await expect(compoundDescription).toHaveTextContent("전문 상담사가 도와드립니다.");
    await expect(compound.getByRole("button", { name: "상담 예약하기" })).toBeInTheDocument();
  },
};

export const ActionInteraction: Story = {
  name: "Interaction/Action Button",
  render: function Render() {
    const [retried, setRetried] = React.useState(false);

    return (
      <div style={{ width: 360 }}>
        <EmptyState
          icon={<ErrorIcon />}
          title="일시적인 오류가 발생했습니다"
          description="잠시 후 다시 시도해주세요."
          action={
            <Button variant="outlined" size="sm" onClick={() => setRetried(true)}>
              다시 시도
            </Button>
          }
        />
        {retried && <p>재시도 요청됨</p>}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "다시 시도" }));
    await expect(canvas.getByText("재시도 요청됨")).toBeInTheDocument();
  },
};
