import type { Meta, StoryObj } from "@storybook/react";

/**
 * Container / Section — Layout primitive(클래스 + 패턴), React/HTML 컴포넌트가 아니다.
 * 따라서 스토리도 raw <div className="nds-container"> 로만 렌더한다(컴포넌트 import 없음).
 * 룰 전체: get_guide({ topic: 'pattern:container-section' }) — Figma 5303:111.
 *
 *  - base   .nds-container          : 전 브랜드 공용 (PC 1200/40 · Tablet 768/24 · Mobile 100%/16)
 *  - Trost  .nds-container--pc      : PC 일반 컨텐츠 (max 1080 · 좌우 24)
 *  - Trost  .nds-container--wide    : PC-Wide 테이블/대시보드 (max 1200 · 좌우 24)
 *  - 가산    .nds-section-surface    : 흰 컨텐츠 카드 (BG/Surface/Default + radius 16)
 */
const meta: Meta = {
  title: "Layout/Container",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

/** Container 폭 시각화용 — 가운데 정렬된 max-width 를 보이도록 옅은 채움. */
const fill: React.CSSProperties = {
  background: "var(--semantic-bg-brand-subtle, #eef2ff)",
  outline: "1px dashed var(--semantic-border-normal-default, #cbd5e1)",
  padding: 16,
  fontSize: 13,
  color: "var(--semantic-text-normal-default, #334155)",
  textAlign: "center",
};

export const Overview: Story = {
  tags: ["gallery"],
  name: "Overview",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "24px 0" }}>
      <div>
        <p style={{ padding: "0 16px", fontSize: 12, color: "#64748b" }}>
          base — PC max 1200 / Tablet 768 / Mobile 100%
        </p>
        <div className="nds-container">
          <div style={fill}>.nds-container</div>
        </div>
      </div>

      <div>
        <p style={{ padding: "0 16px", fontSize: 12, color: "#64748b" }}>
          Trost PC — max 1080 / 좌우 24
        </p>
        <div className="nds-container nds-container--pc">
          <div style={fill}>.nds-container--pc</div>
        </div>
      </div>

      <div>
        <p style={{ padding: "0 16px", fontSize: 12, color: "#64748b" }}>
          Trost PC-Wide — max 1200 / 좌우 24 (테이블·대시보드)
        </p>
        <div className="nds-container nds-container--wide">
          <div style={fill}>.nds-container--wide</div>
        </div>
      </div>
    </div>
  ),
};

/** Section(세로 블록, BG 교차) 안에 Container 1개 + .nds-section-surface 흰 카드. */
export const SectionComposition: Story = {
  name: "Section + Surface",
  render: () => (
    <div>
      <section
        style={{
          padding: "40px 0",
          background: "var(--semantic-bg-section-default, #f5f5f5)",
        }}
      >
        <div className="nds-container nds-container--pc">
          <div
            className="nds-section-surface"
            style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>섹션 제목</h2>
            <p style={{ margin: 0, fontSize: 14, color: "#475569" }}>
              Container BG = BG/Section/Default(회색), 그 위 흰 카드 = .nds-section-surface
              (BG/Surface/Default + radius 16). item 간격 PC 24(Gap/Wide).
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "40px 0",
          background: "var(--semantic-bg-section-default, #f5f5f5)",
        }}
      >
        <div className="nds-container nds-container--wide">
          <div className="nds-section-surface" style={{ padding: 24 }}>
            PC-Wide(1200) — 테이블/대시보드용 넓은 컨텐츠
          </div>
        </div>
      </section>
    </div>
  ),
};
