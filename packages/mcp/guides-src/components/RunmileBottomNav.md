---
figmaNodeUrl: https://www.figma.com/design/g3ifA735EE6EKjeL4ZW2ax/?node-id=1221-64046
---

## summary

Runmile 5탭 BottomNav (홈/대회정보/커뮤니티/채팅/마이페이지 — Figma 1221:64046). 5탭 모두 active/inactive 그래픽 분리, active=검정(#221E1F)/inactive=gray600. 라벨 12/16 (Figma 실측). HTML 목업은 `<nds-brand-bottom-nav brand='runmile'>` (BrandBottomNav 가이드).

## pitfalls

- label 매핑은 '홈/대회정보/커뮤니티/채팅/마이페이지' 기준. 다른 라벨이면 fallback RunmileHomeIcon.
- 커뮤니티 탭은 2인 그룹(People) 아이콘, 마이페이지는 원형 인물(Account) 아이콘 — 4탭(83:887)→5탭(1221:64046) 개편판.
- 채팅 탭의 이중 말풍선(RunmileChats)은 웹 헤더의 단일 말풍선(RunmileChatting)과 다름 — 혼용 금지.
- active 색 = --semantic-icon-strong-default. 라벨은 11/14 가 아니라 12/16.

## recommended

- `<RunmileBottomNav tabs={[{ key:'home', label:'홈', href:'/' }, ...]} activeTab='home' />`
- HTML 목업(vanilla): `<nds-brand-bottom-nav brand='runmile' active-key='home'>` — 제네릭 nds-footer-tab-bar 손수 조립 금지.
