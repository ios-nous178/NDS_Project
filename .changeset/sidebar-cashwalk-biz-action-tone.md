---
"@nudge-design/react": patch
"@nudge-design/html": patch
---

캐포비(cashwalk-biz) Sidebar 액션(CTA / 푸터) 색·형태를 Storybook SSOT(Figma 3304:617)에 정렬.

- **solid CTA** — 시그니처 검정(button secondary: bg #000 · text 흰), radius 8.
- **account outlined CTA(내역보기)** — 검정 보더+텍스트(textRole.strong #111), radius 8.
- **footer outlined(로그아웃)** — 회색 보더(borderRole.normal #EEE) + 검정 텍스트, pill radius 28 · height 48.
- account-actions / footer-actions 를 분리 타겟해 서로 다른 outlined 톤을 표현 — 새 토큰 슬롯 없이 기존 cv 시멘틱 토큰만 참조. react `Sidebar` / html `<nds-sidebar>` 미러.
