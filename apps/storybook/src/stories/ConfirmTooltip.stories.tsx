import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, ConfirmTooltip } from "@nudge-design/react";

/**
 * Components/Overlay/ConfirmTooltip — 캐포비 어드민 popconfirm.
 *
 * 흰 말풍선 + 제목/본문 + 1~2 액션 버튼(검정 secondary CTA) + 방향 tail.
 * Tooltip(다크 hover 안내)과 분리 — 이건 **사용자의 응답/결정이 필요한** 가벼운 확인 팝업.
 * (한 화면을 채울 만큼 길거나 차단형 결정이면 Modal/Popup 을 쓸 것.)
 *
 * `open` 은 controlled — 트리거 클릭 핸들러에서 토글한다. 색은 모두 semantic role 토큰이라
 * `data-brand="cashwalk-biz"` 아래에서 검정 CTA 로 해석된다. (Figma 4018:1226)
 */
const meta: Meta<typeof ConfirmTooltip> = {
  title: "Components/Overlay/ConfirmTooltip",
  component: ConfirmTooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    placement: { control: "select", options: ["top", "bottom", "left", "right"] },
    actions: { control: "inline-radio", options: ["dual", "single"] },
    open: { control: "boolean" },
  },
  args: {
    title: "연결을 해제하시겠습니까?",
    description: "연결을 해제하면 광고에 해당 소재는 더이상 노출되지 않습니다.",
    placement: "top",
    actions: "dual",
    confirmLabel: "해제",
    cancelLabel: "취소",
  },
  decorators: [
    (Story) => (
      <div data-brand="cashwalk-biz" style={{ padding: 140, display: "inline-flex" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ConfirmTooltip>;

/* ─── 1. Playground (controlled — 트리거 클릭으로 토글) ─── */

const PlaygroundDemo: React.FC<React.ComponentProps<typeof ConfirmTooltip>> = (args) => {
  const [open, setOpen] = useState(args.open ?? false);
  return (
    <ConfirmTooltip
      {...args}
      open={open}
      onConfirm={() => setOpen(false)}
      onCancel={() => setOpen(false)}
    >
      <Button color="secondary" variant="outlined" size="sm" onClick={() => setOpen((v) => !v)}>
        연결 해제
      </Button>
    </ConfirmTooltip>
  );
};

export const Playground: Story = {
  render: (args) => <PlaygroundDemo {...args} />,
};

/* ─── 2. Actions=Dual (취소 + 해제) ─── */

export const Dual: Story = {
  tags: ["gallery"],
  name: "Variant/Dual (취소+해제)",
  args: { actions: "dual", open: true },
  render: (args) => (
    <ConfirmTooltip {...args}>
      <Button color="secondary" variant="outlined" size="sm">
        연결 해제
      </Button>
    </ConfirmTooltip>
  ),
};

/* ─── 3. Actions=Single (확인) ─── */

export const Single: Story = {
  name: "Variant/Single (확인)",
  args: { actions: "single", confirmLabel: "확인", open: true },
  render: (args) => (
    <ConfirmTooltip {...args}>
      <Button color="secondary" variant="outlined" size="sm">
        안내 보기
      </Button>
    </ConfirmTooltip>
  ),
};

/* ─── 4. Placement 4종 ─── */

export const Placements: Story = {
  name: "Variant/Placement (top/bottom/left/right)",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, auto)",
        gap: 180,
        padding: 60,
        justifyItems: "center",
      }}
    >
      {(["top", "bottom", "left", "right"] as const).map((p) => (
        <ConfirmTooltip
          key={p}
          open
          placement={p}
          title="연결을 해제하시겠습니까?"
          description="연결을 해제하면 광고에 해당 소재는 더이상 노출되지 않습니다."
          confirmLabel="해제"
          cancelLabel="취소"
        >
          <Button color="secondary" variant="outlined" size="sm">
            {p}
          </Button>
        </ConfirmTooltip>
      ))}
    </div>
  ),
};
