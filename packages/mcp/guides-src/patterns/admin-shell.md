---
metrics:
  requiredImport: "@nudge-design/styles/styles.css"
  pageShellClass: nds-shell
  sidebarClass: nds-shell__sidebar
  sidebarIcon: nds-sidebar item.icon = inline SVG (find_icon 결과 주입, 이름 아님 — innerHTML) · React Sidebar 는 icon?:ReactNode 로 대칭 · JSON 속성이라 SVG의 " 는 이스케이프
  mainClass: nds-shell__main
  topbarClass: nds-shell__topbar (+ -title-group / -title / -subtitle / -actions)
  tabsClass: nds-shell__tabs
  contentClass: nds-shell__content (+ --single)
  sectionClass: nds-section (+ --stack)
  sectionSlots: nds-section__head / __title / __caption / __body
  formRowClass: nds-form-row
  formRowSlots: nds-form-row__label / __label-required / __control / __hint
  defaultSidebarWidth: 240px (--nds-shell-sidebar-width)
  defaultAsideWidth: 320px (--nds-shell-aside-width)
  defaultSectionRadius: 12px (--nds-section-radius)
  defaultFormRowLabelWidth: 140px (--nds-form-row-label-width)
  sidebarLogo: nds-sidebar[brand] 가 로고 자동 주입 (5개 브랜드 data URI 내장) — 텍스트 placeholder·수동 base64 <img> 금지 · validator admin-sidebar-logo-not-component
  enforcementRule: raw-shell-pattern (error) — <style> 안 raw .page / .topbar / .section / .form-row 정의 차단
---

## summary

어드민/CMS/대시보드 페이지의 **shell + section + form-row** 보일러플레이트. @nudge-design/styles 의 nds-shell / nds-section / nds-form-row 클래스를 의무 사용. raw <style> 블록으로 .page / .topbar / .section / .form-row 를 재정의하면 토큰 drift · 브랜드 스왑 실패 · 일관성 붕괴를 유발. 사용자 mock-test 기준 페이지당 200-600 줄 CSS 가 사라지는 영역.

## rules

- **Setup 의무**: `import "@nudge-design/styles/styles.css";` 한 줄로 nds-shell 계열 클래스가 자동 활성화. tokens.css / html/styles.css 와 함께 import. 별도 install 불필요.
- **Page shell** (sidebar + main + topbar + content): `<div class="nds-shell"><aside class="nds-shell__sidebar"><nds-sidebar />...</aside><main class="nds-shell__main"><header class="nds-shell__topbar">...</header><div class="nds-shell__content">...</div></main></div>`. raw `<div class="page">` + grid CSS 직접 작성 **금지**.
- **Topbar**: `<header class="nds-shell__topbar">` 안에 `<div class="nds-shell__topbar-title-group"><h1 class="nds-shell__topbar-title">제목</h1><p class="nds-shell__topbar-subtitle">부제</p></div>` + `<div class="nds-shell__topbar-actions">...</div>`. sticky/border-bottom/padding 직접 작성 **금지** — 클래스가 처리.
- **Section card** (본문 안 흰 박스): `<section class="nds-section">` + 헤더 `<header class="nds-section__head"><h2 class="nds-section__title">...</h2><p class="nds-section__caption">...</p></header>` + 본문 `<div class="nds-section__body">...</div>`. raw `.section { background: ...; border: 1px solid ...; border-radius: 12px; }` 작성 **금지**.
- **Section 자식 간격** 자동: `<section class="nds-section nds-section--stack">` 모디파이어를 쓰면 직계 자식 사이 20px 간격이 margin-top 으로 자동 부여. `> * + * { margin-top: }` 직접 작성 **금지**.
- **Form row** (라벨 + 컨트롤 grid): `<div class="nds-form-row"><label class="nds-form-row__label">필드명<span class="nds-form-row__label-required">*</span></label><div class="nds-form-row__control"><nds-input />...<p class="nds-form-row__hint">힌트</p></div></div>`. raw `.form-row { display: grid; grid-template-columns: 140px 1fr; }` **금지**.
- **Content 우측 aside**: `<div class="nds-shell__content">` 가 기본 main + 320px aside 2-컬럼. aside 가 없을 때만 `<div class="nds-shell__content nds-shell__content--single">` 또는 `data-aside="false"` 로 단일 컬럼. raw grid-template-columns 직접 작성 **금지**.
- **커스터마이즈**: 폭/패딩만 바꾸려면 CSS 변수만 override — `--nds-shell-sidebar-width` / `--nds-shell-topbar-padding` / `--nds-shell-content-padding` / `--nds-shell-aside-width` / `--nds-section-radius` / `--nds-section-head-padding` / `--nds-section-body-padding` / `--nds-form-row-label-width` / `--nds-form-row-gap`. **클래스 자체를 :where 밖에서 재정의하지 말 것**.
- **브랜드 토큰만 사용**: 색/보더/배경은 nds-shell 계열이 이미 `--semantic-bg-surface-default` / `--semantic-border-normal-default` / `--semantic-text-strong-default` 등을 참조. raw hex 또는 `var(--semantic-*)` 인라인 override 금지 — 브랜드 스왑 시 깨짐.
- **Aside / sticky** 가 자체 white card 가 필요하면 → `<nds-section>` 으로 감싸기. 별도 `.aside { background: ...; border: 1px solid ...; border-radius: ...; padding: 24px; }` 를 새로 정의 금지 (nds-section 의 의도된 중복).
- **Validator 강제**: html-validator 가 `<style>` 블록의 raw shell 패턴을 `raw-shell-pattern: error` 로 차단. 의도된 예외(예: 마케팅 랜딩의 hero 등 admin shell 이 아닌 layout) 만 별도 클래스명 (`.lp-hero` 등 nds- 접두 회피) + 인라인 토큰 사용으로 우회.
- **사이드바/톱바 로고 = 컴포넌트로 자동 주입 (텍스트·수동 base64 금지)**: 사이드바 상단 브랜드 로고는 `<nds-sidebar brand="trost|geniet|nudge-eap|cashwalk-biz|runmile">` 만 두면 BrandHeader 와 동일 로고 SSOT 가 data URI 로 자동 주입된다. **5개 브랜드 로고가 에셋 패키지에 내장**돼 있으니 `"geniet"` 같은 텍스트·색박스 placeholder 로 두거나, 빌드 산출물에서 로고 base64 를 추출해 raw `<img src="data:…">` 로 박지 말 것(회귀: 백오피스 CMS 사이드바 로고를 텍스트로 두고 base64 를 손수 추출). 사이드바 밖(어드민 온보딩 카드 등)이면 `<nds-brand-logo brand="…">`. **React/antd 등 호스팅 앱**은 패키지를 못 가져온다는 오해 없이 `import { getBrandLogo } from "@nudge-design/assets"`(→ dataUri) 또는 `<BrandLogo brand="…" />` 사용. 자산 경로 목록은 `get_brand({ brand, assetKind: 'logos' })`. (validator: `admin-sidebar-logo-not-component`.)
- **사이드바 아이콘 = inline SVG (이름 아님)**: `<nds-sidebar items='[...]'>` 의 각 item `icon` 필드는 **innerHTML 로 주입되는 raw SVG 마크업**이다. `"icon":"CashwalkBizGnbBannerIcon"` 처럼 **아이콘 이름/컴포넌트명을 넣으면 그대로 텍스트로 렌더**된다(라벨 옆에 글자로 흘러나옴). 올바른 절차: `find_icon({ name })` → 반환된 inline SVG 문자열을 `icon` 에 넣는다. `icon` 은 React `<Sidebar>` 의 `icon?: ReactNode` 와 대칭 — HTML 은 SVG 문자열, React 는 엘리먼트. **HTML 목업이라 사이드바가 라벨 전용이라는 건 사실이 아니다**(런타임 한계 아님). `items` 는 JSON 속성이므로 SVG 안의 `"` 는 `\"` 로 이스케이프할 것.

## avoid

- `<style>` 안에 `.page { display: grid; grid-template-columns: 240px 1fr }` 직접 정의 — `class="nds-shell"` 사용
- `<style>` 안에 `.section { background: ...; border: 1px solid ...; border-radius: 12px }` 정의 — `class="nds-section"` 사용
- `<style>` 안에 `.topbar { position: sticky; top: 0; }` 정의 — `class="nds-shell__topbar"` 사용
- `<style>` 안에 `.form-row { display: grid; grid-template-columns: 140px 1fr }` 정의 — `class="nds-form-row"` 사용
- nds-section 안에 다시 `.aside { ... border-radius: ... }` 별도 카드 정의 — nds-section 한 번 더 중첩이 올바름
- nds-shell__content 의 grid-template-columns 를 인라인 style 또는 새 클래스로 덮어쓰기 — `--nds-shell-aside-width` CSS 변수만 사용
- nds-form-row__label 폰트/색을 다시 정의 — semantic 토큰 의도 깨짐. 폭만 바꾸려면 `--nds-form-row-label-width`
- 어드민 페이지 1개 안에서 nds-shell 클래스 + raw shell CSS 혼용 (drift 보장)
- raw `<header>` / `<main>` / `<aside>` 만 사용하고 nds-shell 클래스 미부여 — landmark 의미는 그대로 두되 클래스로 visual contract 보장
- nds-sidebar item `icon` 에 아이콘 이름(`"CashwalkBizGnbBannerIcon"`)을 넣기 — innerHTML 이라 텍스트로 흘러나옴. find_icon 의 inline SVG 문자열을 넣을 것
- 아이콘이 안 박힌다고 사이드바를 라벨 전용으로 두고 'HTML 런타임 한계'로 결론내리기 — icon=inline SVG 로 정상 렌더됨
- 사이드바/톱바 로고를 텍스트('geniet')·색박스나 빌드에서 추출한 수동 base64 `<img data:…>` 로 손수 박기 — `<nds-sidebar brand>` 자동 주입 또는 `<nds-brand-logo brand>` 사용(로고는 에셋 패키지에 data URI 로 내장)
