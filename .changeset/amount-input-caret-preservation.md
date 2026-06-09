---
"@nudge-design/react": patch
---

AmountInput(돈입력): 천단위 콤마 재포맷 후 커서(caret) 위치 보존

매 입력마다 `toLocaleString` 으로 재포맷하며 input 값을 통째로 교체해, 커서가 항상 문자열 끝으로 튀던 문제(중간 자리 수정 불가 — "동작 이상")를 고친다. 입력 시점 커서 앞의 숫자 개수를 세고, 재포맷된 문자열에서 같은 자릿수 위치로 커서를 되돌린다. react `useLayoutEffect` + html `setSelectionRange` 로 양쪽 미러 동시 반영. 캐럿 보존 케이스(중간 삽입/끝 입력/전체 삭제)를 테스트로 고정.
