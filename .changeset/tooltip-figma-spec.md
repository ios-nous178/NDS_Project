---
"@nudge-design/styles": minor
"@nudge-design/tokens": minor
"@nudge-design/mcp": patch
---

Tooltip — Figma 가이드(1380:13) 규격 정렬

Tooltip 을 디자인 가이드(Figma 1380:13) 스펙에 맞췄다. React/HTML 컴포넌트 구조·API·동작(hover·focus, show 200ms·hide 0ms, 4 position, 단일 노출)은 이미 부합해 변경 없이 **시각 규격(CSS·토큰)만** 정렬했다.

- **단일 다크 톤** — 배경을 `surface.inverse`(#111) → `--nds-tooltip-bg`(= `fill.neutral` 역할, base #383838 / 캐포비 #333)로. base `nudge-eap` theme 이 `:root` 로 emit, 슬롯값=시멘틱 var. 기존 캐포비 전용 `tooltip.bg` 브랜드 override 는 base 가 흡수해 **중복 제거**.
- **본문** — Caption1 **Medium** 13/18(weight regular → medium), 흰 텍스트.
- **패딩 14/16**(상하/좌우, 기존 8/12), radius 8 유지.
- **꼬리 12×8 triangle** — 기존 8×8 rotate(45deg) 사각형 → border 로 그린 정삼각형(4 방향), 본체 외부 가운데에서 트리거 방향. 본체-트리거 8px 간격을 꼬리가 메운다.
- **z-index** — `popup`(1100) → 신설 토큰 `tooltip`(**1400**, 모달·토스트 1500 보다 아래).

MCP 가이드(`component:Tooltip`)에 `figmaNodeUrl` + 규격 갱신. 리치 본문(`<template slot="content">`)·캐포비 compact 타이포 override 는 유지.
