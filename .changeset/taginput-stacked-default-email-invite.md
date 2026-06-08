---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

TagInput 일반화 — 이메일 초대형(입력+추가버튼, 칩 아래)을 **기본**으로, 기존 인라인 토큰필드를 variant 로.

- **`variant="stacked"` (신규 기본)** — 입력칸 + 우측 추가 버튼(입력 있을 때만 활성, 검정 neutral 채움) + 칩은 **아래** wrap(중립 회색 pill + 원형 X). 멤버/이메일 초대·수신자 패턴.
- **`variant="inline"`** — 기존 동작(칩이 입력칸 안쪽 tokenfield).
- **`prefix`** (기본 `""`) — `#` 강제 제거, 해시태그는 `prefix="#"` 로 opt-in. (저장값엔 prefix 미포함, 표시 시 부착.)
- **`pattern`**(정규식)·**`validate`**(함수)·**`onInvalid`** / `nds-tag-invalid` 이벤트 — 이메일 등 형식 검증. 실패 시 추가 안 됨(입력 유지).
- `addButtonLabel` 추가.
- **치수/색 정합**: 입력칸·추가버튼이 Input 과 동일한 `--nds-input-height`/`--nds-input-radius`/`--nds-input-padding-x` 슬롯을 추종 → 캐포비 admin 40px/radius4, base 48/8 로 cascade(둘이 항상 flush). 입력칸 색은 input 시멘틱(`input.bg`·`borderDefault`·`borderFocus`·`borderError`·`placeholder`·`helpertext*`), 추가버튼 채움은 button 시멘틱(`button.bgSecondary`/`textSecondary` = 브랜드 검정 CTA), 칩은 `surface.subtle`·`icon.disabled`. 전부 시멘틱 cascade(리터럴 0).
- 추가버튼은 입력칸에 붙는 정사각 affordance라 IconButton(최대 36·고스트)/Button(40px 없음·radius8)으론 정렬이 깨져 인라인 유지 — 단 button 시멘틱 토큰으로 버튼 시스템과 일관.

- 버그 수정: 한글 IME 조합 중 Enter 로 마지막 글자가 중복 입력되던 문제 — `isComposing`(keyCode 229) 가드로 조합 확정 전 Enter 무시.

⚠️ 동작 변경: 인자 없이 쓰던 기존 TagInput 은 이제 stacked + `#` 미부착으로 렌더됨. 해시태그식이 필요하면 `variant="inline" prefix="#"` 로 마이그레이션. (레포 내 사용처·스토리·MCP 가이드·AllComponents 모두 갱신.)
