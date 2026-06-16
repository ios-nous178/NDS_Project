---
"@nudge-design/tokens": patch
"@nudge-design/styles": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
"@nudge-design/mcp": patch
---

트로스트 컴포넌트 Figma 가이드 동기화 — Controls·Modal·Toast·Tooltip

- **Controls(체크박스·라디오·토글)**: 트로스트 on(checked) 상태를 브랜드 노랑 대신 다크(#333) 채움 + 흰 체크/점으로(노랑 위 가독성), 컨트롤 크기 24×24, 토글 트랙 50×30 (Controls 가이드 5158:108). 체크색은 새 토큰 슬롯(`--nds-checkbox-checked-bg/-checked-border/-check-color`, `--nds-radio-checked-color`)으로 분리 — 다른 브랜드는 기존 `fill.brand` fallback 유지(무변화).
- **Modal**: 확인 CTA 텍스트색을 `confirmCta.text` 로 정렬(노랑 위 흰 글씨 회귀 해소 — 트로스트 노랑+검은 글씨 자동). 비가역 액션용 `confirmTone="destructive"`(검정 Neutral CTA + 흰 텍스트) prop 추가. 트로스트 모달 상단 패딩 24(`--nds-modal-pad-top`). HTML(`<nds-modal>`)은 footer 가 consumer slot 이라 destructive 확정 = `<nds-button color="neutral">`.
- **Toast**: 트로스트 그림자를 drop y8·blur24·18% 로(가이드 806:1277).
- **Tooltip**: 기존 스펙이 이미 정합(가이드 806:1278) — figmaNodeUrl·문서만 갱신.
- 컴포넌트 가이드 `figmaNodeUrl` 을 트로스트 라이브러리로 갱신 + Controls/Toast/Tooltip 스펙 보강.
