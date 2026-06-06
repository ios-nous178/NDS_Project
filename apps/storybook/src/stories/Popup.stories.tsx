import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Button, Popup, type PopupProps } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser } from "./interactionTest";

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
