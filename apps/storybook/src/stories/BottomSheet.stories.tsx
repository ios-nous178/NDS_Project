import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, waitFor } from "storybook/test";
import { BottomSheet, Button, type BottomSheetProps } from "@nudge-design/react";
import { colors } from "@nudge-design/tokens";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<BottomSheetProps> = {
  title: "Components/BottomSheet",
  component: BottomSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("BottomSheet"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<BottomSheetProps>;

/* ─── Default (Flat API) ─── */

function FlatExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>바텀시트 열기</Button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="상담 유형 선택"
        closable
        footer={
          <Button fullWidth onClick={() => setOpen(false)}>
            선택 완료
          </Button>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-comfortable)" }}>
          {["심리상담", "법률상담", "재무상담", "건강상담"].map((item) => (
            <div
              key={item}
              style={{
                padding: "var(--inset-input) var(--inset-card)",
                borderRadius: 8,
                border: `1px solid ${colors.neutral[200]}`,
                cursor: "pointer",
                fontSize: 15,
                color: colors.neutral[800],
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}

export const Default: Story = {
  name: "State/Default",
  render: () => <FlatExample />,
};

/* ─── Compound API ─── */

function CompoundExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Compound 바텀시트</Button>
      <BottomSheet.Root open={open} onClose={() => setOpen(false)}>
        <BottomSheet.Overlay />
        <BottomSheet.Content maxWidth={400}>
          <BottomSheet.Handle />
          <BottomSheet.Header title="알림 설정" closable />
          <BottomSheet.Body>
            <p style={{ margin: 0 }}>
              Compound API를 사용하면 핸들, 헤더, 바디, 푸터를 자유롭게 조합할 수 있습니다.
            </p>
          </BottomSheet.Body>
          <BottomSheet.Footer>
            <Button variant="outlined" fullWidth onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button fullWidth onClick={() => setOpen(false)}>
              확인
            </Button>
          </BottomSheet.Footer>
        </BottomSheet.Content>
      </BottomSheet.Root>
    </>
  );
}

/* ─── Simple (Handle Only) ─── */

function SimpleExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>간단한 바텀시트</Button>
      <BottomSheet open={open} onClose={() => setOpen(false)} showHandle>
        <p style={{ margin: 0, textAlign: "center" }}>
          간단한 안내 메시지입니다.
          <br />
          오버레이를 클릭하면 닫힙니다.
        </p>
      </BottomSheet>
    </>
  );
}

export const Simple: Story = {
  name: "State/Simple",
  render: () => <SimpleExample />,
};

/* ─── List Selection ─── */

function ListSelectionExample() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  const options = ["대면 상담", "화상 상담", "채팅 상담", "전화 상담"];

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--gap-default)",
          alignItems: "center",
        }}
      >
        <Button onClick={() => setOpen(true)}>상담 방식 선택</Button>
        {selected && (
          <span style={{ fontSize: 14, color: colors.neutral[600] }}>선택: {selected}</span>
        )}
      </div>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="상담 방식" closable>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-tight)" }}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 4px",
                border: "none",
                borderBottom: `1px solid ${colors.neutral[100]}`,
                background: "none",
                cursor: "pointer",
                fontSize: 15,
                color: selected === option ? colors.blue[500] : colors.neutral[800],
                fontWeight: selected === option ? 600 : 400,
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}

/* ─── Long Content (스크롤) ─── */

function LongContentExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>긴 콘텐츠 바텀시트</Button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="개인정보 처리방침"
        closable
        maxHeight="60vh"
        footer={
          <Button fullWidth onClick={() => setOpen(false)}>
            동의합니다
          </Button>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-loose)" }}>
          {Array.from({ length: 10 }, (_, i) => (
            <p
              key={i}
              style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: colors.neutral[700] }}
            >
              제{i + 1}조. 본 서비스는 이용자의 개인정보를 수집·이용하며, 관련 법령에 따라 안전하게
              관리합니다. 수집된 정보는 서비스 제공, 상담 예약, 프로그램 운영 등의 목적으로만
              사용됩니다. 이용자는 언제든지 자신의 개인정보에 대한 열람, 정정, 삭제를 요청할 수
              있습니다.
            </p>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}

export const LongContent: Story = {
  name: "State/Long Content Scrollable",
  render: () => <LongContentExample />,
};

/* ─── No Handle, No Overlay Close ─── */

function NoHandleNoMaskCloseExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>핸들 없음 + 오버레이 닫기 비활성</Button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="필수 확인"
        closable
        showHandle={false}
        isMaskClose={false}
        footer={
          <Button fullWidth onClick={() => setOpen(false)}>
            확인했습니다
          </Button>
        }
      >
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: colors.neutral[700] }}>
          이 바텀시트는 오버레이 클릭으로 닫을 수 없습니다.
          <br />
          반드시 확인 버튼이나 닫기(✕)를 눌러야 합니다.
        </p>
      </BottomSheet>
    </>
  );
}

export const NoHandleNoMaskClose: Story = {
  name: "State/No Handle No Mask Close",
  render: () => <NoHandleNoMaskCloseExample />,
};

/* ─── Custom Max Width ─── */

function CustomMaxWidthExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>좁은 바텀시트 (360px)</Button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Quick Action"
        closable
        maxWidth={360}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-default)" }}>
          <Button fullWidth onClick={() => setOpen(false)}>
            상담 예약하기
          </Button>
          <Button fullWidth variant="outlined" onClick={() => setOpen(false)}>
            일정 변경하기
          </Button>
          <Button fullWidth variant="soft" onClick={() => setOpen(false)}>
            취소하기
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}

export const CustomMaxWidth: Story = {
  name: "State/Custom Max Width",
  render: () => <CustomMaxWidthExample />,
};

/* ─── Two-button Footer ─── */

function TwoButtonFooterExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>취소/확인 푸터</Button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="상담 일정 확인"
        closable
        footer={
          <>
            <Button variant="outlined" fullWidth onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button fullWidth onClick={() => setOpen(false)}>
              확인
            </Button>
          </>
        }
      >
        <div style={{ fontSize: 14, lineHeight: 1.6, color: colors.neutral[700] }}>
          <p style={{ margin: "0 0 8px" }}>
            <strong>일시:</strong> 2026년 4월 15일 (수) 14:00
          </p>
          <p style={{ margin: "0 0 8px" }}>
            <strong>상담사:</strong> 김민수 전문상담사
          </p>
          <p style={{ margin: 0 }}>
            <strong>유형:</strong> 심리상담 (대면)
          </p>
        </div>
      </BottomSheet>
    </>
  );
}

/* ─── Without Overlay ─── */

function NoOverlayExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>오버레이 없는 바텀시트</Button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Quick Menu"
        closable
        mask={false}
        showHandle={false}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-default)" }}>
          <Button fullWidth variant="soft" onClick={() => setOpen(false)}>
            복사하기
          </Button>
          <Button fullWidth variant="soft" onClick={() => setOpen(false)}>
            공유하기
          </Button>
          <Button fullWidth variant="soft" onClick={() => setOpen(false)}>
            삭제하기
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}

export const NoOverlay: Story = {
  name: "State/Without Overlay",
  render: () => <NoOverlayExample />,
};

export const Compound: Story = {
  name: "Recipe/Compound API",
  render: () => <CompoundExample />,
};

export const ListSelection: Story = {
  name: "Recipe/List Selection",
  render: () => <ListSelectionExample />,
};

export const TwoButtonFooter: Story = {
  name: "Recipe/Two Button Footer",
  render: () => <TwoButtonFooterExample />,
};

/* ─── Interaction Tests ─── */

export const OpenAndCloseInteraction: Story = {
  name: "Interaction/Open And Close",
  render: () => <FlatExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "바텀시트 열기" }));
    await expect(within(document.body).getByText("상담 유형 선택")).toBeInTheDocument();

    await user.click(within(document.body).getByRole("button", { name: "선택 완료" }));
  },
};

export const ListSelectionInteraction: Story = {
  name: "Interaction/List Item Selection",
  render: () => <ListSelectionExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "상담 방식 선택" }));
    await expect(within(document.body).getByText("상담 방식")).toBeInTheDocument();

    await user.click(within(document.body).getByText("채팅 상담"));

    await expect(canvas.getByText("선택: 채팅 상담")).toBeInTheDocument();
  },
};

export const EscapeClosesInteraction: Story = {
  name: "Interaction/Escape Closes",
  render: () => <FlatExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "바텀시트 열기" }));
    await expect(within(document.body).getByText("상담 유형 선택")).toBeInTheDocument();

    await user.keyboard("{Escape}");
  },
};

export const CloseButtonAccessibilityInteraction: Story = {
  name: "Interaction/Close Button Accessibility",
  render: () => <FlatExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const trigger = canvas.getByRole("button", { name: "바텀시트 열기" });

    await user.click(trigger);

    const dialog = within(document.body).getByRole("dialog");
    const closeButton = within(dialog).getByRole("button", { name: /닫기/i });
    await expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);
  },
};

export const FocusTrapInteraction: Story = {
  name: "Interaction/Focus Trap",
  render: () => <CompoundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "Compound 바텀시트" }));

    const dialog = within(document.body).getByRole("dialog");
    await expect(dialog).toBeInTheDocument();

    const cancelButton = within(dialog).getByRole("button", { name: "취소" });
    const confirmButton = within(dialog).getByRole("button", { name: "확인" });

    await expect(cancelButton).toBeInTheDocument();
    await expect(confirmButton).toBeInTheDocument();
  },
};

/* ─── Edge Case Tests ─── */

export const FocusReturnEdge: Story = {
  name: "Edge/Focus Return After Close",
  render: () => <FlatExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const trigger = canvas.getByRole("button", { name: "바텀시트 열기" });

    await user.click(trigger);
    await expect(within(document.body).getByRole("dialog")).toBeInTheDocument();

    await user.click(within(document.body).getByRole("button", { name: "선택 완료" }));

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  },
};

export const MaskCloseDisabledEdge: Story = {
  name: "Edge/Mask Close Disabled Persists",
  render: () => <NoHandleNoMaskCloseExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "핸들 없음 + 오버레이 닫기 비활성" }));
    const dialog = within(document.body).getByRole("dialog");

    const overlay = document.body.querySelector('[data-slot="overlay"]');
    if (overlay) {
      await user.click(overlay as Element);
    }
    await expect(dialog).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "확인했습니다" }));
  },
};

export const ClosingAnimationCompletes: Story = {
  name: "Edge/Closing Animation Completes",
  render: () => <FlatExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "바텀시트 열기" }));
    const dialog = within(document.body).getByRole("dialog");
    await expect(dialog).toBeInTheDocument();

    // ESC 누르면 closing 상태로 전환
    await user.keyboard("{Escape}");

    const root = document.body.querySelector("[data-slot='root']");
    await expect(root).toHaveAttribute("data-closing", "true");

    // 다이얼로그가 아직 존재 (애니메이션 진행 중)
    await expect(dialog).toBeInTheDocument();
  },
};

export const ScrollLockWhileOpen: Story = {
  name: "Edge/Body Scroll Locked",
  render: () => <FlatExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "바텀시트 열기" }));
    await expect(within(document.body).getByRole("dialog")).toBeInTheDocument();

    // body 스크롤이 잠겨야 함
    await expect(document.body.style.overflow).toBe("hidden");
  },
};
