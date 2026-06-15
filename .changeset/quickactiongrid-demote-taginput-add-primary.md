---
"@nudge-design/react": patch
"@nudge-design/html": patch
---

QuickActionGrid 컴포넌트 제거(패턴으로 강등) · TagInput '추가' 버튼 색 정정

- **QuickActionGrid 제거** — 단일 도메인 레이아웃 + Figma 가이드 노드 부재로 컴포넌트 편입 기준 미달. 같은 "빠른 액션 그리드"는 이제 **Card + CSS 그리드 패턴**(`pattern:quick-action-grid`)으로 조립한다. react `QuickActionGrid` / html `nds-quick-action-grid` export 가 사라지니, 쓰던 곳은 패턴 가이드대로 Card 그리드로 교체.
- **TagInput '추가' 버튼** — 색이 secondary(브랜드마다 light/dark 로 갈려 일부 브랜드에서 밝게 떠 어색)였던 것을 **primary(추가 어포던스)** 로 정정. 캐시워크비즈는 기존대로 neutral(검정) — 브랜드 토큰 슬롯에서 처리되어 분기 없음.
