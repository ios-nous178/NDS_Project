---
"@nudge-design/react": patch
"@nudge-design/html": patch
---

입력 계열 헬퍼텍스트 간격·폰트 통일 — 공용 HelperText 로 6종 통합

- TagInput·AmountInput·PhoneInput·AddressPicker·TimePicker·SearchInput 의 헬퍼텍스트가 각자 굴리던 `__helper` 스타일 대신 공용 `.nds-helper-text` 를 쓰도록 통합. 그동안 이 6종만 헬퍼가 13px 였고 나머지(Input·Textarea·Select·FormField)는 12px 라 크기가 어긋나 있었음 → 전부 12px 로 통일.
- 헬퍼가 `<p>` 라서 붙던 브라우저 기본 마진(1em)이 root gap(8px) 위에 겹쳐 입력↔헬퍼 간격이 21px 로 벌어지던 문제 수정. 공용 `.nds-helper-text` 에 `margin:0` 을 박아 간격은 부모 레이아웃(8px)이 단독으로 소유하도록 정리.
- 캐포비(CashwalkBiz)에서 이 6종도 에러 시 빨간 경고 아이콘이 표시됨 — Input 등 다른 입력과 동일한 동작으로 정합.
