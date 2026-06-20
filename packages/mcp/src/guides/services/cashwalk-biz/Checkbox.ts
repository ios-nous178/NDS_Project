import type { ServiceOverlay } from "../types.js";

/**
 * Cashwalk-biz (Cashpobi) Checkbox overlay.
 * Source: Figma ControlsGuide 3295:547 (Controls · Checkbox / Toggle · 캐포비 admin 표준).
 *
 * 빠진 내용 (의도적, SSOT 분리):
 *   - Active 색상 hex (#FFD200 = Yellow/500) 는 토큰 SSOT (packages/tokens/src/projects/cashwalk-biz.semantic.ts) 가 담당.
 *   - 4 states 매트릭스 (Off / On / Off Disabled / On Disabled) 는 base Checkbox 의 checked × disabled 조합 — overlay 가 아니라 base 의 prop 매트릭스로 충분.
 */
export const CheckboxOverlay: ServiceOverlay = {
  preferredPatterns: [
    "다중 선택 · 독립 항목 · 즉시 효과 없는 입력에 사용 — 약관 동의 (필수/선택 다중), 필터 옵션 (여러 카테고리 동시), 테이블 row 일괄 처리가 표준 케이스.",
    "라벨 클릭으로도 토글되도록 영역 확장 — Checkbox 컴포넌트가 label 슬롯과 묶이면 자동 처리되지만, 외부에서 별도 텍스트로 분리하지 말 것.",
    "동일 그룹 안에서는 동일 컨트롤 사용 — Checkbox 그룹은 모두 Checkbox (일부만 Toggle 로 섞지 말 것).",
    "Active(체크) 색상은 Yellow/500 (Primary) — 토큰 슬롯에 이미 박혀 있으므로 임의로 덮어쓰지 말 것.",
    "Disabled 상태는 reason 을 hint text(helper) 로 함께 안내 — '왜 잠겼는지' 가 보이지 않으면 사용자가 막힘.",
  ],
  forbiddenPatterns: [
    "즉시 효과가 발생하는 ON/OFF 전환에 Checkbox 사용 — Toggle 이 맞음.",
    "단일 선택 그룹에 Checkbox 사용 — Radio 가 맞음.",
    "라벨 없이 Checkbox 만 단독 배치 — 무엇을 선택하는지 시각만으로 불명확.",
    "체크/On 상태에서 라벨 색상 변경 — 텍스트는 동일하게 유지 (체크박스 indicator 만 색상 변화).",
    "Disabled 상태에 hover 효과 적용 — disabled 는 비활성 신호, hover 와 충돌.",
  ],
  servicePitfalls: [
    "캐포비 admin 폼에서는 약관 동의·필터·다중 선택 리스트가 전부 Checkbox — Switch/Toggle 와 섞이지 않는지 화면 단위로 점검.",
  ],
};
