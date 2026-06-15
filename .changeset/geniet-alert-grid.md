---
"@nudge-design/tokens": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

지니어트 Alert·Section/Container 정합 — Figma Library 가이드

- **Alert (1054:30)**: 인라인 NoticeAlert 컨테이너 radius 를 **Shape/MD 8**(base lg 12)로 — Alert 가이드·Radius 가이드 모두 8 명시. `--nds-notice-alert-radius` 슬롯 신설(기본 12, 타 브랜드 유지). 5색 variant·아이콘 20×20·Body3 Medium 은 시멘틱/기본값으로 이미 정합.
- **Section/Container (1385:13)**: Container PC max-width **1200→1280**(`--grid-content-pc`). side padding 40 = base minMargin, mobile 16 = base 라 그대로. Section 은 컴포넌트 아님(페이지 레이아웃 가이드) — 토큰화 대상은 grid 뿐.
