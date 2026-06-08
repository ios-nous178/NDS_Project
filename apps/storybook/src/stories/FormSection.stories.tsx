import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FormSection, FormField, Input, Select } from "@nudge-design/react";

/**
 * FormSection — 제목 + 보더 카드로 여러 `FormField` 를 묶는 폼 그룹 컨테이너.
 *
 * 캐시워크 for Business 어드민 폼 표준 (Figma InputGuide 3080:741 · FormSection 3466:17405):
 *   - 제목 Headline3 24 Bold + (옵션) 설명
 *   - 카드: white bg · 1px border(#EEE) · radius 16(브랜드 cascade) · 좌우 padding 24
 *   - 본문은 `FormField density="admin"` 행을 쌓아 세로 리듬(py-24)을 만든다.
 *   - 입력 너비는 `fieldWidth` 스케일(xs~xl/full) 사용 — 인라인 width 금지.
 */
const meta: Meta<typeof FormSection> = {
  title: "Components/FormSection",
  component: FormSection,
  parameters: { layout: "padded" },
  globals: { brand: "cashwalk-biz" },
};
export default meta;
type Story = StoryObj<typeof FormSection>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <FormSection title="기본 정보" description="계정 식별 정보를 입력하세요.">
        <FormField label="계정명" density="admin" labelPosition="left">
          <Input placeholder="입력해 주세요" fieldWidth="lg" />
        </FormField>
        <FormField label="담당자" density="admin" labelPosition="left">
          <Input placeholder="입력해 주세요" fieldWidth="md" />
        </FormField>
        <FormField label="구분" density="admin" labelPosition="left">
          <Select
            fieldWidth="sm"
            value=""
            onValueChange={() => {}}
            placeholder="선택해 주세요"
            options={[
              { value: "a", label: "일반" },
              { value: "b", label: "프리미엄" },
            ]}
          />
        </FormField>
      </FormSection>
    </div>
  ),
};

export const MultipleSections: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
      <FormSection title="기본 정보">
        <FormField label="계정명" density="admin" labelPosition="left">
          <Input placeholder="입력해 주세요" fieldWidth="lg" />
        </FormField>
      </FormSection>
      <FormSection title="연락처" description="알림이 발송되는 채널입니다.">
        <FormField label="이메일" density="admin" labelPosition="left">
          <Input placeholder="name@company.com" fieldWidth="lg" />
        </FormField>
        <FormField label="전화번호" density="admin" labelPosition="left">
          <Input placeholder="010-0000-0000" fieldWidth="md" />
        </FormField>
      </FormSection>
    </div>
  ),
};
