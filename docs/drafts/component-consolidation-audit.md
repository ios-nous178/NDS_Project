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

---

## 6. 2차 라운드 — 유사 클러스터 전수 스윕 (2026-06-13)

1차에서 다루지 않은 이름·역할 유사 클러스터를 전수 비교했다 (버튼 계열 / 배너·노티스 계열 /
오버레이 5종 / Input 계열 6종 / Select 계열 4종 / 헤더 계열). 결론: **신규 통합 후보는 1건뿐**.

### 6.1 TextButton ↔ Button (낮은 우선순위, 조건부)

- `TextButton.tsx` 80줄 — Button 과 별개 구현. size 2단(large/medium) + left/rightIcon 만 가진
  텍스트 전용 버튼. Button 에 `variant="text"` 를 추가하면 API 상으로는 흡수 가능.
- **반대 근거**: TextButton 은 자체 Figma 노드(171:8550/171:8538)와 자체 MCP 가이드를 가진
  독립 디자인 엔티티다. Figma SSOT 가 둘을 별개 컴포넌트로 유지하는 한, 코드만 합치면
  figma↔code 매핑이 어긋난다. **디자인 쪽에서 Button 세트로 합칠 계획이 생길 때만 실행** 권장.

### 6.2 유지 판정 클러스터 (통합 비권장)

| 클러스터                                              | 판정 근거                                                              |
| ----------------------------------------------------- | ---------------------------------------------------------------------- |
| AddButton / IconButton / SelectionButton              | 시멘틱·인터랙션 모델이 각각 다름 (추가 액션 / 아이콘 단독 / 선택 토글) |
| Banner / NoticeAlert / FloatingCtaBanner              | 레이아웃·색상 전략·고정 위치가 본질적으로 다름                         |
| Modal / Popup / BottomSheet / Tooltip / Popover       | compound 구조로 역할 분리 명확                                         |
| Input / SearchInput / PhoneInput / AmountInput 등 6종 | 마스킹·도메인 로직이 각자 본질                                         |
| Select / MultiSelect / PageSizeSelect / Dropdown      | MultiSelect 는 풋터·전체선택, PageSizeSelect 는 preset 이 본질         |

컴포넌트 prop 표면의 deprecated 정리(Card 의 subtitle/meta/footer/footerNoBorder 등 prop-level
`@deprecated` 4건)는 통합과 별개의 청소 항목으로, major 전에 일괄 제거 라운드를 잡으면 된다.

---

## 7. 실행 기록 (2026-06-13) — 카드류 제외, 나머지 통합

사용자 지시: **카드 5종은 유지**, 나머지는 통합 진행.

### 7.1 Calendar ↔ DateRangePicker — 그리드 코어 통일 (구현 완료)

2절의 원래 제안("Calendar 에 `mode="range"` 추가 → DateRangePicker 를 Calendar 합성으로 재구현")은
**코드를 열어보니 부적합**으로 판명났다. 실제 구조:

- `DateRangePicker`(541줄)·`DatePicker`(412줄)는 이미 **공유 엔진 `internal/dateCore.ts`**
  (`buildMonthGrid`·`isSameDay`·`isBetweenDays` 등, Date 기반)을 쓰는 popover·듀얼팬·range·키보드
  네비·프리셋 컴포넌트.
- `Calendar`(269줄)만 **자체 `buildGrid`/`toIsoDate`(문자열 기반)** 를 따로 구현한 인라인 단일선택 뷰.

즉 진짜 중복은 "Calendar 가 그리드 로직을 따로 구현"한 것이고, 옳은 해소는 DRP 를 Calendar 로
욱여넣는 게 아니라(아키텍처 불일치 — 인라인 단일선택 ↔ popover range, DRP 의 검증된 a11y/키보드를
재작성하는 큰 리스크) **Calendar 를 공유 `dateCore` 위로 올리는 것**이다.

실행:

- `dateCore.buildMonthGrid(viewDate, weekStartsOn = 0)` 로 일반화 — 주 시작 요일 파라미터 추가
  (기본 0 = 일요일, 기존 1-인자 호출부 DatePicker/DRP 와 호환).
- `Calendar` 를 `buildMonthGrid` + `formatYMD` 로 이행 — 자체 `buildGrid`/`toIsoDate`/`pad2`/`DayCell`
  제거(269→232줄, 그리드 중복 45줄 삭제). **공개 API(value/onChange ISO·markers·weekStartsOn·month)
  무변경**.
- 검증: Calendar/DatePicker/DateRangePicker 스토리 테스트 14건 통과 · 그리드 출력 동등성 실행 검증
  (weekStartsOn 0·1 × 윤년/연말 경계) · mirror parity·typecheck 통과.

결과: 세 날짜 컴포넌트가 **단일 월-그리드 엔진**을 공유한다 — 그리드·요일·outside 규칙이 한 곳.
full 컴포넌트 병합(DRP→Calendar)은 아키텍처상 비권장으로 종결.

### 7.2 TextButton ↔ Button — 보류 유지 (6.1 재확인)

TextButton 은 자체 Figma 노드(171:8550/171:8538)·자체 가이드를 가진 독립 디자인 엔티티.
코드만 합치면 figma↔code 매핑이 깨진다 — 디자인 쪽에서 Button 세트로 합칠 결정이 설 때만 실행.
이번 라운드 통합 대상 아님(6.1 결론 유지).

### 7.3 가이드 공백 (FormSection · SelectionButton) — 별도 트랙에서 해소

3절의 가이드 없는 2건은 통합이 아니라 문서 공백 → guides-src 작성으로 처리.

---

## 8. 도메인 카드/컴포넌트 정리 라운드 (2026-06-13) — NudgeEAP Card 가이드 기준

Figma **CardRulesGuide(713:2)** 를 SSOT 로 삼아 도메인 카드/컴포넌트를 재감사. 가이드는
"Card = 합성 컨테이너(Title Required + 7 Optional 슬롯), Variant 카탈로그 금지"를 명시하고
조합 규칙에 **미디어 콘텐츠 카드(Thumbnail+Title+Desc+CTA)·프로필 카드(Avatar+Title+Metadata)·
수치 요약 카드(Title+Metadata+Footer)** 를 허용 조합으로 직접 명명 — 도메인 카드 다수가
사실 Card 합성 패턴임을 가이드가 보증.

10개 컴포넌트를 에이전트 병렬 감사(composability·도메인로직·표면)했다.

### ★ 핵심 교훈 — 인-레포 usage grep 은 신뢰 불가

감사는 brands/·mockup-core/·apps/ grep 으로 거의 전부 "실사용 0"으로 판정했으나, **사용자가
MediaCard 는 Geniet 에서 확실히 쓰인다고 정정**. 원인: 이 레포의 `brands/*` 는 토큰 스캐폴드
(DESIGN.md)일 뿐 실제 브랜드 앱이 아니다 — 진짜 소비처는 npm 으로 DS 를 받는 **별도 앱 레포**라
인-레포 grep 으로 안 잡힌다. 따라서 "0 usage → 삭제 안전" 추론은 **무효**. 제거/통합 후보는
실사용 여부를 사용자에게 확인한 뒤에만 손댄다.

**판정 정정**: 처음엔 "실사용이면 유지"로 4종을 전부 keep 했으나, 그건 _실사용_(=즉시 hard-delete
가능 여부)과 _방향_(=Card 합성/de-domain)을 혼동한 것이었다. 실사용은 제거 **방식**만 가른다 —
실사용이면 hard-delete 대신 **deprecate→migrate**(비파괴: `@deprecated` + 가이드 매핑 + export 1 minor
유지)로 같은 방향을 간다. 따라서 분석 verdict 를 살리되 안전하게 집행했다. 진짜 keep 은 도메인 로직이
실재하는 **MediaCard·ProductCard·ReviewCard 3종**뿐.

### 실행 결과

| 컴포넌트                           | 판정             | 처리                                                                                                                         |
| ---------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **VotePoll**                       | 제거             | 사용자 명시 삭제 + figmaNodeUrl 부재. 3면 미러/가이드/스토리/docs/카탈로그 전부 제거. 설문은 LikertScale.                    |
| **UserCard**                       | deprecate→Card   | `@deprecated` JSDoc + 가이드 매핑(프로필 카드: Avatar+Title+Subtitle+Description+Metadata+Cta). export 1 minor 유지(비파괴). |
| **CounselorCard**                  | deprecate→Card   | `@deprecated` + 가이드 매핑(Card.stories CompoundCounselorCard 가 합성 증명). export 1 minor 유지.                           |
| **AppointmentCard**                | deprecate→앱이관 | `@deprecated` — 날짜파생+status/mode 상태머신 = 앱 로직(편입기준 위반). 앱 레이어로 이관 권고, 시각은 Card 합성.             |
| **OrderSummaryCard**               | de-domain        | 도메인 무관 범용 요약(라벨:값+합계). category `도메인`→`데이터`, 코드/API 무변경. SummaryCard 별칭 후보.                     |
| **AttachmentItem**                 | de-domain        | category `도메인`→`일반(Display)`. 코드 무변경(범용 파일 list-item).                                                         |
| **FloatingCtaBanner**              | de-domain        | 동상 — figmaNodeUrl(91:3) 보유 프리미티브, 오태깅만 정정.                                                                    |
| **ContentViewer · MediaThumbnail** | de-domain        | 범용 프리미티브(안전-HTML 렌더러 / 이미지 표준화). 오태깅만 정정.                                                            |
| MediaCard                          | **유지**         | Geniet 실사용 + "미디어 콘텐츠 카드" 합성 가치.                                                                              |
| ProductCard                        | **유지**         | 가격/할인/적립/랭킹 = 커머스 도메인로직, Card 대체 불가. "Card" 네이밍 유지.                                                 |
| ReviewCard                         | **유지**         | half-star 알고리즘+verified+split 헤더. (후속: 빈 별 `#E0E0E0` 토큰화·figmaNodeUrl)                                          |

결론: 실제 제거 **VotePoll 1건**, deprecate **3건**(UserCard·CounselorCard·AppointmentCard, 비파괴),
de-domain 재분류 **5건**(OrderSummaryCard·AttachmentItem·FloatingCtaBanner·ContentViewer·MediaThumbnail).
진짜 keep 은 MediaCard·ProductCard·ReviewCard. `도메인` 카테고리 20→15. Card 가이드의 합성 철학은
**신규** 도메인 카드 추가를 막는 기준으로 상시 활용.
