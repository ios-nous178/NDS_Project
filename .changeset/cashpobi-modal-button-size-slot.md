---
"@nudge-design/styles": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
"@nudge-design/mcp": patch
---

캐포비 admin Modal 가이드 동기화 (Figma ModalGuide 3418-471)

- 푸터 액션 버튼 크기 갱신: 높이 44px→48px, 폭 120px(single)/hug(dual)→**128px 고정**(Single·Dual 모두 우측 정렬 pill).
- ④ Confirm + Slot 을 **두 개의 독립 슬롯**으로 가이드에 명문화 — slot a=severity(Notice info/caution/error) · slot b=BodyContent 컨트롤(ContentSlot/Input/Select/DatePicker). Variant Showcase 반영.
