---
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

Text 타이포 primitive 추가 + 공용 타이포 클래스 레이어 · ExpandableText·ContentViewer 정리 (BREAKING)

### 추가

- **Text** (`nds-text`) — 타이포 primitive. `variant`(타입 스케일 14단)·`tone`(시맨틱 색 12종)·`weight`·`maxLines`·`as` 를 토큰에서만 받아 임의의 텍스트에 거는 얇은 컴포넌트입니다. Heading 의 body 짝 — "제목+설명 묶음"은 `Heading`, "한 덩이의 텍스트(본문·라벨·메타·캡션)"는 `Text` 를 쓰세요. `expandable` 로 길면 '더보기/접기' 토글이 됩니다.
  - 예: `<Text variant="body1" tone="normal" as="p">…</Text>` / `<Text variant="caption1" tone="subtle">메타</Text>` / `<Text expandable maxLines={3}>긴 설명…</Text>`
- **공용 타이포 클래스 레이어** (`.nds-text-{scale}` / `.nds-text-tone-{role}` / `.nds-text-weight-{name}`) — DS 의 첫 공용 타이포 SSOT. 컴포넌트마다 `font-size`/`line-height` 를 인라인으로 박던 패턴을 대체합니다. 신규 디자인 토큰은 0개(기존 `typeScale`·`textRole`·`fontWeight` 재사용).

### 제거 (BREAKING)

외부에서 import 중이면 빌드가 깨집니다.

- **ExpandableText** (`nds-expandable-text`) → **`Text` 의 `expandable` 로 흡수**했습니다. `<ExpandableText lines={3}>…</ExpandableText>` 는 `<Text expandable maxLines={3}>…</Text>` 로 바꾸세요. 라벨(`expandLabel`/`collapseLabel`)·`hideCollapse`·제어(`expanded`/`onExpandedChange`) prop 은 그대로 옮겨옵니다.
- **ContentViewer** (`nds-content-viewer`) → **`Article.Body` 로 통합**했습니다. sanitize 안전 렌더 로직은 그대로 살아있고, 공개 컴포넌트만 없앴습니다. `<ContentViewer html={…} />` 는 `<Article.Body html={…} />` 로, html 은 `<nds-article-body html="…">` 로 바꾸세요(위험태그 제거 + allowlist 동작 동일).

### 개선

- **Heading** 이 새 공용 클래스 레이어를 소비하도록 이전 — 폰트 크기를 JS 인라인으로 박던 코드를 제거해 타이포 SSOT 를 하나로 모았습니다(시각 동작 동일).
