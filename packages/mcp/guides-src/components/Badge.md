---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-10856
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
    brand: 현재 선택 · 핵심 강조에만
    neutral: 일반 카테고리 · 기본 속성 (기본값)
    success: 성공/완료 의미
    error: 오류/실패 의미
    caution: 주의/경고 의미
    info: 정보/안내 의미
  variantPolicy:
    fill: 강한 상태 표시 — 카드당 최대 1개
    ghost: 일반 카테고리 · 기본 보조 정보 (권장 기본값)
    line: 비활성/완료 상태
  limits:
    maxLabelLength: 8
    maxFillPerCard: 1
    maxPerCard: 2
---

## summary

상태/속성을 한눈에 알려주는 보조 라벨. variant: fill/ghost/line · color: brand/neutral/success/error/caution/info. Figma 171:10856. label prop 필수. 콘텐츠가 아니라 콘텐츠를 보조하는 메타 정보만 담는다.

## pitfalls

- Badge 는 강조 요소가 아니라 보조 정보 — 본문 텍스트보다 시선을 끌면 안 된다.
- Fill Badge 남용 금지 — 한 카드/리스트 Row 에 Fill Badge 가 2개 이상 보이면 위계가 무너진다. 일반 카테고리는 ghost/line 우선.
- Brand color 는 '현재 선택 / 핵심 강조' 에만 사용. 일반 카테고리·상태 표시에는 neutral 우선.
- 상태 색(success/error/caution/info) 은 의미 전달 목적에만 사용 — 단순 강조용 컬러로 쓰지 말 것.
- **대기/검수/검토 같은 '중립 워크플로 상태'는 neutral 로** — caution(앰버)은 *주의/경고/선착순* 의미라 '검수 대기'·'대기중'·'검토중' 같은 진행 단계에 쓰면 불필요한 경고처럼 보인다(회귀: 캐포비 '검수 대기' 를 앰버 caution 으로 표기 → '이 색 어디서 나왔나' 혼동). 진행 단계 라벨은 `color="neutral"`, 경고/위험만 caution.
- Tone-on-Tone 금지: 연한 Blue 배경 위에 Blue Fill Badge, 연한 Mint Surface 위 Mint Badge 같은 동일 계열 중첩 금지.
- Badge 안에 긴 문장/CTA 보조 문구 금지 — 8자 안팎 짧은 라벨만.
- Chip 과 혼용 금지 — Chip 은 '선택/필터/분류 액션', Badge 는 '상태/속성 표시(비액션)'.

## examplesHtml.do

```html
<nds-badge variant="fill" color="brand" size="md">NEW</nds-badge>
<nds-badge variant="ghost" color="success" size="sm">완료</nds-badge>
```

## examplesHtml.dont

```html
<!-- hex 인라인. 시멘틱 컬러 토큰을 잃음 -->
<nds-badge style="background:#FFD400;color:#000">NEW</nds-badge>
<!-- 안내문/섹션 제목에 Badge 도배 — Badge 는 상태/짧은 속성용 -->
<nds-badge color="brand">오늘의 미션</nds-badge>
```
