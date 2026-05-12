import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, waitFor } from "storybook/test";
import { Badge, Button, Modal, type ModalProps } from "@nudge-eap/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

const flatModalSource = `import { useState } from "react";
import { Button, Modal } from "@nudge-eap/react";

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>모달 열기</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="상담 안내"
        closable
        closeText="취소"
        confirmText="확인"
        onConfirm={(close) => close()}
      >
        전문 상담사와의 상담을 예약하시겠습니까?
      </Modal>
    </>
  );
}`;

const compoundModalSource = `import { useState } from "react";
import { Badge, Button, Modal } from "@nudge-eap/react";

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>커스텀 모달 열기</Button>
      <Modal.Root open={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content maxWidth={400}>
          <Modal.Header
            style={{
              justifyContent: "flex-start",
              gap: 8,
              borderBottom: "1px solid #ECECEC",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 18 }}>알림</span>
            <Badge variant="primary">NEW</Badge>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "left" }}>
            Compound API를 사용하면 슬롯을 자유롭게 조립할 수 있습니다.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" fullWidth onClick={() => setOpen(false)}>
              나중에 하기
            </Button>
            <Button fullWidth onClick={() => setOpen(false)}>
              지금 확인
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}`;

const slotPropsSource = `import { useState } from "react";
import { Button, Modal } from "@nudge-eap/react";

export function Example() {
  const [open, setOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("집중 업무 BGM");

  return (
    <>
      <Button onClick={() => setOpen(true)}>slotProps 버전 보기</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        showModalButtonGroup={false}
        maxWidth={300}
        slotProps={{
          content: {
            style: { ["--nds-modal-radius" as string]: "12px" },
          },
          body: {
            style: {
              padding: "24px 16px 20px",
              textAlign: "left",
            },
          },
        }}
      >
        <input
          type="text"
          value={playlistName}
          onChange={(event) => setPlaylistName(event.target.value)}
        />
      </Modal>
    </>
  );
}`;

const classNameSource = `import { useState } from "react";
import { Button, Modal } from "@nudge-eap/react";

export function Example() {
  const [open, setOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("주말 드라이브");

  return (
    <>
      <Button onClick={() => setOpen(true)}>className 버전 보기</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        showModalButtonGroup={false}
        maxWidth={300}
        contentClassName="webview-playlist-edit-modal-class"
        bodyClassName="webview-playlist-edit-modal-class__body"
        contentStyle={{ ["--nds-modal-radius" as string]: "12px" }}
      >
        <input
          type="text"
          value={playlistName}
          onChange={(event) => setPlaylistName(event.target.value)}
        />
      </Modal>
    </>
  );
}`;

const counselingAppDownloadSource = `import { useState } from "react";
import { Button, Modal } from "@nudge-eap/react";

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>앱 다운로드 모달 보기</Button>
      <Modal.Root open={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content maxWidth={296}>
          <Modal.Body style={{ padding: "32px 24px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                상담은 앱에서만 진행할 수 있습니다.
              </h2>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                앱에서 더 편리하게 상담사님과 메시지를 주고받고, 상담 일정을 조율할 수 있어요
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ padding: 16 }}>
            <Button fullWidth>앱에서 상담하기</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}`;

const participateRewardSource = `import { useState } from "react";
import { Button, Modal } from "@nudge-eap/react";

const rewards = [
  { imageUrl: "https://placehold.co/40x40", title: "스타벅스 아메리카노 T" },
  { imageUrl: "https://placehold.co/40x40", title: "배달의민족 1만원권" },
  { imageUrl: "https://placehold.co/40x40", title: "팀워크 포인트 3,000P" },
];

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>참여 보상 모달 보기</Button>
      <Modal open={open} onClose={() => setOpen(false)} closeText="확인" confirmText="쿠폰함가기">
        ...
      </Modal>
    </>
  );
}`;

const meta: Meta<ModalProps> = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Modal"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<ModalProps>;

function FlatModalExample({
  bodyText = "전문 상담사와의 상담을 예약하시겠습니까?",
  ...args
}: Omit<ModalProps, "children"> & { bodyText?: ModalProps["children"] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>모달 열기</Button>
      <Modal {...args} open={open} onClose={() => setOpen(false)}>
        {bodyText}
      </Modal>
    </>
  );
}

function CompoundModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>커스텀 모달 열기</Button>
      <Modal.Root open={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content maxWidth={400}>
          <Modal.Header
            style={{
              justifyContent: "flex-start",
              gap: 8,
              borderBottom: "1px solid #ECECEC",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 18, color: "#111111" }}>알림</span>
            <Badge variant="primary">NEW</Badge>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "left" }}>
            <p style={{ marginTop: 0 }}>
              Compound API를 사용하면 헤더와 바디, 푸터를 자유롭게 조립할 수 있습니다.
            </p>
            <p style={{ marginBottom: 0 }}>
              배지, 버튼 그룹, 텍스트 정렬 같은 커스텀도 스토리북에서 바로 확인할 수 있습니다.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" fullWidth onClick={() => setOpen(false)}>
              나중에 하기
            </Button>
            <Button fullWidth onClick={() => setOpen(false)}>
              지금 확인
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

function PlaylistEditModalUIExample() {
  const [open, setOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("퇴근길 플레이리스트");

  return (
    <>
      <Button onClick={() => setOpen(true)}>플레이리스트 수정 UI 보기</Button>
      <Modal.Root open={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content
          maxWidth={300}
          className="webview-playlist-edit-modal"
          style={{ ["--nds-modal-radius" as string]: "12px" }}
        >
          <Modal.Body style={{ padding: "24px 16px 20px", textAlign: "left" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 16,
                fontSize: 14,
                fontWeight: 500,
                color: "#111827",
              }}
            >
              <p style={{ margin: 0 }}>리스트 이름</p>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  letterSpacing: "-0.6px",
                  color: "#6B7280",
                }}
              >
                {playlistName.length}/25 자
              </p>
            </div>

            <input
              type="text"
              value={playlistName}
              onChange={(event) => setPlaylistName(event.target.value)}
              maxLength={25}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 8,
                border: "1px solid #D1D5DB",
                padding: 12,
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <Button
                variant="solid"
                size="md"
                fullWidth
                style={{ backgroundColor: "#6B7280", borderColor: "#6B7280" }}
                onClick={() => setOpen(false)}
              >
                취소
              </Button>
              <Button size="md" fullWidth onClick={() => setOpen(false)}>
                확인
              </Button>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

function PlaylistEditModalSlotPropsExample() {
  const [open, setOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("집중 업무 BGM");

  return (
    <>
      <Button onClick={() => setOpen(true)}>slotProps 버전 보기</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        showModalButtonGroup={false}
        maxWidth={300}
        slotProps={{
          content: {
            className: "webview-playlist-edit-modal-slot-props",
            style: { ["--nds-modal-radius" as string]: "12px" },
          },
          body: {
            style: {
              padding: "24px 16px 20px",
              textAlign: "left",
            },
          },
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 500,
            color: "#111827",
          }}
        >
          <p style={{ margin: 0 }}>리스트 이름</p>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              letterSpacing: "-0.6px",
              color: "#6B7280",
            }}
          >
            {playlistName.length}/25 자
          </p>
        </div>

        <input
          type="text"
          value={playlistName}
          onChange={(event) => setPlaylistName(event.target.value)}
          maxLength={25}
          style={{
            width: "100%",
            height: 48,
            borderRadius: 8,
            border: "1px solid #D1D5DB",
            padding: 12,
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <Button
            variant="solid"
            size="md"
            fullWidth
            style={{ backgroundColor: "#6B7280", borderColor: "#6B7280" }}
            onClick={() => setOpen(false)}
          >
            취소
          </Button>
          <Button size="md" fullWidth onClick={() => setOpen(false)}>
            확인
          </Button>
        </div>
      </Modal>
    </>
  );
}

function PlaylistEditModalClassNameExample() {
  const [open, setOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("주말 드라이브");

  return (
    <>
      <Button onClick={() => setOpen(true)}>className 버전 보기</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        showModalButtonGroup={false}
        maxWidth={300}
        contentClassName="webview-playlist-edit-modal-class"
        bodyClassName="webview-playlist-edit-modal-class__body"
        contentStyle={{ ["--nds-modal-radius" as string]: "12px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 500,
            color: "#111827",
          }}
        >
          <p style={{ margin: 0 }}>리스트 이름</p>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              letterSpacing: "-0.6px",
              color: "#6B7280",
            }}
          >
            {playlistName.length}/25 자
          </p>
        </div>

        <input
          type="text"
          value={playlistName}
          onChange={(event) => setPlaylistName(event.target.value)}
          maxLength={25}
          style={{
            width: "100%",
            height: 48,
            borderRadius: 8,
            border: "1px solid #D1D5DB",
            padding: 12,
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <Button
            variant="solid"
            size="md"
            fullWidth
            style={{ backgroundColor: "#6B7280", borderColor: "#6B7280" }}
            onClick={() => setOpen(false)}
          >
            취소
          </Button>
          <Button size="md" fullWidth onClick={() => setOpen(false)}>
            확인
          </Button>
        </div>
      </Modal>
    </>
  );
}

const participateRewards = [
  { title: "스타벅스 아메리카노 T", color: "#DCEEFF" },
  { title: "배달의민족 1만원권", color: "#FFE9F0" },
  { title: "팀워크 포인트 3,000P", color: "#FFF4CC" },
];

function CounselingAppDownloadModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>앱 다운로드 모달 보기</Button>
      <Modal.Root open={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content maxWidth={296}>
          <Modal.Body style={{ padding: "32px 24px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: "#383838",
                }}
              >
                상담은 앱에서만 진행할 수 있습니다.
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "#383838",
                }}
              >
                앱에서 더 편리하게 상담사님과 메시지를 주고받고, 상담 일정을 조율할 수 있어요
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ padding: 16 }}>
            <Button fullWidth>앱에서 상담하기</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

function ParticipateRewardModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        참여 보상 모달 보기
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeText="확인"
        confirmText="쿠폰함가기"
        onConfirm={(close) => close()}
        isMaskClose={false}
        title="챌린지 참여 보상 지급 완료!"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 14, color: "#999999" }}>
            지급된 쿠폰은 팀워크 쿠폰함에서
            <br />
            확인하실 수 있습니다.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {participateRewards.map((reward) => (
              <div
                key={reward.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 0",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: reward.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 500, color: "#383838" }}>
                  {reward.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── Figma Spec (612:18421 / 171:9947) ─── */

const MODAL_SPEC_ROWS: Array<{ key: string; value: string }> = [
  { key: "콘텐츠 너비", value: "PC 332px / Mobile 294px (device prop으로 분기)" },
  { key: "콘텐츠 패딩", value: "상 28 / 좌우 16 / 하 16" },
  { key: "콘텐츠 라운드", value: "8px (--nds-modal-radius)" },
  { key: "콘텐츠 그림자", value: "shadow.md (디자인 토큰)" },
  { key: "본문 그룹 ↔ 푸터 간격", value: "24px (gap 8 + body margin-bottom 16)" },
  { key: "이미지/타이틀/본문 내부 gap", value: "8px" },
  { key: "푸터 버튼 padding / radius / gap", value: "11/24 · 8 · 8" },
  { key: "푸터 버튼 font", value: "15 / 22 (확인 700, 취소 500)" },
];

export const FigmaSpec: Story = {
  name: "Spec/✓ Figma Synced (612:18421)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 컴포넌트(612:18421) 및 라이브러리 노드(171:9947) 실측 기반 모달 스펙. 코드는 `packages/react/src/Modal.tsx`에서 단일 소스로 관리됩니다.",
      },
    },
  },
  render: () => (
    <table
      style={{
        borderCollapse: "collapse",
        fontFamily: "Pretendard, sans-serif",
        fontSize: 13,
        minWidth: 520,
      }}
    >
      <thead>
        <tr style={{ background: "#F5F5F5" }}>
          <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
            항목
          </th>
          <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
            값
          </th>
        </tr>
      </thead>
      <tbody>
        {MODAL_SPEC_ROWS.map((row) => (
          <tr key={row.key}>
            <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5", fontWeight: 600 }}>
              {row.key}
            </td>
            <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5" }}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Default: Story = {
  name: "State/Default",
  args: {
    title: "상담 안내",
    closable: true,
    closeText: "취소",
    confirmText: "확인",
    onConfirm: (close) => close(),
  },
  render: (args) => <FlatModalExample {...args} />,
  parameters: {
    docs: {
      source: {
        code: flatModalSource,
      },
    },
  },
};

export const CompoundCustom: Story = {
  name: "Recipe/Compound Custom",
  render: () => <CompoundModalExample />,
  parameters: {
    docs: {
      source: {
        code: compoundModalSource,
      },
    },
  },
};

export const HomePageCounselingAppDownload: Story = {
  name: "Recipe/Homepage Counseling App Download",
  render: () => <CounselingAppDownloadModalExample />,
  parameters: {
    docs: {
      source: {
        code: counselingAppDownloadSource,
      },
    },
  },
};

export const WebViewParticipateReward: Story = {
  name: "Recipe/WebView Participate Reward",
  render: () => <ParticipateRewardModalExample />,
  parameters: {
    docs: {
      source: {
        code: participateRewardSource,
      },
    },
  },
};

export const WebViewCompatibility: Story = {
  name: "Recipe/WebView Compatibility",
  args: {
    closable: true,
    closeText: "아니오",
    confirmText: "예",
    onConfirm: (close) => close(),
  },
  render: (args) => (
    <FlatModalExample
      {...args}
      bodyText={
        <div style={{ padding: "10px 0" }}>
          기존 WebView 프로젝트와 호환되는 props 구조를 기준으로 확인합니다.
        </div>
      }
    />
  ),
};

export const WebViewPlaylistEditUI: Story = {
  name: "Recipe/WebView Playlist Edit UI",
  render: () => <PlaylistEditModalUIExample />,
  parameters: {
    docs: {
      source: {
        code: compoundModalSource,
      },
    },
  },
};

export const WebViewPlaylistEditWithSlotProps: Story = {
  name: "Recipe/WebView Playlist Edit With Slot Props",
  render: () => <PlaylistEditModalSlotPropsExample />,
  parameters: {
    docs: {
      source: {
        code: slotPropsSource,
      },
    },
  },
};

export const WebViewPlaylistEditWithClassNames: Story = {
  name: "Recipe/WebView Playlist Edit With Class Names",
  render: () => <PlaylistEditModalClassNameExample />,
  parameters: {
    docs: {
      source: {
        code: classNameSource,
      },
    },
  },
};

export const OpenAndCloseInteraction: Story = {
  name: "Interaction/Open And Close",
  args: {
    title: "예약 확인",
    closable: true,
    closeText: "아니오",
    confirmText: "예",
    onConfirm: (close) => close(),
  },
  render: (args) => <FlatModalExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "모달 열기" }));
    await expect(
      within(document.body).getByText("전문 상담사와의 상담을 예약하시겠습니까?"),
    ).toBeInTheDocument();
    await user.click(within(document.body).getByRole("button", { name: "아니오" }));
  },
};

export const AccessibilityBehavior: Story = {
  name: "Interaction/Accessibility Behavior",
  args: {
    title: "접근성 확인",
    closable: true,
    closeText: "취소",
    confirmText: "확인",
    onConfirm: (close) => close(),
  },
  render: (args) => <FlatModalExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const trigger = canvas.getByRole("button", { name: "모달 열기" });

    await user.click(trigger);

    const dialog = within(document.body).getByRole("dialog", { name: "접근성 확인" });
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(
      within(dialog).getByText("전문 상담사와의 상담을 예약하시겠습니까?"),
    ).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole("button", { name: "확인" });
    await expect(confirmButton).toHaveFocus();

    await user.tab();
    await expect(within(dialog).getByRole("button", { name: "취소" })).toHaveFocus();

    await user.keyboard("{Escape}");
    await expect(trigger).toHaveFocus();
  },
};

export const FocusTrapLoop: Story = {
  name: "Interaction/Focus Trap Loop",
  args: {
    title: "포커스 트랩 확인",
    closable: true,
    closeText: "취소",
    confirmText: "확인",
    onConfirm: (close) => close(),
  },
  render: (args) => <FlatModalExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "모달 열기" }));

    const dialog = within(document.body).getByRole("dialog", { name: "포커스 트랩 확인" });
    const confirmButton = within(dialog).getByRole("button", { name: "확인" });
    const cancelButton = within(dialog).getByRole("button", { name: "취소" });
    const closeButton = within(dialog).getByRole("button", { name: "모달 닫기" });

    await expect(confirmButton).toHaveFocus();

    await user.tab();
    await expect(cancelButton).toHaveFocus();

    await user.tab();
    await expect(closeButton).toHaveFocus();

    await user.tab();
    await expect(confirmButton).toHaveFocus();

    await user.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(closeButton).toHaveFocus();
  },
};

export const MaskCloseDisabled: Story = {
  name: "Interaction/Mask Close Disabled",
  args: {
    title: "오버레이 닫기 비활성",
    closable: true,
    closeText: "취소",
    confirmText: "확인",
    onConfirm: (close) => close(),
    isMaskClose: false,
  },
  render: (args) => <FlatModalExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "모달 열기" }));

    const dialog = within(document.body).getByRole("dialog", { name: "오버레이 닫기 비활성" });
    await user.click(document.body.querySelector('[data-slot="overlay"]') as Element);
    await expect(dialog).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "모달 닫기" }));
    await expect(
      within(document.body).queryByRole("dialog", { name: "오버레이 닫기 비활성" }),
    ).not.toBeInTheDocument();
  },
};

export const CloseButtonAccessibility: Story = {
  name: "Interaction/Close Button Accessibility",
  args: {
    title: "닫기 버튼 확인",
    closable: true,
    closeText: "취소",
    confirmText: "확인",
    onConfirm: (close) => close(),
  },
  render: (args) => <FlatModalExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const trigger = canvas.getByRole("button", { name: "모달 열기" });

    await user.click(trigger);

    const dialog = within(document.body).getByRole("dialog", { name: "닫기 버튼 확인" });
    const closeButton = within(dialog).getByRole("button", { name: "모달 닫기" });
    await expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);
    await expect(trigger).toHaveFocus();
  },
};

/* ─── Edge Case Tests ─── */

function NestedModalExample() {
  const [outer, setOuter] = useState(false);
  const [inner, setInner] = useState(false);

  return (
    <>
      <Button onClick={() => setOuter(true)}>외부 모달 열기</Button>
      <Modal
        open={outer}
        onClose={() => setOuter(false)}
        title="외부 모달"
        closable
        closeText="취소"
        confirmText="내부 모달 열기"
        onConfirm={() => setInner(true)}
      >
        외부 모달 콘텐츠입니다.
      </Modal>
      <Modal
        open={inner}
        onClose={() => setInner(false)}
        title="내부 모달"
        closable
        confirmText="확인"
        onConfirm={(close) => close()}
      >
        내부 모달 콘텐츠입니다.
      </Modal>
    </>
  );
}

export const NestedModalEdge: Story = {
  name: "Edge/Nested Modal Focus",
  render: () => <NestedModalExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "외부 모달 열기" }));
    const outerDialog = within(document.body).getByRole("dialog", { name: "외부 모달" });
    await expect(outerDialog).toBeInTheDocument();

    await user.click(within(outerDialog).getByRole("button", { name: "내부 모달 열기" }));
    const innerDialog = within(document.body).getByRole("dialog", { name: "내부 모달" });
    await expect(innerDialog).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(
        within(document.body).queryByRole("dialog", { name: "내부 모달" }),
      ).not.toBeInTheDocument();
    });
    await expect(
      within(document.body).getByRole("dialog", { name: "외부 모달" }),
    ).toBeInTheDocument();
  },
};

export const ConfirmCallbackEdge: Story = {
  name: "Edge/Confirm Callback Closes Modal",
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState("");

    return (
      <>
        <Button onClick={() => setOpen(true)}>열기</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="확인 콜백"
          confirmText="저장"
          onConfirm={(close) => {
            setResult("저장 완료");
            close();
          }}
        >
          콜백 테스트
        </Modal>
        {result && <p data-testid="modal-result">{result}</p>}
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "열기" }));
    await user.click(within(document.body).getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(canvas.getByTestId("modal-result")).toHaveTextContent("저장 완료");
    });
    await expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument();
  },
};
