---
"@nudge-design/html": patch
---

AddressPicker(HTML): 주소 검색 입력이 "한 글자마다 끊기던" 포커스 유실 수정

`<nds-address-picker>` 가 키 입력 1번마다 `update()` → `replaceChildren` 로 `<input>` 을 통째로 다시 만들어, 포커스/커서가 매 글자 유실되던 버그를 고쳤다. 검색 input·상세 input 을 **한 번만 mount** 하고 update 에서는 값/결과 리스트만 패치(input 재생성 금지)하도록 렌더 전략을 바꿨다. (React 어댑터는 원래 input 이 mount 유지라 영향 없었음 — HTML 어댑터 단독 버그.) + 입력 후 input 노드 동일성/포커스 유지 회귀 테스트.

부수: DatePicker 의 ×(clear) ↔ 캘린더 아이콘 겹침은 **소스가 이미 올바른 swap 구조**(값+allow-clear → `data-clearable="true"` → CSS 가 아이콘 숨김)라 코드 변경 없음. 다만 그동안 이 swap 을 잠그는 테스트가 없어 date-picker 리팩터마다 조용히 깨졌던 게 재발 원인 — react/html 양면에 **clearable swap 회귀 테스트**를 추가해 영구 고정했다.
