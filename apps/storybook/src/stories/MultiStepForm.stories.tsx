import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MultiStepForm } from "@nudge-design/react";

const meta: Meta<typeof MultiStepForm> = {
  title: "Components/Layout/MultiStepForm",
  component: MultiStepForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MultiStepForm>;

export const Playground: Story = {
  render: function Render() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [agree, setAgree] = useState(false);

    return (
      <div style={{ width: 480 }}>
        <MultiStepForm
          steps={[
            {
              key: "name",
              title: "이름을 알려주세요",
              description: "상담사가 호칭으로 사용할 이름이에요.",
              canProceed: name.length >= 2,
              content: (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  style={{
                    width: "100%",
                    height: 48,
                    padding: "0 var(--semantic-inset-card)",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    fontSize: 15,
                  }}
                />
              ),
            },
            {
              key: "phone",
              title: "연락처를 입력해주세요",
              description: "인증번호를 받을 번호예요.",
              canProceed: /^010\d{8}$/.test(phone),
              content: (
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  style={{
                    width: "100%",
                    height: 48,
                    padding: "0 var(--semantic-inset-card)",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    fontSize: 15,
                  }}
                />
              ),
            },
            {
              key: "agree",
              title: "약관에 동의해주세요",
              description: "필수 약관 동의 후 가입을 마칠 수 있어요.",
              canProceed: agree,
              content: (
                <label
                  style={{
                    display: "flex",
                    gap: "var(--semantic-gap-default)",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  서비스 이용약관 및 개인정보 처리방침에 동의합니다.
                </label>
              ),
            },
          ]}
          onSubmit={() => alert("가입 완료!")}
        />
      </div>
    );
  },
};

export const ProgressIndicator: Story = {
  tags: ["gallery"],
  name: "Variant/progress 인디케이터 (기본)",
  render: () => (
    <div style={{ width: 480 }}>
      <MultiStepForm
        indicator="progress"
        steps={[1, 2, 3, 4].map((i) => ({
          key: `step-${i}`,
          title: `${i}단계 제목`,
          content: (
            <div
              style={{
                padding: "var(--semantic-inset-modal)",
                background: "#FAFBFC",
                borderRadius: 8,
              }}
            >
              {i}단계 콘텐츠
            </div>
          ),
        }))}
        onSubmit={() => alert("완료")}
      />
    </div>
  ),
};

export const NoIndicator: Story = {
  name: "Variant/인디케이터 없음",
  render: () => (
    <div style={{ width: 480 }}>
      <MultiStepForm
        indicator="none"
        steps={[
          { key: "a", title: "단계 A", content: <div>A 콘텐츠</div> },
          { key: "b", title: "단계 B", content: <div>B 콘텐츠</div> },
        ]}
        onSubmit={() => undefined}
      />
    </div>
  ),
};

export const Submitting: Story = {
  name: "State/제출 중",
  render: function Render() {
    const [submitting, setSubmitting] = useState(false);
    return (
      <div style={{ width: 480 }}>
        <MultiStepForm
          submitting={submitting}
          steps={[
            {
              key: "only",
              title: "마지막 단계",
              content: <div>제출 버튼을 눌러보세요.</div>,
            },
          ]}
          onSubmit={async () => {
            setSubmitting(true);
            await new Promise((r) => setTimeout(r, 1500));
            setSubmitting(false);
          }}
        />
      </div>
    );
  },
};
