---
{}
---

## summary

`−` / 값 / `+` 로 정수를 증감하는 입력. 키보드 없이 수량·회차·세트 수·인원 같은 **작은 정수**를 조정할 때. 가운데 값은 직접 입력도 가능(입력 중 자유 타이핑, blur 시 clamp), 위/아래 화살표 키로도 증감. min/max 도달 시 해당 버튼 자동 비활성.

<!-- figmaNodeUrl: TODO — 디자인 가이드 노드 확정 후 추가(현재 디자인 소스 없이 코드 우선 추가됨) -->

## pitfalls

- **Stepper / AmountInput 과 혼동 금지.** `Stepper` 는 단계 **진행 표시기**(numbered/dots/bar)지 증감 입력이 아니다. `AmountInput` 은 금액(천단위 콤마 + 프리셋 칩, value 는 number|null)용 — 큰 수/통화는 NumericSpinner 말고 AmountInput.
- **작은 정수 조정 전용.** 임의의 큰 수를 키패드로 빠르게 치는 화면(나이·금액 등)에는 부적합 — 그건 AmountInput 이나 일반 숫자 input. NumericSpinner 는 "기본값 주변 ±몇" 조정에 쓴다.
- **value 는 number (controlled, not null).** 빈 문자열 상태는 입력 중에만 허용되고 commit 되지 않는다. 반드시 `onValueChange`(html: `numeric-spinner-change`)로 받아 되돌려줘야 화면이 갱신된다.
- **min/max 는 자동 clamp** — 버튼/직접입력 모두 경계로 자르고, 경계 도달 시 `−`/`+` 버튼이 disabled 된다. 외부에서 별도 검증/clamp 불필요.
- `step` 미지정 시 1. 5단위 등은 `step` 으로.

## recommended

- 수량/회차/세트/인원: `value` + `min` + `max` (예: 상담 회차 1~10)
- N단위 증감: `step={5}` (예: 0~100, 5단위)

## examplesHtml.do

```html
<nds-numeric-spinner value="1" min="1" max="10" aria-label="상담 회차"></nds-numeric-spinner>
<script>
  el.addEventListener("numeric-spinner-change", (e) => setCount(e.detail.value));
</script>
```

## examplesHtml.dont

```html
<!-- 금액/큰 수에 스피너 — 큰 수를 +1씩 누르게 만들지 말 것. AmountInput 사용 -->
<nds-numeric-spinner value="50000" step="1000"></nds-numeric-spinner>

<!-- 진행 단계 표시에 오용 — Stepper 사용 -->
<nds-numeric-spinner value="2" max="4" aria-label="가입 단계"></nds-numeric-spinner>
```
