import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, Radio, Toggle } from "@nudge-eap/react";
import { colors } from "@nudge-eap/tokens";

/**
 * Figma `Controls` 가이드(171:9904) 정합 스토리.
 * Radio · Checkbox · Toggle 세 가지 선택 컨트롤을 한 페이지에 모아 보여줍니다.
 */
const meta: Meta = {
  title: "Components/Controls Guide",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Figma `Controls` 가이드(171:9904)와 정합되는 통합 미리보기. Radio(단일 선택), Checkbox(다중/독립 선택), Toggle(즉시 켜기/끄기) 컨트롤의 상태·스펙·사용 규칙을 한 페이지에 모았습니다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* ────────────────────────────────────────────
 * 공용 레이아웃
 * ──────────────────────────────────────────── */

function GuideSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "24px 0",
        borderTop: `1px solid ${colors.neutral[100]}`,
      }}
    >
      <header>
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{title}</h3>
        {description && (
          <p
            style={{
              fontSize: 14,
              color: colors.neutral[700],
              margin: "4px 0 0",
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}

function StateRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 28 }}>
      <div style={{ width: 36, display: "flex", justifyContent: "center" }}>{children}</div>
      <span style={{ fontSize: 14, color: colors.neutral[800] }}>{label}</span>
    </div>
  );
}

function SpecTable({ rows }: { rows: { key: string; value: string }[] }) {
  return (
    <table
      style={{
        width: "100%",
        maxWidth: 420,
        borderCollapse: "collapse",
        fontSize: 13,
        background: colors.neutral["00"],
        border: `1px solid ${colors.neutral[100]}`,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <tbody>
        {rows.map((row, idx) => (
          <tr
            key={row.key}
            style={{
              borderTop: idx === 0 ? "none" : `1px solid ${colors.neutral[100]}`,
            }}
          >
            <td
              style={{
                padding: "8px 12px",
                color: colors.neutral[700],
                fontWeight: 500,
                width: 160,
              }}
            >
              {row.key}
            </td>
            <td style={{ padding: "8px 12px", color: colors.neutral[900] }}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OverviewCard({
  title,
  description,
  bullet,
}: {
  title: string;
  description: string;
  bullet: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        background: colors.neutral[50],
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <h4 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h4>
      <p style={{ fontSize: 13, color: colors.neutral[700], margin: 0, lineHeight: 1.6 }}>
        {description}
      </p>
      <div
        style={{
          marginTop: "auto",
          paddingTop: 8,
          fontSize: 12,
          color: colors.neutral[600],
        }}
      >
        → {bullet}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
 * Type Overview
 * ════════════════════════════════════════════ */

export const TypeOverview: Story = {
  name: "Guide/Type Overview",
  render: () => (
    <GuideSection
      title="Type Overview"
      description="Radio · Checkbox · Toggle 세 가지 선택 컨트롤 컴포넌트입니다. 각각 단일 선택, 다중 선택, 기능 켜기/끄기 용도에 맞게 사용합니다."
    >
      <div style={{ display: "flex", gap: 16, width: "100%", maxWidth: 1300 }}>
        <OverviewCard
          title="Radio Button"
          description="여러 옵션 중 단 하나만 선택. 상담 신청서의 성별, 상담 유형 선택에 사용."
          bullet="단일 선택 (mutually exclusive)"
        />
        <OverviewCard
          title="Checkbox"
          description="독립적인 항목을 하나 이상 선택. 약관 동의, 설정 항목 활성화에 사용."
          bullet="다중 선택 / 독립 항목 토글"
        />
        <OverviewCard
          title="Toggle"
          description="기능을 켜거나 끄는 스위치. CMS 설정, 앱 알림 관리 등에 사용."
          bullet="즉각적 켜기/끄기"
        />
      </div>
    </GuideSection>
  ),
};

/* ════════════════════════════════════════════
 * Radio
 * ════════════════════════════════════════════ */

function RadioExampleGender() {
  const [value, setValue] = useState("self");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
      <strong style={{ fontSize: 14 }}>성별*</strong>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {[
          { v: "self", label: "본인" },
          { v: "infant", label: "영유아" },
          { v: "child", label: "아동" },
          { v: "youth", label: "청소년" },
          { v: "adult", label: "성인" },
        ].map((opt) => (
          <Radio
            key={opt.v}
            checked={value === opt.v}
            onCheckedChange={(c) => c && setValue(opt.v)}
            label={opt.label}
          />
        ))}
      </div>
    </div>
  );
}

export const RadioStates: Story = {
  name: "Radio/States + 사용 예시",
  render: () => (
    <GuideSection
      title="Radio Button"
      description="여러 옵션 중 반드시 하나만 선택해야 할 때 사용합니다. 같은 그룹 내에서는 하나를 선택하면 나머지는 자동으로 해제됩니다."
    >
      <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 220 }}>
          <strong style={{ fontSize: 14 }}>States</strong>
          <StateRow label="Default (Unselected)">
            <Radio checked={false} onCheckedChange={() => undefined} />
          </StateRow>
          <StateRow label="Selected">
            <Radio checked onCheckedChange={() => undefined} />
          </StateRow>
          <StateRow label="Disabled (Unselected)">
            <Radio checked={false} disabled onCheckedChange={() => undefined} />
          </StateRow>
          <StateRow label="Disabled (Selected)">
            <Radio checked disabled onCheckedChange={() => undefined} />
          </StateRow>
        </div>
        <div>
          <strong style={{ fontSize: 14 }}>사용 예시 — 상담 신청서 성별 선택</strong>
          <div style={{ marginTop: 12 }}>
            <RadioExampleGender />
          </div>
        </div>
      </div>
    </GuideSection>
  ),
};

export const RadioSpecs: Story = {
  name: "Radio/Specs",
  render: () => (
    <GuideSection title="Radio · Specs">
      <SpecTable
        rows={[
          { key: "크기", value: "20 × 20px (아이콘 기준)" },
          { key: "터치 영역", value: "최소 44 × 44px (모바일)" },
          { key: "선택 표시", value: "내부 원 10px, fillBrand 색상" },
          { key: "Unselected", value: "border 2px, borderNormal" },
          { key: "Selected", value: "border 2px + 내부 원, fillBrand" },
          { key: "Disabled", value: "배경/텍스트 모두 연회색 (borderDisabled / textDisabled)" },
          { key: "레이블 간격", value: "아이콘과 12px" },
          { key: "사용처", value: "성별 · 상담 유형 · 단일 선택 옵션" },
        ]}
      />
    </GuideSection>
  ),
};

/* ════════════════════════════════════════════
 * Checkbox
 * ════════════════════════════════════════════ */

function CheckboxExampleAgreement() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(true);
  const [c, setC] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
      <Checkbox checked={a} onCheckedChange={setA} label="[필수] 서비스 이용약관 동의" />
      <Checkbox checked={b} onCheckedChange={setB} label="[필수] 개인정보 처리방침 동의" />
      <Checkbox checked={c} onCheckedChange={setC} label="[선택] 마케팅 정보 수신 동의" />
    </div>
  );
}

function CheckboxIndeterminateExample() {
  const [items, setItems] = useState({ a: true, b: false, c: false });
  const checkedCount = Object.values(items).filter(Boolean).length;
  const allChecked = checkedCount === 3;
  const indeterminate = checkedCount > 0 && !allChecked;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        onCheckedChange={(c) => setItems({ a: c, b: c, c })}
        label={`전체 선택 (${checkedCount}/3)`}
      />
      <div
        style={{
          paddingLeft: 32,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          borderLeft: `1px solid ${colors.neutral[100]}`,
          marginLeft: 10,
        }}
      >
        <Checkbox
          checked={items.a}
          onCheckedChange={(c) => setItems((s) => ({ ...s, a: c }))}
          label="알림 받기"
        />
        <Checkbox
          checked={items.b}
          onCheckedChange={(c) => setItems((s) => ({ ...s, b: c }))}
          label="뉴스레터 구독"
        />
        <Checkbox
          checked={items.c}
          onCheckedChange={(c) => setItems((s) => ({ ...s, c }))}
          label="이벤트 정보 수신"
        />
      </div>
    </div>
  );
}

export const CheckboxStates: Story = {
  name: "Checkbox/States + 사용 예시",
  render: () => (
    <GuideSection
      title="Checkbox"
      description="독립적인 항목을 선택하거나 해제할 때 사용합니다. 여러 항목을 동시에 선택할 수 있으며, 각 항목은 서로 독립적입니다."
    >
      <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 220 }}>
          <strong style={{ fontSize: 14 }}>States</strong>
          <StateRow label="Unchecked">
            <Checkbox checked={false} onCheckedChange={() => undefined} />
          </StateRow>
          <StateRow label="Checked">
            <Checkbox checked onCheckedChange={() => undefined} />
          </StateRow>
          <StateRow label="Indeterminate">
            <Checkbox indeterminate onCheckedChange={() => undefined} />
          </StateRow>
          <StateRow label="Disabled (Unchecked)">
            <Checkbox checked={false} disabled onCheckedChange={() => undefined} />
          </StateRow>
          <StateRow label="Disabled (Checked)">
            <Checkbox checked disabled onCheckedChange={() => undefined} />
          </StateRow>
        </div>
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          <div>
            <strong style={{ fontSize: 14 }}>사용 예시 — 약관 동의</strong>
            <div style={{ marginTop: 12 }}>
              <CheckboxExampleAgreement />
            </div>
          </div>
          <div>
            <strong style={{ fontSize: 14 }}>사용 예시 — 부분 선택(Indeterminate)</strong>
            <div style={{ marginTop: 12 }}>
              <CheckboxIndeterminateExample />
            </div>
          </div>
        </div>
      </div>
    </GuideSection>
  ),
};

export const CheckboxSpecs: Story = {
  name: "Checkbox/Specs",
  render: () => (
    <GuideSection title="Checkbox · Specs">
      <SpecTable
        rows={[
          { key: "크기", value: "20 × 20px (아이콘 기준)" },
          { key: "터치 영역", value: "최소 44 × 44px (모바일)" },
          { key: "Radius", value: "4px" },
          { key: "Unchecked", value: "border 2px, borderNormal" },
          { key: "Checked", value: "fillBrand 배경, 흰색 체크 아이콘" },
          { key: "Indeterminate", value: "fillBrand 배경, 흰색 가로선 (부분 선택)" },
          { key: "Disabled", value: "배경/텍스트 모두 연회색 (borderDisabled / textDisabled)" },
          { key: "사용처", value: "약관 동의 · 다중 항목 선택 · 필터" },
        ]}
      />
    </GuideSection>
  ),
};

/* ════════════════════════════════════════════
 * Toggle
 * ════════════════════════════════════════════ */

function ToggleExampleNotifications() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [marketing, setMarketing] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 240 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14 }}>푸시 알림</span>
        <Toggle checked={push} onCheckedChange={setPush} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14 }}>이메일 알림</span>
        <Toggle checked={email} onCheckedChange={setEmail} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14 }}>마케팅 알림</span>
        <Toggle checked={marketing} onCheckedChange={setMarketing} />
      </div>
    </div>
  );
}

export const ToggleStates: Story = {
  name: "Toggle/States + 사용 예시",
  render: () => (
    <GuideSection
      title="Toggle"
      description="기능의 켜기/끄기를 즉각적으로 전환할 때 사용합니다. 상태 변경이 즉시 적용되며 별도의 확인 없이 동작합니다."
    >
      <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 220 }}>
          <strong style={{ fontSize: 14 }}>States</strong>
          <StateRow label="Off">
            <Toggle checked={false} onCheckedChange={() => undefined} />
          </StateRow>
          <StateRow label="On">
            <Toggle checked onCheckedChange={() => undefined} />
          </StateRow>
          <StateRow label="Disabled (Off)">
            <Toggle checked={false} disabled onCheckedChange={() => undefined} />
          </StateRow>
          <StateRow label="Disabled (On)">
            <Toggle checked disabled onCheckedChange={() => undefined} />
          </StateRow>
        </div>
        <div>
          <strong style={{ fontSize: 14 }}>사용 예시 — 알림 설정</strong>
          <div style={{ marginTop: 12 }}>
            <ToggleExampleNotifications />
          </div>
        </div>
      </div>
    </GuideSection>
  ),
};

export const ToggleSpecs: Story = {
  name: "Toggle/Specs",
  render: () => (
    <GuideSection title="Toggle · Specs">
      <SpecTable
        rows={[
          { key: "Track 크기", value: "44 × 24px" },
          { key: "Thumb 크기", value: "18 × 18px, 원형" },
          { key: "Off 색상", value: "borderNormal (중립)" },
          { key: "On 색상", value: "fillBrand" },
          { key: "Thumb", value: "흰색, drop shadow 적용" },
          { key: "Disabled", value: "borderDisabled 고정, 인터랙션 없음" },
          { key: "전환 애니메이션", value: "thumb 슬라이드 (0.2s)" },
          { key: "사용처", value: "알림 설정 · CMS 기능 활성화" },
        ]}
      />
    </GuideSection>
  ),
};

/* ════════════════════════════════════════════
 * When to use? — 비교표
 * ════════════════════════════════════════════ */

export const WhenToUse: Story = {
  name: "Guide/언제 어떤 컨트롤?",
  render: () => (
    <GuideSection
      title="언제 어떤 컨트롤을 쓸까?"
      description="선택 모델·관계·즉시성 기준으로 비교합니다."
    >
      <table
        style={{
          width: "100%",
          maxWidth: 900,
          borderCollapse: "collapse",
          fontSize: 14,
          background: colors.neutral["00"],
          border: `1px solid ${colors.neutral[100]}`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: colors.neutral[50] }}>
            {["구분", "Radio Button", "Checkbox", "Toggle"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 14px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: colors.neutral[800],
                  fontSize: 13,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            {
              k: "선택 수",
              r: "반드시 1개만 선택",
              c: "0개 이상 여러 개 선택",
              t: "2가지 상태 (On/Off)",
            },
            {
              k: "선택 관계",
              r: "항목 간 상호 배타",
              c: "항목 간 독립적",
              t: "단일 항목",
            },
            {
              k: "즉각 적용",
              r: "그룹 내 다른 항목 해제",
              c: "해당 항목만 토글",
              t: "즉시 상태 변경",
            },
            {
              k: "사용 예시",
              r: "성별, 상담 유형 선택",
              c: "약관 동의, 다중 필터",
              t: "알림 켜기/끄기",
            },
          ].map((row) => (
            <tr key={row.k} style={{ borderTop: `1px solid ${colors.neutral[100]}` }}>
              <td
                style={{
                  padding: "10px 14px",
                  fontWeight: 500,
                  color: colors.neutral[700],
                  width: 110,
                }}
              >
                {row.k}
              </td>
              <td style={{ padding: "10px 14px", color: colors.neutral[900] }}>{row.r}</td>
              <td style={{ padding: "10px 14px", color: colors.neutral[900] }}>{row.c}</td>
              <td style={{ padding: "10px 14px", color: colors.neutral[900] }}>{row.t}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </GuideSection>
  ),
};

/* ════════════════════════════════════════════
 * DO / Don't
 * ════════════════════════════════════════════ */

function GuideCard({
  variant,
  title,
  items,
}: {
  variant: "do" | "dont";
  title: string;
  items: string[];
}) {
  const isDo = variant === "do";
  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        borderRadius: 12,
        background: isDo ? "#EAF8F0" : "#FCEEEE",
        border: `1px solid ${isDo ? "#9BD9B3" : "#F0B1B1"}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: isDo ? "#1F9D55" : "#D44848",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {isDo ? "✓" : "✕"}
        </span>
        <strong style={{ fontSize: 14 }}>{title}</strong>
      </div>
      <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item) => (
          <li key={item} style={{ fontSize: 13, color: colors.neutral[800], lineHeight: 1.6 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const DoDont: Story = {
  name: "Guide/DO & Don't",
  render: () => (
    <GuideSection title="DO / Don't">
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <GuideCard
          variant="do"
          title="DO"
          items={[
            "Radio는 그룹 내 항목이 2개 이상일 때 사용하세요. 단일 항목이면 Toggle을 고려하세요.",
            "Checkbox에는 반드시 레이블 텍스트를 함께 제공하세요.",
            "Toggle 변경은 즉각 반영되므로, 민감한 기능에는 변경 전 확인 Dialog를 추가하세요.",
          ]}
        />
        <GuideCard
          variant="dont"
          title="Don't"
          items={[
            "같은 그룹 안에서 Radio와 Checkbox를 혼용하지 마세요.",
            "두 가지 중 하나를 선택하는 경우라도 Toggle로 대체하지 마세요. Toggle은 켜기/끄기 전용입니다.",
            "Radio 그룹에서 기본 선택 없이 빈 상태로 두지 마세요. 반드시 하나를 초기값으로 설정하세요.",
          ]}
        />
      </div>
    </GuideSection>
  ),
};
