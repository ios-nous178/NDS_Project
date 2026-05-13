/**
 * Chip 컴포넌트의 design guide 확정 메타
 *
 * Figma 가이드(171:10856)에 등재된 variant/size/shape 조합만 core 로 표기.
 * Storybook DesignGuideBadge 가 이 정보를 카드 옆에 노출한다.
 */

import type { GuideMeta } from "@nudge-eap/tokens";

export type ChipVariantKey = "outlined" | "filled" | "soft" | "strong";

export const chipGuide: Record<ChipVariantKey, GuideMeta> = {
  outlined: { status: "core", figmaNode: "171:10856" },
  filled: { status: "core", figmaNode: "171:10856" },
  soft: { status: "core", figmaNode: "171:10856" },
  strong: { status: "experimental", note: "Figma 가이드 미확정. 합의 후 core 승격 예정." },
};
