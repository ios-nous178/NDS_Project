import type { Meta, StoryObj } from "@storybook/react";
import { grid } from "@nudge-eap/tokens";

function GridColumn({ index, width }: { index: number; width: number }) {
  return (
    <div
      style={{
        backgroundColor: "rgba(43, 150, 237, 0.15)",
        borderRadius: 4,
        height: 320,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 8,
        fontSize: 11,
        color: "#0074D0",
        fontWeight: 600,
        minWidth: 0,
      }}
    >
      {index + 1}
    </div>
  );
}

function GridSpec({
  label,
  spec,
}: {
  label: string;
  spec: typeof grid.mobile | typeof grid.desktop;
}) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#111111",
          marginBottom: 8,
        }}
      >
        {label}
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "140px 1fr",
          gap: "var(--gap-default) var(--gap-wide)",
          marginBottom: 24,
          fontSize: 14,
        }}
      >
        <span style={{ color: "#666666" }}>Columns</span>
        <span style={{ fontWeight: 600 }}>{spec.columns}</span>
        <span style={{ color: "#666666" }}>Margin</span>
        <span style={{ fontWeight: 600 }}>{spec.margin}px</span>
        <span style={{ color: "#666666" }}>Gutter</span>
        <span style={{ fontWeight: 600 }}>{spec.gutter}px</span>
        <span style={{ color: "#666666" }}>Content Width</span>
        <span style={{ fontWeight: 600 }}>{spec.contentWidth}px</span>
      </div>
      <div
        style={{
          maxWidth: spec.contentWidth,
          margin: "0 auto",
          padding: `0 ${spec.margin < 40 ? spec.margin : 0}px`,
          border: "1px dashed #D8D8D8",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${spec.columns}, 1fr)`,
            gap: spec.gutter,
            padding: "var(--inset-card)",
          }}
        >
          {Array.from({ length: spec.columns }, (_, i) => (
            <GridColumn key={i} index={i} width={0} />
          ))}
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "var(--inset-chip) 0 var(--inset-input)",
            fontSize: 12,
            color: "#999999",
          }}
        >
          Content width: {spec.contentWidth}px · {spec.columns} columns · gutter {spec.gutter}px ·
          margin {spec.margin}px
        </div>
      </div>
    </div>
  );
}

function GridTokensPage() {
  return (
    <div
      style={{
        fontFamily: "'Pretendard', sans-serif",
        padding: "var(--inset-modal)",
        backgroundColor: "#FFFFFF",
      }}
    >
      <h2
        style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 12,
          color: "#111111",
        }}
      >
        Grid System
      </h2>
      <p
        style={{
          fontSize: 14,
          lineHeight: "20px",
          color: "#666666",
          marginBottom: 32,
        }}
      >
        모바일 4컬럼, 데스크탑 12컬럼 그리드 시스템. 컬럼 간 자유로운 span 조합 가능 (3+9, 6+6,
        4+4+4, 3+6+3 등).
      </p>

      <GridSpec label="Mobile (360px viewport)" spec={grid.mobile} />
      <GridSpec label="Desktop (1920px viewport)" spec={grid.desktop} />
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Grid",
  component: GridTokensPage,
};

export default meta;

export const GridSystem: StoryObj = {
  name: "Reference/Grid System",
};
