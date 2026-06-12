---
"@nudge-design/react": patch
"@nudge-design/styles": patch
"@nudge-design/html": patch
---

모든 텍스트 인풋의 placeholder/helper 색을 `cv.input.*` 토큰으로 통일 (드리프트 교정)

- placeholder: FieldActionRow·PhoneInput·Header(검색)·ChatComposer·CheckboxTree(검색) 가 `cv.textRole.muted` → `cv.input.placeholder` 로. (runmile 등에서 실제 색 달랐음)
- helper text: AddressPicker·FormField·PhoneInput·TimePicker·Textarea·ImageUpload·Select·SearchInput 이 `cv.textRole.subtle`/`muted` → `cv.input.helpertextDefault` 로. (base/geniet/runmile/trost 에서 canonical Input 헬퍼와 색 달랐음)
- 이제 `--semantic-input-placeholder` / `--semantic-input-helpertext-*` 단일 토큰이 전 인풋을 제어. Checkbox/Radio(선택 컨트롤)는 범위 제외.
