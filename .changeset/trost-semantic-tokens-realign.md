---
"@nudge-eap/tokens": patch
---

Trost 시멘틱 토큰을 TrostAstroHomepage 실측에 맞춰 정정.

### `--semantic-bg-page-default`: `#F2F2F2` → `#FFFFFF`

페이지 본문 bg 는 모든 트로스트 컴포넌트(UtilityHeader / TabNavigation / DesktopFooter 본문 / CategoryListItem 등)에서 흰색. `#F2F2F2` 는 section divider 색으로 이미 `border.subtle.default` 에 매핑돼 있어 page-bg 와는 의미가 다름.

### `--semantic-bg-overlay`: `rgba(0,0,0,0.7)` → `rgba(0,0,0,0.6)`

Bible 카드 등 트로스트 코드의 overlay 가 모두 `bg-black/60` (= 0.6). NudgeEAP base 의 0.4 보다 진하되 0.7 까지는 아니라는 실측 값.

### `--semantic-text-brand-default` / `-strong` / `--semantic-icon-brand-default`: 노랑(`#E6D200`) → orange(`#FF9D00`)

트로스트의 "활성 / 선택 / 자사 강조" 텍스트는 실측 11회 모두 `#ff9d00` (활성 카테고리 / 인용 멘션 prefix / 댓글 멘션 / 활성 sub-tab / EAP 다운로드 툴팁의 "트로스트" 강조 등). 노란색 brand 컬러는 면적이 큰 button bg / banner bg 용이고 텍스트로는 가독성 때문에 거의 사용되지 않음 — brand-as-text / brand-as-icon 시멘틱은 orange 가 실제 의도에 부합.

### `elevation.shadow["1"]` opacity: `0.10` → `0.12`

트로스트 코드 실측 1위 floating-card 패턴 `shadow-[0_2px_16px_0_rgba(0,0,0,0.12)]` (Music player / 카드 hover / floating bottom sheet 등) 와 일치하도록 정정. shadow."2"/."3" 은 그대로(다른 elevation level).
