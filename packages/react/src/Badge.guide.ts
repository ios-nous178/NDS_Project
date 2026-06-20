/**
 * @deprecated 이 모듈 전체가 폐기 예정 — SSOT 는 `packages/mcp/guides-src/components/Badge.md`
 * frontmatter(figmaNodeUrl). 모든 항목이 동일한 core 메타라 정보량이 frontmatter 와 같아
 * 이중 관리만 남았다. Storybook 은 metadata/componentGuides.json 파생(guideMeta.ts)으로 전환됨.
 * 외부 호환을 위해 export 만 유지 — 차기 minor 에서 제거 예정.
 */

import type { GuideMeta } from "@nudge-design/tokens";

export type BadgeVariantKey = "fill" | "ghost" | "line";
export type BadgeColorKey = "project" | "neutral" | "success" | "error" | "caution" | "info";

export const badgeVariantGuide: Record<BadgeVariantKey, GuideMeta> = {
  fill: { status: "core", figmaNode: "171:10856" },
  ghost: { status: "core", figmaNode: "171:10856" },
  line: { status: "core", figmaNode: "171:10856" },
};

export const badgeColorGuide: Record<BadgeColorKey, GuideMeta> = {
  project: { status: "core", figmaNode: "171:10856" },
  neutral: { status: "core", figmaNode: "171:10856" },
  success: { status: "core", figmaNode: "171:10856" },
  error: { status: "core", figmaNode: "171:10856" },
  caution: { status: "core", figmaNode: "171:10856" },
  info: { status: "core", figmaNode: "171:10856" },
};

/** @deprecated Use `badgeColorGuide` instead. */
export const badgeGuide = badgeColorGuide;
