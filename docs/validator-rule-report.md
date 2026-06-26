# 검증 룰 레지스트리 리포트 — 차단 승격 검토용

> 자동 생성: `node scripts/validator-rule-report.mjs` — 손으로 고치지 말 것.
> 출처: RULE_META(`packages/mockup-core/src/tools/html-validator.ts`) × PRINCIPLE_MAP(`scripts/validator-principle-map.mjs`).
> 원칙 매핑은 1차 패스 — 팀 검토로 교정 전제.

## 요약

- 대상 룰: **52개** (warn/info 만)
- 🟢 승격후보(candidate): **29개** — 예외 없거나 정의됨, 바로 검토 가능
- 🟡 예외선행(context): **7개** — 예외 케이스 데이터화 후 승격
- ⚪ 현행유지(hold): **16개**

### 원칙별 분포

| 원칙 | 룰 수 | 승격후보 | 예외선행 |
| --- | ---: | ---: | ---: |
| 원칙 1 | 2 | 1 | 0 |
| 원칙 2 | 17 | 13 | 0 |
| 원칙 3 | 2 | 1 | 0 |
| 원칙 4 | 6 | 5 | 0 |
| 원칙 5 | 14 | 6 | 7 |
| DS | 11 | 3 | 0 |

## 원칙 1 · 사용자는 목표를 쉽게 달성할 수 있어야 한다

| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 근거 |
| --- | --- | --- | --- | --- | --- |
| `missing-viewport-meta` | warn · invariant | 🟢 승격후보 | high | — | viewport 누락 → 모바일 짓눌림으로 목표 도달 방해. 기술적이나 UX 영향 큼. 보조 DS. |
| `onboarding-back-button-inside-card` | warn · invariant | ⚪ 현행유지 | low | — | 이전버튼 위치 — 흐름 경미. 현행 유지. |

## 원칙 2 · 사용자는 다음 행동을 쉽게 이해할 수 있어야 한다 (위계·강조)

| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 근거 |
| --- | --- | --- | --- | --- | --- |
| `card-everything` | warn · invariant | 🟢 승격후보 | high | `ux:p2-card-justified` | 카드 남용. 단순 구분은 spacing. 정당한 카드(독립묶음·액션·요약·공지)는 예외. |
| `primary-color-role-overload` | warn · invariant | 🟢 승격후보 | high | — | 대표색(Key)을 카드배경·반복목록·장식에 사용. 원칙2 '대표색은 핵심 행동·선택·강조에만'. |
| `primary-cta-overuse` | warn · invariant | 🟢 승격후보 | high | `ux:p2-multi-judgment-unit` | 원칙2 핵심 — 1 판단단위 1 Primary. 단위(화면/모달/반복카드/독립섹션)가 여럿이면 화면 전체 다수는 허용 → 예외 데이터화 선행. |
| `primary-cta-per-container` | warn · invariant | 🟢 승격후보 | high | `ux:p2-multi-judgment-unit` | 반복 카드·행 단위의 Primary 중복. 위와 동일 예외축(판단단위). |
| `project-bg-overuse` | warn · invariant | 🟢 승격후보 | high | — | 프로젝트 키색을 배경 면적으로 남용 — primary-color-role-overload 와 한 묶음으로 검토. |
| `visual-emphasis-overload` | warn · invariant | 🟢 승격후보 | high | — | 강조 장치 경쟁 — 원칙2 '강조가 여러 개로 경쟁하면 안 된다' 직접 대응. |
| `card-badge-overuse` | warn · invariant | 🟢 승격후보 | med | — | 배지가 본문/주요액션보다 강함 — 원칙2 '배지·칩은 약하게'. |
| `card-footer-button-overuse` | warn · invariant | 🟢 승격후보 | med | `ux:p2-multi-judgment-unit` | 카드 푸터 버튼 과다 — 카드=판단단위면 1Primary 적용. |
| `chip-as-entry-grid` | warn · model-guard | 🟢 승격후보 | med | — | 칩을 진입 그리드(주요 액션)로 사용 — 원칙2 '클릭 전환되는 주요 액션으로 칩 ❌'. |
| `chip-overuse` | warn · invariant | 🟢 승격후보 | med | — | 칩 남용 — 본문보다 약해야. 원칙2. |
| `decorative-shadow` | warn · invariant | 🟢 승격후보 | med | `ux:p2-real-float` | 그림자/elevation 은 실제로 떠야 하는 요소에만. 떠 있는 오버레이/드롭다운은 예외. |
| `nested-card` | warn · invariant | 🟢 승격후보 | med | `ux:p2-card-justified` | 카드 안 카드 — 위계 모호. card-everything 과 동일 예외축. |
| `tone-on-tone-filled` | warn · invariant | 🟢 승격후보 | med | — | 동톤 채움으로 위계 붕괴 — 강조 위계 약화. |
| `bold-overuse` | warn · invariant | ⚪ 현행유지 | med | — | 볼드 남용 — 위계 신호이나 오탐 위험 큼(코드만으론 의도 판별 어려움). 정성 점수로 두는 게 안전. |
| `card-slot-double-padding` | warn · invariant | ⚪ 현행유지 | low | — | 카드 슬롯 이중 패딩 — 시각 버그성, DS 위생에 가까움. |
| `heading-decorative-icon` | warn · invariant | ⚪ 현행유지 | low | — | 제목 장식 아이콘 — 경미. 현행 warn 유지. |
| `repeated-h2` | warn · invariant | ⚪ 현행유지 | low | `ux:p2-independent-section` | 독립 섹션이 여럿이면 h2 반복 정당 — 예외 흔해 차단 부적합. |

## 원칙 3 · 사용자는 현재 상태를 쉽게 이해할 수 있어야 한다

| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 근거 |
| --- | --- | --- | --- | --- | --- |
| `onboarding-success-plain-circle` | warn · model-guard | 🟢 승격후보 | med | — | 완료를 민무늬 초록원으로 — check-circle 미사용, 상태 신호 약함. |
| `cashwalk-biz-onboarding-skeleton` | info · project-policy | ⚪ 현행유지 | low | — | info 권고 — 레이아웃 계약 환기. 차단 부적합. |

## 원칙 4 · 사용자는 실수하기 전에 예방받아야 한다

| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 근거 |
| --- | --- | --- | --- | --- | --- |
| `date-as-text-input` | warn · model-guard | 🟢 승격후보 | high | — | 날짜를 raw text 로 — DatePicker 미사용. 잘못된 입력 예방 실패. 보조 원칙1(마찰). |
| `address-as-text-input` | warn · model-guard | 🟢 승격후보 | med | — | 주소 raw text — AddressPicker 미사용. |
| `amount-as-static-display` | warn · model-guard | 🟢 승격후보 | med | — | 폼 값 자리에 정적 숫자 — 입력 불가. |
| `amount-as-text-input` | warn · model-guard | 🟢 승격후보 | med | — | 금액 raw text — AmountInput(콤마·단위·clamp) 미사용. |
| `consent-raw-checkbox` | warn · model-guard | 🟢 승격후보 | med | — | 약관 동의 raw checkbox — checkbox-group(필수/선택/전체동의) 미사용. |
| `verification-manual-assembly` | warn · model-guard | ⚪ 현행유지 | med | `ux:p4-inline-compose` | 인증코드 손조립 — 타이머 등 앱 합성 인라인 정당 케이스 있음. |

## 원칙 5 · 사용자는 예측 가능한 경험을 제공받아야 한다 (일관성)

| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 근거 |
| --- | --- | --- | --- | --- | --- |
| `avoidable-reinvention` | warn · model-guard | 🟢 승격후보 | high | `ux:p5-no-ds-component` | DS 컴포넌트 재발명 — 없는 컴포넌트면 정당(예외). 데이터화 선행. |
| `region-as-chip` | warn · model-guard | 🟢 승격후보 | high | — | 선택 결과를 Chip 으로(SelectionButton 혼동) — 같은 역할 다른 표현. 보조 원칙2. |
| `admin-sidebar-logo-not-component` | warn · model-guard | 🟢 승격후보 | med | — | 사이드바 로고를 컴포넌트 대신 텍스트/수동img — 일관성. |
| `manual-project-header` | warn · model-guard | 🟢 승격후보 | med | — | 프로젝트 chrome 을 손수 조립 — 같은 헤더 다른 구현. 일관성 위반. |
| `selected-item-row-duplicated` | warn · invariant | 🟢 승격후보 | med | — | 선택 결과 중복 행 — 일관/상태 정합. 보조 원칙3. |
| `selected-item-row-outside-panel` | warn · invariant | 🟢 승격후보 | med | — | 행이 패널 밖 — 구조/일관성. 시각 깨짐 동반. |
| `neutral-solid-cta` | warn · project-policy | 🟡 예외선행 | med | `ux:p5-brand-cta-policy` | 검정 solid CTA 브랜드별 상이(캐포비=neutral). 프로젝트 정책 예외 의존. |
| `project-denied-button-color` | warn · project-policy | 🟡 예외선행 | med | `ux:p5-brand-cta-policy` | 프로젝트 금지 버튼색 — 브랜드 정책 예외. |
| `project-modal-footer-stacked` | warn · project-policy | 🟡 예외선행 | med | `ux:p5-modal-policy` | 모달 푸터 세로스택 — 프로젝트 모달 정책. |
| `project-modal-single-button-fullwidth` | warn · project-policy | 🟡 예외선행 | med | `ux:p5-modal-policy` | 단일버튼 full-width — 캐포비 hug 정책 예외. |
| `service-surface-admin-shell` | warn · invariant | 🟡 예외선행 | med | `ux:surface-declared` | 선언 표면과 셸 불일치 — surface 선언(데이터)에 의존. |
| `cashwalk-biz-gender-selection-control` | warn · project-policy | 🟡 예외선행 | low | `ux:p5-brand-form-policy` | 프로젝트 전용 폼 컨트롤 — 정책 예외. |
| `project-modal-footer-button-shape` | warn · project-policy | 🟡 예외선행 | low | `ux:p5-modal-policy` | 푸터 버튼 shape 불일치 — 모달 정책. |
| `selected-items-modal-missing-panel` | warn · invariant | ⚪ 현행유지 | med | `ux:p5-selection-pattern` | 선택 모달 패널 누락 — 패턴 의존, 오탐 위험. |

## DS 위생 · 토큰·모델 가드 (UX 위계와 직접 무관 — 승격 별 트랙)

| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 근거 |
| --- | --- | --- | --- | --- | --- |
| `nds-custom-element-content-mutation` | warn · model-guard | 🟢 승격후보 | high | — | nds-* textContent 직접 대입 → 내부 렌더 소실(빈 박스). 회귀 다발, 승격 강력 후보. |
| `nds-host-box-style` | warn · invariant | 🟢 승격후보 | med | — | display:contents 호스트에 box 스타일 → 브라우저 드롭(여백 사라짐). 시각 버그 근본, 승격 검토. |
| `non-inlinable-img-src` | warn · invariant | 🟢 승격후보 | med | — | 인라인 불가 이미지 경로 → 단일파일 빌드에서 깨짐. 빌드 무결성. |
| `cashwalk-biz-sidebar-logout` | warn · project-policy | ⚪ 현행유지 | low | — | 사이드바 로그아웃 누락 — 권고. |
| `inline-spacing` | warn · invariant | ⚪ 현행유지 | low | — | 인라인 간격 — 토큰 위생. 이미 inline-color 는 error, 간격은 warn 유지 중. |
| `inline-svg` | info · invariant | ⚪ 현행유지 | low | — | info — find_icon 인라인은 정상 패턴. 점수 안 깎음. |
| `non-4pt-spacing` | warn · invariant | ⚪ 현행유지 | low | — | 4pt 그리드 이탈 — 토큰 위생. |
| `non-semantic-spacing` | warn · invariant | ⚪ 현행유지 | low | — | 비시멘틱 간격 — 토큰 위생. |
| `onboarding-missing-project-logo` | warn · model-guard | ⚪ 현행유지 | low | — | 온보딩 로고 컴포넌트 미사용 — 경미. |
| `onboarding-social-bare-text` | warn · model-guard | ⚪ 현행유지 | low | — | 소셜로그인 텍스트 때움 — 에셋 미사용. 경미. |
| `raw-landmark` | warn · invariant | ⚪ 현행유지 | low | — | raw <header> 등 — 컴포넌트 우선. 경미. |

## 다음 단계

1. 🟢 승격후보 중 UX영향 high 부터 차단(error) 승격 검토 — 예외 없는 것은 바로, 있는 것은 예외 정의 확인.
2. 🟡 예외선행은 `exception` id 의 예외 케이스를 공통 UX 문서 + waiver 레지스트리에 데이터로 정의한 뒤 승격.
3. 승격 결정은 RULE_META 의 severity 를 warn→error 로 바꾸고, 승격 사유를 기록.
