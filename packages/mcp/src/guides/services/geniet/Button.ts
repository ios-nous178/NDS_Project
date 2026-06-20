import type { ServiceOverlay } from "../types.js";

/**
 * Geniet Button overlay.
 * Source: legacy COMPONENT_GUIDES.Button.projectMatrix.geniet (제거됨, 이쪽으로 마이그레이션) + Figma 207:1853.
 * 색 정보 ('secondary/solid 는 cobalt-50' 류) 는 토큰 SSOT (packages/tokens/src/projects/geniet.semantic.ts) 가 담당하므로 overlay 에서 제외.
 */
export const ButtonOverlay: ServiceOverlay = {
  allowedVariants: ["solid", "outlined"],
  disallowedVariants: ["soft"],
  preferredPatterns: [
    "secondary/solid 는 #333333(gray-900) dark inverse + 흰 텍스트 — Geniet 고유 패턴 (다른 project 의 light subtle 과 다름).",
  ],
};
