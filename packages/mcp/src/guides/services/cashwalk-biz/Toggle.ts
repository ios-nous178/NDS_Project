import type { ServiceOverlay } from "../types.js";

/**
 * Cashwalk-biz (Cashpobi) Toggle overlay.
 * Source: Figma ControlsGuide 3295:547 (Controls · Checkbox / Toggle · 캐포비 admin 표준).
 *
 * 빠진 내용 (의도적, SSOT 분리):
 *   - On track 색상 (#60be34 green) / Off track 색상 (#d8d8d8) 은 토큰 SSOT 가 담당.
 *   - 2 states (Off · 비활성 / On · 활성) 는 base Toggle 의 checked × disabled 조합으로 충분.
 */
export const ToggleOverlay: ServiceOverlay = {
  preferredPatterns: [
    "기능의 ON/OFF 를 즉시 전환할 때만 사용 — 별도 확인/저장 없이 동작이 즉시 시스템에 반영되어야 Toggle.",
    "표준 사용처: 알림 설정 (푸시·이메일·마케팅 수신), CMS 기능 활성화/비활성화, 다크모드·자동저장 같은 환경 설정.",
    "상태 변경 시 즉시 시스템에 반영 — onCheckedChange 핸들러에서 바로 persist (debounce 필요하면 라벨/Toast 로 신호).",
    "라벨은 항상 함께 — 무엇을 켜고 끄는지 시각만으로 명확해야 함. Toggle 단독 배치 금지.",
  ],
  forbiddenPatterns: [
    "별도 '저장' 버튼이 필요한 폼 입력 항목에 Toggle 사용 — Checkbox 가 맞음 (Toggle 은 즉시 반영 시그널).",
    "제출 전 검토가 필요한 동의 항목(약관 등) 에 Toggle 사용 — Checkbox 가 맞음.",
    "라벨 없이 Toggle 만 단독 배치.",
    "On 상태에서 라벨 색상 변경 — 텍스트는 동일하게 유지 (track 색상만 변화).",
    "Disabled 상태에 hover 효과 적용.",
  ],
  servicePitfalls: [
    "캐포비 admin 의 알림/환경 설정 row 는 좌측 라벨 + 우측 Toggle 의 justify-between 패턴 — 라벨과 Toggle 사이를 인라인 spacing 으로 박지 말 것.",
    "Toggle 의 On 트랙은 project 와 무관한 시스템 green (긍정/활성 시그널) — Checkbox 의 Yellow/500 Primary 와 색이 다르다고 임의로 맞추지 말 것.",
  ],
};
