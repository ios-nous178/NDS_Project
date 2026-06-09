---
"@nudge-design/styles": patch
"@nudge-design/react": patch
---

Modal: 본문에 콘텐츠 슬롯(NoticeAlert/Input/Select/DatePicker)을 둘 때 간격 지원 (④ Confirm + Slot)

`ModalBody` 가 단일 텍스트만 가정해 `display:flex` 가 없던 탓에, 설명 텍스트 + 콘텐츠 슬롯(인라인 알림/입력/드롭다운/날짜)을 함께 넣으면 둘이 간격 없이 붙던 문제를 고친다. 본문을 세로 스택(`flex-direction:column` + `gap`)으로 만들어 Figma ④ Confirm+Slot(3418-471)처럼 설명↔슬롯이 일정 간격으로 쌓이게 한다(캐포비 = 20px 평면 gap, base = `--semantic-gap-default`). 단일 텍스트 본문은 무영향, 슬롯은 full-width 로 늘어남.
