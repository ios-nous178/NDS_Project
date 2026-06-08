---
"@nudge-design/react": patch
"@nudge-design/html": patch
---

웹컴포넌트 프로퍼티 정합 · 모달 타이틀 툴팁 · 필수 뱃지 강조 — 목업에서 드러난 DS 버그 5건 수정.

- **nds-button** `.disabled` / `.fullWidth` 프로퍼티가 attribute 로 reflect. 이전엔 `el.disabled = false` 가 attribute 에 반영되지 않아 버튼이 계속 비활성으로 남았다(약관 동의 후 "다음" 이 안 눌리던 원인).
- **nds-input** host 에 네이티브 `<input>` 처럼 `.value` getter/setter 추가. 이전엔 `el.value` 가 undefined 라 입력 기반 폼 검증이 전부 빈값으로 동작.
- **nds-modal** `title` 속성이 host 에 남아 네이티브 브라우저 툴팁(흰 박스)이 뜨던 문제 수정 — 값만 캐시하고 host 에서 떼어낸다.
- **nds-text-button** 슬롯 텍스트로 라벨을 주면 re-render 때 "라벨라벨" 로 중복되던 버그 수정(mount 시 1회만 캡처).
- **CheckboxGroup** item 에 `required?: boolean` 추가 — 뱃지를 빨강+bold 로 강조해 `[필수]` ↔ `[선택]` 을 구분(react/html/styles 3면 미러).
