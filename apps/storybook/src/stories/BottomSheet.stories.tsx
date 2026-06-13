import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, waitFor } from "storybook/test";
import { BottomSheet, Button, type BottomSheetProps } from "@nudge-design/react";
import { colors } from "@nudge-design/tokens";
import { LinkIcon, DownloadIcon } from "@nudge-design/icons";
import { getSnsLogo } from "@nudge-design/assets";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const meta: Meta<BottomSheetProps> = {
  title: "Components/Overlay/BottomSheet",
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

/* ─── Overview ─── 첫 화면 = 열린 바텀시트(클릭 불필요). 갤러리 프리뷰로도 재사용(정적 인라인). */
export const Overview: Story = {
  name: "Overview",
  tags: ["gallery"],
  render: () => (
    <div style={{ position: "relative", width: 220, height: 160, border: "1px solid #ECECEC", borderRadius: 12, background: "#FAFAFA", overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", fontSize: 11, color: "#888" }}>본문 영역</div>
      <div style={{ position: "absolute", inset: 0, background: "rgba(17,17,17,0.32)" }} aria-hidden />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "#fff", borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: "10px 14px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ width: 32, height: 4, borderRadius: 9999, background: "#D8D8D8", alignSelf: "center", marginBottom: 4 }} aria-hidden />
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>필터</div>
        <div style={{ fontSize: 11, lineHeight: 1.55, color: "#666" }}>옵션을 선택하세요.</div>
      </div>
    </div>
  ),
};

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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--semantic-gap-comfortable)",
          }}
        >
          {["심리상담", "법률상담", "재무상담", "건강상담"].map((item) => (
            <div
              key={item}
              style={{
                padding: "var(--semantic-inset-input) var(--semantic-inset-card)",
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
          gap: "var(--semantic-gap-default)",
          alignItems: "center",
        }}
      >
        <Button onClick={() => setOpen(true)}>상담 방식 선택</Button>
        {selected && (
          <span style={{ fontSize: 14, color: colors.neutral[600] }}>선택: {selected}</span>
        )}
      </div>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="상담 방식" closable>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-tight)" }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}>
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
        <div
          style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-default)" }}
        >
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
        <div
          style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-default)" }}
        >
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

/* ─── Share Sheet (SNS 공유) ───
 * ShareSheet 는 별도 컴포넌트가 아니라 BottomSheet + 4칸 공유 그리드 + 링크 복사로
 * 조립하는 레시피. SNS 아이콘은 @nudge-design/assets 의 SNS 로고를 쓴다.
 */

// SNS 로고를 가져오는 두 가지 방법 — (A) 를 기본으로 두고 (B) 는 주석.
//
// (A) 패키지 코드 (권장 · SSOT): assets 패키지의 getSnsLogo 로 base64 dataUri 를 조회.
//     색상은 kakao=black(노란 버튼 위 검은 심볼), naver=white(초록 버튼 위 흰 심볼).
const kakaoLogo = getSnsLogo("kakao", "black")?.dataUri ?? "";
const naverLogo = getSnsLogo("naver", "white")?.dataUri ?? "";
//
// (B) base64 인라인 (assets 패키지 없이도 안 깨지는 fallback) — (A) 대신 쓰려면 주석 해제.
//     packages/assets/src/files/shared/sns-logos/{kakao-black,naver-white}.svg 를 base64 인코딩한 값.
// const kakaoLogo =
//   "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgdmlld0JveD0iMCAwIDYwIDU2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBpZD0iUGF0aCIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMC4wMDAyIDBDMTMuNDMwNiAwIDAgMTAuMzc2NSAwIDIzLjE3NDNDMCAzMS4xMzM0IDUuMTk0NyAzOC4xNDk5IDEzLjEwNTEgNDIuMzIzMUw5Ljc3NjggNTQuNDgxNkM5LjQ4Mjc0IDU1LjU1NTkgMTAuNzExNCA1Ni40MTIyIDExLjY1NDkgNTUuNzg5N0wyNi4yNDQ2IDQ2LjE2MDZDMjcuNDc1OCA0Ni4yNzk1IDI4LjcyNyA0Ni4zNDg4IDMwLjAwMDIgNDYuMzQ4OEM0Ni41Njg0IDQ2LjM0ODggNjAgMzUuOTcyNyA2MCAyMy4xNzQzQzYwIDEwLjM3NjUgNDYuNTY4NCAwIDMwLjAwMDIgMCIgZmlsbD0idmFyKC0tZmlsbC0wLCBibGFjaykiLz4KPC9zdmc+Cg==";
// const naverLogo =
//   "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgdmlld0JveD0iMCAwIDYwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBpZD0iUGF0aCIgZD0iTTQwLjY4NDIgMjcuODlMMTguNDM4MyA2MEgwVjBIMTkuMzE1OFYzMi4xMTVMNDEuNTYxNyAwSDYwVjYwSDQwLjY4NDJWMjcuODlaIiBmaWxsPSJ2YXIoLS1maWxsLTAsIHdoaXRlKSIvPgo8L3N2Zz4K";

function ShareSheetExample() {
  const [open, setOpen] = useState(false);
  const targets = [
    { key: "kakao", label: "카카오톡", logo: kakaoLogo, bg: "#FEE500" },
    { key: "naver", label: "네이버", logo: naverLogo, bg: "#03C75A" },
    {
      key: "copy",
      label: "링크 복사",
      icon: <LinkIcon size={22} color={colors.neutral[700]} />,
      bg: colors.neutral[200],
    },
    {
      key: "save",
      label: "이미지 저장",
      icon: <DownloadIcon size={22} color={colors.neutral[700]} />,
      bg: colors.neutral[200],
    },
  ];

  return (
    <div style={{ width: 360 }}>
      <Button onClick={() => setOpen(true)}>공유하기</Button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="공유하기" closable>
        <div style={shareGridStyle}>
          {targets.map((target) => (
            <button
              key={target.key}
              type="button"
              onClick={() => setOpen(false)}
              style={shareTargetStyle}
            >
              <span style={{ ...shareIconStyle, background: target.bg }}>
                {target.logo ? (
                  <img src={target.logo} alt="" width={22} height={22} />
                ) : (
                  target.icon
                )}
              </span>
              <span style={shareLabelStyle}>{target.label}</span>
            </button>
          ))}
        </div>
        <div style={shareLinkRowStyle}>
          <input
            aria-label="공유 링크"
            readOnly
            value="https://app.nudge.health/contents/abc123"
            style={shareLinkInputStyle}
          />
          <button type="button" onClick={() => undefined} style={shareCopyButtonStyle}>
            복사
          </button>
        </div>
        <div style={shareNoteStyle}>외부 SDK 호출은 각 버튼의 onClick 에서 직접 연결합니다.</div>
      </BottomSheet>
    </div>
  );
}

const shareGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "var(--semantic-gap-comfortable)",
  marginTop: 8,
};

const shareTargetStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "var(--semantic-gap-default)",
  padding: "var(--semantic-inset-chip)",
  border: "none",
  background: "transparent",
  borderRadius: 12,
};

const shareIconStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 9999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const shareLabelStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.3,
  color: "var(--nds-text-normal, #1c1c1c)",
  textAlign: "center",
};

const shareLinkRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--semantic-gap-default)",
  marginTop: 16,
  padding: "var(--semantic-inset-chip) var(--semantic-inset-input)",
  background: "var(--nds-surface-section, #f6f7f8)",
  borderRadius: 12,
};

const shareLinkInputStyle: React.CSSProperties = {
  flex: 1,
  border: "none",
  background: "transparent",
  minWidth: 0,
  font: "inherit",
};

const shareCopyButtonStyle: React.CSSProperties = {
  height: 32,
  padding: "0 var(--semantic-inset-input)",
  border: "none",
  borderRadius: 9999,
  background: "var(--nds-surface-inverse, #222)",
  color: "white",
  font: "inherit",
  fontWeight: 600,
};

const shareNoteStyle: React.CSSProperties = {
  marginTop: 12,
  fontSize: 12,
  lineHeight: 1.5,
  color: "var(--nds-text-subtle, #666)",
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

export const ShareSheet: Story = {
  name: "Recipe/Share Sheet (SNS 공유)",
  render: () => <ShareSheetExample />,
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

    // ESC 직전에 루트를 잡아둔다 — 닫힘 애니메이션이 끝나면 DOM에서 제거되므로
    const root = document.body.querySelector(".nds-bottom-sheet__root");
    await expect(root).toBeInTheDocument();

    // ESC 누르면 closing 상태로 전환 (분리된 노드에도 마지막 속성이 남는다)
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(root).toHaveAttribute("data-closing", "true");
    });

    // closing 애니메이션이 완료되면 시트가 DOM에서 제거된다
    await waitFor(() => {
      expect(document.body.querySelector(".nds-bottom-sheet__root")).not.toBeInTheDocument();
    });
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
