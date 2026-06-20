---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=96-25918
sizeMatrix:
  root/compact: min-height 56 / bottom border 1px subtle / flex 좌·중·우
  root/webview: min-height 56 / border none / title 절대중앙 + back left
  root/transparent: min-height 56 / 배경 투명 / border none
  root/web: height 80 / bottom border 1px subtle / content max-width 1200 / grid 3열 (1fr auto 1fr)
  logo: "web: height 60 / max-width 200 / object-fit contain — compact: 자유 (props 로 사이즈 지정)"
  menu-item: h 100% / px var(--semantic-inset-card-large) / headline-5(18·26) bold / 활성 시 project 색 + bottom 3px
  download-btn: px 14 / py 8 / radius 8 / bg surface.subtle / body-1 bold project
  auth-btn: px 18 / py 8 / radius 8 / 1px project border / body-1 bold project
stateMatrix:
  menu-item/default: color textRole.strong
  menu-item/hover: color textRole.brand
  menu-item/active: color textRole.brand + 3px project 하단 보더
  download/hover: bg surface.disabled
  auth/hover: bg surface.brandSubtle
---

## summary

base 헤더. variant 로 분기: compact(모바일 56px flex) / webview(56px, title 중앙 + back) / transparent(56px, 배경 투명) / web(데스크탑 80px grid 3열, max-width 1200). 프로젝트 화면이면 base Header 가 아니라 project chrome (TrostAppBar / NudgeEAPWebHeader / CashwalkBizWebHeader 등) 사용.

## pitfalls

- variant 선택: 모바일 헤더는 variant='compact', 데스크탑 웹 헤더는 variant='web'. 'web' 이 grid 3열 + 80px + 1200 max-width 의 그 헤더.
- Logo 는 src 기반 <img> 폴백 또는 children 으로 SVG 컴포넌트 직접 박기 — 둘 다 미지정 시 빈 영역. NudgeEAP 처럼 SVG 로고가 있으면 children 권장(선명함).
- 메뉴 활성 표시는 activeKey 또는 MenuItem 의 active prop — 인라인 border-bottom 금지.
- Auth 슬롯이 두 종류: 배열형(Header.AuthMenu — 로그인+회원가입 동시) vs 단일형(Header.AuthButton — 로그인/로그아웃 토글). 화면 디자인에 맞게 골라쓰기.
- 프로젝트 색은 tokens.css 가 자동 — 인라인 색상 override 금지. 클라이언트 로고만 per-tenant 이미지로 src/href 주입.

## recommended

- 데스크탑 웹: <Header variant='web' maxWidth={1200}>
    <Header.Logo src=tenantLogo href='/' alt='AMORE PACIFIC' />
    <Header.Menu items={GNB} activeKey={current} onItemClick={navigate} />
    <Header.Actions>
      <Header.AppDownloadButton href='/download' />
      <Header.AuthButton authState={isLoggedIn ? 'logout' : 'login'} onClick={...} />
    </Header.Actions>
  </Header>
- 모바일 / AppBar 컨텍스트: <Header variant='compact'>
    <Header.MainBar>
      <Header.Logo src=logo href='/' />
      <Header.AuthMenu items={authItems} separator='none' />
    </Header.MainBar>
  </Header>
- Webview (뒤로가기 + 타이틀): <Header variant='webview' title='상세' leftSlot={<Header.BackButton onClick={onBack} />} />
- 2단 desktop (Trost 패턴): MainBar(logo+search+auth) + Divider + NavBar(menu+trending) + Divider 컴파운드

## accessibility

- Logo 는 <a href> 로 감싸 홈 진입 보장. alt 에 클라이언트 이름 명시.
- Menu 는 <nav> 로 노출. 각 item 은 href 있으면 <a>, 없으면 <button>. onItemClick 호출 시 href 있는 경우 preventDefault 자동.
- AuthButton 은 authState 가 의미 라벨('로그인'/'로그아웃')을 결정. aria-label 자동 부착.
- Webview variant 의 BackButton 은 aria-label='뒤로가기' 기본.

## interactivePattern

Logo / Menu / Actions / AuthMenu 안의 모든 버튼·링크에 onClick 또는 href 부착. position='sticky' 로 스크롤 시 상단 고정 가능 (z-index 자동).

## examplesHtml.do

```html
<nds-header variant="solid" position="fixed" elevated>
  <nds-header-main-bar>
    <nds-header-logo>NudgeEAP</nds-header-logo>
    <nds-header-actions>
      <nds-icon-button aria-label="알림"><svg>…</svg></nds-icon-button>
    </nds-header-actions>
  </nds-header-main-bar>
</nds-header>
```

## examplesHtml.dont

```html
<!-- raw <header> 에 인라인 스타일로 흉내 — 토큰/elevated 그림자가 안 들어감 -->
<header style="position:fixed;background:#fff">…</header>
```
