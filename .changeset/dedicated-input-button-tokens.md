---
"@nudge-design/react": patch
"@nudge-design/html": patch
---

전용 토큰 채택 — 인풋/버튼이 전용 cv.input·cv.button 토큰 참조 + Input 라벨 Figma 정합

DS 컴포넌트가 일반 role 토큰(`cv.surface.*` 등) 대신 자기 카테고리의 전용 토큰을 참조하도록 정리. 넛지EAP 기준 대부분 값 동일(시각 무변화)이고, 브랜드가 input/button 토큰을 따로 줄 때 올바르게 흐릅니다.

- **Input 라벨 Figma 정합 (시각 수정)**: 라벨 `caption2`(12px)/`text-normal`(#383838) → `caption1`(13px)/`text-strong`(#111). Figma Section_Input 명세와 일치.
- **인풋 field 배경 → `cv.input.bg`**: Input·Textarea·Autocomplete·PhoneInput·VerificationCodeInput·SearchInput·Select·MultiSelect·DatePicker·DateRangePicker·TimePicker·AddressPicker·AmountInput·NumberStepper(input) (값 동일 #FFFFFF).
- **인풋 disabled 배경 통일 → `cv.input.bgDisabled`**: `cv.surface.subtle`/`cv.surface.disabled` 제각각이던 것 통일. 드롭다운 트리거 disabled 배경이 #ECECEC → #FAFAFA 로 텍스트 인풋 disabled 와 일치(미세 변화).
- **PhoneInput field 보더 → `cv.input.borderDefault`**: #ECECEC → #D8D8D8, 다른 인풋과 보더 색 통일(PhoneInput 만 연했던 drift).
- **Button/FAB**: primary solid enabled 배경 `cv.surface.brand` → `cv.button.bgDefault`(값 동일), solid disabled 텍스트 `cv.surface.default`(배경 토큰 오용) → `cv.textRole.inverse`. FAB·Button 셸 fallback 도 `cv.button.bgDefault`.
