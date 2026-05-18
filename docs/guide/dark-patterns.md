---
sidebar_position: 11
title: 다크패턴
---

<!-- AUTO-GENERATED FILE. SSOT: packages/mcp/src/guides.ts (PATTERN_GUIDES['dark-patterns']). Run `pnpm generate:guide-docs` after editing the source. -->

# 다크패턴

사용성을 해치는 5 가지 다크패턴. 외부 mockup 프로젝트에서는 `get_guide({ topic: "pattern:dark-patterns" })` MCP 호출로 동일 본문을 받습니다.
시각 안티패턴(`visual-antipatterns`) 이 색·강조·반복 같은 스타일을 다룬다면, 이 문서는 진입·뒤로가기·CTA 라벨 같은 **플로우·사용성** 차원의 안티패턴을 다룹니다.

## 요약

사용성을 해치는 다크패턴 5건. 어느 것 하나라도 적용되면 신뢰가 크게 떨어지고, 외부(앱인토스 등) 검수에서는 출시 거절 사유가 된다. visual-antipatterns(시각/스타일)와 별개로 플로우/사용성 차원의 안티패턴이다.

## 규칙

- **진입 직후 인터럽트 금지** — 화면 진입 즉시 BottomSheet/Modal/풀스크린 광고/알림 동의 자동 노출 금지. 사용자가 의도한 화면을 먼저 보여주고, 안내·동의는 사용자가 가치를 체감한 시점이나 자연스러운 액션 직후로 미룬다.
- **뒤로가기 직후 인터럽트 금지** — 사용자가 이전 화면으로 돌아가려는 순간에 BottomSheet/Modal 로 알림 동의·만류·재구매 유도를 띄우지 않는다. 이탈을 막기 위한 의도된 인터럽트는 자율성 침해.
- **거절 불가 CTA 금지** — 다이얼로그/풀스크린 카드의 버튼이 '확인' 하나뿐이거나, 가능한 선택지가 모두 같은 결과로 이어지는 구조 금지. 비파괴 옵션(닫기/나중에/건너뛰기)을 항상 1개 이상 노출.
- **플로우 중간 예상 못한 전면 모달/광고 금지** — 사용자가 메뉴/액션(예: 아이템 받기)을 눌렀을 때, 그 결과 대신 다른 콘텐츠(광고/프로모션/추가 동의)가 먼저 끼어들면 안 된다. 광고가 필요하다면 결과 화면 뒤 또는 별도 전용 위치에.
- **CTA 라벨 모호성 금지** — 버튼만 보고 다음 행동/화면을 예측할 수 있어야 한다. 위 카피의 가치 제안을 그대로 반복한 버튼('지금 시작', '확인')은 사용자가 결과를 예측 못해 클릭을 망설이게 만든다. 버튼 위에 과장된 보조 설명을 함께 노출해 버튼 역할을 흐리는 것도 금지. 라이팅 룰은 get_guide({ topic: 'ux-writing' }) 의 CTA microcopy 참고.

## 피해야 할 패턴

- 온보딩/홈 진입 직후 자동 BottomSheet (특히 알림 동의 / 마케팅 동의)
- 뒤로가기 누르면 '잠깐만요!' BottomSheet 로 만류
- 혜택/공지 다이얼로그의 버튼이 '확인' 하나만 있는 구조
- 메뉴 클릭 → 의도한 화면 대신 전면 광고 → (광고 닫기 후) 의도한 화면
- 버튼 위에 'OO를 받을 수 있는 특별한 기회' + 버튼 라벨 '받기' 처럼 보조 설명이 라벨을 흐리는 구성
- 다이얼로그 보조 버튼 라벨을 '취소'로 두기 → 사용자가 작업 자체가 취소된다고 오해

## Metrics

| Key                          | Value    |
| ---------------------------- | -------- |
| `maxAutoSheetsOnEntry`       | 0        |
| `maxInterruptsOnBackPress`   | 0        |
| `minDeclineOptionsPerDialog` | 1        |
| `maxInterstitialsMidFlow`    | 0        |
| `ctaLabelClarity`            | required |
| `maxPrimarySolidPerScreen`   | 1        |
