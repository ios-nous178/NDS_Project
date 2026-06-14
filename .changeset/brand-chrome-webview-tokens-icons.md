---
"@nudge-design/html": patch
---

브랜드 chrome — 웹뷰 타이틀 세로정렬 · 트로스트 색 토큰화 · 바텀네비 아이콘 stroke 정합

목업 전용 `nds-brand-*` 브랜드 chrome 의 3건 수정 (Storybook 데모에서 발견):

- **웹뷰 헤더 타이틀 세로정렬** — 공유 `nds-brand-header` webview 타이틀(`<h1>`)이 base
  `.nds-header__title` 에 `margin:0` 이 없어 h1 기본 상단 마진(~0.67em≈10.7px)만큼 아래로
  떨어져 있었다. webview 타이틀에 `margin:0` 리셋 + 세로중앙(`top:50%`/`translateY`) 정합.
  (헤드리스 브라우저 실측: 타이틀-헤더 중심 offset 10.7px → 0px.)
- **트로스트 데스크탑 색 토큰화** — 하드코딩 raw hex 를 시멘틱 토큰으로: 액티브탭·로그인
  `#000`→`--semantic-text-strong`, 검색 `#333`→`--semantic-text-normal`, 서피스 `#fff`→
  `--semantic-bg-surface`. "N" 뱃지 `#ff7a00`→트로스트 brand 토큰 `--semantic-text-brand`
  (#FF9D00) 로 브랜드 추종. (시각 무변, N뱃지만 트로스트 brand orange 로 정합.)
- **바텀네비 아이콘 stroke 정합** — 공유 바텀네비 아이콘(home·mentalcare·mypage·challenge
  +active)이 `stroke-width:2` 로, 브랜드 자체 아이콘 및 아이콘 시스템 norm(1.5)보다 굵었다.
  트로스트 멘탈케어/내공간이 이 공유 아이콘을 재사용해 유독 두껍게 튀던 것을 1.5 로 정규화.
