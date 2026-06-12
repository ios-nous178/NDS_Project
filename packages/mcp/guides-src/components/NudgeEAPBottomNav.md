---
figmaNodeUrl: https://www.figma.com/design/mvecozaRQoGRePffskRgmh/?node-id=20-3331
---

## summary

NudgeEAP 5탭 BottomNav (홈/챌린지/상담/멘탈케어/내 공간). 5탭 모두 active/inactive 그래픽 분리 (채워진 아이콘으로 전환). HTML 목업은 `<nds-brand-bottom-nav brand='nudge-eap'>` (BrandBottomNav 가이드).

## pitfalls

- label 매핑은 '홈/챌린지/상담/멘탈케어/내 공간' 기준. 다른 라벨이면 fallback HomeIcon.
- 상담 아이콘은 Counsel(점 3개 말풍선) — active 는 채워진 CounselActiveIcon. 빈 말풍선 Comment 아님.
- Figma SSOT: 20:3331 (NudgeEAP Dev — 앱 네비게이션).

## recommended

- `<NudgeEAPBottomNav tabs={[{ key:'home', label:'홈', href:'/' }, ...]} activeTab='home' />`
- HTML 목업(vanilla): `<nds-brand-bottom-nav brand='nudge-eap' active-key='home'>` — 제네릭 nds-footer-tab-bar 손수 조립 금지.
