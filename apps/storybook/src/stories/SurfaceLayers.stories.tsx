import type { Meta, StoryObj } from "@storybook/react";

const LAYERS = [
  {
    label: "L0 기본 surface",
    token: "--semantic-bg-surface-default",
    use: "기본 카드/박스 (Card, Info Box)",
    bg: "var(--semantic-bg-surface-default)",
  },
  {
    label: "L1 페이지 배경",
    token: "--semantic-bg-page-default",
    use: "body, 페이지 전체 배경",
    bg: "var(--semantic-bg-page-default)",
  },
  {
    label: "L2 Subtle BG",
    token: "--semantic-bg-surface-subtle",
    use: "비활성 영역, 표 헤더, 섹션 분리",
    bg: "var(--semantic-bg-surface-subtle)",
  },
  {
    label: "L3 Notice (의미 전달)",
    token: "--semantic-bg-brand-subtle",
    use: "핵심 Notice, 상태성 안내",
    bg: "var(--semantic-bg-brand-subtle)",
  },
];

function LayerSwatch({
  label,
  token,
  use,
  bg,
}: {
  label: string;
  token: string;
  use: string;
  bg: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 240px",
        gap: "var(--semantic-gap-loose)",
        alignItems: "stretch",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          background: bg,
          border: "1px solid #E5E5E5",
          borderRadius: 8,
          padding: "var(--semantic-inset-card)",
          minHeight: 80,
          display: "flex",
          alignItems: "center",
          fontSize: 14,
          color: "#383838",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 12, color: "#666" }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{token}</div>
        <div style={{ color: "#999" }}>{use}</div>
      </div>
    </div>
  );
}

function DoCard() {
  return (
    <div
      style={{
        background: "var(--semantic-bg-brand-subtle)",
        border: "1px solid var(--semantic-border-brand-default)",
        borderRadius: 8,
        padding: "var(--semantic-inset-card)",
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: "#383838", marginBottom: 4 }}>
        위기 상황 안내
      </div>
      <div style={{ fontSize: 13, color: "#666", lineHeight: "20px" }}>
        지금 도움이 필요하신가요? 24시간 상담사가 응대합니다.
      </div>
    </div>
  );
}

function DontCard({ label, body }: { label: string; body: string }) {
  return (
    <div
      style={{
        background: "var(--semantic-bg-brand-subtle)",
        borderRadius: 8,
        padding: "var(--semantic-inset-card)",
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: "#383838", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: "#666", lineHeight: "20px" }}>{body}</div>
    </div>
  );
}

function Banner({ kind, children }: { kind: "good" | "bad"; children: React.ReactNode }) {
  const isGood = kind === "good";
  return (
    <div
      style={{
        display: "inline-flex",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 8,
        background: isGood ? "#E6F9F2" : "#FEE9E6",
        color: isGood ? "#0F8F7A" : "#C03100",
      }}
    >
      {children}
    </div>
  );
}

function SurfacePage() {
  return (
    <div
      style={{
        fontFamily: "'Pretendard', sans-serif",
        padding: "var(--semantic-inset-modal)",
        background: "var(--semantic-bg-page-default)",
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111", marginBottom: 8 }}>
        Surface / Background Layers
      </h2>
      <p style={{ fontSize: 14, lineHeight: "20px", color: "#666", marginBottom: 24 }}>
        4단계 레이어로 표면 위계를 표현한다. Brand background 는 시각 장식이 아니라 의미
        전달(주의·안내·하이라이트) 목적으로만 사용한다.
      </p>

      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 16 }}>
          레이어 정의
        </h3>
        {LAYERS.map((l) => (
          <LayerSwatch key={l.token} {...l} />
        ))}
      </section>

      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 8 }}>
          Brand background 사용 결정 트리
        </h3>
        <ol
          style={{
            fontSize: 13,
            color: "#383838",
            lineHeight: "22px",
            paddingLeft: 20,
            marginBottom: 16,
          }}
        >
          <li>사용자에게 주의 / 안내 / 하이라이트 의미 전달이 필요한가?</li>
          <li>현재 화면에 이미 사용 중인 brand background 가 없는가?</li>
          <li>단순 decoration 목적이 아닌가?</li>
        </ol>
        <p style={{ fontSize: 13, color: "#666" }}>
          → 셋 모두 YES 일 때만 사용. 하나라도 NO 면 --semantic-bg-surface-default 로 처리.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--semantic-gap-wide)",
        }}
      >
        <div>
          <Banner kind="good">DO</Banner>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
            주의/안내 의미가 있고 화면 내 brand bg 가 1개뿐인 경우.
          </p>
          <DoCard />
        </div>
        <div>
          <Banner kind="bad">DON&apos;T</Banner>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
            KPI/summary 카드를 brand bg 로 도배 — 위계가 평탄해진다.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--semantic-gap-default)",
            }}
          >
            <DontCard label="이번 주 상담" body="3회" />
            <DontCard label="다음 일정" body="목 14:00" />
            <DontCard label="평균 만족도" body="4.8 / 5" />
            <DontCard label="미응답" body="1건" />
          </div>
        </div>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Surface",
  component: SurfacePage,
};

export default meta;

export const Layers: StoryObj = {
  name: "Layers & Brand BG Decision",
};
