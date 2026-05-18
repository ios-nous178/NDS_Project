---
sidebar_position: 12
title: 시각 안티패턴
---

<!-- AUTO-GENERATED FILE. SSOT: packages/mcp/src/guides.ts (PATTERN_GUIDES['visual-antipatterns']). Run `pnpm generate:guide-docs` after editing the source. -->

# 시각 안티패턴

1차 목업에서 퀄리티를 떨어뜨리는 대표 시각 안티패턴. 외부 mockup 프로젝트에서는 `get_guide({ topic: "pattern:visual-antipatterns" })` MCP 호출로 동일 본문을 받습니다.
다크패턴(`dark-patterns`) 이 진입·뒤로가기·CTA 라벨 같은 **플로우·사용성** 차원을 다룬다면, 이 문서는 색·강조·반복 같은 **시각·스타일** 차원의 안티패턴을 다룹니다.

## 요약

1차 목업에서 퀄리티를 떨어뜨리는 대표 시각 안티패턴.

## 규칙

- Tone-on-Tone Filled Component 금지: 연한 primary/blue 배경 위에 같은 계열의 연한 filled tag, badge, box를 반복하지 않는다.
- Primary color는 CTA, interactive, 핵심 highlight 중 하나의 역할로 제한한다. 배경/CTA/태그/카드/포커스/hover에 동시에 쓰지 않는다.
- 브랜드 로고 컬러는 UI accent color가 아니다. 로고의 gradient/accent 색은 로고 표현 용도로만 사용한다.
- 한 섹션에서 primary tint가 배경, 라벨, 아이콘, 카드 surface로 3회 이상 반복되면 neutral surface + 텍스트 위계로 낮춘다.
- 강조가 필요하면 색상보다 정보 우선순위, spacing, typography weight, CTA 위치를 먼저 조정한다.

## 피해야 할 패턴

- 연한 블루 페이지 배경 + 연한 블루 Chip + 연한 블루 안내 박스 조합
- primary blue를 배경, 버튼, 태그, hover, focus, 카드 테두리에 모두 사용
- 로고에 들어간 gradient/accent를 카드 배경이나 배지 색으로 재사용
- 새 영역마다 같은 색 계열 배경을 주어 섹션이 모두 강조되어 보이는 구성

## Metrics

| Key                                | Value     |
| ---------------------------------- | --------- |
| `maxPrimaryRolesPerScreen`         | 2         |
| `maxPrimaryTintSurfacesPerSection` | 1         |
| `logoColorAsUiAccent`              | forbidden |
| `toneOnToneFilled`                 | forbidden |
