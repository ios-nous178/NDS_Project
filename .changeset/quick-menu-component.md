---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

QuickMenu(신규): PC 우측 고정 퀵메뉴 컴포넌트

PC 화면 우측에 고정(sticky/fixed)되어 자주 쓰는 전역 액션 2~4개(3개 권장)를 빠르게 노출하는 보조 navigation 컴포넌트를 추가했다. Container(width 120 · radius 12 · White · overlay shadow) + Header("QUICK MENU" Bold/brand 색 + divider) + Menu Item × N(IconCircle 60 + 라벨) + 하단 TOP(맨 위로) 버튼 구조.

- React `<QuickMenu items={[…]} fixed showTop onTopClick />` · HTML `<nds-quick-menu items='[…]' fixed>` 3면 미러.
- 색은 전부 시멘틱 토큰 — 헤더는 `--semantic-text-brand-default`(brand cascade)라 5개 브랜드 색이 자동 적용. raw hex 없음.
- `fixed` 속성으로 PC 우측 고정 위치(top 172 · right 40 · z 900) + 모바일/태블릿(<1024) 자동 숨김(하단 Tab Bar 로 대체).
- 아이템 클릭 → `quick-menu-item`(detail.key) · TOP 클릭 → `quick-menu-top` 이벤트. icon 은 inline SVG(이름/이모지 아님).
- MCP 가이드(`component:QuickMenu`) · Storybook 스토리 · AllComponents 카탈로그 등재.
