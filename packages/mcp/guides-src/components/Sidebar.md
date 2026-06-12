---
figmaNodeUrl: https://www.figma.com/design/9lJ9XCwVYFSoZGcmRuJtI4/%ED%95%9C%EA%B5%AD-%EC%BA%90%EC%8B%9C%EC%9B%8C%ED%81%AC_WEB-Dev?node-id=168-1250
---

## summary

어드민/CMS용 좌측 수직 내비게이션. 캐시워크 포 비즈니스(CashwalkBiz) Figma 168:1250 / 290:1593 기준으로 정합. flat items 배열 또는 SidebarSection[] (라벨 그룹) 둘 다 지원, 1단계 서브메뉴 + 뱃지 + collapsed(64px) 가능.

## pitfalls

- **★ 캐포비(cashwalk-biz) 어드민 = nds-sidebar 가 정답.** 일반 브랜드의 어드민/CMS 는 antd Layout.Sider 가 규칙이지만(get_guide({ topic:'admin-cms' })), 캐포비는 DS 안에 자체 admin DS(sidebar 300px · admin 토큰)를 갖고 있어 antd 가 아니라 이 `<nds-sidebar>`(React `<Sidebar>`) 를 쓴다. `intent='admin-cms' + brand='cashwalk-biz'` 면 라우터도 antd 가 아니라 html/DS 로 보낸다. `:root[data-brand='cashwalk-biz']` cascade 로 brand-subtle bg + 노란 indicator 가 자동 적용 — 색 hex 박지 말 것.
- items prop 은 flat SidebarItem[] 또는 SidebarSection[] 둘 다 받지만, **섹션 라벨이 필요하면** SidebarSection[] 으로 넘길 것. flat 배열 안에 빈 객체로 'spacer' 만들지 말 것.
- 활성 상태는 `activeKey` 로만 결정. 각 item 에 isActive 같은 boolean 을 박지 말 것 — controlled 패턴 깨짐.
- 캐시워크 포 비즈니스 브랜드는 `data-brand='cashwalk-biz'` 가 :root 에 있을 때 자동으로 brand-subtle bg + 노란 indicator 톤. 다른 브랜드는 NudgeEAP 토큰 cascade.
- **★ HTML `<nds-sidebar>` 의 item `icon` = inline SVG 문자열 (이름 아님).** `icon` 은 innerHTML 로 주입되므로 `"icon":"home"` 이나 `"icon":"CashwalkBizGnbBannerIcon"` 처럼 **이름/컴포넌트명을 넣으면 그대로 텍스트로 렌더**된다(라벨 옆에 글자). 절차: `find_icon({ name })` → 반환 inline SVG 를 `icon` 에 주입. React `<Sidebar>` 의 `icon?: ReactNode`(엘리먼트)와 대칭일 뿐, **HTML 목업이라 아이콘이 안 된다는 건 사실이 아니다**(런타임 한계 X). `items` 가 JSON 속성이라 SVG 안 `"` 는 `\"` 로 이스케이프.
- GNB 아이콘은 brand-specific 우선 — 자세한 목록은 get_guide({ topic:'component:Sidebar', brand:'<slug>' }).iconSet 또는 find_icon({ query:'CashwalkBizGnb' }) 참조. (이때 얻은 이름을 그대로 HTML icon 에 넣지 말고 find_icon 으로 SVG 를 받아 주입.)
- **★ items JSON 이스케이프 함정 — 사이드바가 로고만 뜨고 메뉴가 통째로 사라지는 #1 원인.** 단일따옴표 `items='...'` 안에서 JSON **구조용 따옴표까지** `\"` 로 이스케이프하면(`items='[{\"key\"...]'`) HTML 속성에서 백슬래시는 리터럴이라 JSON 파싱이 깨지고, 컴포넌트가 메뉴를 통째로 버린다(로고/헤더만 렌더). 구조용 따옴표는 **bare**, SVG 내부 따옴표만 `\"`. 헷갈리면 `<script type="application/json" slot="items">` 자식을 쓰면 이스케이프가 아예 필요 없다. 빌드 validator(`nds-json-attr-unparseable`)가 깨진 JSON 을 error 로 잡아 빌드를 막고, 컴포넌트도 조용히 비우지 않고 console.warn 한다.
- 서브메뉴는 1단계까지만 허용 — children 안에 또 children 넣어서 트리화 금지 (트리는 별도 컴포넌트로).
- collapsed=true 일 때 라벨/뱃지/캐럿/유저 메타 모두 숨김 — 그래도 의미가 전달되도록 모든 item.label 은 string 으로 두기 (tooltip 자동 부착).
- footer 와 user 를 동시에 주면 footer 가 우선. user 는 'avatar + 이름 + 역할' 정형 패턴 단축이라 footer 가 있으면 무시.
- **★ 캐포비 계정 헤더 / 로그아웃은 구조화 slot — 손수 div 금지.** 로고 아래 계정 블록(이메일→잔액→충전/내역 CTA 쌍)은 `account` slot(HTML `account='{…}'` / React `account={{…}}`), 최하단 로그아웃은 `footer-actions` slot(HTML `footer-actions='[…]'` / React `footerActions={[…]}`). `account.actions` / `footer-actions` 의 `variant` 는 'solid'|'outlined'(기본 outlined)로 DS 버튼 토큰을 자동 적용 — hex/직접 버튼 마크업 금지. 이 slot 들을 모르고 `header` 에 raw HTML 로 조립하거나 통째로 빼먹는 게 캐포비 사이드바 재발 #1.
- **사이드바는 풀하이트 셸(.nds-shell) 안에 둔다.** `<nds-sidebar>` 는 기본 full-height(100vh sticky)지만, body 직속·height 미확정 컨테이너에 두면 높이가 화면을 못 채우거나 레이아웃이 깨진다. `<div class='nds-shell'>…<nds-sidebar/>…<main class='nds-shell__main'>` 형태로 감쌀 것 — get_guide({ topic: 'pattern:admin-shell' }) / ready-made 셸은 pattern:cashwalk-biz-admin-sidebar.

## recommended

- **캐포비 어드민이면 ready-made 픽업**: items 를 손으로 만들지 말고 `get_guide({ topic: 'pattern:cashwalk-biz-admin-sidebar' })` 의 복붙 트리(React/HTML, 아이콘 inline 완료)를 쓰고 activeKey 만 화면 키로. BrandHeader/Footer 처럼 한 번에 끌어온다.
- <Sidebar items={items} activeKey={key} onItemClick={(it) => navigate(it.key)} user={{ name, role }} />
- 섹션 그룹: items={[{ key: 'content', label: '콘텐츠 운영', items: [...] }, { key: 'system', label: '시스템', items: [...] }]}
- icon-only 사이드바: collapsed + onToggleCollapse 페어로 controlled. 토글 버튼은 헤더에 자동 노출.
- 뱃지: item.badge=12 (숫자) 또는 ReactNode. 빨간 dot 만 보이면 NotificationItem 의 dot 패턴을 참고.

## accessibility

- 활성 아이템에 aria-current='page' 가 자동 부착됨 — 추가로 박지 말 것.
- 각 item 의 label 이 string 이면 title 도 자동 — collapsed 상태에서 tooltip 역할.

## interactivePattern

활성 키 관리는 호스트 라우터에서 결정 (activeKey={location.pathname}). onItemClick 은 navigation 트리거용.

## examplesHtml.do

```html
<!-- 권장: items 를 자식 <script type="application/json" slot="items"> 로 넣는다 — 속성이 아니라 텍스트라 따옴표 이스케이프 함정이 아예 없고 단일파일 빌드에도 안전 -->
<nds-sidebar active-key="home" width="240" title="NudgeEAP">
  <script type="application/json" slot="items">
  [{"key":"home","label":"홈","icon":"<svg ...>...</svg>"},{"key":"chat","label":"상담","icon":"<svg ...>...</svg>"}]
  </script>
</nds-sidebar>
<!-- 속성 형태도 가능: items='[{"key":"home",...}]' — 단, 구조용 따옴표는 bare 로 두고 SVG 내부 따옴표만 \" 로 이스케이프(구조 따옴표를 \" 로 만들면 파싱 실패→메뉴 통째 유실). icon = find_icon({name}) inline SVG 그대로(이름 넣으면 텍스트로 흘러나옴) -->
<script>el.addEventListener("item-click", e => navigate(e.detail.key));</script>
```

## examplesHtml.dont

```html
<!-- 일반 어드민/CMS(=antd 영역)에서 nds-sidebar 사용 — 일반 어드민은 antd Layout.Sider. -->
<!-- ★ 단, 캐포비(cashwalk-biz) 어드민은 정반대 — nds-sidebar 가 정답이다 (DS 자체 admin DS). 아래 pitfalls 참고 -->
<nds-sidebar items='...'></nds-sidebar>
```
