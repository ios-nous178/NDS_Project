---
"@nudge-design/react": patch
"@nudge-design/styles": patch
---

Chip · TagInput 의 제거(✕) 아이콘을 공유 SSOT 로 통일 — 중복 제거(시각 변화 없음).

두 컴포넌트가 각각 같은 모양의 ✕ svg(라운드 캡 stroke 1.5)를 따로 그리고 있어, 공유 `RemoveIcon`(react `internal/RemoveIcon.tsx` · html `base/remove-icon.ts`) 하나로 모았다.

- 글리프는 viewBox 14 로 통일하고 `vector-effect="non-scaling-stroke"` 로 스트로크를 1.5px 로 고정 — Chip(14px)·TagInput(10px) 어느 크기에서도 통일 전과 동일한 두께로 렌더(시각 회귀 0).
- TagInput `__remove svg` 에 10px 사이즈 규칙 추가(공유 아이콘은 크기를 CSS 가 결정).
- React/HTML 4개 사본 → 1개 SSOT.

SelectedItemRow/RegionRow 의 '원형 배경 X' 는 리스트 행 삭제용 별개 어포던스라 의도적으로 통일 대상에서 제외.
