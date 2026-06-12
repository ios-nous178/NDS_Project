---
{}
---

## summary

가격 + 할인율 + 원가. amount/originalAmount 모두 number일 때만 할인율 자동 계산. 0원은 freeLabel.

## pitfalls

- 통화는 prefix($) 또는 unit(원) 중 하나만. 둘 다 쓰면 '$1,000원' 어색.
- 할인율은 amount/originalAmount 둘 다 number일 때만 자동. 문자열로 넘기면 계산 안 됨.
- formatThousands=false로 두면 콤마 없이 표시됨 — 외화/표시 정책에 맞춰 조정.

## recommended

- 상품 카드: size='lg', 할인 자동
- 결제 합계: size='md', originalAmount로 절약 표시
- 구독: amount=29000, unit='원/월'

## examplesHtml.do

```html
<nds-price-tag amount="50000" original-amount="100000" prefix="₩" unit="원" size="md" format-thousands></nds-price-tag>
```

## examplesHtml.dont

```html
<!-- 할인 표시를 strikethrough 텍스트로 직접 작성 — original-amount 권장 -->
<span>₩100,000</span> <strong>₩50,000</strong>
```
