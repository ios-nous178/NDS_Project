/**
 * Badge 컴포넌트의 design guide 확정 메타
 *
 * Figma 가이드(171:10856)에 등재된 variant/color/size 만 core 로 표기.
 * Storybook DesignGuideBadge 가 이 정보를 카드 옆에 노출한다.
 */

import type { GuideMeta } from "@nudge-design/tokens";

export type BadgeVariantKey = "fill" | "ghost" | "line";
export type BadgeColorKey = "brand" | "neutral" | "success" | "error" | "caution" | "info";

export const badgeVariantGuide: Record<BadgeVariantKey, GuideMeta> = {
  fill: { status: "core", figmaNode: "171:10856" },
  ghost: { status: "core", figmaNode: "171:10856" },
  line: { status: "core", figmaNode: "171:10856" },
};

export const badgeColorGuide: Record<BadgeColorKey, GuideMeta> = {
  brand: { status: "core", figmaNode: "171:10856" },
  neutral: { status: "core", figmaNode: "171:10856" },
  success: { status: "core", figmaNode: "171:10856" },
  error: { status: "core", figmaNode: "171:10856" },
  caution: { status: "core", figmaNode: "171:10856" },
  info: { status: "core", figmaNode: "171:10856" },
};

/** @deprecated Use `badgeColorGuide` instead. */
export const badgeGuide = badgeColorGuide;
