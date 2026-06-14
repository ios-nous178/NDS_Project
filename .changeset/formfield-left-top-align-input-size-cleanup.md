---
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

캐포비 admin 폼 입력 정합 — FormField 좌측 라벨 top 정렬 + Input size 정리 (BREAKING)

**FormField `labelPosition="left"` 라벨 정렬 수정**

- 좌측 라벨을 입력 세로 중앙으로 끌어내리던 보정 `padding-top`(default 10px / admin 12px)을 제거. 이제 Figma 대로 **라벨 시작점 = 입력 시작점(top 정렬)**. `align-items: flex-start` 한 자리로 처리돼 입력 높이(40/48 등)와 무관하게 라벨이 항상 컨트롤 상단에 붙음 — density/size 조합이 어긋나도 라벨이 처지지 않음.

**Input `size="compact"` 제거 (BREAKING)**

- `InputSize` 가 `"default" | "field" | "compact"` → `"default" | "field"` 로 좁혀짐. `compact`(40px)는 한때 "캐포비 admin TextField 표준"으로 문서화됐으나, admin 입력 표준은 브랜드 토큰 정합(`fc223c7a`, cashwalk-biz `--nds-input-height` 40→48) 이후 **48px** 임. admin 폼은 `size` 미지정(캐포비 brand :root 48 cascade) 또는 `field`(48) 를 사용. 기존 `size="compact"` 사용처는 size 속성을 제거하면 됨.
- raw 토큰 `sizing.input.compact`(40)은 유지 — 컴포넌트 size API 에서만 제거.

**html `nds-input` `field` 높이 parity 버그 수정**

- html `SIZE_CONFIG` 의 `field` 가 44px 로 박혀 react/토큰(48px)과 어긋나 있던 react↔html mirror parity 버그를 수정 → **48px** 로 일치. `size="field"` 를 쓰던 html 소비처는 4px 커짐.

**가이드/주석 정합**

- FormField / Input / `cashwalk-biz-form-layout` 가이드와 브랜드 토큰 주석에서 "admin = compact 40 / 48 로 두면 select 와 어긋남" 류의 stale 서술을 **admin = 48** 로 정정 (`cashwalk-biz-form-layout` 은 정반대로 48 을 경고하고 있었음). FormField 좌측 라벨 정렬도 "중앙" → "top(시작점 일치)" 으로 갱신.
