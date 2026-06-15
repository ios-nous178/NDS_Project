---
"@nudge-design/icons": patch
---

Geniet 아이콘 정리 — 글리프 교체 · 메달 크기 정규화 · 미사용 아이콘 제거

- 하트(`GenietHeartIcon`·`GenietHeartSolidIcon`), 로그인/로그아웃(`GenietLoginIcon`·`GenietLogoutIcon`), 신발 채움(`GenietShoeFillIcon`) 글리프를 새 디자인으로 교체 (viewBox `0 0 24 24` 정규화).
- `GenietShoeIcon`(신발 라인)을 multicolor → mono 로 이동 — `currentColor` 로 색 변경 가능. root flat import(`@nudge-design/icons`)는 영향 없음, `/multicolor` subpath 직접 import 만 `/mono` 로 변경 필요.
- 메달(`GenietGoldmedalIcon`·`GenietSilvermedalIcon`·`GenietBronzemedalIcon`) viewBox 정규화 — 하단 잘림 + 형제 아이콘 대비 ~20% 과대 렌더 수정.
- 미사용 아이콘 제거: `GenietPlayIcon` · `GenietCheckcircleIcon` · `GenietMealGrayIcon`.
