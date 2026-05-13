/**
 * DesignGuideBadge — "디자인 가이드 확정" 표기 칩
 *
 * 시멘틱 토큰 카탈로그·컴포넌트 variant 카드 옆에 "Design Guide" 칩을
 * 부착해, 가이드 문서에 정식 등재된 항목인지(core) 합의 전인지(experimental)
 * 한눈에 구분하게 한다.
 *
 * 데이터 소스: `@nudge-eap/tokens`의 `semanticGuide`,
 *            `@nudge-eap/react`의 `badgeGuide`/`chipGuide` 등.
 */

import type { GuideMeta, GuideStatus } from "@nudge-eap/tokens";

const FIGMA_BASE = "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH";

const STATUS_STYLE: Record<GuideStatus, { bg: string; fg: string; label: string }> = {
  core: {
    bg: "var(--semantic-bg-status-info, #E3F2FC)",
    fg: "var(--semantic-text-brand-default, #017EE4)",
    label: "Design Guide",
  },
  experimental: {
    bg: "var(--semantic-bg-section-default, #F3F4F6)",
    fg: "var(--semantic-text-muted-default, #999)",
    label: "Experimental",
  },
};

export interface DesignGuideBadgeProps {
  meta: GuideMeta | undefined;
  /** Figma node 링크 노출 (기본 true). 단순 표기만 필요하면 false. */
  showFigmaLink?: boolean;
}

export function DesignGuideBadge({ meta, showFigmaLink = true }: DesignGuideBadgeProps) {
  if (!meta) return null;
  const style = STATUS_STYLE[meta.status];
  const node = meta.figmaNode?.replace(":", "-");
  const figmaHref = node ? `${FIGMA_BASE}/?node-id=${node}` : undefined;

  return (
    <span
      data-slot="design-guide-badge"
      data-status={meta.status}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 8px",
        borderRadius: 999,
        background: style.bg,
        color: style.fg,
        fontSize: 11,
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: 0,
      }}
      title={meta.note}
    >
      <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: style.fg }} />
      {style.label}
      {showFigmaLink && figmaHref && (
        <a
          href={figmaHref}
          target="_blank"
          rel="noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
          onClick={(e) => e.stopPropagation()}
        >
          {meta.figmaNode}
        </a>
      )}
    </span>
  );
}
