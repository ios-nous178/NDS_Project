---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/tokens": minor
"@nudge-design/mcp": patch
---

Toast — Figma 가이드(1330:2) 정렬: 단일 다크 토스트로 정리

Toast 디자인 가이드(Figma 1330:2)에 맞춰 컴포넌트를 **비차단형 단일 다크 메시지**로 재정의했다. 위치가 곧 형태다 — `top`(PC·상단 중앙·**pill**·패딩 16/32·body2) / `bottom`(모바일·하단·**rounded 24**·패딩 12/20·body3). 배경은 다크값(#212121·0.92) + 흰 텍스트, drop shadow(y8 blur12 18%) 추가.

배경/그림자는 role-based 시멘틱 변수(Figma SSOT) 집합 밖이라 **`--nds-toast-bg` / `--nds-toast-shadow` 컴포넌트 토큰**으로 신설(base `nudge-eap` theme `components` 맵 → `:root` emit, 브랜드 cascade 가능). styles 는 raw hex 없이 `var(--nds-toast-*)` 만 참조한다.

**BREAKING**

- **색 변형 제거** — `variant`(`success`/`error`/`warning`/`info`) 와 `ToastVariant` 타입을 삭제했다. Toast 는 단일 다크 스타일만 가진다. 심각한 오류·결정 요청은 Modal/Alert, 액션·닫기·브랜드 카드(캐포비 흰 카드)는 Snackbar 로 라우팅. `error` 토스트의 `role=alert`/`aria-live=assertive` 도 함께 제거(모든 토스트 `role=status`·polite — 비차단형 일관).
- **`top-right` position 제거** — `ToastPosition` 은 `top | bottom` 만 남는다(가이드 2-position 모델). 유일 소비처였던 캐포비 admin 은 이미 Toast 자체가 banned(Snackbar 만 사용).
- **동시 1개 노출이 기본** — `maxCount` 기본값을 3 → **1** 로 변경(새 토스트가 기존을 즉시 대체). 스택이 필요하면 `maxCount` 를 올려 opt-in.

기타: z-index 토큰 `toast` 1200 → **1500**(가이드 spec, Snackbar 와 공유). MCP 가이드(`component:Toast`)에 `figmaNodeUrl` 추가 + 단일 다크/2-position/1개 노출 모델로 갱신.
