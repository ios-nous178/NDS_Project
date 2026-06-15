---
"@nudge-design/tokens": patch
---

지니어트 Toast 배경/그림자 정합 — Toast 가이드(1330:2)

- Toast 배경 = **Black(#111)/0.92**, 그림자 = **drop y8·blur24·18% black** (`--nds-toast-bg` / `--nds-toast-shadow` 슬롯).
- 직전 Elevation 작업에서 토스트 그림자를 E1 Subtle(옅은 회색)로 잘못 둔 것을 전용 Toast 가이드 값으로 정정.
- Modal(3079:1718)·Tooltip(1380:13)은 기존 토큰으로 이미 정합 — Modal radius 16(XL)·E3 그림자·confirm=brand mint, Tooltip bg #333·white caption1·padding 14/16·radius 8. 변경 없음.
