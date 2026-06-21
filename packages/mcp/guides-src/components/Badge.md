---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-10856
references:
  - label: CashwalkBiz Admin Badge/Chip Guide — RoundedSquare / Pill
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3782-20558
    caption: 'Cashwalk for Business · Label & Chip(ChipGuide). Badge 두 shape — RoundedSquare(shape="default", radius 4~6, 동적 상태값 충전·사용·적립·만료·취소) / Pill(shape="pill", radius full, 정적 식별 태그 일반 계정·프리미엄·신규). 톤은 ghost 변형으로 매핑(충전=project·사용=info·적립=success·만료=neutral·취소=error). SelectChip 은 Badge 아니라 Chip 컴포넌트.'
    project: cashwalk-biz
  - label: Trost Badge Guide — type(label/dot/count) · 5톤(ghost)
    url: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/Trost-Library?node-id=5107-130
    caption: 'Trost Library · Badge. 유형(type) 3종 — label(텍스트 배지, 기본) / dot(8×8 상태 점, 텍스트 없음) / count(min 18px 원형 숫자 카운터). 5톤(neutral·project·success·error·info)은 variant="ghost" 의 subtle 룩으로 표현(project=#FFFDD9 bg/#FF9D00 text 등). dot·count 의 색은 variant=fill 룰(예: color="error" → 빨강).'
    project: trost
usagePolicy:
  useFor:
    - 상태 표시 (진행중 / 완료 / 마감)
    - 속성 라벨 (신규 / 추천 / 필수)
    - 리스트 Row 의 보조 메타 정보
  doNotUseFor:
    - 버튼 / CTA 대체
    - 섹션 제목 장식
    - 본문 강조용 컬러 칩
    - 모든 카드에 반복되는 시각 장식
  colorPolicy:
    project: 현재 선택 · 핵심 강조에만
    neutral: 일반 카테고리 · 기본 속성 (기본값)
    success: 성공/완료 의미
    error: 오류/실패 의미
    caution: 주의/경고 의미
    info: 정보/안내 의미
  variantPolicy:
    fill: 강한 상태 표시 — 카드당 최대 1개
    ghost: 일반 카테고리 · 기본 보조 정보 (권장 기본값)
    line: 비활성/완료 상태
  shapePolicy:
    default: 라운드 사각(radius 4~6) — 거래/처리 상태·카테고리 같은 동적 상태값(충전·사용·적립·만료·취소). 데이터 테이블·리스트 셀 기본.
    pill: 완전 둥근(radius full) — 계정 유형·식별성 같은 정적 속성 태그(일반 계정·프리미엄·신규). 헤더/타이틀 옆 식별 표식. 동적 상태값에는 쓰지 말 것(혼용 주의).
  limits:
    maxLabelLength: 8
    maxFillPerCard: 1
    maxPerCard: 2
---

## summary

상태/속성을 한눈에 알려주는 보조 라벨. variant: fill/ghost/line · color: project/neutral/success/error/caution/info · shape: default(라운드 사각)/pill(완전 둥근) · **type: label/dot/count**. Figma 171:10856 (캐포비 admin ChipGuide 3782-20558 · 트로스트 5107-130). label prop 필수. 콘텐츠가 아니라 콘텐츠를 보조하는 메타 정보만 담는다. **shape 로 의미 구분 — 동적 상태값=default(사각), 정적 식별 태그=pill.** **type 축**(트로스트 5107-130, 기본 label·하위호환): label=텍스트 배지 · dot=8×8 점(텍스트 없음·활성/미확인) · count=min 18px 원형 숫자 카운터(99 초과 `99+`); dot·count 색은 ghost 가 아니라 variant=fill 룰을 따른다(예: `color="error"`→빨강). 가이드 5톤(neutral/project/success/error/info)은 variant="ghost" subtle 룩(project=#FFFDD9 bg/#FF9D00 text), caution 은 앰버 경고용으로 enum 유지.

## pitfalls

- Badge 는 강조 요소가 아니라 보조 정보 — 본문 텍스트보다 시선을 끌면 안 된다.
- Fill Badge 남용 금지 — 한 카드/리스트 Row 에 Fill Badge 가 2개 이상 보이면 위계가 무너진다. 일반 카테고리는 ghost/line 우선.
- Project color 는 '현재 선택 / 핵심 강조' 에만 사용. 일반 카테고리·상태 표시에는 neutral 우선.
- 상태 색(success/error/caution/info) 은 의미 전달 목적에만 사용 — 단순 강조용 컬러로 쓰지 말 것.
- **대기/검수/검토 같은 '중립 워크플로 상태'는 neutral 로** — caution(앰버)은 *주의/경고/선착순* 의미라 '검수 대기'·'대기중'·'검토중' 같은 진행 단계에 쓰면 불필요한 경고처럼 보인다(회귀: 캐포비 '검수 대기' 를 앰버 caution 으로 표기 → '이 색 어디서 나왔나' 혼동). 진행 단계 라벨은 `color="neutral"`, 경고/위험만 caution.
- Tone-on-Tone 금지: 연한 Blue 배경 위에 Blue Fill Badge, 연한 Teal Surface 위 Teal Badge 같은 동일 계열 중첩 금지.
- Badge 안에 긴 문장/CTA 보조 문구 금지 — 8자 안팎 짧은 라벨만.
- Chip 과 혼용 금지 — Chip 은 '선택/필터/분류 액션', Badge 는 '상태/속성 표시(비액션)'.
- **shape 로 동적/정적 의미 구분 (캐포비 admin · Figma 3782-20558)**: `shape="default"`(라운드 사각)=거래/처리 상태·카테고리 같은 **동적 상태값**(충전·사용·적립·만료·취소), `shape="pill"`(완전 둥근)=계정 유형·식별성 같은 **정적 속성 태그**(일반 계정·프리미엄·신규). 둘을 혼용하지 말 것 — 동적 상태값에 pill, 정적 식별에 사각을 쓰면 의미 신호가 깨진다. 데이터 테이블 셀에는 default 사각이 기본.
- **type 혼동 금지 (트로스트 5107-130)**: `dot` 은 텍스트 없는 8×8 점이라 children 을 넣어도 의미가 없다 — 텍스트가 필요하면 `label`. `count` 는 숫자 카운터 전용(min 18px 원형), 라벨 텍스트를 넣지 말 것. dot·count 의 색은 ghost 톤이 아니라 variant=fill 룰을 따른다(color 로 의미색 지정).

## examplesHtml.do

```html
<nds-badge variant="fill" color="project" size="md">NEW</nds-badge>
<nds-badge variant="ghost" color="success" size="sm">완료</nds-badge>
<!-- 캐포비 admin: 동적 상태값 = 라운드 사각(shape 기본) ghost 톤 -->
<nds-badge variant="ghost" color="project" size="sm">충전</nds-badge>
<nds-badge variant="ghost" color="info" size="sm">사용</nds-badge>
<nds-badge variant="ghost" color="success" size="sm">적립</nds-badge>
<nds-badge variant="ghost" color="neutral" size="sm">만료</nds-badge>
<nds-badge variant="ghost" color="error" size="sm">취소</nds-badge>
<!-- 캐포비 admin: 정적 식별 태그 = pill -->
<nds-badge variant="ghost" color="neutral" shape="pill" size="sm">일반 계정</nds-badge>
<nds-badge variant="ghost" color="project" shape="pill" size="sm">프리미엄</nds-badge>
<!-- 트로스트: type 축 — dot(8×8 점, 텍스트 없음) / count(원형 숫자 카운터) -->
<nds-badge type="dot" variant="fill" color="error"></nds-badge>
<nds-badge type="count" variant="fill" color="error">12</nds-badge>
<nds-badge type="count" variant="fill" color="project">99+</nds-badge>
```

## examplesHtml.dont

```html
<!-- hex 인라인. 시멘틱 컬러 토큰을 잃음 -->
<nds-badge style="background:#FFD400;color:#000">NEW</nds-badge>
<!-- 안내문/섹션 제목에 Badge 도배 — Badge 는 상태/짧은 속성용 -->
<nds-badge color="project">오늘의 미션</nds-badge>
<!-- 동적 상태값(적립/충전/만료…)에 pill — pill 은 정적 식별 태그 전용이라 의미 신호가 깨짐 -->
<nds-badge variant="ghost" color="success" shape="pill">적립</nds-badge>
<!-- count 에 라벨 텍스트 — count 는 숫자 카운터 전용 -->
<nds-badge type="count" color="error">신규</nds-badge>
```
