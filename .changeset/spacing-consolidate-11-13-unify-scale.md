---
"@nudge-design/tokens": major
"@nudge-design/tailwind-preset": minor
"@nudge-design/styles": patch
"@nudge-design/html": patch
---

spacing 스케일 정리 — 어정쩡한 legacy 토큰 흡수 + 브랜드 공통화

- **`--spacing-11` · `--spacing-13` 제거**: 각각 1곳씩만 쓰이던 legacy 값. 가장 가까운 표준 스텝 `12`로 흡수했습니다. (Modal 헤더 패딩 11→12, ProjectChrome 칩 패딩 13→12 — 시각상 1px 차이). `--spacing-14`는 6곳에서 쓰여 유지.
- **cashwalk-biz의 spacing 숫자 스케일 override 제거**: 값이 base와 동일했고 cashwalk-biz 전용으로 얹던 `--spacing-56` / `--spacing-64`는 소비처가 없었습니다. 이제 spacing도 radius처럼 **모든 프로젝트가 base 단일 스케일을 공유**합니다 (프로젝트 차이는 컴포넌트 슬롯·inset·gapTitle 로만). cashwalk-biz의 inset/gapTitle/borderWidth 등 실제 값이 다른 override는 그대로 유지.

- **tailwind-preset**: cashwalk-biz preset 도 다른 프리셋과 동일하게 공통 spacing 스케일을 사용합니다. cashwalk-biz tailwind 유틸에서 `spacing-56` / `spacing-64` 가 사라지고 `spacing-80` 이 추가됩니다.

외부 소비처가 `var(--spacing-11)` / `var(--spacing-13)` / `var(--spacing-56)` / `var(--spacing-64)` 를 직접 참조했다면 표준 스텝(`12` 등)으로 교체하세요.
