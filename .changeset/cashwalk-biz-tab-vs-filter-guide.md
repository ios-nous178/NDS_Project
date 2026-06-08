---
"@nudge-design/mcp": patch
---

캐포비 admin `cashwalk-biz-tab` 패턴 가이드에 **Tab vs Filter 의사결정 가이드** 보강 — Figma 캐포비 Library(DesignGuide/Tab 3544:206) 정합.

기존 Tab 카탈로그(Underline/Box 2 변형)에 더해, Tab 과 Filter 의 역할 구분을 가이드에 추가:

- **역할 구분** — Tab = 상호 배타적 분류로 view 자체 전환(URL 경로 변경), Filter(FilterBar) = 현재 view 안에서 조건 점진적으로 좁히기(쿼리 파라미터 누적).
- **결정 트리** — Q1 view 가 바뀌나→Tab / Q2 조건 누적→Filter / Q3 2–7개 단일선택→Radio·SelectionButtonGroup.
- **화면 배치 순서** — 페이지 타이틀 → Tab → FilterBar → 데이터 영역.
- **DO/Don't 안티패턴** — 큰 분류를 Filter 로·조건 좁히기를 Tab 으로 만들기 금지, Tab 중첩 금지, Underline·Box 혼용 금지, FilterBar CTA 1개 제한 등.

컴포넌트(`Tabs` line/chip · `FilterBar`)·브랜드 토큰 cascade 는 변경 없음 — 가이드(문서) 보강만.
