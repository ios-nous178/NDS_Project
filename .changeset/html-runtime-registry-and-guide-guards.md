---
"@nudge-design/html": patch
"@nudge-design/mcp": patch
---

목업 런타임 미등록 회귀 수정 + 재발방지 가드.

- **html 런타임 등록 누락 수정** — `define()` 은 하지만 `runtime.ts`(standalone 번들 side-effect 엔트리)에 import 되지 않아 단일파일 HTML 목업에서 미등록(빈 박스)이던 컴포넌트 10종을 등록: `nds-stepper`, `nds-pagination`, `nds-popup`, `nds-text-button`, `nds-coach-mark`, `nds-empty-state`, `nds-online-indicator`, `nds-snackbar`, `nds-snackbar-host`, `nds-sparkline`. 이 중 7종은 `index.ts` 배럴 export 도 함께 복원(react↔html parity).
- **회귀 차단 lint 게이트 추가** — `define()` 하는 모든 컴포넌트가 `runtime.ts` 에 import 됐는지 검사하는 `check-runtime-registry` 를 `pnpm lint` 에 편입(`nds-stepper`/`nds-pagination` 회귀가 다시 안 나도록).
- **목업 검증룰 2종 추가** — ① `nds-*` 호스트의 `textContent`/`innerText`/`innerHTML` 직접 대입(컴포넌트 내부 렌더가 지워짐) 감지, ② `<div role/onclick>` 로 파일업로드·페이지네이션·스텝퍼·검색을 자작한 경우 named warn.
- **가이드 보강** — Stepper `variant=bar` + `StepItem.title` 문서화(+ Stepper vs MultiStepForm 결정 노트), Checkbox 전체선택의 `checked` 프로퍼티/`change` 이벤트 모델, cta-group 의 모달/팝업 푸터 pill·actionsLayout 규칙 교차참조.
