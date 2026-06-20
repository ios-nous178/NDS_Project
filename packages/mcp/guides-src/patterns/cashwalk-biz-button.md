---
metrics:
  sizes: X-Large=52 · Large=48 · Medium=44 · Small=40 · Mini=36 (px)
  styles: 5
  states: default / hover / disabled
  textButtonSizes: Large=38 / Medium=32 (px)
  iconButtonSizes: X-Large=48 / Large=44 / Medium=40 / Small=32 (px)
  relatedPatterns: cta-group, cashwalk-biz-input
---

## summary

캐시워크 포 비즈니스 admin 의 Button 카탈로그 — 5 스타일 × 2 shape × 5 사이즈 × 3 상태 + TextButton + IconButton.

## rules

- 5 스타일: Solid/Primary · Solid/Secondary · Weak/Secondary · Outlined/Primary · Outlined/Secondary. (※ Figma 캔버스 라벨은 'Neutral' 이지만 DS 네이밍은 'Secondary' — 동일 슬롯, color="secondary" 와 정합.)
- 2 shape: default(radius 8 · 일반 admin 폼/CTA) · pill(radius full · 모달 확인/취소·BottomCTA·격식 컨텍스트). `<Button shape="pill" />` 로 지정.
- 5 사이즈: X-Large 52px · Large 48px · Medium 44px · Small 40px · Mini 36px.
- Solid/Primary 는 #FFD200 배경 + 검정 텍스트(high-contrast) — 캐시워크 포 비즈니스 시그니처. 텍스트 색을 흰색으로 바꾸지 않는다.
- Disabled bg 는 Neutral/400 #DDDDDD + 흰 텍스트 (Solid/Primary · Solid/Secondary 공통 페어, Figma 3098:1079/3098:1121).
- Outlined disabled (Primary/Secondary 모두) 는 border #E7E7E7 + text #BBB.
- TextButton: Large(38px) / Medium(32px) × Default/Hover/Disabled.
- IconButton: X-Large(48) / Large(44) / Medium(40) / Small(32) × Default/Hover/Disabled. (총 12 variants)
- 터치/마우스 타겟 ≥ 36px (Mini) — admin 데스크톱은 그래도 Medium(44) 이상 권장.
- Outlined/Primary 텍스트는 Yellow/700 (#FEAF01) — Outlined 텍스트가 그린 색이면 안 됨 (가이드 명시).
- **아이콘 색 하드코딩 금지** — `color="var(--semantic-icon-inverse-default)"` 처럼 inverse/project 토큰 사용 금지. 캐시워크 포 비즈니스는 primary text 가 검정이라 흰 아이콘이 노란 배경 위에 떠 보임. `color="currentColor"` 로 두어 Button 텍스트 색을 상속.

## avoid

- Solid/Primary 의 텍스트를 흰색으로 바꾸지 말 것 — 가이드 위반 + 가독성 저하.
- Mini 사이즈를 본문 CTA 로 사용하지 말 것 — table row inline action 같은 좁은 영역 한정.
