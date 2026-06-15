---
"@nudge-design/html": patch
---

html 웹컴포넌트 2건 — 버튼 라벨 동적 변경 · `[hidden]` 무력화 수정 (목업 실버그)

캐포비 온보딩 목업이 드러낸 html 미러 버그 2건 수정. 둘 다 React 는 정상이라 미러 drift.

- **nds-button — mount 후 `el.textContent`/`el.innerHTML` 로 라벨을 바꾸면 버튼이 통째로 사라지던 버그.**
  버튼은 mount 시 children 을 inner `<button><span.label>` 안으로 옮기는데, 이후 host 에 직접
  텍스트를 넣으면 inner 버튼이 detach 되고 맨 텍스트만 남았다("인증번호 재전송" 토글, AddressPicker
  검색 버튼이 스타일 없는 맨 텍스트로 깨짐). MutationObserver 로 stray 노드를 라벨로 재흡수해
  `textContent`/`innerHTML` 변경에도 버튼 구조를 유지하도록 복원.
- **NdsElement(베이스) — `<nds-* hidden>` 이 안 먹던 버그.** 다수 컴포넌트가 `style.display="contents"`
  를 강제해 UA 기본 `[hidden]{display:none}` 을 인라인으로 덮어, 예: `nds-notice-alert message="" hidden`
  이 숨지 않고 아이콘만 든 빈 박스로 항상 노출됐다. 베이스가 update 이후 `[hidden]` 을 교정하고
  hidden 토글을 관찰해 재렌더하도록 수정 — html 미러 전 컴포넌트(97개)에 적용. 회귀 테스트 추가.
