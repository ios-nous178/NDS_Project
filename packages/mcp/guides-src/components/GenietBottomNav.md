---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=90-2
references:
  - label: Geniet 앱 — 음식 리뷰 상세 화면
    image: references/geniet-app-review-detail.png
    caption: Geniet 모바일 앱 음식 리뷰 상세 (포도향기님 아임닭 닭가슴살). 상단 webview 헤더 + 리뷰 본문 + '닭가슴살 먹은 유저들의 다른 리뷰' 그리드 + 커뮤니티 게시글 리스트 + 하단 5탭 GenietBottomNav (홈/기록/혜택/리뷰/커뮤니티) 가 함께 보이는 전형 화면.
    brand: geniet
---

## summary

Geniet 5탭 BottomNav (Figma 90:2 — 홈/기록/혜택/리뷰/커뮤니티). 단일 그래픽 + color cascade. label 만 받으면 자동 아이콘 매핑. HTML 목업은 `<nds-brand-bottom-nav brand='geniet'>` (BrandBottomNav 가이드).

## pitfalls

- label 이 '홈/기록/혜택/리뷰/커뮤니티' 중 하나가 아니면 fallback HomeIcon 으로 렌더 — 커스텀 라벨이면 tabs[i].icon 직접 지정.
- active/inactive 그래픽 별도 매핑 금지 — Geniet 정책은 단일 그래픽 + color cascade (currentColor).
- Trost/NudgeEAP 가 쓰는 active/inactive split 아이콘 패턴 (HomeActiveIcon 등) 을 여기 쓰지 말 것.

## recommended

- `<GenietBottomNav tabs={[{ key:'home', label:'홈', href:'/' }, ...]} activeTab='home' />`
- 스크롤 컨테이너 안: `position='static'` 으로 fixed 빠져나가는 것 방지.
- 그림자 끄기: `shadow={false}` (기본 true — Figma 90:2 의 살짝 떠 보이는 가이드)
- HTML 목업(vanilla): `<nds-brand-bottom-nav brand='geniet' active-key='home'>` — 제네릭 nds-footer-tab-bar 손수 조립 금지.
