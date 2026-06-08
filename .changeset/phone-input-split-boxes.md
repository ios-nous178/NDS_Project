---
"@nudge-design/react": minor
"@nudge-design/styles": patch
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

PhoneInput 분리형 박스 레이아웃 + 자동 하이픈 (캐포비 Figma 3001:40209·3902 폼).

- **레이아웃**: 국가코드 다이얼 + 구분선 + 번호 입력이 합쳐진 단일 필드 → **국가코드 드롭다운 박스 + 번호 입력 박스가 분리된 두 박스(gap)** 로 변경. 내부 구분선(`__divider`) 제거. 두 박스 모두 base Input 시멘틱 토큰(`--nds-input-height`=48 · `--nds-input-radius`=md · `--nds-input-border-color`/`-background`)을 상속 — Input 과 둥근 모서리·높이·brand cascade 자동 일관.
- **자동 하이픈**: 새 `autoFormat` prop(기본 on, html `auto-format` 속성). 화면에는 KR(+82) 모바일 3-4-4 하이픈을 자동 삽입하고 `value`/`onValueChange` 는 숫자만 다룸(예: `01012345678`). KR 외 국가는 규칙 미정의라 숫자 패스스루. `autoFormat={false}` 로 비활성.
- focus/error 보더는 base Input 토큰(`input.borderFocus`/`input.borderError`)으로 각 박스에 적용.
- MCP `COMPONENT_GUIDES.PhoneInput` 에 `figmaNodeUrl` + 레이아웃·하이픈 설명 갱신.
