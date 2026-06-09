---
"@nudge-design/mcp": patch
---

캐포비(cashwalk-biz)는 알림에 Snackbar 만 사용 — Toast 사용을 validator 가 차단

캐포비 알림 SSOT 는 흰 카드 chrome·우측 상단 고정·상태 칩 아이콘·닫기 X 를 가진 Snackbar 인데, 이를 권고하는 가이드만 있고 검증룰이 없어 캐포비 목업에서 `<nds-toast>` 가 아무 위반 없이 통과하던 공백이 있었다. `validate_html_mockup` 에 `cashwalk-biz-toast` 룰(error)을 신설해, `data-brand="cashwalk-biz"`(별칭 cashpobi 포함) 화면의 `<nds-toast>` 를 전면 차단하고 Snackbar 로 안내한다. Toast 컴포넌트 가이드(component:Toast)도 "캐포비는 Toast 미사용 — 예외 없음" 으로 문구를 강화했다. 다른 브랜드의 Toast 사용은 영향 없음.
