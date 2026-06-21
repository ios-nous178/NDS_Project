---
"@nudge-design/tokens": major
"@nudge-design/tailwind-preset": major
---

아토믹 컬러 패밀리 이름을 **공통 Family 한 벌로 통일**했습니다.

그동안 브랜드마다 같은 색을 다른 이름으로 부르거나(예: Trost `cobalt`, Geniet `mint`) 한 이름이 브랜드별로 다른 것을 가리키던 것(`neutral` = warm 회색이기도, 흑백이기도)을, 색 이름 기준 공통 Family로 정리했습니다. **값은 브랜드별로 그대로 유지**됩니다(전 브랜드 763개 시멘틱 토큰 동일 hex — value-freeze 검증).

**리네임 (BREAKING — atomic 공개 export · `--color-*` CSS 변수 · tailwind 유틸 이름 변경):**
- `cobalt` → `indigo` (Trost)
- `mint` → `teal` (Geniet)
- `magenta` → `pink`
- `red`(#F13F00, EAP 에러=오렌지레드) → `orange` / `coralRed`(#FF4141) → `red`
- `neutral`(warm 회색) → `gray`, 흑백(white/black)은 신규 `common` Family로 분리, 차가운 회색은 기존 `coolGray` 유지 (runmile 의 회색은 cool 이라 `coolGray` 로)

**최종 공통 Family**: Common · Gray · CoolGray · Blue · Teal · Red · Orange · Yellow · Green · Indigo (+ 브랜드 accent: Pink · Amber · Purple · Brown).

**마이그레이션 가이드** — 외부에서 atomic 토큰을 직접 쓰던 경우:
- `var(--color-cobalt-*)` → `var(--color-indigo-*)`, `--color-mint-*` → `--color-teal-*`, `--color-magenta-*` → `--color-pink-*`, `--color-neutral-*` → `--color-gray-*`(흑백은 `--color-common-*`)
- 단, 컴포넌트는 시멘틱 토큰(`--semantic-*`)을 쓰므로 대부분 영향 없음 — 직접 atomic 참조 시에만 해당.
- 역할(role) 토큰 `neutral`(button.neutral 등)·시멘틱 status 는 변경 없음.
