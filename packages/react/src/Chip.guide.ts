/**
 * Chip 컴포넌트의 design guide 확정 메타
 *
 * Figma 가이드(171:10856)에 등재된 variant/color/size 만 core 로 표기.
 * Storybook DesignGuideBadge 가 이 정보를 카드 옆에 노출한다.
 */

import type { GuideMeta } from "@nudge-eap/tokens";

export type ChipVariantKey = "fill" | "outlined" | "ghost";
export type ChipColorKey = "brand" | "neutral" | "success" | "error" | "caution";

export const chipVariantGuide: Record<ChipVariantKey, GuideMeta> = {
  fill: { status: "core", figmaNode: "171:10856" },
  outlined: { status: "core", figmaNode: "171:10856" },
  ghost: { status: "core", figmaNode: "171:10856" },
};

export const chipColorGuide: Record<ChipColorKey, GuideMeta> = {
  brand: { status: "core", figmaNode: "171:10856" },
  neutral: { status: "core", figmaNode: "171:10856" },
  success: { status: "core", figmaNode: "171:10856" },
  error: { status: "core", figmaNode: "171:10856" },
  caution: { status: "core", figmaNode: "171:10856" },
};

/** @deprecated Use `chipVariantGuide` / `chipColorGuide` instead. */
export const chipGuide = chipVariantGuide;
