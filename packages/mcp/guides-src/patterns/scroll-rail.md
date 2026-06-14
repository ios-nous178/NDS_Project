---
metrics:
  maxHorizontalRailsPerScreen: 1
  nativeHorizontalScrollbar: forbidden
---

## summary

가로로 넘치는 콘텐츠(카드 레일·칩 row·가로 탭·가로 미디어 목록)를 모바일에서 스크롤로 노출하는 패턴. 스크롤바는 숨기고, 아이템은 찌그러지지 않게 고정 폭으로 흐르게 한다. 핵심은 공용 `.nds-scroll-x` 유틸 클래스 — 스크롤바 숨김(`scrollbar-width:none` + `::-webkit-scrollbar{display:none}` + `-ms-overflow-style:none`)을 컴포넌트마다 재구현하지 않고 한 자리에서 가져온다.

## rules

- 가로 스크롤 컨테이너에는 공용 `.nds-scroll-x` 유틸 클래스를 건다 — `overflow-x:auto` + 스크롤바 숨김(크로스 브라우저)이 한 벌로 적용된다. `::-webkit-scrollbar`/`scrollbar-width` 를 컴포넌트·목업에서 직접 재구현하지 않는다.
- 레이아웃은 호출부 책임 — `.nds-scroll-x` 에 `display:flex; gap:<token>` 를 주고, 각 아이템(카드)은 `flex-shrink:0` + 고정/최소 폭으로 찌그러짐을 막는다. (회귀 사례: 레일 아이템이 flex shrink 돼 카드가 81px 로 짓눌림 — flex-shrink:0 누락이 원인.)
- `nds-card` 를 레일 아이템으로 쓸 땐 폭을 호스트가 아니라 카드 박스에 건다 — `nds-card` 호스트는 `display:contents` 라 host 에 건 flex/grid·width 가 안 먹는다. `--nds-card-width` 토큰으로 폭을 주거나, 폭을 가진 래퍼(`<div style="flex:0 0 280px">`)로 감싼다. 호스트에 `display:block !important` 를 박는 핵으로 우회하지 않는다.
- 가독 여백은 레일 양 끝 아이템의 padding(또는 컨테이너 `scroll-padding-inline`)으로 — 첫/끝 카드가 화면 가장자리에 붙지 않게. 가장자리까지 흐르는 bleed 레일이 모바일 기본.
- 한 화면(또는 한 스크롤 영역)에 가로 스크롤 레일을 2개 이상 쌓지 않는다 — 가로/세로 스크롤 축이 섞여 사용자가 스크롤 방향을 잃는다.

## avoid

- 가로 스크롤 컨테이너에 네이티브 스크롤바를 그대로 노출 (특히 데스크톱 트랙패드/마우스에서 거슬림 — `.nds-scroll-x` 로 숨김 처리)
- 컴포넌트·목업마다 `::-webkit-scrollbar{display:none}` / `scrollbar-width:none` 를 손으로 재구현 (→ `.nds-scroll-x` 공용 유틸)
- 레일 아이템에 `flex-shrink` 기본값(1)을 둬 카드가 컨테이너 폭에 맞춰 찌그러지게 방치
- `nds-card` 호스트에 폭/`display:block !important` 를 박아 레일 사이징을 우회 (호스트는 display:contents — 폭은 카드 박스/래퍼에)
- 한 화면에 가로 스크롤 레일을 여러 개 중첩·병치
