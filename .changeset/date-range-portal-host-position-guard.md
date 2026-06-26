---
"@nudge-design/html": patch
"@nudge-design/mcp": patch
---

DateRangePicker 캘린더 패널이 모달/아코디언 안에서 잘리던 문제 수정 + 호스트 positioning·아이콘 가이드 보강

- **DateRangePicker(HTML) 패널이 이제 `document.body` 로 portal** — `overflow:hidden` 조상(아코디언·모달 본문·필터 패널) 안에서 달력이 잘리지 않습니다(React 와 동작 일치). `portal-container`(셀렉터) 로 portal 대상 지정 가능. 값 없이 attribute 로 열어도 현재 연·월이 뜨도록 view 초기화 버그(1900년 표시)도 수정.
- **검증 강화**: `nds-*` 호스트(display:contents)에 `position:absolute/fixed` 를 인라인뿐 아니라 **클래스로** 줘도 validator(`nds-host-box-style`)가 잡습니다 — 모달 닫기 X 버튼이 좌상단으로 흘러나오는 버그 재발 차단. positioned wrapper `<div>` 로 감싸세요.
- **가이드 보강**: host-spacing 패턴에 positioning 풋건 추가, icon-usage 에 "글리프를 손으로 추정해 그리지 말고 find_icon 으로" 명시.
