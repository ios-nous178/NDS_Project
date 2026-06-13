import React, { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Snackbar } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const { Provider: SnackbarProvider, useSnackbar } = Snackbar;

const meta: Meta<typeof Snackbar> = {
  title: "Components/Feedback/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Snackbar"),
      },
    },
  },
  argTypes: {
    variant: { control: "radio", options: [undefined, "info", "success", "warning", "error"] },
    closable: { control: "boolean" },
  },
  args: { title: "변경사항이 저장됐어요" },
};

export default meta;
type Story = StoryObj<typeof Snackbar>;

/* ─── Gallery (compact, 대표 인라인 프리뷰) ─── */

/** 카탈로그 갤러리용 — 실제 열린 Snackbar 바(메시지 + 액션)를 인라인 정적 렌더. */
export const Overview: Story = {
  tags: ["gallery"],
  name: "Overview",
  render: () => (
    <div style={{ width: 440 }}>
      <Snackbar title="변경사항이 저장됐어요" actionLabel="되돌리기" onAction={() => {}} />
    </div>
  ),
};

/* ─── Inline (declarative) ─── */

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 480 }}>
      <Snackbar {...args} />
    </div>
  ),
};

export const Variants: Story = {
  name: "Variant/info success warning error",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-comfortable)",
        width: 480,
      }}
    >
      <Snackbar variant="info" title="알려드려요" description="상담사 일정이 변경됐어요." />
      <Snackbar variant="success" title="저장 완료" description="다음 단계로 이동합니다." />
      <Snackbar variant="warning" title="주의" description="네트워크 연결이 불안정해요." />
      <Snackbar
        variant="error"
        title="저장 실패"
        description="잠시 후 다시 시도해주세요."
        actionLabel="다시 시도"
      />
    </div>
  ),
};

export const WithAction: Story = {
  name: "Recipe/액션 버튼 (되돌리기)",
  render: function Render() {
    const [count, setCount] = useState(0);
    return (
      <div
        style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-comfortable)" }}
      >
        <Snackbar
          title="감정 기록을 삭제했어요"
          actionLabel="되돌리기"
          onAction={() => setCount((c) => c + 1)}
        />
        <small>되돌리기 클릭: {count}회</small>
      </div>
    );
  },
};

export const Closable: Story = {
  name: "State/닫기 버튼",
  render: function Render() {
    const [open, setOpen] = useState(true);
    if (!open) return <button onClick={() => setOpen(true)}>다시 표시</button>;
    return <Snackbar title="이 메시지는 닫을 수 있어요" closable onClose={() => setOpen(false)} />;
  },
};

export const DescriptionOnly: Story = {
  name: "Recipe/설명 없이",
  render: () => <Snackbar title="복사됐어요" />,
};

/* ─── Triggered (inline, 부모가 표시 통제) ─── */

export const Triggered: Story = {
  name: "Recipe/버튼 클릭 후 노출 (인라인)",
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 480 }}>
        <button type="button" onClick={() => setOpen((v) => !v)} style={triggerButton}>
          Snackbar 토글
        </button>
        {open && (
          <Snackbar
            title="변경사항이 저장됐어요"
            description="방금 수정한 내용이 반영되었습니다."
            closable
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    );
  },
};

/* ─── Provider (자동 사라짐·포지셔닝·단일교체) ─── */

function ManagedDefaultExample() {
  const { snackbar } = useSnackbar();
  return (
    <button type="button" style={triggerButton} onClick={() => snackbar("변경사항이 저장됐어요")}>
      Snackbar 표시
    </button>
  );
}

export const Managed: Story = {
  name: "Variant/클릭 후 노출 (자동 사라짐)",
  render: () => (
    <SnackbarProvider position="bottom">
      <ManagedDefaultExample />
    </SnackbarProvider>
  ),
};

function ManagedActionExample() {
  const { snackbar } = useSnackbar();
  return (
    <button
      type="button"
      style={triggerButton}
      onClick={() =>
        snackbar("감정 기록을 삭제했어요", {
          action: { label: "되돌리기", onClick: () => alert("되돌리기 실행") },
        })
      }
    >
      액션 Snackbar
    </button>
  );
}

export const ManagedWithAction: Story = {
  name: "Variant/With Action (되돌리기)",
  render: () => (
    <SnackbarProvider position="bottom" duration={6000}>
      <ManagedActionExample />
    </SnackbarProvider>
  ),
};

function ManagedErrorActionExample() {
  const { snackbar } = useSnackbar();
  return (
    <button
      type="button"
      style={triggerButton}
      onClick={() =>
        snackbar("저장에 실패했습니다", {
          variant: "error",
          action: { label: "다시 시도", onClick: () => alert("재시도 실행") },
        })
      }
    >
      에러 + 액션 Snackbar
    </button>
  );
}

export const ManagedErrorWithAction: Story = {
  name: "Variant/Error With Action (다시 시도)",
  render: () => (
    <SnackbarProvider position="bottom" duration={6000}>
      <ManagedErrorActionExample />
    </SnackbarProvider>
  ),
};

/* ─── Cashwalk for Business: 흰 카드 · 우측 상단 · 단일 교체 ─── */

function CashbizSnackbarInner() {
  const { snackbar } = useSnackbar();
  return (
    <div style={{ display: "flex", gap: "var(--semantic-gap-default)", flexWrap: "wrap" }}>
      <button type="button" style={triggerButton} onClick={() => snackbar("변경사항이 저장됐어요")}>
        Default
      </button>
      <button
        type="button"
        style={triggerButton}
        onClick={() => snackbar("저장 완료", { variant: "success" })}
      >
        Success
      </button>
      <button
        type="button"
        style={triggerButton}
        onClick={() =>
          snackbar("네트워크 오류로 중단되었습니다. 다시 시도해 주세요", {
            variant: "error",
            duration: 5000,
            action: { label: "다시 시도", onClick: () => alert("재시도") },
          })
        }
      >
        Error
      </button>
      <button
        type="button"
        style={triggerButton}
        onClick={() => snackbar("이미 추가된 이메일 주소입니다", { variant: "warning" })}
      >
        Warning
      </button>
      <button
        type="button"
        style={triggerButton}
        onClick={() => snackbar("새 소식이 있습니다", { variant: "info" })}
      >
        Info
      </button>
    </div>
  );
}

/**
 * 캐포비 admin Snackbar — **흰 카드**(흰 배경 + 그림자 + radius 8) · 우측 상단 고정(`position="top-right"`)
 * · 동시 1개(`maxCount={1}`, 새 알림이 기존 교체) · status 칩 아이콘 + 닫기 X. 흰 카드/검정 메시지는
 * `data-brand="cashwalk-biz"` cascade + `brand="cashwalk-biz"`(칩 아이콘)로 적용된다.
 * 기존 캐포비 "토스트"였던 5개 state(Default/Success/Error/Warning/Info)가 Snackbar 로 이관됐다.
 */
export const CashbizTopRight: Story = {
  name: "Brand/Cashbiz Top-Right (흰 카드 · Single)",
  globals: { brand: "cashwalk-biz" },
  render: () => (
    <SnackbarProvider position="top-right" maxCount={1} brand="cashwalk-biz" duration={5000}>
      <CashbizSnackbarInner />
    </SnackbarProvider>
  ),
};

/* ─── Position in context (실제 화면 위 노출 위치) ─── */

/**
 * 폰 프레임 안에서 Snackbar 가 실제로 어디에 뜨는지 보여준다. Provider 의 viewport 는
 * `position: fixed` 라 프레임을 `transform` 으로 containing block 으로 만들고 `portalContainer`
 * 로 프레임을 지정해 브라우저 창이 아닌 프레임 기준으로 고정시킨다. (기본=하단 중앙 / 캐포비=우측 상단)
 */
function PhoneFrame({
  label,
  brand,
  children,
}: {
  label: string;
  brand?: string;
  children: (frame: HTMLElement | null) => React.ReactNode;
}) {
  const [frame, setFrame] = useState<HTMLElement | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <span style={frameLabel}>{label}</span>
      <div ref={setFrame} data-brand={brand} style={phoneFrame}>
        <div
          style={{ padding: "16px 16px", display: "flex", flexDirection: "column", gap: 10 }}
          aria-hidden
        >
          <div style={{ height: 12, width: 128, borderRadius: 4, background: "#E8E8E8" }} />
          <div style={{ height: 60, borderRadius: 10, background: "#F3F4F6" }} />
          <div style={{ height: 60, borderRadius: 10, background: "#F3F4F6" }} />
          <div style={{ height: 60, borderRadius: 10, background: "#F3F4F6" }} />
        </div>
        {children(frame)}
      </div>
    </div>
  );
}

/** 마운트 시 1회 노출 (정적 화면에서도 위치가 보이도록 길게 유지). */
function AutoSnackbar({ message }: { message: string }) {
  const { snackbar } = useSnackbar();
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    snackbar(message);
  }, [snackbar, message]);
  return null;
}

export const PositionInContext: Story = {
  name: "State/노출 위치 (화면 위)",
  render: () => (
    <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
      <PhoneFrame label="기본 · 하단 중앙">
        {(frame) =>
          frame && (
            <SnackbarProvider position="bottom" duration={1_000_000} portalContainer={frame}>
              <AutoSnackbar message="변경사항이 저장됐어요" />
            </SnackbarProvider>
          )
        }
      </PhoneFrame>
      <PhoneFrame label="캐포비 · 우측 상단" brand="cashwalk-biz">
        {(frame) =>
          frame && (
            <SnackbarProvider
              position="top-right"
              brand="cashwalk-biz"
              maxCount={1}
              duration={1_000_000}
              portalContainer={frame}
            >
              <AutoSnackbar message="변경사항이 저장됐어요" />
            </SnackbarProvider>
          )
        }
      </PhoneFrame>
    </div>
  ),
};

/* ─── Interaction Tests (docs 개요에서 바로 테스트) ─── */

export const TriggeredInteraction: Story = {
  name: "Interaction/인라인 클릭 노출",
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button type="button" style={triggerButton} onClick={() => setOpen(true)}>
          Snackbar 열기
        </button>
        {open && <Snackbar title="변경사항이 저장됐어요" closable onClose={() => setOpen(false)} />}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    await user.click(canvas.getByRole("button", { name: "Snackbar 열기" }));
    await expect(canvas.getByText("변경사항이 저장됐어요")).toBeInTheDocument();
  },
};

export const ManagedInteraction: Story = {
  name: "Interaction/Provider 클릭 노출",
  render: () => (
    <SnackbarProvider position="bottom">
      <ManagedDefaultExample />
    </SnackbarProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    await user.click(canvas.getByRole("button", { name: "Snackbar 표시" }));
    await expect(within(document.body).getByText("변경사항이 저장됐어요")).toBeInTheDocument();
  },
};

export const ManagedActionInteraction: Story = {
  name: "Interaction/Provider 액션 버튼",
  render: () => (
    <SnackbarProvider position="bottom" duration={6000}>
      <ManagedActionExample />
    </SnackbarProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    await user.click(canvas.getByRole("button", { name: "액션 Snackbar" }));
    await expect(within(document.body).getByText("감정 기록을 삭제했어요")).toBeInTheDocument();
    await expect(
      within(document.body).getByRole("button", { name: "되돌리기" }),
    ).toBeInTheDocument();
  },
};

/* ─── styles ─── */

const triggerButton: React.CSSProperties = {
  alignSelf: "flex-start",
  height: 36,
  padding: "0 12px",
  borderRadius: 8,
  border: "1px solid #D8D8D8",
  background: "#FFF",
  font: "inherit",
  cursor: "pointer",
};

const phoneFrame: React.CSSProperties = {
  position: "relative",
  // fixed viewport 가 브라우저 창이 아닌 이 프레임 기준으로 잡히도록 containing block 생성.
  transform: "translateZ(0)",
  width: 300,
  height: 520,
  borderRadius: 28,
  border: "8px solid #1F2937",
  background: "#FFF",
  overflow: "hidden",
  boxSizing: "border-box",
};

const frameLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#666",
};
