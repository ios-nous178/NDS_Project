---
"@nudge-design/tokens": major
"@nudge-design/tailwind-preset": major
---

캐시워크 가이드 정리에 맞춰 **사용처 없는 토큰을 제거**했습니다 (radius 는 유지).

- **죽은 spacing 제거** — `spacing.1`(1px) · `spacing.7`(7px) · `spacing.33`(33px) · `spacing.64`(64px). 전 컴포넌트·스타일에서 소비 0건이던 legacy 값입니다. (실사용 중인 11·13·18·30·48·80 은 유지.)
- **`shape` 스케일 통째 제거** — `shape`(sm/md/lg/xl/pill)는 `radius` 정책의 중복 별칭이었고 어떤 컴포넌트도 `--shape-*` / `shape.*` 를 쓰지 않았습니다(소비 0). `radius` 가 SSOT 로 그대로 유지됩니다.
- **radius 는 변경 없음** — `radius.xl`(16)은 Card PC 프리셋·Section 서피스가 사용 중이고 캐시워크 가이드에도 16px 가 있어 그대로 둡니다.

**BREAKING**

- `@nudge-design/tokens`: `shape` export 제거(→ `radius` 사용). `--shape-*` CSS 변수 및 `--spacing-{1,7,33,64}` 제거. Figma 변수의 Dimension `shape/*` 도 제거.
- `@nudge-design/tailwind-preset`: spacing 유틸 `*-1` · `*-7` · `*-33` · `*-64` 제거(소비처 없던 값).

값 변경 없음 — 남은 토큰은 전부 기존 hex/px 그대로(전 브랜드 value-freeze 통과).
