---
{}
---

## summary

1-5 / 1-7 단계 만족도 / 동의 정도 측정. 자가검사(우울/불안), 후기, 설문에 사용. 단계당 텍스트 라벨은 최소화하고 양 끝 anchor 만.

## pitfalls

- 양 끝 anchor(start-label / end-label) 누락 — 1/5 가 좋음/나쁨 어느 쪽인지 모호.
- 11점 이상 단계는 슬라이더(nds-slider) 가 더 적합. Likert 는 3/5/7 단계 권장.
- Likert 결과를 평균 점수로만 노출하지 말 것 — 분포(히스토그램) 가 의미 있는 경우가 많음.

## examplesHtml.do

```html
<nds-likert-scale name="satisfaction" options="[1,2,3,4,5]" start-label="매우 불만족" end-label="매우 만족"></nds-likert-scale>
<script>el.addEventListener("likert-change", e => setValue(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- anchor 라벨 누락 — 의미 해석 불가 -->
<nds-likert-scale name="x" options="[1,2,3,4,5]"></nds-likert-scale>
```
