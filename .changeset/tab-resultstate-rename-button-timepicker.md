---
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/tokens": patch
"@nudge-design/styles": patch
---

컴포넌트 리네임(BREAKING) 2건 + Button outline neutral 글자색 버그 수정 + TimePicker UI 개선

- **BREAKING — `Tabs` → `Tab` 리네임.** react `Tabs`/`Tabs.Root/List/Trigger/Panel` → `Tab`/`Tab.Root/List/Trigger/Panel`, 타입 `TabsVariant/Size/Tone` → `TabVariant/Size/Tone`. html `<nds-tabs>` → `<nds-tab>`(클래스 `nds-tabs__*` → `nds-tab__*`), 캐포비 브랜드 슬롯 `--nds-tabs-*` → `--nds-tab-*`. variant(line/chip/segment)·prop·동작은 그대로.
- **BREAKING — `EmptyState` → `ResultState` 리네임.** 빈 상태(empty)뿐 아니라 결과 화면(success/error/info status)까지 포괄하도록 의미 확장에 맞춰 이름 변경. react `EmptyState` → `ResultState`, html `<nds-empty-state>` → `<nds-result-state>`. props·status·동작 동일.
- **Button outline×neutral 글자색 버그 수정.** NudgeEAP/Trost 기본 테마에서 outline neutral 버튼의 텍스트가 흰색(#FFFFFF)이라 흰 배경 위에서 보이지 않던 문제를, 가이드 SSOT 값(#383838)으로 교정.
- **TimePicker UI 개선.** 시/분 옵션 터치 타깃 확대(34→40px)·스크롤 스냅 정렬·컬럼 헤더 구분선·필드 hover 보더 등 웹/앱 공용 다듬기(토큰 기반, 동작 변화 없음).

마이그레이션: `Tabs`/`EmptyState` import·태그를 `Tab`/`ResultState`(`nds-tab`/`nds-result-state`)로 교체하세요.
