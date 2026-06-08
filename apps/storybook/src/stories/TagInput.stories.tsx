import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TagInput } from "@nudge-design/react";

/**
 * Components/Inputs/TagInput
 *
 * 기본 `variant="stacked"` — 입력칸 + 우측 추가 버튼, 칩은 아래 wrap (이메일 초대/수신자).
 * `variant="inline"` — 칩이 입력칸 안쪽(tokenfield). `prefix="#"` 로 해시태그식.
 */
const meta: Meta<typeof TagInput> = {
  title: "Components/Inputs/TagInput",
  component: TagInput,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: { control: "inline-radio", options: ["stacked", "inline"] },
  },
};

export default meta;
type Story = StoryObj<typeof TagInput>;

const EMAIL_RE = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$";

/* ─── 1. 이메일 초대 (기본 stacked — 이미지 케이스) ─── */

export const Playground: Story = {
  name: "이메일 초대 (stacked 기본)",
  render: function Render() {
    const [emails, setEmails] = useState<string[]>(["abc1234@google.com", "kim23@cashwalk.io"]);
    return (
      <div style={{ width: 440 }}>
        <TagInput
          label="멤버 초대하기"
          value={emails}
          onValueChange={setEmails}
          placeholder="이메일 주소를 입력해 주세요"
          pattern={EMAIL_RE}
          onInvalid={(v) => alert(`올바른 이메일이 아니에요: ${v}`)}
          maxTags={50}
          onMaxReached={() => alert("최대 50명까지 초대할 수 있어요")}
          helperText="멤버는 최대 50명까지, 한번에 최대 10명까지 초대할 수 있습니다."
          fullWidth
        />
      </div>
    );
  },
};

/* ─── 2. 빈 상태 ─── */

export const Empty: Story = {
  name: "State/빈 상태",
  render: function Render() {
    const [emails, setEmails] = useState<string[]>([]);
    return (
      <div style={{ width: 440 }}>
        <TagInput
          label="멤버 초대하기"
          value={emails}
          onValueChange={setEmails}
          placeholder="이메일 주소를 입력해 주세요"
          pattern={EMAIL_RE}
          fullWidth
        />
      </div>
    );
  },
};

/* ─── 3. 인라인(해시태그) variant ─── */

export const InlineHashtag: Story = {
  name: "Variant/inline (해시태그)",
  render: function Render() {
    const [tags, setTags] = useState<string[]>(["수면", "스트레스"]);
    return (
      <div style={{ width: 360 }}>
        <TagInput
          variant="inline"
          prefix="#"
          label="관심 주제"
          value={tags}
          onValueChange={setTags}
          placeholder="태그 입력 후 Enter"
          maxTags={5}
          helperText="Enter 또는 , 로 구분 · 최대 5개"
          fullWidth
        />
      </div>
    );
  },
};

/* ─── 4. 에러 ─── */

export const WithError: Story = {
  name: "State/에러",
  render: function Render() {
    const [emails, setEmails] = useState<string[]>([]);
    return (
      <div style={{ width: 440 }}>
        <TagInput
          label="필수 멤버"
          value={emails}
          onValueChange={setEmails}
          placeholder="이메일 주소를 입력해 주세요"
          error
          helperText="최소 1명 이상 입력해주세요"
          fullWidth
        />
      </div>
    );
  },
};

/* ─── 5. Disabled ─── */

export const Disabled: Story = {
  name: "State/Disabled",
  render: () => (
    <div style={{ width: 440 }}>
      <TagInput
        label="초대 완료 (수정 불가)"
        value={["abc1234@google.com", "kim23@cashwalk.io"]}
        onValueChange={() => undefined}
        disabled
        fullWidth
      />
    </div>
  ),
};
