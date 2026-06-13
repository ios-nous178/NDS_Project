import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Drawer,
  Button,
  FormField,
  Input,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
  CheckboxGroup,
} from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/Overlay/Drawer",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Drawer"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function RightExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>오른쪽 Drawer 열기</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        title="상담사 상세"
        description="상담사 정보와 후기를 확인하세요"
        footer={
          <>
            <Button variant="outlined" onClick={() => setOpen(false)} style={{ flex: 1 }}>
              취소
            </Button>
            <Button onClick={() => setOpen(false)} style={{ flex: 1 }}>
              예약하기
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>여기에 상담사 프로필, 전문 분야, 후기 등이 표시됩니다.</p>
      </Drawer>
    </>
  );
}

function LeftNavExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>왼쪽 Drawer (네비)</Button>
      <Drawer open={open} onClose={() => setOpen(false)} side="left" size="sm" title="메뉴">
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {["홈", "상담", "심리검사", "마음일기", "마이페이지"].map((label) => (
            <li
              key={label}
              style={{
                padding: "var(--semantic-inset-input) 0",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  );
}

function FilterExample() {
  const [open, setOpen] = useState(false);
  const [counselorType, setCounselorType] = useState("all");
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        필터
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        size="md"
        title="필터"
        footer={
          <>
            <Button variant="outlined" onClick={() => setOpen(false)} style={{ flex: 1 }}>
              초기화
            </Button>
            <Button onClick={() => setOpen(false)} style={{ flex: 1 }}>
              적용
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-wide)" }}>
          <FormField label="상담사 유형">
            <RadioGroup
              name="counselor-type"
              value={counselorType}
              onValueChange={setCounselorType}
            >
              <RadioGroupItem value="all" label="전체" />
              <RadioGroupItem value="psychologist" label="심리상담사" />
              <RadioGroupItem value="psychiatrist" label="정신과 의사" />
            </RadioGroup>
          </FormField>
          <FormField label="전문 분야">
            <CheckboxGroup>
              <Checkbox label="우울/불안" />
              <Checkbox label="가족/대인관계" />
              <Checkbox label="번아웃/스트레스" />
              <Checkbox label="청소년" />
            </CheckboxGroup>
          </FormField>
          <FormField label="키워드 검색">
            <Input placeholder="이름, 키워드…" />
          </FormField>
        </div>
      </Drawer>
    </>
  );
}

function LargeExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>큰 Drawer (lg)</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title="검사 상세 결과"
        description="검사 일자: 2026-04-30"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}>
          <p>여기에 검사 결과 차트, 해석, 권고사항 등이 표시됩니다.</p>
          <p>스크롤이 필요한 긴 콘텐츠도 잘 처리됩니다.</p>
        </div>
      </Drawer>
    </>
  );
}

export const Right: Story = {
  tags: ["gallery"], name: "오른쪽 (상세)", render: () => <RightExample /> };
export const LeftNav: Story = { name: "왼쪽 (네비게이션)", render: () => <LeftNavExample /> };
export const Filter: Story = { name: "필터 패널", render: () => <FilterExample /> };
export const Large: Story = { name: "Large 사이즈", render: () => <LargeExample /> };
