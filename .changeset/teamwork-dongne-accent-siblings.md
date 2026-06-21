---
"@nudge-design/tokens": minor
"@nudge-design/tailwind-preset": minor
---

캐시워크 형제 브랜드 **동네산책 · 팀워크**를 추가했습니다 (accent 색만 다른 자매 테마).

캐시워크(소비자앱)의 구조·타이포·여백을 그대로 물려받되, **브랜드 색만** 각자의 accent 로 바꾼 두 테마입니다. 디자이너 결정에 따라 "브랜드 색 전면 스왑"으로 적용했습니다.

- **팀워크** — Cornflower 블루(`#3D79F1`)
- **동네산책** — Indigo(`#3B45D9`)

각 테마에서 brand 채움·텍스트·보더·아이콘·포커스·**Primary 버튼**(버튼 텍스트는 대비를 위해 흰색)이 accent 색으로 렌더됩니다. 캐시워크의 시그니처는 그대로 둡니다 — 주의(caution)색 노랑, 검정 Neutral CTA, 검정 input focus, 검정 모달 confirm 버튼.

**추가된 것**

- `@nudge-design/tokens`: `teamworkTheme` / `dongneSanchaekTheme`(+ semantic) export, CSS 서브패스 `@nudge-design/tokens/css/teamwork` · `.../css/dongne-sanchaek`.
- `@nudge-design/tailwind-preset`: `teamworkPreset` / `dongneSanchaekPreset`(팔레트·시멘틱 키는 캐시워크와 동일 — 색 차이는 import 하는 CSS 가 결정).
- Figma 토큰 가이드: Semantic/Dimension 표에 두 브랜드 컬럼이 더해져 8개 모드가 됩니다.

값 변동 없음 — 기존 5개 브랜드 토큰은 전부 동일 hex(value-freeze 763토큰 통과).

함께: Figma 토큰 가이드 Typography 페이지의 Text Style 샘플을 **모드별 렌더**로 바꿔, 각 브랜드의 바인딩된 글자 크기로 미리보기가 표시됩니다(타이포가 브랜드별로 갈리면 자동으로 크기 차이가 보임).
