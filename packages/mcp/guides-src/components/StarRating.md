---
{}
---

## summary

1-5 / 1-10 별 점수. 후기 입력 + 후기 표시 양쪽에 사용. readonly 와 disabled 구분.

## pitfalls

- 0.5 단위 반쪽 별 표시는 `precision="half"` 로 켠다. 기본 `precision="full"` 은 정수 반올림이라 4.5 가 5개로 보인다. 인터랙티브(입력) 모드는 항상 정수.
- readonly 와 disabled 혼동 — disabled 는 폼 비활성, readonly 는 보기 전용 (clickable 아님).
- max 가 5 인데 value 6 — 표시가 깨짐.
- HTML size 는 React 와 동일하게 px 숫자를 우선 사용. "md"/"lg" alias 는 허용되지만 목업 가이드 예제에서는 숫자 px 로 지시.

## examplesHtml.do

```html
<nds-star-rating value="4" size="20" max="5" show-value></nds-star-rating>
<nds-star-rating value="4.5" size="16" max="5" precision="half" readonly></nds-star-rating>
<script>el.addEventListener("star-rating-change", e => setRating(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- value 가 max 초과 -->
<nds-star-rating value="6" max="5"></nds-star-rating>
```
