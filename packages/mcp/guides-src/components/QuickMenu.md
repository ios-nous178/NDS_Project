---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=1354-52
---

## summary

PC 화면 우측 고정(sticky/fixed) 영역에서 자주 쓰는 **전역 액션 2~4개(3개 권장)**를 빠르게 노출하는 보조 navigation. Container(width 120 · radius 12 · White · overlay shadow) + Header("QUICK MENU" Bold 13 project) + Menu Item × N(IconCircle 60 + 라벨) + 하단 TOP(맨 위로) 버튼으로 구성. 고빈도·즉시성·전역 도달이 핵심 — 페이지별 컨텍스트 액션과 분리한다.

## pitfalls

- **모바일/태블릿(<1024)에는 노출하지 않는다** — 하단 Tab Bar 로 대체. `fixed` 속성을 쓰면 <1024 에서 자동 숨김된다.
- 아이템은 **전역에서 항상 유효한 액션**만(예: 상담사 찾기). 페이지 컨텍스트별 임시 액션은 컨텍스트 메뉴/툴바로.
- 아이템 **5개 이상 금지** — 스크롤 발생. 3개 ±1 로 인지부하 최소화.
- 라벨은 **한글 8자 이내** — 두 줄 wrap 방지. `showLabel=false`(아이콘만)는 식별성 저하라 비권장.
- **icon = inline SVG 문자열 (이름/이모지 아님).** `icon` 은 innerHTML 로 주입되므로 `"icon":"home"` 같은 이름/이모지를 넣으면 텍스트로 흘러나온다. `find_icon({ name })` → 반환 inline SVG 를 넣는다. Icon Library 의 32px line style 로 통일. React `QuickMenu` 의 `icon: ReactNode` 와 대칭, nds-sidebar 와 동일 규약.
- 한 페이지에 **두 개 이상 노출 금지**. 위치는 PC 우측 고정 — top 172 / right 24~40 / z-index 900(모달·토스트보다 아래). 오프셋은 `--nds-quickmenu-top/right/z` 로 override.
- 색을 hex 로 박지 말 것 — 헤더는 `--semantic-text-brand-default`(project cascade)라 프로젝트별 색이 자동 적용된다.

## recommended

- 상담 서비스 홈: 바로 상담하기 / 상담사 찾기 / 내 상담방 (3개)
- TOP 버튼은 스크롤이 viewport 1.5배 이상일 때만 표시(`show-top` 으로 토글).
- 콘텐츠 영역과 겹치지 않게 우측 여백 24~40 확보.

## examplesHtml.do

```html
<nds-quick-menu fixed
  items='[{"key":"counsel","label":"바로 상담하기","icon":"<svg ...>...</svg>"},{"key":"search","label":"상담사 찾기","icon":"<svg ...>...</svg>"},{"key":"room","label":"내 상담방","icon":"<svg ...>...</svg>"}]'></nds-quick-menu>
<!-- icon = find_icon({name}) inline SVG (이름/이모지 아님 — innerHTML). items 는 JSON 속성이라 SVG의 " 는 \" 로 이스케이프. key 필수(없으면 렌더 제외) -->
<script>
  el.addEventListener("quick-menu-item", e => navigate(e.detail.key));
  el.addEventListener("quick-menu-top", () => window.scrollTo({ top: 0, behavior: "smooth" }));
</script>
```

## examplesHtml.dont

```html
<!-- 5개 이상 + 라벨 없이 아이콘만 + 모바일 노출 — 모두 금지 -->
<nds-quick-menu items='[{"key":"a","icon":"home"},{"key":"b","icon":"chat"},{"key":"c","icon":"user"},{"key":"d","icon":"bell"},{"key":"e","icon":"gear"}]'></nds-quick-menu>
<!-- 틀린 점: 아이템 5개(스크롤) · icon 에 이름(텍스트로 흘러나옴 — inline SVG 여야) · 라벨 누락(식별성 저하) -->
```
