---
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

폼/입력 정리 — FieldActionRow·NotificationItem 제거(BREAKING) · 라벨 13px 통일 · FormField success · ContentViewer 안전강화

### 제거 (BREAKING)

외부에서 import 중이면 빌드가 깨집니다.

- **FieldActionRow** (`nds-field-action-row`): 인증행 전용 컴포넌트 — 이미 있는 `InputGroup`·`VerificationCodeInput`·`CountdownTimer` 와 기능이 겹쳐 제거했습니다. 인증 폼은 `FormField` + `InputGroup` + `VerificationCodeInput`(+ `CountdownTimer`) 합성으로 만드세요. 가이드/스토리에 새 레시피를 넣어 뒀습니다(`get_guide({ topic: 'component:VerificationCodeInput' })`).
- **NotificationItem** (`nds-notification-item`): Figma 디자인 근거도 실사용처도 없는 선젬이라 제거했습니다. 알림 리스트는 `List` + `ListItem` 합성으로 표현하세요.

### 개선

- **필드 라벨 글자 크기를 13px(caption1)로 통일** — 컨트롤마다 12~15px 로 제각각이던 라벨이 한 값으로 정렬됩니다. 같은 필드가 bare(`<Input label>`) 일 때와 `FormField` 로 감쌌을 때 13/14px 로 달라지던 문제가 사라집니다. (전 입력 컴포넌트 라벨 크기 미세 변경 — QA 시 참고)
- **`FormField` 에 `success` 상태 추가** — 에러가 없을 때 "인증되었습니다" 같은 성공 헬퍼 텍스트를 success 톤으로 표시합니다(react `success` prop / html `success` 속성).
- **`ContentViewer` 안전 처리 강화** — 허용 태그·속성·URL 스킴만 남기는 allowlist 방식으로 바꿨습니다(문자열 1차 제거 + 클라이언트 DOM allowlist). 신뢰할 수 없는 입력은 여전히 DOMPurify 사전 처리 권장.
