---
"@nudge-design/tokens": patch
---

런마일 브랜드 토큰 — Figma 런마일 Library 가이드 반영

- 팔레트 확장: blue·red 풀스케일 + green·yellow 패밀리 신규, orange 50/200 톤 추가, gray600 #919CAA→#8B95A1
- 시멘틱 갱신: status bg/text/icon 을 green·yellow 실색으로(구 base 임시값 대체), info bg=blue, surface-subtle=gray100, bg-disabled=gray200, border default/subtle/strong 재정렬, **focus=blue(#007AFF)**, placeholder=gray600, helper success=green
- 엘리베이션: E1~E3 drop shadow 를 가이드 실측값으로 교체
- 보더&레디우스: radius XL 16→15 + 2XL(20)·3XL(24) 추가, border-width icon(1.5)·strong(2) 추가
- 타이포는 기존 가이드와 일치(변경 없음)
- 컴포넌트 슬롯 정합 (Controls·Toast·Tooltip·Modal·Popup Figma 가이드): Checkbox·Radio 24×24, Toggle 51×31 (OFF=BG/Disabled gray200·ON=오렌지 fill.brand), Snackbar 다크 토스트(#221E1F α0.85·radius 12·Elevation/2·흰 메시지 Medium·아이콘 24·Info 아이콘 파랑·액션 Text/Brand 오렌지) + 단일 Toast 동일 톤, Tooltip(bg #221E1F α0.9·radius 6·화살표 8×8·본문 12/16), Modal(radius 3XL 24·Elevation/3·Title=Strong·Body 13/18 subtle), Popup(radius 20·Elevation/3).
- 컴포넌트 슬롯 신설(브랜드 무관 — 값은 런마일 토큰이 흘려보냄, 타 브랜드 fallback 유지): `--nds-snackbar-fg/-radius/-info-icon/-action-bg/-action-color/-title-font-weight`, `--nds-tooltip-radius/-font-size/-line-height/-arrow-w/-arrow-h`, `--nds-modal-shadow/-title-color/-body-color/-body-font-size/-body-line-height`, `--nds-popup-radius/-shadow`. (정적 import 였던 radius/shadow/typography 를 var() 슬롯으로 — Trost/base 도 향후 토큰으로 덮을 수 있게.)
