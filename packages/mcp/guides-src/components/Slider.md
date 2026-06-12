---
{}
---

## summary

연속값 입력 (통증·스트레스 강도 등). LikertScale은 고정 N단계, Slider는 연속.

## pitfalls

- 5단계 같은 이산형 평가는 LikertScale을 쓸 것. Slider step=1 max=4로 흉내내지 말 것 — 시각적 의미가 다름.
- showValue=false인데 startLabel/endLabel만 있으면 사용자가 현재 값을 알 수 없음. 한쪽은 무조건 표시.
- max-min 범위가 너무 크면 한 칸 차이가 시각적으로 안 보임. step을 sensible 단위(5/10)로.

## recommended

- 통증 강도: min=0 max=10 step=1 startLabel="없음" endLabel="극심" showValue
- 스트레스 %: min=0 max=100 step=5 showValue formatValue={(v) => `${v}%`}

## examplesHtml.do

```html
<nds-slider value="3" min="0" max="10" start-label="약함" end-label="강함" show-value></nds-slider>
<script>el.addEventListener("slider-change", e => setLevel(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- 표시할 단계가 적은데 슬라이더 사용 — segmented 가 맞음 -->
<nds-slider value="2" min="1" max="3"></nds-slider>
```
