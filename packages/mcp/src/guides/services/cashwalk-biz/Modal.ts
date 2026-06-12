import type { ServiceOverlay } from "../types.js";

/**
 * Cashwalk-biz Modal overlay.
 * Source: legacy COMPONENT_GUIDES.Modal.brandMatrix['cashwalk-biz'] (제거됨, 이쪽으로 마이그레이션) + Modal.pitfalls 의 캐시워크 포 비즈니스 한정 2건.
 *
 * 빠진 내용 (의도적, 새 모델 분리):
 *   - 480/16/32/gap20/typography 같은 spec 차이 → COMPONENT_GUIDES.Modal.matrixOverrides['cashwalk-biz'].dimensions (overlay 아닌 base 안 brand-aware metadata).
 *   - 색 정보 (#000 검정 CTA 등) → 토큰 SSOT (packages/tokens/src/brands/cashwalk-biz.semantic.ts) 가 담당.
 */
export const ModalOverlay: ServiceOverlay = {
  preferredPatterns: [
    "Confirm = 검정 CTA (`cv.button.bgSecondary` = #000), Cancel = white + `cv.button.borderNeutral` 회색 보더.",
    "Footer 1버튼(Single): 우측 정렬 + 128px 고정 폭 (`data-has-both-actions` 속성 자동 감지). 버튼 48px pill (Figma 3418-471 — 옛 44/120 폐기).",
    "Footer 2버튼(Dual): 우측 정렬 + 128px 고정 ×2 (취소 outlined + 확정 검정).",
  ],
  servicePitfalls: [
    "헤더 spacer 가 좌측 정렬 위해 자동 display:none — 그래도 인라인 style 로 spacer 박지 말 것.",
    'admin 모달이라고 가정해 너비/패딩/라운드를 inline style 로 덮어쓰지 말 것. `<html data-brand="cashwalk-biz">` 가 박힌 환경이면 480/16/32 가 자동 적용 — 그 외 컨텍스트라면 base 모바일 스펙이 의도된 것.',
  ],
  forbiddenPatterns: [
    "flat `<Modal ...>` 에 `closable + onClose + onConfirm` 을 한꺼번에 넘기지 말 것. 헤더 X 와 푸터 cancel 이 중복으로 노출됨. 패턴 ③(With Close: 헤더 X + 푸터 단일 확인) 은 반드시 Compound API (`Modal.Root` / `Modal.Header closable` / `Modal.Footer onConfirm` 만) 로 조립 — 푸터에는 `onClose` 를 넘기지 말 것.",
  ],
};
