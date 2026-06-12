---
usagePolicy:
  useFor:
    - 사용자 앱 (Trost/Geniet/NudgeEAP/Runmile) 모바일 하단 5탭 내비게이션
  doNotUseFor:
    - 웹 전용 브랜드(CashwalkBiz) — BottomNav 자체가 없음
    - 어드민/CMS 좌측 내비 — Sidebar 사용
  emphasisRule: nds-footer-tab-bar 를 손수 조립하고 SVG 를 슬롯에 박은 흔적이 발견되면 즉시 BrandBottomNav 한 줄로 교체.
validPropValues:
  trost:
    activeKey:
      - home
      - counsel
      - community
      - care
      - my
  geniet:
    activeKey:
      - home
      - record
      - benefit
      - review
      - community
  nudge-eap:
    activeKey:
      - home
      - challenge
      - counsel
      - care
      - my
---

## summary

**브랜드 앱 하단 BottomNav — 손수 조립하지 말 것.** `<nds-brand-bottom-nav brand='trost|geniet|nudge-eap|runmile' active-key='home'>` 한 줄로 브랜드별 5탭 (라벨/아이콘 active·inactive/색)이 BRAND_DATA 에서 자동 렌더. 제네릭 nds-footer-tab-bar + nds-footer-tab-item 에 아이콘 SVG 를 슬롯으로 직접 주입하는 건 안티패턴.

## pitfalls

- **손수 조립 금지** — nds-footer-tab-bar / nds-footer-tab-item 를 직접 박고 `<span slot='icon'>` 에 SVG 를 손으로 넣지 말 것. 브랜드별 탭/아이콘/색은 BrandBottomNav 한 줄이 BRAND_DATA 에서 전부 자동.
- **cashwalk-biz 는 BottomNav 없음** — 웹 전용 브랜드라 `<nds-brand-bottom-nav brand='cashwalk-biz'>` 는 빈 렌더. 어드민/CMS 좌측 내비는 Sidebar 사용.
- active-key 는 브랜드별 탭 key 와 매칭 — trost: home/counsel/community/care/my · geniet: home/record/benefit/review/community · nudge-eap: home/challenge/counsel/care/my · runmile: home/race/community/chat/my. 잘못 적으면 활성 탭 표시 안 됨.
- **Geniet 은 단일 그래픽 + color cascade** — active/inactive 별도 아트가 아니라 같은 SVG 가 nav-item color(민트↔그레이)로 active 를 표현. Trost/NudgeEAP/Runmile 은 active/inactive 그래픽 분리(채워진 아이콘 전환).
- Runmile 라벨은 12/16 (Figma 실측 — 11/14 아님).
- HTML 래퍼는 트로스트 기본 앱(홈/심리상담/커뮤니티/멘탈케어/내공간)만 커버. React TrostBottomNav 의 variant='cashwalk-trost'(홈/사운드/내음악/커뮤니티/마이페이지)는 HTML 미지원 — 필요 시 React 컴포넌트 사용.

## recommended

- Trost: `<nds-brand-bottom-nav brand='trost' active-key='counsel' />` · 탭 keys: home / counsel / community / care / my
- Geniet: `<nds-brand-bottom-nav brand='geniet' active-key='home' />` · 탭 keys: home / record / benefit / review / community (단일 그래픽 + color cascade)
- NudgeEAP: `<nds-brand-bottom-nav brand='nudge-eap' active-key='home' />` · 탭 keys: home / challenge / counsel / care / my
- Runmile: `<nds-brand-bottom-nav brand='runmile' active-key='race' />` · 탭 keys: home / race / community / chat / my (라벨 12/16)
- Aliases (선택): `<nds-trost-bottom-nav>`, `<nds-geniet-bottom-nav>`, `<nds-nudge-eap-bottom-nav>`, `<nds-runmile-bottom-nav>` — brand attribute 안 써도 동일 동작.

## examplesHtml.do

```html
<nds-brand-bottom-nav brand="trost" active-key="counsel"></nds-brand-bottom-nav>
```

## examplesHtml.dont

```html
<!-- 손수 조립 안티패턴 — 탭/아이콘/색을 인라인으로 박으면 브랜드 데이터와 분리되어 다음 화면에서 또 적게 됨 -->
<nds-footer-tab-bar active-tab="home">
  <nds-footer-tab-item key="home" label="홈" href="/">
    <span slot="icon"><svg ...></svg></span>
    <span slot="active-icon"><svg ...></svg></span>
  </nds-footer-tab-item>
  <!-- ...4 more... -->
</nds-footer-tab-bar>
```
