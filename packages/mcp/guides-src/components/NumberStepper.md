---
{}
---

## summary

**수량 조절 +/- 버튼 입력 (폼 필드)** — 복약 횟수·장바구니 수량·알림 빈도 등 '폼 안에서 숫자를 올리고 내리는 칸'. ⚠️ **`Stepper`(다단계 *진행 표시* 막대/원)와 이름만 비슷한 전혀 다른 컴포넌트.** 헷갈리면: 값을 입력받는 폼 컨트롤이면 **NumberStepper**, 지금 몇 단계인지 보여주는 인디케이터면 **Stepper**(component:Stepper).

## pitfalls

- **Stepper(진행 표시)와 혼동 금지** — 그건 회원가입/멀티스텝 폼 같은 '지금 몇 단계' 표시(component:Stepper). NumberStepper 는 폼 필드의 수량 입력이다.
- 큰 범위(100+) 입력에는 부적합. tap/click을 N번 해야 하므로 Input type='number'를 쓸 것.
- min/max 도달 시 해당 버튼이 자동 비활성. 외부에서 또 비활성 처리할 필요 없음.

## recommended

- 복약 횟수: min=1 max=10 unit='회'
- 장바구니 수량: min=1 max=99 editable
- 알림 빈도: step=5 unit='분'

## interactivePattern

value/onValueChange는 controlled 강제. 내부 state 없음 — 부모에서 관리.

## examplesHtml.do

```html
<nds-number-stepper value="1" min="1" max="9" step="1" unit="명"></nds-number-stepper>
<script>el.addEventListener("number-change", e => setQty(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- 자유 입력을 nds-input 으로 받고 stepper 흉내 — 범위/단위 룰이 빠짐 -->
<nds-input type="number" />
```
