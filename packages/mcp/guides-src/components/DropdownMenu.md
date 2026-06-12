---
{}
---

## summary

버튼 / 아이콘 트리거에서 펼쳐지는 짧은 액션 메뉴. 옵션 5개 이하 권장 — 그 이상은 Select 또는 별도 화면.

## pitfalls

- 옵션이 많아서 스크롤이 필요한 경우 DropdownMenu 가 아님 (Select / 검색형 UI 사용).
- destructive 액션은 별도 group 으로 분리하거나 최하단에 배치 — 다른 일반 액션 사이에 끼우지 말 것.
- 메뉴 항목에 disabled 가 많으면 차라리 그 항목들을 빼고 권한 설명을 별도 영역에 노출.
- **item `leading`/`trailing` = inline SVG (이름/이모지 아님).** innerHTML 로 주입되므로 아이콘 이름을 넣으면 텍스트로 흘러나온다. `find_icon({ name })` 의 inline SVG 를 넣을 것 (trailing 은 단축키 등 짧은 텍스트도 가능). React DropdownMenu 의 `leading?/trailing?: ReactNode` 와 대칭.

## examplesHtml.do

```html
<nds-dropdown-menu items='[{"label":"편집","value":"edit"},{"label":"공유","value":"share"},{"label":"삭제","value":"delete","destructive":true}]'></nds-dropdown-menu>
<script>el.addEventListener("dropdown-select", e => handle(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- 옵션이 너무 많고 destructive 가 일반 액션 사이 -->
<nds-dropdown-menu items='[{"label":"1"},{"label":"2"},{"label":"삭제"},{"label":"4"},{"label":"5"},...]'></nds-dropdown-menu>
```
