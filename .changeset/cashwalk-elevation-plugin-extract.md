---
"@nudge-design/tokens": minor
---

캐시워크 Elevation(그림자) 4단계 추가 + Figma 플러그인이 elevation 도 추출하도록 확장.

- **캐시워크 elevation** (Figma 캐시워크 Library 67:56) — E1 Card(y1·blur3·8%) / E2 Dropdown(y2·blur8·10%) / E3 Popover(y6·blur16·12%) / E4 Modal(y12·blur32·16%). `--shadow-1~4` 로 emit. 형제 브랜드(팀워크·동네산책)도 동일 상속.
- **Figma 플러그인 elevation 추출** — 그동안 Color·Dimension·Typography 3가지만 뽑던 토큰 가이드 플러그인이 이제 **Elevation 도 함께 추출**:
  - box-shadow → **Effect Style**(`Elevation/{브랜드}/E{n}`, base 와 다른 브랜드만 생성).
  - **"🎨 Token Guide — Elevation" 페이지 신설** — 레벨 × 브랜드 표로 실제 그림자 카드 + 값(y·blur·opacity) 표시.
- figma-variables.json 에 `elevation` 섹션(brand=mode box-shadow) 추가.
