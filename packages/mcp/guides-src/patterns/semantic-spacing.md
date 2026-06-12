---
metrics:
  gridBase: 4pt
  gapDefault: --semantic-gap-default (10px)
  insetDefault: --semantic-inset-card (16px)
  allowedGapTokens: tight(4) / default(10) / comfortable(12) / loose(16) / wide(24)
  allowedInsetTokens: chip(8) / input(12) / card(16) / card-large(20) / modal(24)
  figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=SpacingGuide
---

## summary

Spacing 은 정보 관계와 위계를 표현하는 구조 시스템이다. 4pt grid · Figma SpacingGuide 실측 기반. Gap(요소 간 거리, 의도 기반) 과 Inset(컨테이너 내부 여백, 사용처 기반) 을 명확히 구분하고, 같은 의미의 간격은 같은 semantic 토큰만 사용한다.

## rules

- Gap (요소 간 거리) — 의도 기반 5단계만 사용:
    · `--semantic-gap-tight` (4px) → Chip · Badge 그룹
    · `--semantic-gap-default` (10px) ★ 표준 컴포넌트 gap
    · `--semantic-gap-comfortable` (12px) → 폼 필드 · 세그먼트
    · `--semantic-gap-loose` (16px) → 컴포넌트 ↔ 컴포넌트
    · `--semantic-gap-wide` (24px) → 큰 영역 ↔ 큰 영역
- Inset (컨테이너 내부 여백) — 사용처 기반 5단계만 사용:
    · `--semantic-inset-chip` (8px) → Chip · Badge 내부 padding
    · `--semantic-inset-input` (12px) → Input · 작은 컨테이너 padding
    · `--semantic-inset-card` (16px) ★ 카드 표준 padding
    · `--semantic-inset-card-large` (20px) → 큰 카드 padding
    · `--semantic-inset-modal` (24px) → Modal · 통계 박스 padding
- 결정 트리 — 내부 여백(padding)인지 요소 간격(gap)인지 먼저 판단한 뒤 위 토큰 중 하나로 매핑한다. 모호하면 표준값(`--semantic-gap-default` 10px / `--semantic-inset-card` 16px)을 우선.
- 같은 깊이·같은 의도의 간격은 항상 같은 토큰을 쓴다 — 한 화면 내 카드들이 모두 16px padding 이면 모두 `--semantic-inset-card` 로.
- Primitive(--spacing-N) 는 토큰 정의용. UI 코드에서는 직접 사용 금지 — 반드시 `--semantic-gap-*` / `--semantic-inset-*` 를 거친다.
- 임의 px 사용 금지: 5 / 7 / 9 / 11 / 13 / 15px 는 4pt 위반이므로 토큰으로 대체할 것.
- Inset 자리에 Gap 토큰 사용 / Gap 자리에 Inset 토큰 사용 금지 — padding 에 `--semantic-gap-*`, flex/grid gap 에 `--semantic-inset-*` 쓰지 않는다.

## avoid

- padding: 14px / margin: 11px 같은 raw px 직접 사용
- padding 에 `--semantic-gap-default` 사용 / gap 에 `--semantic-inset-card` 사용 (역할 혼동)
- 한 화면에 카드마다 다른 padding 토큰 사용 (일관성 손상)
- spacing 대신 색 배경 / border 만으로 영역 구분
- var(--spacing-12) 같은 primitive 토큰을 UI 코드에서 직접 사용
