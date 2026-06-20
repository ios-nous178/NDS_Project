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
 * `data-project="cashwalk-biz"` 아래에서 검정 CTA 로 해석된다. (Figma 4018:1226)
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
      <div data-project="cashwalk-biz" style={{ padding: 140, display: "inline-flex" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ConfirmTooltip>;

/* ─── Gallery / Open ─── 갤러리 대표 프리뷰. 딤/모달 없이 열린 말풍선 하나만 자연 크기로 노출. */
export const GalleryOpen: Story = {
  name: "Gallery / Open (단독 말풍선)",
  tags: ["gallery"],
  render: () => (
    <ConfirmTooltip
      open
      placement="top"
      actions="dual"
      title="연결을 해제하시겠습니까?"
      description="연결을 해제하면 광고에 해당 소재는 더이상 노출되지 않습니다."
      confirmLabel="해제"
      cancelLabel="취소"
    >
      <Button color="secondary" variant="outlined" size="sm">
        연결 해제
      </Button>
    </ConfirmTooltip>
  ),
};

/* ─── Overview ─── 갤러리 대표: 모달(딤) 위에 떠 있는 확인 툴팁 = "두 번째 모달 없이" 모달 위에서 바로 확인받는 용도.
   실제 ConfirmTooltip 을 open 으로 정적 렌더 → tail 포함. */
export const Overview: Story = {
  name: "Overview / 모달 위 확인 (중복 모달 회피)",
  decorators: [],
  render: () => (
    <div
      data-project="cashwalk-biz"
      style={{
        position: "relative",
        width: 300,
        height: 320,
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid #ECECEC",
        background: "#FAFAFA",
        boxSizing: "border-box",
      }}
    >
      {/* 1) 딤 아래로 비치는 어드민 화면 (스크림이 가리는 실제 본문) */}
      <div
        style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}
        aria-hidden
      >
        <div style={{ height: 10, width: 104, borderRadius: 4, background: "#E4E4E4" }} />
        <div
          style={{ height: 34, borderRadius: 6, background: "#fff", border: "1px solid #ECECEC" }}
        />
        <div
          style={{ height: 34, borderRadius: 6, background: "#fff", border: "1px solid #ECECEC" }}
        />
        <div
          style={{ height: 34, borderRadius: 6, background: "#fff", border: "1px solid #ECECEC" }}
        />
      </div>

      {/* 2) 모달 딤(스크림) — 본문을 덮어 '오버레이 위'임을 드러낸다 */}
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(17,17,17,0.45)" }}
        aria-hidden
      />

      {/* 3) 딤 위 모달 카드 — 그 안 버튼에 ConfirmTooltip 을 앵커해 tail 이 실제 컨트롤을 가리킨다 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 20,
          transform: "translateX(-50%)",
          width: 240,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 12px 32px rgba(0,0,0,0.24)",
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>소재 관리</div>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: "#666" }}>
          연결된 소재를 정리하세요.
        </div>
        <ConfirmTooltip
          open
          placement="top"
          actions="dual"
          bodyWidth={208}
          title="이 항목을 삭제할까요?"
          description="삭제하면 다시 되돌릴 수 없습니다."
          confirmLabel="삭제"
          cancelLabel="취소"
        >
          <Button color="secondary" variant="outlined" size="sm">
            연결 해제
          </Button>
        </ConfirmTooltip>
      </div>
    </div>
  ),
};

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
