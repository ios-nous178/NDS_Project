import type { Meta, StoryObj } from "@storybook/react";
import { shadow, elevationLevel, zIndex } from "@nudge-eap/tokens";
import React from "react";

/* ─────────────────────────────────────────────────────────────
 * Figma 가이드: ElevationGuide (node 556:2)
 *  - 4 Levels (E0 ~ E3). Shadow는 "떠있음"을 표현하는 수단.
 *  - 기본 UI는 Border, Shadow는 다른 요소 위에 올라가는 경우에만.
 * ───────────────────────────────────────────────────────────── */

interface LevelDef {
  level: "E0" | "E1" | "E2" | "E3";
  key: "0" | "1" | "2" | "3";
  alias: keyof typeof elevationLevel;
  name: string;
  cssVar: string;
  usage: string;
}

const LEVELS: LevelDef[] = [
  {
    level: "E0",
    key: "0",
    alias: "none",
    name: "기본 (Base)",
    cssVar: "var(--shadow-0)",
    usage: "페이지 · Section · 기본 Card",
  },
  {
    level: "E1",
    key: "1",
    alias: "subtle",
    name: "부유 (Subtle)",
    cssVar: "var(--shadow-1)",
    usage: "Card Hover · Sticky Header · Pinned Row",
  },
  {
    level: "E2",
    key: "2",
    alias: "overlay",
    name: "오버레이 (Overlay)",
    cssVar: "var(--shadow-2)",
    usage: "Dropdown · Popover · Tooltip · Datepicker",
  },
  {
    level: "E3",
    key: "3",
    alias: "modal",
    name: "최상위 (Modal)",
    cssVar: "var(--shadow-3)",
    usage: "Modal · Dialog · Bottom Sheet · Toast",
  },
];

function LevelCard({ def }: { def: LevelDef }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "64px 140px 1fr 220px 120px",
        alignItems: "center",
        gap: 20,
        padding: "var(--inset-card-large) 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#111",
          padding: "4px 10px",
          background: "#F5F5F5",
          borderRadius: 8,
          textAlign: "center",
        }}
      >
        {def.level}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{def.name}</div>
        <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
          shadow[&quot;{def.key}&quot;] · elevationLevel.{def.alias}
        </div>
      </div>
      <div style={{ fontSize: 13, color: "#666" }}>{def.usage}</div>
      <code
        style={{
          fontSize: 11,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          color: "#555",
          background: "#FAFAFA",
          padding: "4px var(--inset-chip)",
          borderRadius: 4,
        }}
      >
        {shadow[def.key]}
      </code>
      <div
        style={{
          width: 96,
          height: 56,
          borderRadius: 8,
          background: "#FFF",
          boxShadow: shadow[def.key],
          border: def.key === "0" ? "1px solid #ECECEC" : "none",
        }}
      />
    </div>
  );
}

function ZIndexItem({ token, value }: { token: string; value: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px 80px 1fr",
        alignItems: "center",
        gap: 20,
        padding: "14px 0",
        borderBottom: "1px solid #ECECEC",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: "#111111" }}>zIndex.{token}</div>
      <div style={{ fontSize: 13, color: "#666666" }}>{value}</div>
      <div
        style={{
          width: Math.max(value / 5, 8),
          height: 16,
          borderRadius: 999,
          backgroundColor: "#2B96ED",
        }}
      />
    </div>
  );
}

function GuideBanner() {
  return (
    <div
      style={{
        background: "var(--semantic-bg-status-info, #E3F2FC)",
        color: "var(--semantic-text-status-info, #017EE4)",
        padding: "var(--inset-input) var(--inset-card)",
        borderRadius: 8,
        fontSize: 13,
        lineHeight: 1.5,
        marginBottom: 24,
      }}
    >
      ✅ <strong>Figma 가이드 정합 완료</strong> · 검증일 2026-05-13 ·{" "}
      <a
        href="https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=556-2"
        target="_blank"
        rel="noreferrer"
        style={{ color: "inherit", textDecoration: "underline" }}
      >
        Figma 556:2
      </a>{" "}
      — 4 Levels (E0 ~ E3) 모두 정합 완료.
    </div>
  );
}

function PrinciplesBlock() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "var(--gap-loose)",
        marginBottom: 32,
      }}
    >
      {[
        {
          n: "01",
          title: "기본은 Border",
          desc: "카드·컨테이너 구분은 1px border로 처리. Shadow는 Border의 대안이 아닙니다.",
        },
        {
          n: "02",
          title: "Shadow = 레이어 표현",
          desc: "다른 요소 위에 떠있을 때만 사용. 스타일 장식이나 Hover 강조에 사용 금지.",
        },
        {
          n: "03",
          title: "일관성 유지",
          desc: "동일 역할의 컴포넌트는 항상 동일 Elevation Level을 사용합니다.",
        },
      ].map((p) => (
        <div
          key={p.n}
          style={{
            border: "1px solid #ECECEC",
            borderRadius: 12,
            padding: "var(--inset-card) var(--inset-card-large)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#999",
              marginBottom: 8,
            }}
          >
            {p.n}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 6 }}>
            {p.title}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: "#666" }}>{p.desc}</div>
        </div>
      ))}
    </div>
  );
}

function DoDontBlock() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "var(--gap-loose)",
        marginBottom: 32,
      }}
    >
      <div
        style={{
          border: "1px solid #ECECEC",
          borderRadius: 12,
          padding: "var(--inset-card-large)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "#00A07C", marginBottom: 12 }}>
          ● DO
        </div>
        <ul style={{ fontSize: 13, lineHeight: 1.7, color: "#383838", margin: 0, paddingLeft: 18 }}>
          <li>기본 카드·컨테이너 구분은 1px border로 처리</li>
          <li>Dropdown·Popover는 반드시 var(--shadow-2)</li>
          <li>Modal·Dialog는 반드시 var(--shadow-3)</li>
          <li>동일 역할 컴포넌트는 항상 동일 Elevation Level</li>
          <li>Tooltip에 border + var(--shadow-2) 조합</li>
          <li>Sticky Header는 스크롤 시에만 var(--shadow-1) 활성화</li>
        </ul>
      </div>
      <div
        style={{
          border: "1px solid #ECECEC",
          borderRadius: 12,
          padding: "var(--inset-card-large)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "#F13F00", marginBottom: 12 }}>
          ● Don&apos;t
        </div>
        <ul style={{ fontSize: 13, lineHeight: 1.7, color: "#383838", margin: 0, paddingLeft: 18 }}>
          <li>Hover 시 shadow 레벨을 급변경 (E0 → E2 급등)</li>
          <li>장식 목적의 과도한 shadow (버튼·텍스트·아이콘)</li>
          <li>동일 화면에 서로 다른 Elevation 혼재</li>
          <li>Shadow만으로 Border 없이 Card 경계 표현</li>
          <li>E3 초과 레벨을 임의로 생성</li>
          <li>모든 컴포넌트에 shadow를 default로 적용</li>
        </ul>
      </div>
    </div>
  );
}

function ElevationTokensPage() {
  return (
    <div
      style={{
        fontFamily: "'Pretendard', sans-serif",
        padding: "var(--inset-modal)",
        backgroundColor: "#FFFFFF",
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#111111" }}>
        Elevation Tokens
      </h2>
      <p style={{ fontSize: 14, lineHeight: "20px", color: "#666666", marginBottom: 24 }}>
        요소가 화면 위에 얼마나 떠있는지를 표현하는 레이어 시스템입니다. Shadow는 시각 효과가 아닌
        정보 위계를 명시하기 위해 사용하며, 최소한으로 적용합니다.
      </p>

      <GuideBanner />

      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111111" }}>
        개념 원칙
      </h3>
      <PrinciplesBlock />

      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111111" }}>
        Level별 정의
      </h3>
      <div style={{ marginBottom: 40 }}>
        {LEVELS.map((def) => (
          <LevelCard key={def.level} def={def} />
        ))}
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111111" }}>
        DO / Don&apos;t
      </h3>
      <DoDontBlock />

      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111111" }}>Z-Index</h3>
      <div>
        {Object.entries(zIndex).map(([token, value]) => (
          <ZIndexItem key={token} token={token} value={value} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Elevation",
  component: ElevationTokensPage,
};

export default meta;

export const AllElevation: StoryObj = {
  name: "Reference/All Elevation",
};
