// 검증 룰 → 공통 UX 원칙 매핑 (리뷰용 SSOT, 1차 패스)
//
// 목적: validate_html_mockup 의 RULE_META(packages/mockup-core/src/tools/html-validator.ts)
//   warn/info 룰을 "공통 UX 원칙" 5개에 매핑해, 어떤 경고를 차단(error)으로 승격할지
//   원칙 단위로 검토할 수 있게 한다. RULE_META 는 건드리지 않고 여기서만 메타를 얹는다.
//   (scripts/validator-rule-report.mjs 가 RULE_META × 이 맵을 조인해 리포트 생성)
//
// principle: "1".."5" = 공통 UX 원칙 / "DS" = DS 위생(토큰·모델 가드, UX 위계와 무관)
//   1 목표를 쉽게 달성        2 다음 행동을 쉽게 이해(위계·강조)
//   3 현재 상태를 쉽게 이해    4 실수 예방            5 예측 가능(일관성)
// uxImpact: high | med | low  — 사용자 경험에 미치는 영향. 승격 우선순위 1차 신호.
// promotion: "candidate"(승격 검토 대상) | "hold"(현행 warn 유지 권장) | "context"(예외 의존 — 데이터화 선행 필요)
// exception: 차단 승격 시 반드시 정의돼야 하는 예외 케이스(공통 UX 문서 기준). null = 예외 없음(무조건 차단 가능).
// note: 매핑 근거 / 검토 코멘트.
//
// ⚠ 1차 매핑이다 — 팀 검토로 교정 전제. 한 룰이 여러 원칙에 걸치면 primary 1개로 단정하고 note 에 보조 원칙 표기.

/** @type {Record<string, { principle: "1"|"2"|"3"|"4"|"5"|"DS", uxImpact: "high"|"med"|"low", promotion: "candidate"|"hold"|"context", exception: string|null, note: string }>} */
export const PRINCIPLE_MAP = {
  // ── 원칙 2: 다음 행동을 쉽게 이해 (위계·강조·1단위 1Primary·카드/칩 남용) ──────────────
  "primary-cta-overuse": {
    principle: "2",
    uxImpact: "high",
    promotion: "candidate",
    exception: "ux:p2-multi-judgment-unit",
    note: "원칙2 핵심 — 1 판단단위 1 Primary. 단위(화면/모달/반복카드/독립섹션)가 여럿이면 화면 전체 다수는 허용 → 예외 데이터화 선행.",
  },
  "primary-cta-per-container": {
    principle: "2",
    uxImpact: "high",
    promotion: "candidate",
    exception: "ux:p2-multi-judgment-unit",
    note: "반복 카드·행 단위의 Primary 중복. 위와 동일 예외축(판단단위).",
  },
  "primary-color-role-overload": {
    principle: "2",
    uxImpact: "high",
    promotion: "candidate",
    exception: null,
    note: "대표색(Key)을 카드배경·반복목록·장식에 사용. 원칙2 '대표색은 핵심 행동·선택·강조에만'.",
  },
  "project-bg-overuse": {
    principle: "2",
    uxImpact: "high",
    promotion: "candidate",
    exception: null,
    note: "프로젝트 키색을 배경 면적으로 남용 — primary-color-role-overload 와 한 묶음으로 검토.",
  },
  "card-everything": {
    principle: "2",
    uxImpact: "high",
    promotion: "candidate",
    exception: "ux:p2-card-justified",
    note: "카드 남용. 단순 구분은 spacing. 정당한 카드(독립묶음·액션·요약·공지)는 예외.",
  },
  "visual-emphasis-overload": {
    principle: "2",
    uxImpact: "high",
    promotion: "candidate",
    exception: null,
    note: "강조 장치 경쟁 — 원칙2 '강조가 여러 개로 경쟁하면 안 된다' 직접 대응.",
  },
  "decorative-shadow": {
    principle: "2",
    uxImpact: "med",
    promotion: "candidate",
    exception: "ux:p2-real-float",
    note: "그림자/elevation 은 실제로 떠야 하는 요소에만. 떠 있는 오버레이/드롭다운은 예외.",
  },
  "tone-on-tone-filled": {
    principle: "2",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "동톤 채움으로 위계 붕괴 — 강조 위계 약화.",
  },
  "nested-card": {
    principle: "2",
    uxImpact: "med",
    promotion: "candidate",
    exception: "ux:p2-card-justified",
    note: "카드 안 카드 — 위계 모호. card-everything 과 동일 예외축.",
  },
  "card-badge-overuse": {
    principle: "2",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "배지가 본문/주요액션보다 강함 — 원칙2 '배지·칩은 약하게'.",
  },
  "card-footer-button-overuse": {
    principle: "2",
    uxImpact: "med",
    promotion: "candidate",
    exception: "ux:p2-multi-judgment-unit",
    note: "카드 푸터 버튼 과다 — 카드=판단단위면 1Primary 적용.",
  },
  "chip-overuse": {
    principle: "2",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "칩 남용 — 본문보다 약해야. 원칙2.",
  },
  "chip-as-entry-grid": {
    principle: "2",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "칩을 진입 그리드(주요 액션)로 사용 — 원칙2 '클릭 전환되는 주요 액션으로 칩 ❌'.",
  },
  "bold-overuse": {
    principle: "2",
    uxImpact: "med",
    promotion: "hold",
    exception: null,
    note: "볼드 남용 — 위계 신호이나 오탐 위험 큼(코드만으론 의도 판별 어려움). 정성 점수로 두는 게 안전.",
  },
  "repeated-h2": {
    principle: "2",
    uxImpact: "low",
    promotion: "hold",
    exception: "ux:p2-independent-section",
    note: "독립 섹션이 여럿이면 h2 반복 정당 — 예외 흔해 차단 부적합.",
  },
  "heading-decorative-icon": {
    principle: "2",
    uxImpact: "low",
    promotion: "hold",
    exception: null,
    note: "제목 장식 아이콘 — 경미. 현행 warn 유지.",
  },
  "card-slot-double-padding": {
    principle: "2",
    uxImpact: "low",
    promotion: "hold",
    exception: null,
    note: "카드 슬롯 이중 패딩 — 시각 버그성, DS 위생에 가까움.",
  },

  // ── 원칙 5: 예측 가능(일관성) — 같은 역할 = 같은 컴포넌트/모양/위치 ──────────────────────
  "region-as-chip": {
    principle: "5",
    uxImpact: "high",
    promotion: "promoted",
    exception: null,
    note: "선택 결과를 Chip 으로(SelectionButton 혼동) — 같은 역할 다른 표현. 보조 원칙2. [승격 2026-06-26]",
  },
  "avoidable-reinvention": {
    principle: "5",
    uxImpact: "high",
    promotion: "candidate",
    exception: "ux:p5-no-ds-component",
    note: "DS 컴포넌트 재발명 — 없는 컴포넌트면 정당(예외). 데이터화 선행.",
  },
  "neutral-solid-cta": {
    principle: "5",
    uxImpact: "med",
    promotion: "context",
    exception: "ux:p5-brand-cta-policy",
    note: "검정 solid CTA 브랜드별 상이(캐포비=neutral). 프로젝트 정책 예외 의존.",
  },
  "project-denied-button-color": {
    principle: "5",
    uxImpact: "med",
    promotion: "context",
    exception: "ux:p5-brand-cta-policy",
    note: "프로젝트 금지 버튼색 — 브랜드 정책 예외.",
  },
  "manual-project-header": {
    principle: "5",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "프로젝트 chrome 을 손수 조립 — 같은 헤더 다른 구현. 일관성 위반.",
  },
  "admin-sidebar-logo-not-component": {
    principle: "5",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "사이드바 로고를 컴포넌트 대신 텍스트/수동img — 일관성.",
  },
  "service-surface-admin-shell": {
    principle: "5",
    uxImpact: "med",
    promotion: "context",
    exception: "ux:surface-declared",
    note: "선언 표면과 셸 불일치 — surface 선언(데이터)에 의존.",
  },
  "project-modal-footer-stacked": {
    principle: "5",
    uxImpact: "med",
    promotion: "context",
    exception: "ux:p5-modal-policy",
    note: "모달 푸터 세로스택 — 프로젝트 모달 정책.",
  },
  "project-modal-footer-button-shape": {
    principle: "5",
    uxImpact: "low",
    promotion: "context",
    exception: "ux:p5-modal-policy",
    note: "푸터 버튼 shape 불일치 — 모달 정책.",
  },
  "project-modal-single-button-fullwidth": {
    principle: "5",
    uxImpact: "med",
    promotion: "context",
    exception: "ux:p5-modal-policy",
    note: "단일버튼 full-width — 캐포비 hug 정책 예외.",
  },
  "cashwalk-biz-gender-selection-control": {
    principle: "5",
    uxImpact: "low",
    promotion: "context",
    exception: "ux:p5-brand-form-policy",
    note: "프로젝트 전용 폼 컨트롤 — 정책 예외.",
  },
  "selected-item-row-duplicated": {
    principle: "5",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "선택 결과 중복 행 — 일관/상태 정합. 보조 원칙3.",
  },
  "selected-item-row-outside-panel": {
    principle: "5",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "행이 패널 밖 — 구조/일관성. 시각 깨짐 동반.",
  },
  "selected-items-modal-missing-panel": {
    principle: "5",
    uxImpact: "med",
    promotion: "hold",
    exception: "ux:p5-selection-pattern",
    note: "선택 모달 패널 누락 — 패턴 의존, 오탐 위험.",
  },

  // ── 원칙 4: 실수 예방 — 타입드 인풋·검증·확인 단계 ────────────────────────────────────
  "date-as-text-input": {
    principle: "4",
    uxImpact: "high",
    promotion: "candidate",
    exception: null,
    note: "날짜를 raw text 로 — DatePicker 미사용. 잘못된 입력 예방 실패. 보조 원칙1(마찰).",
  },
  "address-as-text-input": {
    principle: "4",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "주소 raw text — AddressPicker 미사용.",
  },
  "amount-as-text-input": {
    principle: "4",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "금액 raw text — AmountInput(콤마·단위·clamp) 미사용.",
  },
  "amount-as-static-display": {
    principle: "4",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "폼 값 자리에 정적 숫자 — 입력 불가.",
  },
  "verification-manual-assembly": {
    principle: "4",
    uxImpact: "med",
    promotion: "hold",
    exception: "ux:p4-inline-compose",
    note: "인증코드 손조립 — 타이머 등 앱 합성 인라인 정당 케이스 있음.",
  },
  "consent-raw-checkbox": {
    principle: "4",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "약관 동의 raw checkbox — checkbox-group(필수/선택/전체동의) 미사용.",
  },

  // ── 원칙 3: 현재 상태를 쉽게 이해 — 로딩/완료/실패/Empty/상태색 ───────────────────────
  "onboarding-success-plain-circle": {
    principle: "3",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "완료를 민무늬 초록원으로 — check-circle 미사용, 상태 신호 약함.",
  },
  "cashwalk-biz-onboarding-skeleton": {
    principle: "3",
    uxImpact: "low",
    promotion: "hold",
    exception: null,
    note: "info 권고 — 레이아웃 계약 환기. 차단 부적합.",
  },

  // ── 원칙 1: 목표를 쉽게 달성 — 마찰 제거·핵심행동 노출 ────────────────────────────────
  "missing-viewport-meta": {
    principle: "1",
    uxImpact: "high",
    promotion: "promoted",
    exception: null,
    note: "viewport 누락 → 모바일 짓눌림으로 목표 도달 방해. 기술적이나 UX 영향 큼. 보조 DS. [승격 2026-06-26]",
  },
  "onboarding-back-button-inside-card": {
    principle: "1",
    uxImpact: "low",
    promotion: "hold",
    exception: null,
    note: "이전버튼 위치 — 흐름 경미. 현행 유지.",
  },

  // ── DS 위생: 토큰·모델 가드 (UX 위계와 직접 무관 — 승격은 별 트랙) ───────────────────────
  "inline-spacing": {
    principle: "DS",
    uxImpact: "low",
    promotion: "hold",
    exception: null,
    note: "인라인 간격 — 토큰 위생. 이미 inline-color 는 error, 간격은 warn 유지 중.",
  },
  "non-4pt-spacing": {
    principle: "DS",
    uxImpact: "low",
    promotion: "hold",
    exception: null,
    note: "4pt 그리드 이탈 — 토큰 위생.",
  },
  "non-semantic-spacing": {
    principle: "DS",
    uxImpact: "low",
    promotion: "hold",
    exception: null,
    note: "비시멘틱 간격 — 토큰 위생.",
  },
  "nds-host-box-style": {
    principle: "DS",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "display:contents 호스트에 box 스타일 → 브라우저 드롭(여백 사라짐). 시각 버그 근본, 승격 검토.",
  },
  "nds-custom-element-content-mutation": {
    principle: "DS",
    uxImpact: "high",
    promotion: "promoted",
    exception: null,
    note: "nds-* textContent 직접 대입 → 내부 렌더 소실(빈 박스). 회귀 다발. [승격 2026-06-26]",
  },
  "raw-landmark": {
    principle: "DS",
    uxImpact: "low",
    promotion: "hold",
    exception: null,
    note: "raw <header> 등 — 컴포넌트 우선. 경미.",
  },
  "non-inlinable-img-src": {
    principle: "DS",
    uxImpact: "med",
    promotion: "candidate",
    exception: null,
    note: "인라인 불가 이미지 경로 → 단일파일 빌드에서 깨짐. 빌드 무결성.",
  },
  "onboarding-missing-project-logo": {
    principle: "DS",
    uxImpact: "low",
    promotion: "hold",
    exception: null,
    note: "온보딩 로고 컴포넌트 미사용 — 경미.",
  },
  "onboarding-social-bare-text": {
    principle: "DS",
    uxImpact: "low",
    promotion: "hold",
    exception: null,
    note: "소셜로그인 텍스트 때움 — 에셋 미사용. 경미.",
  },
  "cashwalk-biz-sidebar-logout": {
    principle: "DS",
    uxImpact: "low",
    promotion: "hold",
    exception: null,
    note: "사이드바 로그아웃 누락 — 권고.",
  },
  "inline-svg": {
    principle: "DS",
    uxImpact: "low",
    promotion: "hold",
    exception: null,
    note: "info — find_icon 인라인은 정상 패턴. 점수 안 깎음.",
  },
};
