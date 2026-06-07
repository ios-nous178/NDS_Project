---
"@nudge-design/styles": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

SelectionButtonGroup: 그룹 내 옵션을 기본 등폭으로 정렬

'전체' / '특정 지역' 처럼 묶인 옵션의 라벨 길이가 달라도 너비가 들쭉날쭉하지 않도록,
SelectionButtonGroup 의 옵션을 기본값에서도 가장 넓은 옵션 기준 등폭으로 렌더한다
(inline-grid + grid-auto-columns:1fr). `fullWidth` 는 그룹을 콘텐츠에 hug 시킬지(false)
컨테이너 100% 로 늘릴지(true)만 결정한다. react/html 공용 CSS(@nudge-design/styles) 변경이라
두 표면에 동일 적용된다.
