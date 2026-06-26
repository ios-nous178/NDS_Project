# 검증 룰 레지스트리 리포트 — 차단 승격 검토용

> 자동 생성: `node scripts/validator-rule-report.mjs` — 손으로 고치지 말 것.
> 출처: RULE_META(`packages/mockup-core/src/tools/html-validator.ts`) × PRINCIPLE_MAP(`scripts/validator-principle-map.mjs`).
> 원칙 매핑은 1차 패스 — 팀 검토로 교정 전제.

## 요약

- 대상 룰: **52개** (warn/info + 승격완료)
- ✅ 승격완료(promoted, 차단 중): **7개** — `missing-viewport-meta`, `project-modal-single-button-fullwidth`, `region-as-chip`, `nds-custom-element-content-mutation`, `project-denied-button-color`, `nested-card`, `primary-cta-per-container`
- 🟢 승격후보(candidate): **24개** — 예외 없거나 정의됨, 바로 검토 가능
- 🟡 예외선행(context): **5개** — 예외 케이스 데이터화 후 승격
- ⚪ 현행유지(hold): **16개**

### 차단 안전성 (승격후보+예외선행 기준)

- ✅ 차단 안전: **28개** — 예외 없거나 auto/structural/policy 자동 면제. detect 배선만 하면 바로 error 승격 가능.
- ⚠ waiver 필요: **1개** — explicit-waiver 예외라 차단 시 `data-nudge-allow` 사유 태그 운영 필요.

### 원칙별 분포

| 원칙 | 룰 수 | 승격후보 | 예외선행 |
| --- | ---: | ---: | ---: |
| 원칙 1 | 2 | 0 | 0 |
| 원칙 2 | 17 | 11 | 0 |
| 원칙 3 | 2 | 1 | 0 |
| 원칙 4 | 6 | 5 | 0 |
| 원칙 5 | 14 | 5 | 5 |
| DS | 11 | 2 | 0 |

## 원칙 1 · 사용자는 목표를 쉽게 달성할 수 있어야 한다

| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 차단안전성 | 근거 |
| --- | --- | --- | --- | --- | --- | --- |
| `missing-viewport-meta` | error · invariant | ✅ 승격완료 | high | — | 차단 가능(예외없음) | viewport 누락 → 모바일 짓눌림으로 목표 도달 방해. 기술적이나 UX 영향 큼. 보조 DS. [승격 2026-06-26] |
| `onboarding-back-button-inside-card` | warn · invariant | ⚪ 현행유지 | low | — | 차단 가능(예외없음) | 이전버튼 위치 — 흐름 경미. 현행 유지. |

## 원칙 2 · 사용자는 다음 행동을 쉽게 이해할 수 있어야 한다 (위계·강조)

| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 차단안전성 | 근거 |
| --- | --- | --- | --- | --- | --- | --- |
| `primary-cta-per-container` | error · invariant | ✅ 승격완료 | high | `ux:p2-multi-judgment-unit` | 차단 안전(auto 자동면제) | 영역(Card/section/Modal/...) 단위 Primary 단일성. 예외 ux:p2-multi-judgment-unit 배선됨(가장 가까운 컨테이너 귀속 카운트 → 중첩 단위 오탐 없음). [승격 2026-06-26] |
| `nested-card` | error · invariant | ✅ 승격완료 | med | `ux:p2-card-justified` | waiver 필요(explicit) | 카드 안 카드 — 위계 모호. 예외 ux:p2-card-justified waiver 배선됨(외곽 카드 data-nudge-allow). deterministic. [승격 2026-06-26] |
| `card-everything` | warn · invariant | 🟢 승격후보 | high | `ux:p2-card-justified` | waiver 필요(explicit) | 카드 남용. 단순 구분은 spacing. 정당한 카드(독립묶음·액션·요약·공지)는 예외. |
| `primary-color-role-overload` | warn · invariant | 🟢 승격후보 | high | — | 차단 가능(예외없음) | 대표색(Key)을 카드배경·반복목록·장식에 사용. 원칙2 '대표색은 핵심 행동·선택·강조에만'. |
| `primary-cta-overuse` | warn · invariant | 🟢 승격후보 | high | `ux:p2-multi-judgment-unit` | 차단 안전(auto 자동면제) | 원칙2 핵심 — 1 판단단위 1 Primary. 단위(화면/모달/반복카드/독립섹션)가 여럿이면 화면 전체 다수는 허용 → 예외 데이터화 선행. |
| `project-bg-overuse` | warn · invariant | 🟢 승격후보 | high | — | 차단 가능(예외없음) | 프로젝트 키색을 배경 면적으로 남용 — primary-color-role-overload 와 한 묶음으로 검토. |
| `visual-emphasis-overload` | warn · invariant | 🟢 승격후보 | high | — | 차단 가능(예외없음) | 강조 장치 경쟁 — 원칙2 '강조가 여러 개로 경쟁하면 안 된다' 직접 대응. |
| `card-badge-overuse` | warn · invariant | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 배지가 본문/주요액션보다 강함 — 원칙2 '배지·칩은 약하게'. |
| `card-footer-button-overuse` | warn · invariant | 🟢 승격후보 | med | `ux:p2-multi-judgment-unit` | 차단 안전(auto 자동면제) | 카드 푸터 버튼 과다 — 카드=판단단위면 1Primary 적용. |
| `chip-as-entry-grid` | warn · model-guard | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 칩을 진입 그리드(주요 액션)로 사용 — 원칙2 '클릭 전환되는 주요 액션으로 칩 ❌'. |
| `chip-overuse` | warn · invariant | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 칩 남용 — 본문보다 약해야. 원칙2. |
| `decorative-shadow` | warn · invariant | 🟢 승격후보 | med | `ux:p2-real-float` | 차단 안전(auto 자동면제) | 그림자/elevation 은 실제로 떠야 하는 요소에만. 떠 있는 오버레이/드롭다운은 예외. |
| `tone-on-tone-filled` | warn · invariant | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 동톤 채움으로 위계 붕괴 — 강조 위계 약화. |
| `bold-overuse` | warn · invariant | ⚪ 현행유지 | med | — | 차단 가능(예외없음) | 볼드 남용 — 위계 신호이나 오탐 위험 큼(코드만으론 의도 판별 어려움). 정성 점수로 두는 게 안전. |
| `card-slot-double-padding` | warn · invariant | ⚪ 현행유지 | low | — | 차단 가능(예외없음) | 카드 슬롯 이중 패딩 — 시각 버그성, DS 위생에 가까움. |
| `heading-decorative-icon` | warn · invariant | ⚪ 현행유지 | low | — | 차단 가능(예외없음) | 제목 장식 아이콘 — 경미. 현행 warn 유지. |
| `repeated-h2` | warn · invariant | ⚪ 현행유지 | low | `ux:p2-independent-section` | 차단 안전(auto 자동면제) | 독립 섹션이 여럿이면 h2 반복 정당 — 예외 흔해 차단 부적합. |

## 원칙 3 · 사용자는 현재 상태를 쉽게 이해할 수 있어야 한다

| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 차단안전성 | 근거 |
| --- | --- | --- | --- | --- | --- | --- |
| `onboarding-success-plain-circle` | warn · model-guard | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 완료를 민무늬 초록원으로 — check-circle 미사용, 상태 신호 약함. |
| `cashwalk-biz-onboarding-skeleton` | info · project-policy | ⚪ 현행유지 | low | — | 차단 가능(예외없음) | info 권고 — 레이아웃 계약 환기. 차단 부적합. |

## 원칙 4 · 사용자는 실수하기 전에 예방받아야 한다

| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 차단안전성 | 근거 |
| --- | --- | --- | --- | --- | --- | --- |
| `date-as-text-input` | warn · model-guard | 🟢 승격후보 | high | — | 차단 가능(예외없음) | 날짜를 raw text 로 — DatePicker 미사용. 잘못된 입력 예방 실패. 보조 원칙1(마찰). |
| `address-as-text-input` | warn · model-guard | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 주소 raw text — AddressPicker 미사용. |
| `amount-as-static-display` | warn · model-guard | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 폼 값 자리에 정적 숫자 — 입력 불가. |
| `amount-as-text-input` | warn · model-guard | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 금액 raw text — AmountInput(콤마·단위·clamp) 미사용. |
| `consent-raw-checkbox` | warn · model-guard | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 약관 동의 raw checkbox — checkbox-group(필수/선택/전체동의) 미사용. |
| `verification-manual-assembly` | warn · model-guard | ⚪ 현행유지 | med | `ux:p4-inline-compose` | waiver 필요(explicit) | 인증코드 손조립 — 타이머 등 앱 합성 인라인 정당 케이스 있음. |

## 원칙 5 · 사용자는 예측 가능한 경험을 제공받아야 한다 (일관성)

| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 차단안전성 | 근거 |
| --- | --- | --- | --- | --- | --- | --- |
| `region-as-chip` | error · model-guard | ✅ 승격완료 | high | — | 차단 가능(예외없음) | 선택 결과를 Chip 으로(SelectionButton 혼동) — 같은 역할 다른 표현. 보조 원칙2. [승격 2026-06-26] |
| `project-denied-button-color` | error · project-policy | ✅ 승격완료 | med | `ux:p5-brand-cta-policy` | 차단 안전(policy 자동면제) | 프로젝트 금지 버튼색 — 프로필 deniedButtonColors 로 발화(예외 내재: 해당 프로젝트에 그 tone 자체가 없음). deterministic. [승격 2026-06-26] |
| `project-modal-single-button-fullwidth` | error · project-policy | ✅ 승격완료 | med | `ux:p5-modal-policy` | 차단 안전(policy 자동면제) | 단일버튼 full-width — 프로필 modal.singleButtonLayout='hug-right' 로 발화(예외 내재). deterministic, 문서화된 회귀. [승격 2026-06-26] |
| `avoidable-reinvention` | warn · model-guard | 🟢 승격후보 | high | `ux:p5-no-ds-component` | 차단 안전(structural 자동면제) | DS 컴포넌트 재발명 — 없는 컴포넌트면 정당(예외). 데이터화 선행. |
| `admin-sidebar-logo-not-component` | warn · model-guard | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 사이드바 로고를 컴포넌트 대신 텍스트/수동img — 일관성. |
| `manual-project-header` | warn · model-guard | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 프로젝트 chrome 을 손수 조립 — 같은 헤더 다른 구현. 일관성 위반. |
| `selected-item-row-duplicated` | warn · invariant | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 선택 결과 중복 행 — 일관/상태 정합. 보조 원칙3. |
| `selected-item-row-outside-panel` | warn · invariant | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 행이 패널 밖 — 구조/일관성. 시각 깨짐 동반. |
| `neutral-solid-cta` | warn · project-policy | 🟡 예외선행 | med | `ux:p5-brand-cta-policy` | 차단 안전(policy 자동면제) | 검정 solid CTA 브랜드별 상이(캐포비=neutral). 프로젝트 정책 예외 의존. |
| `project-modal-footer-stacked` | warn · project-policy | 🟡 예외선행 | med | `ux:p5-modal-policy` | 차단 안전(policy 자동면제) | 모달 푸터 세로스택 — 프로젝트 모달 정책. |
| `service-surface-admin-shell` | warn · invariant | 🟡 예외선행 | med | `ux:surface-declared` | 차단 안전(structural 자동면제) | 선언 표면과 셸 불일치 — surface 선언(데이터)에 의존. |
| `cashwalk-biz-gender-selection-control` | warn · project-policy | 🟡 예외선행 | low | `ux:p5-brand-form-policy` | 차단 안전(policy 자동면제) | 프로젝트 전용 폼 컨트롤 — 정책 예외. |
| `project-modal-footer-button-shape` | warn · project-policy | 🟡 예외선행 | low | `ux:p5-modal-policy` | 차단 안전(policy 자동면제) | 푸터 버튼 shape 불일치 — 모달 정책. |
| `selected-items-modal-missing-panel` | warn · invariant | ⚪ 현행유지 | med | `ux:p5-selection-pattern` | waiver 필요(explicit) | 선택 모달 패널 누락 — 패턴 의존, 오탐 위험. |

## DS 위생 · 토큰·모델 가드 (UX 위계와 직접 무관 — 승격 별 트랙)

| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 차단안전성 | 근거 |
| --- | --- | --- | --- | --- | --- | --- |
| `nds-custom-element-content-mutation` | error · model-guard | ✅ 승격완료 | high | — | 차단 가능(예외없음) | nds-* textContent 직접 대입 → 내부 렌더 소실(빈 박스). 회귀 다발. [승격 2026-06-26] |
| `nds-host-box-style` | warn · invariant | 🟢 승격후보 | med | — | 차단 가능(예외없음) | display:contents 호스트에 box 스타일 → 브라우저 드롭(여백 사라짐). 시각 버그 근본, 승격 검토. |
| `non-inlinable-img-src` | warn · invariant | 🟢 승격후보 | med | — | 차단 가능(예외없음) | 인라인 불가 이미지 경로 → 단일파일 빌드에서 깨짐. 빌드 무결성. |
| `cashwalk-biz-sidebar-logout` | warn · project-policy | ⚪ 현행유지 | low | — | 차단 가능(예외없음) | 사이드바 로그아웃 누락 — 권고. |
| `inline-spacing` | warn · invariant | ⚪ 현행유지 | low | — | 차단 가능(예외없음) | 인라인 간격 — 토큰 위생. 이미 inline-color 는 error, 간격은 warn 유지 중. |
| `inline-svg` | info · invariant | ⚪ 현행유지 | low | — | 차단 가능(예외없음) | info — find_icon 인라인은 정상 패턴. 점수 안 깎음. |
| `non-4pt-spacing` | warn · invariant | ⚪ 현행유지 | low | — | 차단 가능(예외없음) | 4pt 그리드 이탈 — 토큰 위생. |
| `non-semantic-spacing` | warn · invariant | ⚪ 현행유지 | low | — | 차단 가능(예외없음) | 비시멘틱 간격 — 토큰 위생. |
| `onboarding-missing-project-logo` | warn · model-guard | ⚪ 현행유지 | low | — | 차단 가능(예외없음) | 온보딩 로고 컴포넌트 미사용 — 경미. |
| `onboarding-social-bare-text` | warn · model-guard | ⚪ 현행유지 | low | — | 차단 가능(예외없음) | 소셜로그인 텍스트 때움 — 에셋 미사용. 경미. |
| `raw-landmark` | warn · invariant | ⚪ 현행유지 | low | — | 차단 가능(예외없음) | raw <header> 등 — 컴포넌트 우선. 경미. |

## 예외 레지스트리 (차단 승격의 전제)

> SSOT: `scripts/validator-exception-registry.mjs`. `evaluation` 이 차단 안전성을 결정 — auto/structural/policy=validator·프로필 자동 면제(차단 안전), explicit-waiver=`data-nudge-allow` 사유 태그 필요(마찰).

| 예외 id | 원칙 | evaluation | 면제 룰 | 허용 조건 |
| --- | --- | --- | --- | --- |
| `ux:p2-multi-judgment-unit` | 2 | auto | `primary-cta-overuse` `primary-cta-per-container` `card-footer-button-overuse` | Primary 1개 제한은 '같은 판단 단위' 안에서만 따진다. 판단 단위 = 화면 · 모달 등 별도 레이어 · 반복 구조의 카드·행 · 목적이 다른 독립 섹션. 단위가 여럿이면 한 화면에 Primary 가 여러 개 보일 수 있고 정당하다. 한 단위 안에서 2개 이상 경쟁할 때만 위반. |
| `ux:p2-card-justified` | 2 | explicit-waiver | `card-everything` `nested-card` | 카드는 독립 정보 묶음·액션·요약·공지에만 쓴다. 단순 구분은 간격(spacing). 위 목적의 카드면 정당하며 위반 아님 — '단순 구분용 카드 남용'만 위반. |
| `ux:p2-real-float` | 2 | auto | `decorative-shadow` | 그림자·elevation 은 실제로 떠 있어야 하는 요소에만 — 오버레이·드롭다운·팝오버·모달·toast/snackbar. 평면 카드·섹션에 장식 그림자 ❌. |
| `ux:p2-independent-section` | 2 | auto | `repeated-h2` | 목적이 다른 독립 섹션이 여럿이면 같은 레벨 heading(h2) 반복은 정당하다. 같은 섹션 안 중복 h2 만 위반. |
| `ux:p5-no-ds-component` | 5 | structural | `avoidable-reinvention` | DS 에 해당 역할의 컴포넌트가 아직 없으면 직접 구현(재발명)은 정당하다. DS 에 있는데 재발명한 경우만 위반 — 없는 컴포넌트는 추가 대상. |
| `ux:surface-declared` | 5 | structural | `service-surface-admin-shell` | 표면(admin/service) 불일치는 화면 제목이 아니라 선언된 surface(brief/CLAUDE.md + nudge.surface 마커) 기준으로 판단. 선언과 셸이 일치하면 면제. |
| `ux:p5-brand-cta-policy` | 5 | policy | `neutral-solid-cta` `project-denied-button-color` | 검정 solid CTA 의 허용/금지는 프로젝트별로 다르다 — 캐포비=neutral 검정 CTA 정상, 타 브랜드=금지일 수 있음. 프로젝트 정책에 부합하면 면제. |
| `ux:p5-modal-policy` | 5 | policy | `project-modal-footer-stacked` `project-modal-footer-button-shape` `project-modal-single-button-fullwidth` | 모달 푸터의 배치·버튼 형태는 프로젝트 모달 정책을 따른다 — 캐포비=가로 hug pill, 단일버튼 우측 hug(full-width 금지). 정책에 부합하면 면제. |
| `ux:p5-brand-form-policy` | 5 | policy | `cashwalk-biz-gender-selection-control` | 프로젝트 전용 폼 컨트롤 규약 — 캐포비 성별 타겟팅=SelectionButtonGroup(전체/특정)+selection chip. 규약대로면 면제. |
| `ux:p5-selection-pattern` | 5 | explicit-waiver | `selected-items-modal-missing-panel` | 대형 다중 선택 모달은 우측 SelectedItemsPanel 동반이 정석이나, 소규모 단일/경량 선택은 패널 없이 정당하다. |
| `ux:p4-inline-compose` | 4 | explicit-waiver | `verification-manual-assembly` | 인증코드 입력의 남은시간 타이머 등 앱 도메인 합성이 불가피한 인라인은 허용. 컴포넌트로 대체 가능한 손조립만 위반. |

## 다음 단계

1. **차단 안전(✅)** 룰: 예외의 `detect`(auto/structural/policy 면제 로직)를 validator 에 배선한 뒤 RULE_META severity 를 warn→error 로 승격. 예외 없는 것은 detect 불필요 → 바로 승격.
2. **waiver 필요(⚠)** 룰: `data-nudge-allow="<예외id> — <사유>"` 토큰 파싱을 validator 에 배선(// allow-native 일반화)한 뒤 승격. 운영 마찰 있으니 신중.
3. 승격은 RULE_META severity 변경 + 승격 사유 기록. 예외 detect/waiver 배선 = 다음 단계 ③(승격 게이트).
