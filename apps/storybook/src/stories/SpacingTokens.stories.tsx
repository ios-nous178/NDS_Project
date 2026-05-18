import type { Meta, StoryObj } from "@storybook/react";
import { spacing, gap, inset } from "@nudge-eap/tokens";

const GAP_INTENT: Record<string, { intent: string; use: string }> = {
  tight: { intent: "tight", use: "Chip · Badge 그룹" },
  default: { intent: "default ★", use: "표준 컴포넌트 gap" },
  comfortable: { intent: "comfortable", use: "폼 필드 · 세그먼트" },
  loose: { intent: "loose", use: "컴포넌트 ↔ 컴포넌트" },
  wide: { intent: "wide", use: "큰 영역 ↔ 큰 영역" },
};

const INSET_USAGE: Record<string, { use: string; star?: boolean }> = {
  chip: { use: "Chip · Badge 내부" },
  input: { use: "Input · 작은 컨테이너" },
  card: { use: "카드 표준 padding", star: true },
  "card-large": { use: "큰 카드" },
  modal: { use: "Modal · 통계 박스" },
};

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 80px 1fr 260px",
        alignItems: "center",
        gap: 20,
        padding: "14px 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      {children}
    </div>
  );
}

function SpacingItem({ token, value }: { token: string; value: number }) {
  return (
    <Row>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>spacing.{token}</div>
      <div style={{ fontSize: 13, color: "#666666" }}>{value}px</div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--gap-loose)" }}>
        <div
          style={{
            width: value,
            height: 16,
            minWidth: value,
            backgroundColor: "#2B96ED",
            borderRadius: 999,
          }}
        />
        <div style={{ fontSize: 12, color: "#999999" }}>Visual width sample</div>
      </div>
      <div />
    </Row>
  );
}

function GapItem({
  name,
  value,
  intent,
  use,
}: {
  name: string;
  value: number;
  intent: string;
  use: string;
}) {
  return (
    <Row>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>--gap-{name}</div>
      <div style={{ fontSize: 13, color: "#666666" }}>{value}px</div>
      <div style={{ display: "flex", alignItems: "center", gap: `var(--gap-${name})` }}>
        <span style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: "#2B96ED" }} />
        <span style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: "#2B96ED" }} />
        <span style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: "#2B96ED" }} />
      </div>
      <div style={{ fontSize: 12, color: "#666666" }}>
        <div style={{ fontWeight: 600 }}>{intent}</div>
        <div style={{ color: "#999999" }}>{use}</div>
      </div>
    </Row>
  );
}

function InsetItem({
  name,
  value,
  use,
  star,
}: {
  name: string;
  value: number;
  use: string;
  star?: boolean;
}) {
  return (
    <Row>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>
        --inset-{name}
        {star ? " ★" : ""}
      </div>
      <div style={{ fontSize: 13, color: "#666666" }}>{value}px</div>
      <div>
        <div
          style={{
            display: "inline-block",
            padding: `var(--inset-${name})`,
            backgroundColor: "#F1F8FD",
            border: "1px dashed #2B96ED",
            borderRadius: 4,
          }}
        >
          <div
            style={{
              width: 80,
              height: 16,
              backgroundColor: "#2B96ED",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#999999" }}>{use}</div>
    </Row>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111111", margin: "32px 0 4px" }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: "#666666", margin: "0 0 16px" }}>{description}</p>
      <Row>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#999999", letterSpacing: 0.4 }}>
          TOKEN
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#999999", letterSpacing: 0.4 }}>
          VALUE
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#999999", letterSpacing: 0.4 }}>
          VISUAL
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#999999", letterSpacing: 0.4 }}>
          INTENT / USE
        </div>
      </Row>
      {children}
    </section>
  );
}

function SpacingTokensPage() {
  return (
    <div
      style={{
        fontFamily: "'Pretendard', sans-serif",
        padding: "var(--inset-modal)",
        backgroundColor: "#FFFFFF",
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#111111" }}>
        Spacing Tokens
      </h2>
      <p style={{ fontSize: 14, lineHeight: "20px", color: "#666666", marginBottom: 8 }}>
        4pt grid 기반. Gap(요소 간 거리)과 Inset(컨테이너 내부 여백)을 구분하고 항상 semantic 토큰을
        사용한다.
      </p>
      <p style={{ fontSize: 13, lineHeight: "20px", color: "#999999", marginBottom: 32 }}>
        Primitive(--spacing-N)는 직접 사용하지 말 것. 자세히는 get_guide(&#123; topic:
        &quot;pattern:semantic-spacing&quot; &#125;).
      </p>

      <Section
        title="Gap — 요소 간 거리 (의도 기반)"
        description="flex/grid 의 gap 또는 sibling 간 거리에 사용. 5단계만 사용."
      >
        {Object.entries(gap).map(([name, value]) => (
          <GapItem
            key={name}
            name={name}
            value={value as number}
            intent={GAP_INTENT[name]?.intent ?? name}
            use={GAP_INTENT[name]?.use ?? ""}
          />
        ))}
      </Section>

      <Section
        title="Inset — 컨테이너 내부 여백 (사용처 기반)"
        description="padding 에 사용. 컨테이너 종류에 따라 한 가지 토큰만 매핑."
      >
        {Object.entries(inset).map(([name, value]) => (
          <InsetItem
            key={name}
            name={name}
            value={value as number}
            use={INSET_USAGE[name]?.use ?? ""}
            star={INSET_USAGE[name]?.star}
          />
        ))}
      </Section>

      <Section
        title="Primitive Spacing (참고용)"
        description="토큰 정의용 raw 스케일. UI 코드에서는 직접 사용 금지 — gap/inset semantic 을 거칠 것."
      >
        {Object.entries(spacing).map(([token, value]) => (
          <SpacingItem key={token} token={token} value={value} />
        ))}
      </Section>
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Spacing",
  component: SpacingTokensPage,
};

export default meta;

export const AllSpacing: StoryObj = {
  name: "Reference/All Spacing",
};
