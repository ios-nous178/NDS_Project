---
"@nudge-design/react": major
"@nudge-design/html": patch
"@nudge-design/mcp": patch
---

chrome 정리 — Sidebar 를 목업 전용 nds-brand-chrome 으로 흡수 (Phase 3, BREAKING)

브랜드-aware admin 사이드바를 공개 react 면에서 걷어내고, 목업 전용 html 한 곳으로 모은다.
(chrome 통합 플랜 Phase 3 — Phase 2/4 와 동일 방향.)

- **react `Sidebar` 컴포넌트 제거(BREAKING)** — 브랜드 로고·캐포비 admin 튜닝이 박힌 admin 셸이라
  공개 primitive 가 아니다. admin 사이드바 화면은 목업 전용 html `<nds-sidebar>` 로 만든다.
- **html `<nds-sidebar>` 는 그대로 유지** — 코드만 standalone `nds-sidebar.ts` 에서 `nds-brand-chrome`
  으로 흡수(병합). element 명·속성·UI·여닫기(collapse/서브메뉴 토글) 동작 모두 동일. `NdsSidebar` export
  도 유지(deep 모듈 경로만 이동). admin chrome 도 브랜드 chrome 의 한 형태로 한 파일에 모임.
- 가이드(`component:Sidebar`, `pattern:cashwalk-biz-admin-sidebar`)를 html 전용으로 재프레이밍 —
  제거된 react `<Sidebar>` ready-made/예시 정리. validator·목업 intake 는 `<nds-sidebar>` 그대로라 무변경.
- 폐기 잔재 정리: orphan `cashwalk-biz-sidebar-example.ts` + 생성기 제거.

대체: admin 사이드바 → `<nds-sidebar brand="cashwalk-biz">` (또는 `pattern:cashwalk-biz-admin-sidebar`
ready-made). 공개 react 에는 사이드바 primitive 를 두지 않는다(admin = 목업 html).
