---
sizeMatrix:
  root: height 56(--nds-bottomnav-height) / width 100% / 하단 fixed / border-top 1px subtle
  item: flex 1 1 0 균등분할 / icon 24×24 / 라벨 11(label) / 세로 정렬(아이콘 위·라벨 아래)
  badge: 우상단 카운트 칩 / 16×16 min / radius pill / bg status-error / 텍스트 inverse
stateMatrix:
  item/default: color --nds-bottomnav-inactive-color(=text subtle) · 비활성 아이콘
  item/active: color --nds-bottomnav-active-color(=text normal) · 활성 아이콘(activeIcon) · aria-current=page
  root/shadow: data-shadow 시 상단 그림자(콘텐츠 위에 떠 보이게)
---

## summary

모바일 앱 하단 글로벌 네비게이션(3~5탭) 전용 primitive. compound + 슬롯 — `<BottomNav activeKey onChange>` 안에 `<BottomNav.Item itemKey label icon activeIcon href badge>`. 프로젝트를 모르는 컴포넌트로, 색은 `--nds-bottomnav-*` 슬롯으로 노출되고 프로젝트 토큰이 값만 덮는다. 프로젝트별 아이콘/라벨은 호출부가 주입한다(`{Project}BottomNav` 래퍼 대체).

## pitfalls

- `<BottomNav.Item>` 의 key prop 은 `itemKey` 다 — React 예약어 `key` 와 충돌하므로 `key` 로 활성 비교가 안 된다(목록 렌더 시 `key` 와 `itemKey` 둘 다 준다).
- 활성/비활성 아이콘이 다른 그래픽이면 `icon`(비활성) + `activeIcon`(활성) 둘 다 준다. `activeIcon` 생략 시 같은 그래픽에 색만 cascade 로 바뀐다(단일 currentColor 아이콘용).
- 색을 컴포넌트에 박지 말 것 — 프로젝트 활성색은 `--nds-bottomnav-active-color`, 비활성은 `--nds-bottomnav-inactive-color` 슬롯으로 프로젝트 토큰 파일이 덮는다.
- 데스크톱/PC 화면엔 쓰지 않는다 — 하단 탭 바는 모바일 전용. PC 보조 네비는 QuickMenu, 콘텐츠 전환은 Tab.
- 페이지 내 콘텐츠 전환(필터/세그먼트)에 쓰지 말 것 — 그건 Tab. BottomNav 는 화면 단위 라우팅 탭이다.
- 스토리북/스크롤 컨테이너 안에서는 `position="static"` 으로 — 기본 `fixed` 는 뷰포트 하단에 붙는다.

## examplesHtml.do

```html
<nds-bottom-nav active-key="home">
  <nds-bottom-nav-item item-key="home" label="홈" href="/">
    <svg slot="icon" width="24" height="24"><!-- 비활성 --></svg>
    <svg slot="active-icon" width="24" height="24"><!-- 활성 --></svg>
  </nds-bottom-nav-item>
  <nds-bottom-nav-item item-key="challenge" label="챌린지" href="/challenge" badge="3">
    <svg slot="icon" width="24" height="24"></svg>
    <svg slot="active-icon" width="24" height="24"></svg>
  </nds-bottom-nav-item>
  <nds-bottom-nav-item item-key="my" label="내 공간" href="/my">
    <svg slot="icon" width="24" height="24"></svg>
    <svg slot="active-icon" width="24" height="24"></svg>
  </nds-bottom-nav-item>
</nds-bottom-nav>
```

## examplesHtml.dont

```html
<!-- raw <nav> 로 모양만 흉내 — 토큰/active 동작/색 격리 없음 -->
<nav style="position:fixed;bottom:0;display:flex">
  <a style="color:#00A8AC">홈</a>
  <a style="color:#999">챌린지</a>
</nav>
```
