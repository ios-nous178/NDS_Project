# 컴포넌트 통합·제거 감사 보고서 (2026-06-12)

레포 정리 라운드에서 수행한 DS 컴포넌트 표면 감사. **이 라운드에서는 코드 변경 없음** — 후보와 근거만
기록하고, 실행(deprecate→제거)은 팀 논의 후 별도 라운드에서 진행한다.

실측 기준: react 공개 컴포넌트 125 · MCP 가이드 144 · componentInventory 132 (2026-06-12).

---

## 1. 도메인 특화 카드 5종 — deprecate 후보

CLAUDE.md DS 편입 기준 대비 평가. 모두 **기준 3(앱 비즈니스 로직/도메인 규칙 없음)** 에 걸리는
도메인 어휘 컴포넌트로, 일반화된 베이스(Card/List 패턴)로 표현 가능하다.

| 컴포넌트         | 도메인        | 기준1 (2+ 브랜드)          | 기준2 (figmaNodeUrl) | html 미러 | 판정                                                                          |
| ---------------- | ------------- | -------------------------- | -------------------- | --------- | ----------------------------------------------------------------------------- |
| ProductCard      | 커머스(상품)  | 사실상 Geniet 전용         | 있음                 | 있음      | deprecate 후보 — MediaCard/Card 합성으로 대체 가능 검토                       |
| ReviewCard       | 커머스(리뷰)  | 사실상 Geniet 전용         | **없음**             | 있음      | deprecate 후보                                                                |
| OrderSummaryCard | 결제(주문)    | 캐포비/커머스 전용         | **없음**             | 있음      | deprecate 후보                                                                |
| AppointmentCard  | 상담 예약     | NudgeEAP/Trost 상담 도메인 | **없음**             | 있음      | 보류 — 2개 브랜드 사용이면 기준1 충족. 기준2(figma)·기준3(도메인) 재평가 필요 |
| CounselorCard    | 상담사 프로필 | NudgeEAP/Trost 상담 도메인 | **없음**             | 있음      | 보류 — 동상                                                                   |

권장 deprecate 경로 (실행 라운드에서):

1. `guides-src/components/<Name>.md` frontmatter 에 deprecated 표기 + 대체 패턴 안내
2. MCP `suggest_replacement` 에 대체 매핑 등록 (예: ProductCard → Card+MediaThumbnail 합성)
3. react/html export 는 1 minor 유지 후 제거 (changeset major 아님 — 신규 사용만 차단하는 단계적 수순)

figmaNodeUrl 없는 4종은 `scripts/guide-figma-baseline.json` waiver 에 이미 등재 —
deprecate 가 확정되면 노드 확보 대신 baseline 에서 사유를 "deprecated" 로 바꾸는 것으로 종결.

## 2. DateRangePicker ↔ Calendar 중복

| 파일                                     | 줄수 |
| ---------------------------------------- | ---- |
| `packages/react/src/Calendar.tsx`        | 269  |
| `packages/react/src/DateRangePicker.tsx` | 541  |
| `packages/styles/src/Calendar.ts`        | 178  |
| `packages/styles/src/DateRangePicker.ts` | 366  |

- 두 컴포넌트가 **월 그리드 빌드 로직을 각자 구현** — Calendar 는 `buildGrid()`(Calendar.tsx:81),
  DateRangePicker 는 자체 날짜 산술(startOfDay/min/max/disabled 판정, DateRangePicker.tsx:123-203).
  서로 import 관계 없음.
- 흡수안: Calendar 에 `mode="range"` 를 추가하고 DateRangePicker 는 Calendar(range) + 트리거
  인풋의 합성으로 재구현. 월 그리드/요일 헤더/disabled 규칙이 한 곳으로 모인다.
- 비용: DateRangePicker 의 프리셋(이번 달/지난 7일 등)·듀얼 팬 레이아웃을 Calendar API 로 옮기는
  설계 필요. styles 366줄 중 그리드 셀 스타일 ~40% 가 Calendar.ts 와 같은 패턴.
- DatePicker(412줄)도 같은 흡수 대상이나 우선순위는 RangePicker 보다 낮음 (자체 그리드 없음 여부 재확인 필요).

## 3. 가이드 없는 react 컴포넌트 (실측 2건)

탐색 단계에서 "16개"로 보고됐으나 **실측은 2건** — 나머지는 브랜드 셸 비대칭(4절)이었다.

- `FormSection` — guides-src 없음. FormField 가이드에 흡수하거나 신규 작성.
- `SelectionButton` — guides-src 없음 + componentInventory 에도 없음(카탈로그 baseline waiver 등재).
  Chip/SelectionButton 역할 중복 여부부터 판정 권장.

## 4. 수량 불일치 매트릭스 (react 125 / guides 144 / inventory 132)

| 차이                         | 건수 | 원인                                                                                                                                                                                                                                                                                |
| ---------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 가이드 ⊃ react(top-level)    | +21  | 브랜드 셸 가이드 — BrandChrome/BrandHeader/BrandFooter/BrandBottomNav(합성 4) + 브랜드별 AppBar/Footer/BottomNav/WebHeader/ScrollFab/Toast(17). 구현은 `packages/react/src/{brand}/` 서브디렉토리( barrel 별도) 또는 html 전용(nds-brand-chrome)이라 top-level export 집계에서 빠짐 |
| inventory ⊃ react(top-level) | +14  | 같은 브랜드 셸 중 inventory 에 등재된 부분집합 (AppBar/WebHeader + 브랜드별 12)                                                                                                                                                                                                     |
| react ⊃ guides               | +2   | FormSection · SelectionButton (3절)                                                                                                                                                                                                                                                 |
| react ⊃ inventory            | +8→0 | AddButton/Header/BrandLogo/PageSizeSelect/InputGroup/SelectionButton/Sidebar — 이번 라운드에 `scripts/storybook-catalog-baseline.json` waiver 로 박제, 신규 누락은 게이트가 차단                                                                                                    |

결론: 수량 차이의 대부분은 "방치"가 아니라 **브랜드 셸의 집계 표면 비대칭**이다. 단,
브랜드 셸을 카탈로그(인벤토리·가이드·스토리)에서 어떤 단위로 셀지(합성 4개로 셀지, 브랜드×종류로 셀지)
규칙이 없어서 표면마다 다르게 세고 있다 — 이 규칙을 정하면 3면 게이트로 강제할 수 있다.

## 5. 부수 발견

- `brands/cashwalk-biz/DESIGN.md` 부재 — 4개 브랜드만 DESIGN.md 보유. 캐포비 토큰 의도 문서화 공백.
- 레거시 `--semantic-primary-*` 별칭: dist 어디에도 emit 되지 않는데 MCP 가이드 일부(LikeButton·Calendar
  예시, mockup-validator 안내 문구)가 `var(--semantic-primary-main)` 사용을 권장 — 외부 목업에서
  미정의 변수가 된다. 가이드 예시를 `--semantic-*` role 토큰으로 교체 필요 (별도 /ds-fix 건).
