---
examples:
  - verdict: good
    source: 마케팅 랜딩 HTML 목업
    caption: hero/feature/CTA/footer 영역을 식별해 각각 <nds-*> 로 1:1 매핑, 헤드라인·본문 카피는 원본 그대로, 색/여백만 시멘틱 토큰으로, 원본 자체 header/footer 는 <nds-brand-header>/<nds-brand-footer> 로 교체.
  - verdict: bad
    source: className 흉내 + 카피 재작성
    caption: 원본 <button> 을 <button class="nds-button"> 로만 바꾸고 실제 <nds-button> 컴포넌트는 안 쓰고(흉내), 원본 문구를 임의로 다시 쓰고 섹션 순서를 재배치 — 재현이 아니라 다른 화면이 됨.
---

## summary

기존 HTML 목업(또는 HTML 형식의 기획서)이 입력으로 들어왔을 때, 그것을 '재설계 대상'이 아니라 '재현할 정답 디자인'으로 보고 구조·콘텐츠·문구·위계를 보존한 채 primitive 만 DS(<nds-*> + 시멘틱 토큰 + 브랜드 크롬)로 바꿔 충실히 옮기는 패턴.

## rules

- 이건 재설계가 아니라 재현이다. 첨부된 HTML 은 이미 정해진 디자인의 정답 소스다 — ui-direction-proposal 처럼 새 레이아웃 방향을 제안하지 말고, 원본의 구조/섹션 순서/정보 위계/문구를 그대로 보존한다.
- 시각 게이트와의 관계: 렌더되는 HTML 목업은 '구조·콘텐츠의 정답'이므로 구조 게이트를 충족한다(prd-as-visual 처럼 막지 말 것 — 그건 텍스트 스펙 얘기다). 다만 브랜드 톤/색 정합은 Figma/스크린샷이 있으면 대조하고, 없으면 브랜드 토큰을 기준으로 한다.
- 1) 원본 HTML 을 끝까지 읽고 영역을 식별한다: header/nav, hero, section/card, list, form, cta, footer 등. 어떤 콘텐츠가 어디에 어떤 위계로 있는지 메모한다.
- 2) 각 영역을 가장 가까운 DS 컴포넌트로 매핑한다 — find_component({ query }) 로 후보 확인, get_guide({ topic: 'component:<Name>', target: 'html', brand }) 로 정확한 <nds-*> 사용법을 가져온다(추측 금지).
- 3) 사용자 노출 문구/카피는 원본 그대로 보존한다. placeholder 라고 임의로 다시 쓰지 말 것 — 다듬어야 할 것 같으면 먼저 사용자에게 확인한다. (단 ux-writing 위반이 명백하면 get_guide({ topic: 'ux-writing' }) 기준으로 제안 후 확인.)
- 4) raw 색/여백/타이포를 토큰으로 치환한다: 색은 find_token 으로 --semantic-* 매칭, 여백은 4의 배수 또는 --semantic-gap-*/--semantic-inset-*. raw hex/rgb/gradient 금지.
- 5) 표면에 맞는 브랜드 크롬을 주입한다 — 원본이 자체 <header>/<footer> 로 그린 것을 DS 크롬으로 교체한다. surface=service → <nds-brand-header>/<nds-brand-footer>/<nds-brand-bottom-nav>, surface=admin → admin-shell(사이드바+톱바) 또는 어드민 온보딩 카드(소비자 brand chrome 금지).
- 6) validate_html_mockup 으로 위반 0 + low-ds-ratio 없음(DS 반영도 충분)까지 고친다. native 잔존(<button> 등)이 남으면 convert_html_to_ds_html 로 1차 변환한 뒤 variant/색을 손으로 마감한다. withStats:true 로 stats.counts.dsRatio 를 확인.
- 7) build_singlefile_html 으로 단일 파일을 만들고, 완료 보고에 ① 영역별 before(native)→after(nds-*) 매핑, ② 그대로 보존한 핵심 문구, ③ 적용한 토큰/컴포넌트, ④ dsUsageSummary 뱃지를 포함한다.

## avoid

- className 만 nds-* 로 바꾸고 실제 <nds-*> 컴포넌트로 교체하지 않음(흉내) — dsRatio 게이트(low-ds-ratio)가 잡는다
- 원본 문구를 임의로 다시 쓰거나 정보 위계/섹션 순서를 재배치 — 이건 재현이지 재설계가 아님
- ui-direction-proposal 처럼 새 UI 방향을 2-3개 제안 — 디자인은 이미 HTML 로 정해져 있음
- 원본의 자체 <header>/<footer> 를 그대로 두고 DS 브랜드 크롬을 빠뜨림(raw-landmark)
- raw hex/그라데이션/non-4pt 여백을 토큰화하지 않고 그대로 둠
- [html-as-prd-spec] 렌더되는 HTML 목업을 '텍스트 스펙(prd-as-visual)' 으로 오해해 시각 레퍼런스로 인정하지 않고 빌드를 막음 — HTML 은 구조의 정답 소스, 톤/색만 Figma/스크린샷으로 보강
