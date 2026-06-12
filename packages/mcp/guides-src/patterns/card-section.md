---
metrics:
  containerBorder: 1px (semantic-border-normal-default)
  containerRadius: 12-16px (--shape-md / --shape-lg)
  containerBgToken: var(--semantic-bg-surface-default)
  headerTitleType: H4 Bold (또는 Body 1 Bold)
  headerSubType: Caption Regular Muted (우측 정렬)
  innerRowVariant: thumb only
  innerRowMaxCount: 10 (이상은 페이지네이션 필수)
  paginationThreshold: 6
  maxNestingLevel: 1
  figmaNodeUrl: https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=337-1506
---

## summary

Section/Group Card 패턴 — 카드 안에 list rows 를 담는 컨테이너 카드. 단일 Card 가 아니라 '관련 row 묶음 + 섹션 제목 + 페이지네이션' 을 한 번에 포장하는 구조. Figma 출처: Zenirit Card 가이드의 'Background+Border+Shadow' 명세 (예: '루테인 포함 영양제 · 총 84개 제품').

## rules

- **구조**: 외곽 컨테이너(border 1px + radius 12-16 + bg surface) → 헤더(섹션 타이틀 + 보조 정보, 예: '총 84개 제품') → 내부 row 리스트(보통 Thumb variant ListItem 5-6개) → 페이지네이션 (선택).
- **컨테이너 vs 단일 Card**: Section Card 는 Card 가 아니라 'Card-of-Cards' 컨테이너. variant prop 으로 표현하지 말고, 별도 `<Card.Root variant='section'>` 또는 `<Section bordered>` 형태로 분리.
- **내부 row 제약**: 내부에 들어가는 row 는 Thumb variant 의 단순 형태만 (썸네일 + Title + Meta). 다른 variant 혼용 금지.
- **Composition 제약**: Section Card 안의 row 는 Composition 슬롯을 4개 모두 사용하지 않음. Title + Star rating + Review count 정도까지만. 위계 충돌 방지.
- **헤더 라인**: 섹션 타이틀(H4 Bold) + 보조 정보(Caption Regular Muted, 우측 정렬). 헤더 line-height 24px 고정.
- **페이지네이션**: 6개 이상이면 하단 페이지네이션 추가. 6개 이하면 페이지네이션 없이 그대로.
- **중첩 금지**: Section Card 안에 또 다른 Section Card 금지. 카테고리 그룹이 필요하면 Section Card 를 형제 노드로 나란히 둠.
- **Card 가이드 권위 룰과 정합**: Card 단일 가이드의 'Nested Card 금지' 룰을 Section 컨테이너만 예외 — Section 은 row 를 담는 컨테이너지 row 자체가 Card 가 아님 (그래서 위반 아님).

## avoid

- Section Card 안에 또 다른 Section Card (3중 중첩)
- 내부 row 마다 elevation/border 추가 — Section 컨테이너가 이미 경계 표시
- 내부에 List/Cover variant row 혼합 — Thumb only
- Section 헤더에 CTA 버튼 추가 — '더보기' 가 필요하면 페이지네이션 또는 별도 하단 TextButton
- 내부 row 가 1-2개뿐인 Section Card — 컨테이너 의미 없음, 직접 row 노출
- 단일 1회성 메시지 그룹을 Section Card 로 포장 — Banner/Notice 가 적절
