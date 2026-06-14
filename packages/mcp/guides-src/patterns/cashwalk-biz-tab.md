---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3544-206
metrics:
  variants: line(Underline) · chip(Box)
  font: Subtitle1 16/24
  lineIndicator: 2px
  boxRadius: 10
  tabVsFilter: Tab = view 전환(상호 배타·URL 경로) / Filter = 현재 view 좁히기(다중 누적·쿼리 파라미터)
  screenOrder: 페이지 타이틀 → Tab → FilterBar → 데이터 영역
  relatedComponents: Tab, FilterBar
  relatedPatterns: cashwalk-biz-step-progress, cashwalk-biz-badge-chip, cashwalk-biz-page-patterns
---

## summary

캐시워크 포 비즈니스 admin 의 Tab 카탈로그 — Underline(line) + Box(chip) 2 변형. DS `Tab` 컴포넌트로 구현, 브랜드 색·치수는 data-brand="cashwalk-biz" 시 자동 cascade.

## rules

- **Underline(line)** = 페이지 메인 카테고리·목록 필터·단계 전환. 마크업: `<nds-tab variant="line" size="pc" tone="neutral">`. 텍스트 Subtitle1 16/24, Selected=Strong(#111) Bold + 하단 2px 검정 인디케이터, Default=Subtle(#666) Medium.
- **Box(chip)** = 상태/좁은 영역 필터(진행중·진행예정·종료 등). 마크업: `<nds-tab variant="chip" size="pc" tone="neutral">`. radius 10, Selected=#111(bg-inverse) bg + 흰 텍스트 Bold, Default=#DDD(button-bg-disabled) bg + 흰 텍스트 Bold (의도된 저대비 — 가이드 명시).
- 치수·색은 모두 캐포비 브랜드 토큰(`--nds-tab-*`)으로 cascade — 별도 style 오버라이드 금지. `data-brand="cashwalk-biz"` 만 루트에 있으면 자동 적용된다.
- 동적 상태(진행/종료)는 Box, 페이지 카테고리는 Underline — 혼용 주의. 단계형 진행 표시는 Tab 이 아니라 `pattern:cashwalk-biz-step-progress`.
- **Tab vs Filter — 역할이 다르다(혼동 금지).** 둘 다 데이터를 분류해 보여주지만: **Tab** = 데이터를 **상호 배타적으로 분류**(한 번에 한 view 만) → **view 자체가 바뀜** → URL **경로** 변경(`/quizzes/active → /quizzes/done`). 예: 진행중/종료/대기, 승인/반려. **Filter**(`pattern:` FilterBar) = **현재 view 안에서 조건을 점진적으로 좁히기** → 같은 view 에 **결과만 변함** → **쿼리 파라미터**로 누적(`?date=…&keyword=…`, URL 공유 시에도 필터 유지). 예: 날짜 범위·키워드·카테고리 다중.
- **결정 트리** — Q1. view 자체가 바뀌나(목록 전체 교체)? → YES = **Tab**. Q2. 조건을 누적해서 좁히나(다중 필터)? → YES = **Filter(FilterBar)**. Q3. 옵션 2–7개 단일 선택인가? → YES = **Radio / SelectionButtonGroup**(`get_guide` Selection Components). 그 외 = 다른 컨트롤 검토.
- **화면 배치 순서(페이지 패턴)** — 페이지 타이틀 → **Tab** → **FilterBar** → 데이터 영역(위→아래). Tab 으로 큰 분류를 고른 뒤 Filter 로 그 안에서 좁히는 흐름. 한 화면에 Tab 종류는 1개로 통일(Underline 또는 Box 택1), Tab 항목 수는 2–5개 권장(6개+는 메뉴/Select). Filter 항목 수 제한 없음(12개+면 별도 `[필터 더보기]` 모달).

## avoid

- Box Default 텍스트를 회색으로 바꾸지 말 것 — 캐포비 가이드는 #DDD 위 흰 텍스트(저대비)가 의도된 스펙.
- Underline 인디케이터를 3px(base) 로 두지 말 것 — 캐포비는 2px. 단, 브랜드 cascade 가 처리하므로 직접 px 박지 말 것.
- Tab 으로 다단계 폼 진행도(Step)를 표현하지 말 것 — Stepper variant=bar 사용.
- 큰 분류(상호 배타적)를 Filter 로 만들지 말 것 — 예: 진행중/종료를 토글 필터로. → **Tab** 사용.
- 조건 좁히기를 Tab 으로 만들지 말 것 — 예: 날짜 범위를 Tab 으로. → **Filter** 사용.
- Tab 안에 또 Tab 을 중첩하지 말 것(계층이 깊어져 길을 잃음) — Sub-section 은 Accordion 또는 Anchor.
- Underline Tab 과 Box Tab 을 같은 화면에서 혼용하지 말 것.
- FilterBar 에 Primary CTA 외 다른 액션 버튼을 여러 개 두지 말 것(CTA 는 1개만).
