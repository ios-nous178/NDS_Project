/**
 * Badge 컴포넌트의 design guide 확정 메타
 *
 * Figma 가이드(171:10856)에 등재된 variant/size 만 core 로 표기.
 * Storybook DesignGuideBadge 가 이 정보를 카드 옆에 노출한다.
 */

import type { GuideMeta } from "@nudge-eap/tokens";

export type BadgeVariantKey = "primary" | "secondary" | "success" | "caution" | "error" | "neutral";

export const badgeGuide: Record<BadgeVariantKey, GuideMeta> = {
  primary: { status: "core", figmaNode: "171:10856" },
  secondary: { status: "core", figmaNode: "171:10856" },
  success: { status: "core", figmaNode: "171:10856" },
  caution: { status: "core", figmaNode: "171:10856" },
  error: { status: "core", figmaNode: "171:10856" },
  neutral: { status: "core", figmaNode: "171:10856" },
};
