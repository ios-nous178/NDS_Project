---
"@nudge-design/icons": minor
---

트로스트 브랜드 아이콘 세트 확장 (Figma 아이콘 가이드 동기화)

- Figma Trost Iconography 라이브러리 기준으로 60여 종의 신규 트로스트 아이콘을 추가했습니다 — 내비게이션(chevron 4방향·arrow-back/forward), 액션(close·share·play·pause·skip·more·download·delete·camera·pencil·reply·coupon), 상태(question·info·caution·check·check-circle), 콘텐츠(heart·star·bookmark·eye·medal·book·people·thumb-up/down), 폼/기타(menu·list·memo·calendar·time·place·location·subway·web·call·headphone·message·consult) 등.
- 기존 트로스트 아이콘(home·my·mentalcare·counsel-active·search·setting·psych-test·alarm·energy-coin)을 최신 Figma 가이드 도형으로 리프레시했습니다.
- 결과 아이콘 TestresultSafe/Warning/Danger 를 다색(multicolor) 트랙으로 이동했습니다 — 시그니처 컬러를 보존하는 일러스트성 아이콘이라 `--semantic-icon-*` 토큰 오버라이드 대상이 아니기 때문입니다(icon-color 가이드 정합).
- 단색(mono) 아이콘은 모두 `currentColor` 로 정규화되어 `color` prop / `--semantic-icon-*` 토큰으로 자유롭게 색을 바꿀 수 있습니다.
