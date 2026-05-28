import type { ServiceOverlay } from "../types.js";

/**
 * Cashwalk-biz (Cashwalk for Business) Button overlay.
 * Source: legacy COMPONENT_GUIDES.Button.brandMatrix['cashwalk-biz'] (제거됨, 이쪽으로 마이그레이션) + Figma 3098:1032.
 *
 * 빠진 내용 (의도적, 새 모델 분리):
 *   - Disabled 페어 / 사이즈 매트릭스 (sm 40 / xs 36) / shape (default·pill) / 관련 컴포넌트 (TextButton, IconButton)
 *     → COMPONENT_GUIDES.Button.matrixOverrides['cashwalk-biz'] (overlay 아닌 base 안의 brand-aware metadata, Figma 450:68 v2 결정).
 *   - 색 정보 (#FFD200 등) → 토큰 SSOT (packages/tokens/src/brands/cashwalk-biz.semantic.ts) 가 담당.
 */
export const ButtonOverlay: ServiceOverlay = {
  preferredPatterns: [
    "Solid/Primary(노+검), Solid/Secondary(검+흰), Weak/Secondary, Outlined/Primary(노란 보더), Outlined/Secondary 5조합 — 그 외 조합은 Figma 라이브러리에 없음.",
    "Solid Primary 의 텍스트는 항상 검정 — Cashwalk-biz high-contrast 시그니처.",
    "Solid/Secondary(검정) 은 color='secondary', variant='solid' 슬롯이 담당 — Geniet dark inverse 패턴과 동일 운용.",
    "Shape default(radius 8 — 일반 admin 액션) · pill(radius full — 모달 확인/취소, BottomCTA, 격식 컨텍스트). 5종 스타일 × 2 shape × 5 size = 50 cell 이 Figma ButtonGuide 에 모두 존재.",
  ],
  servicePitfalls: [
    "Figma 캔버스 라벨은 'Neutral' 로 표기되지만 DS 네이밍은 'Secondary' — 동일 슬롯. color='secondary' 식별자와 정합.",
  ],
};
