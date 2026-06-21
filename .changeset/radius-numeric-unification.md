---
"@nudge-design/tokens": major
"@nudge-design/tailwind-preset": major
---

radius 토큰을 **숫자 단일 체계로 통일**했습니다 (t셔츠 sm/md/lg/xl/pill 폐기).

같은 값인데 이름이 둘이던 문제(`radius.md`=8 과 `radius/8`, `radius.lg`=12 와 `radius/12` …)를 캐시워크 가이드의 숫자 스케일로 합쳤습니다. **곡률 값은 그대로** — 이름만 숫자로 바뀝니다.

- 새 스케일: `radius = { 2, 4, 8, 10, 12, 16, 20, 24, full }` (full = 9999 = pill).
- 매핑: `sm→4 · md→8 · lg→12 · xl→16 · pill→full`. DS 컴포넌트 177곳을 일괄 이전(렌더 동일).
- **프로젝트별 radius 토큰 제거** — trost/geniet/runmile/cashwalk-biz 의 t셔츠 radius 스케일은 어떤 컴포넌트도 `var(--radius-*)` 로 소비하지 않던 죽은 토큰이었습니다(프로젝트 곡률 차이는 `--nds-{c}-radius` 컴포넌트 슬롯이 담당, 무변경). cashwalk-biz 의 숫자+t셔츠 이중 정의도 정리.
- Figma 토큰 가이드 Dimension 표의 radius 도 숫자 단일 컬럼으로(프로젝트별 sm/md/lg/xl/2xl/3xl 중복 컬럼 사라짐).

**BREAKING**

- `@nudge-design/tokens`: `radius` export 키가 `sm|md|lg|xl|pill` → 숫자(`4|8|12|16|full` 등)로 변경. `radius.md` 등으로 직접 참조하던 외부 코드는 `radius[8]`·`radius.full` 로 바꾸세요. `--radius-*` CSS 변수도 숫자 키(`--radius-8` 등)로 emit.
- `@nudge-design/tailwind-preset`: `rounded-sm/md/lg/xl/2xl/3xl/pill` → `rounded-2/4/8/10/12/16/20/24/full`(+ `rounded` 기본 8px · `rounded-none`). 전 프리셋 동일 스케일.

값 변경 없음 — 색 토큰 value-freeze 763개 동일 hex, radius 픽셀값 보존.
