---
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

ValidationChip 신규 + 폼 검증/합성 패턴 가이드 (넛지EAP InputFormGuide)

넛지EAP Library 의 새 인풋 가이드(InputFormGuide 1399:124)에서 유일하게 DS 에 없던 **ValidationChip** 을 추가했다 — 입력 형식 요구사항 1개의 실시간 충족 신호(16px 체크 아이콘 + 12px 라벨). `state` 3종: `incomplete`(muted)·`complete`(Brand Blue)·`error`(status-error). 아이콘·텍스트가 같은 색이라 root `color` 하나만 semantic 토큰으로 두고 SVG 는 `currentColor` 로 상속 → 5 브랜드 cascade 자동 대응. react `<ValidationChip>` + html `<nds-validation-chip>` 3면 미러, Storybook 스토리·AllComponents 카탈로그 동시 등재.

가이드(MCP): `component:ValidationChip` + 신규 `pattern:form-validation` — 회원가입 합성 3종(Input+ValidationChip 실시간 검증 · Input+Inline Button=FieldActionRow · Input+내장 password-toggle)과 Label/Helper/Error 규칙·검증 시점(onBlur/onSubmit/onChange)을 정리했다. 단일 필드 레이아웃은 기존 `pattern:nudge-eap-form-layout`, 컨트롤 선택은 `pattern:selection-controls` 로 위임.
