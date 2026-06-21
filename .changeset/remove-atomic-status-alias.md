---
"@nudge-design/tokens": major
"@nudge-design/tailwind-preset": major
---

레이어 위반이던 아토믹 `status` 색 별칭을 제거했습니다.

`status`(error/success/info/caution)는 **시멘틱 역할**인데, 그동안 브랜드 팔레트(아토믹 레이어)에 `cashwalkStatus`·`cashwalkBizStatus`·`genietStatus`·`runmileStatus` 별칭으로 raw hex가 박혀 있었습니다. 이 값은 어떤 컴포넌트도 쓰지 않는(소비 0건) 중복이었고, Figma 변수에서는 `status/*`가 아토믹 컬렉션에, 브랜드 CSS에서는 `--color-status-*`로, Tailwind에서는 `status-*` 유틸로 새어 나오고 있었습니다.

상태색은 이미 시멘틱 토큰(`--semantic-bg-status-*` / `--semantic-text-status-*` / `icon` / `border` / `fill`)이 SSOT이며, 그쪽은 그대로 유지됩니다(값 변동 0 — 전 브랜드 575개 토큰 동일 hex). 이번 변경으로 아토믹 레이어는 "색 이름 램프"만 남아 Figma 정합 방향과 일치합니다.

**BREAKING**
- `@nudge-design/tokens`: `cashwalkStatus` / `cashwalkBizStatus` / `genietStatus` / `runmileStatus` export 제거. 상태색은 시멘틱 토큰(`var(--semantic-*-status-*)`)을 사용하세요.
- `@nudge-design/tailwind-preset`: 브랜드 프리셋의 아토믹 `status` 색 그룹 제거(raw-hex `status-*` 유틸 사라짐). 시멘틱 유틸(`bg-status-*` / `text-status-*` 등)은 그대로 유지됩니다.
- 산출물: Figma 변수의 아토믹 `status/*` 및 브랜드 CSS `--color-status-*` 제거(시멘틱 `status/*`는 유지).
