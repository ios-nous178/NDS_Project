import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Button, Popup, type PopupProps } from "@nudge-design/react";
import { resolveActionsLayout } from "@nudge-design/tokens";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

/** 정적 프리뷰용 — 현재 브랜드 기본 버튼 배치(data-layout)를 실제 컴포넌트와 동일하게 해석. */
function currentActionsLayout(): "split" | "end" {
  const brand =
    typeof document !== "undefined" ? document.documentElement.getAttribute("data-brand") : null;
  return resolveActionsLayout(brand);
}

const meta: Meta<PopupProps> = {
  title: "Components/Overlay/Popup",
  component: Popup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Popup"),
      },
    },
  },
  argTypes: {
    isMaskClose: { control: "boolean" },
    actionsLayout: {
      control: "radio",
      options: [undefined, "split", "end"],
      description: "버튼 배치. 생략 시 브랜드 기본(캐포비=end, 그 외=split).",
    },
  },
  args: {
    title: "알림",
    description: "정말 삭제하시겠습니까?",
    confirmText: "확인",
    cancelText: "취소",
    isMaskClose: true,
  },
};

export default meta;
type Story = StoryObj<PopupProps>;

/* ─── Overview ─── 첫 화면 = 열린 팝업 예시(클릭 불필요). 갤러리 프리뷰로도 그대로 재사용.
   Popup 은 body 로 portal 되므로 카드 안에서는 실제 nds-popup__* 클래스로 열린 형태를 정적 렌더. */
export const Overview: Story = {
  name: "Overview",
  tags: ["gallery"],
  render: () => (
    <div className="nds-popup__content" data-slot="content" style={{ width: 224, margin: "0 auto" }}>
      <div className="nds-popup__text" data-slot="text-info">
        <h3 className="nds-popup__title" data-slot="title">
          정말 삭제할까요?
        </h3>
        <p className="nds-popup__description" data-slot="description">
          이 작업은 되돌릴 수 없습니다.
        </p>
      </div>
      <div
        className="nds-popup__actions"
        data-slot="actions"
        data-layout={currentActionsLayout()}
        data-single="false"
      >
        <button type="button" className="nds-popup__btn nds-popup__btn--cancel">
          취소
        </button>
        <button type="button" className="nds-popup__btn nds-popup__btn--confirm">
          삭제
        </button>
      </div>
    </div>
  ),
};

/* ─── Playground ─── */

function PopupExample(args: React.ComponentProps<typeof Popup>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>팝업 열기</Button>
      <Popup
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

export const Playground: Story = {
  render: (args) => <PopupExample {...args} />,
};

/* ─── Single / Dual Action ───────────────────────────────────────────────
   docs(개요)에서 클릭 없이 바로 UI 가 보이도록, 포털/오버레이 없이 컴포넌트와 동일한
   DS 클래스(nds-popup__*)로 카드만 인라인 렌더한다 — styles.css 가 그대로 적용되므로
   브랜드 툴바를 cashwalk-biz 로 두면 우측 hug pill 확인창으로 보인다.
   (실제 열림/포커스/Esc 동작은 Playground·Interaction 스토리 참고.) */

function PopupStaticPreview({
  title,
  description,
  confirmText,
  cancelText,
}: {
  title: string;
  description: React.ReactNode;
  confirmText: string;
  cancelText?: string;
}) {
  const dual = cancelText != null;
  return (
    <div className="nds-popup__content" style={{ margin: "0 auto" }}>
      <div className="nds-popup__text">
        <p className="nds-popup__title">{title}</p>
        <p className="nds-popup__description">{description}</p>
      </div>
      <div
        className="nds-popup__actions"
        data-layout={currentActionsLayout()}
        data-single={dual ? undefined : "true"}
      >
        {dual && (
          <button type="button" className="nds-popup__btn nds-popup__btn--cancel">
            {cancelText}
          </button>
        )}
        <button type="button" className="nds-popup__btn nds-popup__btn--confirm">
          {confirmText}
        </button>
      </div>
    </div>
  );
}

export const SingleAction: Story = {
  name: "State/Single Action",
  render: () => (
    <PopupStaticPreview
      title="수정 완료"
      description="수정이 완료되었습니다. 검수 후 반영됩니다."
      confirmText="확인"
    />
  ),
};

export const DualAction: Story = {
  name: "State/Dual Action",
  render: () => (
    <PopupStaticPreview
      title="변경하시겠습니까?"
      description="변경 시 상태 반영에 최대 5분까지 소요될 수 있습니다."
      cancelText="취소"
      confirmText="변경"
    />
  ),
};

/* ─── Alert Only (확인 버튼만) ─── */

function AlertOnlyExample(args: React.ComponentProps<typeof Popup>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>알림 팝업 열기</Button>
      <Popup
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

export const AlertOnly: Story = {
  name: "State/Alert Only",
  args: {
    title: "저장 완료",
    description: "변경 내용이 정상적으로 저장되었습니다.",
    confirmText: "확인",
    cancelText: undefined,
  },
  render: (args) => <AlertOnlyExample {...args} />,
};

/* ─── No Title (Description Only) ─── */

function NoTitleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>타이틀 없는 팝업</Button>
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        description="로그인 세션이 만료되었습니다. 다시 로그인해주세요."
        confirmText="로그인"
      />
    </>
  );
}

export const NoTitle: Story = {
  name: "State/No Title Description Only",
  render: () => <NoTitleDemo />,
};

/* ─── Long Description ─── */

function LongDescriptionDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>긴 설명 팝업</Button>
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="서비스 이용 안내"
        description={
          <>
            상담 서비스는 평일 09:00~18:00에 이용 가능합니다.
            <br />
            주말 및 공휴일에는 긴급 상담만 운영됩니다.
            <br />
            예약 변경은 상담 24시간 전까지 가능하며,
            <br />
            취소 시 포인트가 환불됩니다.
          </>
        }
        cancelText="닫기"
        confirmText="이해했습니다"
      />
    </>
  );
}

export const LongDescription: Story = {
  name: "State/Long Description",
  render: () => <LongDescriptionDemo />,
};

/* ─── Custom Max Width ─── */

function CustomMaxWidthDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>넓은 팝업 (500px)</Button>
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="상담 프로그램 소개"
        description="EAP(Employee Assistance Program)는 임직원과 가족의 심리, 법률, 재무, 건강 등 다양한 문제에 대해 전문가의 상담을 제공하는 프로그램입니다."
        maxWidth={500}
        cancelText="닫기"
        confirmText="자세히 보기"
      />
    </>
  );
}

export const CustomMaxWidth: Story = {
  name: "State/Custom Max Width",
  render: () => <CustomMaxWidthDemo />,
};

/* ─── No Mask Close ─── */

function NoMaskCloseDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>오버레이 닫기 비활성</Button>
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="중요 안내"
        description="이 팝업은 배경을 클릭해도 닫히지 않습니다. 반드시 버튼을 눌러주세요."
        confirmText="확인"
        isMaskClose={false}
      />
    </>
  );
}

export const NoMaskClose: Story = {
  name: "State/Mask Close Disabled",
  render: () => <NoMaskCloseDemo />,
};

/* ─── Compound API ─── */

function CompoundDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Compound API 팝업</Button>
      <Popup.Root open={open} onClose={() => setOpen(false)}>
        <Popup.Overlay />
        <Popup.Content>
          <Popup.TextInfo>
            <Popup.Title>Compound API</Popup.Title>
            <Popup.Description>
              Compound API를 사용하면 팝업의 각 영역을 자유롭게 커스터마이즈할 수 있습니다.
            </Popup.Description>
          </Popup.TextInfo>
          <Popup.Actions>
            <Popup.CancelButton onClick={() => setOpen(false)}>닫기</Popup.CancelButton>
            <Popup.ConfirmButton onClick={() => setOpen(false)}>확인</Popup.ConfirmButton>
          </Popup.Actions>
        </Popup.Content>
      </Popup.Root>
    </>
  );
}

export const CompoundAPI: Story = {
  name: "Recipe/Compound API",
  render: () => <CompoundDemo />,
};

/* ─── Destructive Confirm (삭제/위험 작업) ─── */

function DestructiveConfirmDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>삭제 확인 팝업</Button>
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          alert("삭제되었습니다");
          setOpen(false);
        }}
        title="상담 기록 삭제"
        description="삭제된 기록은 복구할 수 없습니다. 정말 삭제하시겠습니까?"
        cancelText="취소"
        confirmText="삭제"
        isMaskClose={false}
        slotProps={{
          confirmButton: {
            style: { backgroundColor: "#F13F00" },
          },
        }}
      />
    </>
  );
}

export const DestructiveConfirm: Story = {
  name: "Recipe/Destructive Confirm",
  render: () => <DestructiveConfirmDemo />,
};

/* ─── Counseling Confirm ─── */

function CounselingConfirmDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>상담 확인 팝업 열기</Button>
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="상담 신청 확인"
        description={
          <>
            전문 상담사와의 상담을 신청하시겠습니까?
            <br />
            신청 후에는 상담 일정 안내를 받아볼 수 있습니다.
          </>
        }
        cancelText="다음에 하기"
        confirmText="신청하기"
        isMaskClose={false}
      />
    </>
  );
}

export const CounselingConfirmExample: Story = {
  name: "Recipe/Counseling Confirm",
  render: () => <CounselingConfirmDemo />,
};

/* ─── Reward Guide ─── */

function RewardGuideDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        리워드 안내 팝업 열기
      </Button>
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="챌린지 참여 보상 지급 완료!"
        description={
          <>
            지급된 쿠폰은 팀워크 쿠폰함에서
            <br />
            확인하실 수 있습니다.
          </>
        }
        confirmText="쿠폰함 가기"
        slotProps={{
          confirmButton: {
            style: {
              backgroundColor: "#FFC303",
              color: "#111111",
            },
          },
        }}
      />
    </>
  );
}

export const RewardGuideExample: Story = {
  name: "Recipe/Reward Guide",
  render: () => <RewardGuideDemo />,
};

/* ─── Interaction Tests ─── */

export const ConfirmCancelInteraction: Story = {
  name: "Interaction/Confirm And Cancel",
  tags: ["!dev", "!autodocs"],
  render: (args) => <PopupExample {...args} />,
  args: {
    title: "삭제 확인",
    description: "정말 삭제하시겠습니까?",
    confirmText: "삭제",
    cancelText: "취소",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "팝업 열기" }));
    await expect(within(document.body).getByText("정말 삭제하시겠습니까?")).toBeInTheDocument();

    const confirmButton = within(document.body).getByRole("button", { name: "삭제" });
    await expect(confirmButton).toBeInTheDocument();

    const cancelButton = within(document.body).getByRole("button", { name: "취소" });
    await user.click(cancelButton);
  },
};

export const AlertDismissInteraction: Story = {
  name: "Interaction/Alert Dismiss",
  tags: ["!dev", "!autodocs"],
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>알림 열기</Button>
        <Popup
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          title="저장 완료"
          description="변경 내용이 저장되었습니다."
          confirmText="확인"
        />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "알림 열기" }));
    await expect(
      within(document.body).getByText("변경 내용이 저장되었습니다."),
    ).toBeInTheDocument();

    await user.click(within(document.body).getByRole("button", { name: "확인" }));
  },
};

export const AccessibilityBehaviorInteraction: Story = {
  name: "Interaction/Accessibility Behavior",
  tags: ["!dev", "!autodocs"],
  render: (args) => <PopupExample {...args} />,
  args: {
    title: "접근성 확인",
    description: "포커스와 ARIA 속성을 검증합니다.",
    confirmText: "확인",
    cancelText: "취소",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const trigger = canvas.getByRole("button", { name: "팝업 열기" });

    await user.click(trigger);

    const dialog = within(document.body).getByRole("alertdialog", { name: "접근성 확인" });
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(within(dialog).getByText("포커스와 ARIA 속성을 검증합니다.")).toBeInTheDocument();
  },
};

export const EscapeClosesInteraction: Story = {
  name: "Interaction/Escape Closes",
  tags: ["!dev", "!autodocs"],
  render: (args) => <PopupExample {...args} />,
  args: {
    title: "Escape 테스트",
    description: "Escape 키로 닫히는지 확인합니다.",
    confirmText: "확인",
    cancelText: "취소",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "팝업 열기" }));
    await expect(
      within(document.body).getByText("Escape 키로 닫히는지 확인합니다."),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
  },
};

export const FocusReturnInteraction: Story = {
  name: "Interaction/Focus Return To Trigger",
  tags: ["!dev", "!autodocs"],
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>포커스 복원 테스트</Button>
        <Popup
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          title="포커스 복원"
          description="닫은 후 트리거로 포커스가 돌아갑니다."
          confirmText="확인"
        />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();
    const trigger = canvas.getByRole("button", { name: "포커스 복원 테스트" });

    await user.click(trigger);
    await user.click(within(document.body).getByRole("button", { name: "확인" }));

    await expect(trigger).toHaveFocus();
  },
};

export const NoMaskCloseInteraction: Story = {
  name: "Interaction/Mask Close Disabled",
  tags: ["!dev", "!autodocs"],
  render: () => <NoMaskCloseDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    await user.click(canvas.getByRole("button", { name: "오버레이 닫기 비활성" }));
    await expect(
      within(document.body).getByText(
        "이 팝업은 배경을 클릭해도 닫히지 않습니다. 반드시 버튼을 눌러주세요.",
      ),
    ).toBeInTheDocument();

    const overlay = document.body.querySelector('[data-slot="overlay"]');
    if (!(overlay instanceof HTMLElement)) {
      throw new Error("Popup overlay not found");
    }

    await user.click(overlay);
    await expect(
      within(document.body).getByText(
        "이 팝업은 배경을 클릭해도 닫히지 않습니다. 반드시 버튼을 눌러주세요.",
      ),
    ).toBeInTheDocument();

    await user.click(within(document.body).getByRole("button", { name: "확인" }));
  },
};
