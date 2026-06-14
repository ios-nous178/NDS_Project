---
"@nudge-design/styles": patch
"@nudge-design/html": patch
"@nudge-design/tokens": patch
---

캐포비 온보딩 목업 피드백 — DatePicker clear 겹침 수정 + Input error-message/full-width + 모달 pill 강제 + 가이드 보강

- **DatePicker clear(×) 버그 수정** — `.nds-date-picker__clear` 의 `display:inline-flex` 가 `hidden` 속성을 덮어, 값이 없어도 × 가 떠 캘린더 아이콘과 겹쳤다. `:not([hidden])` 로 스코프 → 빈 값이면 × 숨고 캘린더 아이콘만(전 브랜드).
- **html `nds-input` 이 `error-message` 관측** — 기존엔 React `errorMessage` 만 있고 html 은 안 봐서 `error-message` 설정 시 조용히 실패했다. 이제 `error-message`(또는 `error`+`helper-text`)로 빨간 보더+인라인 에러가 뜬다(필드 검증 에러는 NoticeAlert 아님).
- **`nds-input` flex-row 채움 robust** — root 에 `min-width:0` 추가(긴 값이 flex 행에서 넘치지 않게). 행 채움은 `full-width` 속성 사용(host=display:contents 라 CSS flex 무시).
- **캐포비 모달 버튼 전부 pill 강제** — brand-profiles `cashwalk-biz.modal.footerButtonShape="pill"` 데이터 선언 + validator `brand-modal-footer-button-shape` 가 pill 누락 footer 버튼을 잡는다(보조 버튼에 shape 빠뜨려 각진 버튼 섞이는 재발 차단).
- **가이드 보강**: 운영자 키워드(admin/백오피스) 영역 확답 하드스톱(claude-md), 온보딩 카드 패딩 48/내부 stretch(기본 16 override 필요 명시), NoticeAlert 필드에러 오용 금지, Modal 보조버튼 pill, Input 에러/full-width.

검증: html nds-input error-message 테스트 + mockup-core pill validator 테스트 추가, DatePicker 빈값 clear 숨김 브라우저 재현 확인.
