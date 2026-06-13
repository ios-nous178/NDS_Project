import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, waitFor } from "storybook/test";
import { Badge, Button, Modal, type ModalProps } from "@nudge-design/react";
import { cv, resolveActionsLayout } from "@nudge-design/tokens";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

/** 정적 프리뷰용 — 현재 브랜드 기본 버튼 배치(data-layout)를 실제 컴포넌트와 동일하게 해석. */
function currentActionsLayout(): "split" | "end" {
  const brand =
    typeof document !== "undefined" ? document.documentElement.getAttribute("data-brand") : null;
  return resolveActionsLayout(brand);
}

/* Modal 은 createPortal 로 document.body 에 mount 되므로 캐스케이드를
   적용하려면 <html data-brand="cashwalk-biz"> 가 필요. 캐포비 admin 스토리는
   브랜드 툴바와 무관하게 항상 cashwalk-biz 캐스케이드를 보여주기 위해
   documentElement 의 data-brand 를 일시적으로 cashwalk-biz 로 고정한다. */
function useForceCashwalkBizBrand() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute("data-brand");
    root.setAttribute("data-brand", "cashwalk-biz");
    return () => {
      if (prev === null) root.removeAttribute("data-brand");
      else root.setAttribute("data-brand", prev);
    };
  }, []);
}

const flatModalSource = `import { useState } from "react";
import { Button, Modal } from "@nudge-design/react";

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
import { Badge, Button, Modal } from "@nudge-design/react";

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
              gap: "var(--semantic-gap-default)",
              borderBottom: "1px solid #ECECEC",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 18 }}>알림</span>
            <Badge variant="fill" color="brand">
              NEW
            </Badge>
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
import { Button, Modal } from "@nudge-design/react";

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
              padding: "var(--semantic-inset-modal) var(--semantic-inset-card) var(--semantic-inset-card-large)",
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
import { Button, Modal } from "@nudge-design/react";

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
import { Button, Modal } from "@nudge-design/react";

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>앱 다운로드 모달 보기</Button>
      <Modal.Root open={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content maxWidth={296}>
          <Modal.Body style={{ padding: "32px 24px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-default)" }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                상담은 앱에서만 진행할 수 있습니다.
              </h2>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                앱에서 더 편리하게 상담사님과 메시지를 주고받고, 상담 일정을 조율할 수 있어요
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ padding: "var(--semantic-inset-card)" }}>
            <Button fullWidth>앱에서 상담하기</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}`;

const participateRewardSource = `import { useState } from "react";
import { Button, Modal } from "@nudge-design/react";

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
  title: "Components/Overlay/Modal",
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
  argTypes: {
    actionsLayout: {
      control: "radio",
      options: [undefined, "split", "end"],
      description: "푸터 버튼 배치. 생략 시 브랜드 기본(캐포비=end, 그 외=split).",
    },
  },
};

export default meta;
type Story = StoryObj<ModalProps>;

/* ─── Overview ─── 첫 화면 = 열린 모달 예시(클릭 불필요). 갤러리 프리뷰로도 그대로 재사용.
   Modal 은 body 로 portal 되므로 카드 안에서는 실제 nds-modal__* 클래스로 열린 형태를 정적 렌더. */
export const Overview: Story = {
  name: "Overview",
  tags: ["gallery"],
  render: () => (
    <div className="nds-modal__content" style={{ width: 244, margin: "0 auto" }}>
      <div className="nds-modal__header" data-slot="header" data-has-title="true">
        <span aria-hidden className="nds-modal__header-spacer" data-slot="header-spacer" />
        <h3 className="nds-modal__header-title">알림</h3>
        <button type="button" aria-hidden tabIndex={-1} className="nds-modal__close" data-slot="close">
          ✕
        </button>
      </div>
      <div className="nds-modal__body" data-slot="body">
        저장한 내용을 적용할까요?
      </div>
      <div
        className="nds-modal__footer"
        data-slot="footer"
        data-layout={currentActionsLayout()}
        data-has-both-actions="true"
      >
        <button type="button" className="nds-modal__footer-action nds-modal__footer-cancel">
          취소
        </button>
        <button type="button" className="nds-modal__footer-action nds-modal__footer-confirm">
          확인
        </button>
      </div>
    </div>
  ),
};

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
              gap: "var(--semantic-gap-default)",
              borderBottom: "1px solid #ECECEC",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 18, color: "#111111" }}>알림</span>
            <Badge variant="fill" color="brand">
              NEW
            </Badge>
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
                  color: cv.textRole.subtle,
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
                padding: "var(--semantic-inset-input)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", gap: "var(--semantic-gap-default)", marginTop: 20 }}>
              <Button
                variant="solid"
                size="md"
                fullWidth
                style={{ backgroundColor: cv.textRole.muted, borderColor: cv.textRole.muted }}
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
              padding:
                "var(--semantic-inset-modal) var(--semantic-inset-card) var(--semantic-inset-card-large)",
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
              color: cv.textRole.subtle,
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
            padding: "var(--semantic-inset-input)",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "flex", gap: "var(--semantic-gap-default)", marginTop: 20 }}>
          <Button
            variant="solid"
            size="md"
            fullWidth
            style={{ backgroundColor: cv.textRole.muted, borderColor: cv.textRole.muted }}
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
              color: cv.textRole.subtle,
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
            padding: "var(--semantic-inset-input)",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "flex", gap: "var(--semantic-gap-default)", marginTop: 20 }}>
          <Button
            variant="solid"
            size="md"
            fullWidth
            style={{ backgroundColor: cv.textRole.muted, borderColor: cv.textRole.muted }}
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--semantic-gap-default)",
              }}
            >
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
          <Modal.Footer style={{ padding: "var(--semantic-inset-card)" }}>
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--semantic-gap-comfortable)",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: 14, color: "#999999" }}>
            지급된 쿠폰은 팀워크 쿠폰함에서
            <br />
            확인하실 수 있습니다.
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-default)" }}
          >
            {participateRewards.map((reward) => (
              <div
                key={reward.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--semantic-gap-default)",
                  padding: "var(--semantic-inset-chip) 0",
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

/* ─── CashwalkBiz Admin Modal (Figma 3418:471) ─────────────────
   "Cashwalk for Business ModalGuide" — admin 데스크톱 다이얼로그.
   480px / radius 16 / padding 32 / pill 44px / Title2 좌측 정렬.
   4가지 슬롯 기반 패턴: Single / Dual / With Close / Confirm+Slot. */

function CashwalkBizSingleActionExample() {
  useForceCashwalkBizBrand();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="neutral" variant="solid" onClick={() => setOpen(true)}>
        ① Single Action 열기
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="수정 완료"
        confirmText="확인"
        onConfirm={(close) => close()}
      >
        수정이 완료되었습니다.
        <br />
        검수 후 퀴즈에 반영됩니다.
      </Modal>
    </>
  );
}

function CashwalkBizDualActionExample() {
  useForceCashwalkBizBrand();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="neutral" variant="solid" onClick={() => setOpen(true)}>
        ② Dual Action 열기
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="쿠폰 노출 여부를 변경하시겠습니까?"
        closeText="취소"
        confirmText="변경"
        onConfirm={(close) => close()}
      >
        쿠폰 노출 여부를 변경할 경우, 상태 반영에 최대 5분까지 소요될 수 있습니다.
      </Modal>
    </>
  );
}

/* Pattern ③: 헤더 X + 푸터 단일 확인 버튼. flat ModalComponent 는
   `onClose` 를 전달하면 자동으로 cancel 버튼을 만들기 때문에 이 패턴은
   Compound API 로 명시적으로 조립한다. */
function CashwalkBizWithCloseExample() {
  useForceCashwalkBizBrand();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="neutral" variant="solid" onClick={() => setOpen(true)}>
        ③ With Close 열기
      </Button>
      <Modal.Root open={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header title="검수 안내" closable />
          <Modal.Body>
            퀴즈가 등록되었습니다.
            <br />
            등록된 퀴즈는 [퀴즈 목록 &gt; 검수 대기 탭]에서 확인 가능합니다.
          </Modal.Body>
          <Modal.Footer confirmText="확인" onConfirm={() => setOpen(false)} />
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

/* 회귀 가드: 타이틀이 없고 닫기(X)만 있는 모달. 헤더 스페이서가 타이틀과 함께만
   렌더되던 탓에, 타이틀이 없으면 X 가 space-between 에서 좌측으로 떨어지던 버그를 고정한다.
   close 버튼의 margin-left:auto 로 타이틀 유무와 무관하게 항상 우측이어야 한다. */
function CashwalkBizCloseOnlyNoTitleExample() {
  useForceCashwalkBizBrand();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="neutral" variant="solid" onClick={() => setOpen(true)}>
        ⑤ 타이틀 없이 X만 열기
      </Button>
      <Modal.Root open={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header closable />
          <Modal.Body>
            내 정보 페이지로 이동합니다.
            <br />X 버튼은 타이틀이 없어도 항상 우측에 있어야 합니다.
          </Modal.Body>
          <Modal.Footer confirmText="확인" onConfirm={() => setOpen(false)} />
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

function CashwalkBizConfirmSlotExample() {
  useForceCashwalkBizBrand();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <>
      <Button color="neutral" variant="solid" onClick={() => setOpen(true)}>
        ④ Confirm + Slot 열기
      </Button>
      <Modal.Root open={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header title="퀴즈는 진행 중 종료가 불가한 상품입니다." />
          <Modal.Body>
            광고주 요청으로 퀴즈가 강제 종료될 경우, 광고비는 전액 청구되며, 보장된 참여자 수 미달에
            대해서도 환불·보상·재집행은 불가합니다.
          </Modal.Body>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px dashed #EEE",
              backgroundColor: "#FFF",
            }}
          >
            <input
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="강제 종료 사유 입력 (선택)"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "#333",
                backgroundColor: "transparent",
              }}
            />
          </div>
          <Modal.Footer
            onClose={() => setOpen(false)}
            closeText="취소"
            onConfirm={(close) => close()}
            confirmText="강제 종료"
          />
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

export const CashwalkBizAdminSingleAction: Story = {
  name: "Brand/CashwalkBiz Admin · ① Single Action",
  parameters: {
    docs: {
      description: {
        story:
          "캐포비 admin Modal · 1버튼 패턴 (Figma 3418:471 / Cashwalk for Business ModalGuide ①). " +
          "단순 안내 후 확인 1개. 확인 버튼은 우측 정렬 + 120px 고정 폭.",
      },
    },
  },
  render: () => <CashwalkBizSingleActionExample />,
};

export const CashwalkBizAdminDualAction: Story = {
  name: "Brand/CashwalkBiz Admin · ② Dual Action",
  parameters: {
    docs: {
      description: {
        story:
          "캐포비 admin Modal · 취소 + 실행 2버튼 패턴 (Figma 3418:471 ②). " +
          "버튼은 가로 양분, confirm = 검정 CTA, cancel = white + neutral 보더.",
      },
    },
  },
  render: () => <CashwalkBizDualActionExample />,
};

export const CashwalkBizAdminWithClose: Story = {
  name: "Brand/CashwalkBiz Admin · ③ With Close",
  parameters: {
    docs: {
      description: {
        story:
          "캐포비 admin Modal · 헤더 X + 푸터 단일 확인 버튼 (Figma 3418:471 ③). " +
          "헤더 X 와 푸터 cancel 이 중복되지 않도록 Compound API (`Modal.Root` ...) 로 조립.",
      },
    },
  },
  render: () => <CashwalkBizWithCloseExample />,
};

export const CashwalkBizAdminCloseOnlyNoTitle: Story = {
  name: "Brand/CashwalkBiz Admin · ⑤ Close Only (no title)",
  parameters: {
    docs: {
      description: {
        story:
          "타이틀 없이 닫기(X)만 있는 모달 — X 는 항상 우측. 회귀 가드: 타이틀이 없으면 " +
          "헤더 스페이서가 안 그려져 X 가 좌측으로 떨어지던 버그를 close 버튼 margin-left:auto 로 고정.",
      },
    },
  },
  render: () => <CashwalkBizCloseOnlyNoTitleExample />,
};

export const CashwalkBizAdminConfirmSlot: Story = {
  name: "Brand/CashwalkBiz Admin · ④ Confirm + Slot",
  parameters: {
    docs: {
      description: {
        story:
          "캐포비 admin Modal · 본문 + 추가 컨텐츠 슬롯 + 2버튼 (Figma 3418:471 ④). " +
          "Compound API 의 `Modal.Content` 자식으로 슬롯을 끼워 넣으면 gap 20 으로 자동 정렬.",
      },
    },
  },
  render: () => <CashwalkBizConfirmSlotExample />,
};

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

/* ─── Single / Dual Action ───────────────────────────────────────────────
   docs(개요)에서 클릭 없이 바로 UI 가 보이도록, 포털/오버레이 없이 컴포넌트와 동일한
   DS 클래스(nds-modal__*)로 카드만 인라인 렌더한다 — styles.css 가 그대로 적용되므로
   브랜드 툴바를 cashwalk-biz 로 두면 우측 hug pill 푸터로 보인다.
   (실제 열림/포커스/Esc 동작은 State/Default·Interaction 스토리 참고.) */

function ModalStaticPreview({
  title,
  body,
  confirmText,
  cancelText,
}: {
  title: string;
  body: React.ReactNode;
  confirmText: string;
  cancelText?: string;
}) {
  const dual = cancelText != null;
  return (
    <div className="nds-modal__content" style={{ margin: "0 auto" }}>
      <div className="nds-modal__header">
        <h2 className="nds-modal__header-title">{title}</h2>
      </div>
      <div className="nds-modal__body" style={{ textAlign: "left" }}>
        {body}
      </div>
      <div
        className="nds-modal__footer"
        data-layout={currentActionsLayout()}
        data-has-both-actions={dual ? "true" : undefined}
      >
        {dual && (
          <button type="button" className="nds-modal__footer-action nds-modal__footer-cancel">
            {cancelText}
          </button>
        )}
        <button type="button" className="nds-modal__footer-action nds-modal__footer-confirm">
          {confirmText}
        </button>
      </div>
    </div>
  );
}

export const SingleAction: Story = {
  name: "State/Single Action",
  render: () => (
    <ModalStaticPreview
      title="수정 완료"
      body="수정이 완료되었습니다. 검수 후 반영됩니다."
      confirmText="확인"
    />
  ),
};

export const DualAction: Story = {
  name: "State/Dual Action",
  render: () => (
    <ModalStaticPreview
      title="쿠폰 노출 여부를 변경하시겠습니까?"
      body="변경 시 상태 반영에 최대 5분까지 소요될 수 있습니다."
      cancelText="취소"
      confirmText="변경"
    />
  ),
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

    // 확인 버튼이 DOM상 마지막 포커스 대상이므로 Tab은 첫 번째(닫기)로 순환한다
    await user.tab();
    await expect(within(dialog).getByRole("button", { name: "모달 닫기" })).toHaveFocus();

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

    // DOM 순서: 닫기(헤더) → 취소 → 확인. 확인(마지막)에서 Tab은 닫기로 순환.
    await user.tab();
    await expect(closeButton).toHaveFocus();

    await user.tab();
    await expect(cancelButton).toHaveFocus();

    await user.tab();
    await expect(confirmButton).toHaveFocus();

    await user.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(cancelButton).toHaveFocus();
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
