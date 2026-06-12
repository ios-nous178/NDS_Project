---
{}
---

## summary

큰 금액/수량 입력(원·명·개·포인트 등). 자동 천 단위 콤마, presets(빠른 입력), max/min 클램프. NumberStepper(작은 정수)와 분리.

## pitfalls

- **금액/수량을 입력받는 폼 필드를 일반 text input 이나 정적 숫자 표시('3,000,000 명' 큰 글씨)로 만들지 말 것** — 사용자가 못 고치고 콤마/단위/clamp 가 빠진다. <nds-amount-input value=… unit='명|원|개' placeholder='0'> 로. unit 은 '원' 외에도 '명/개' 등 자유 (검증룰 amount-as-text-input / amount-as-static-display 가 막음).
- value는 number | null. 빈 입력은 null (0이 아님).
- presets의 set: true = 값 설정, false/미지정 = 누적. 헷갈리지 말 것.
- max/min 자동 클램프 — 외부 검증 X. 단, 에러 메시지는 외부에서 helperText로.

## recommended

- 송금: presets +1만/+5만/전액(set), max=balance
- 후원: presets에 set:true 4종 (5천/1만/3만/5만)

## examplesHtml.do

```html
<nds-amount-input value="10000" prefix="₩" unit="원" label="후원 금액"
  presets='[{"label":"+1만","amount":10000},{"label":"+5만","amount":50000}]'></nds-amount-input>
<script>el.addEventListener("amount-change", e => setAmount(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- 값에 통화기호와 쉼표 직접 박음 — number 파싱이 깨짐 -->
<nds-amount-input value="₩10,000"></nds-amount-input>
```
