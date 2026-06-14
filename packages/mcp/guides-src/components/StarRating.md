---
{}
---

## summary

1-5 / 1-10 별 점수. 후기 입력 + 후기 표시 양쪽에 사용. **입력(클릭해서 별점 선택)은 html `interactive` 속성 / React `onValueChange` 핸들러로 켠다.** 안 켜면 표시 전용(별이 클릭되지 않음).

## pitfalls

- **입력 모드를 깜빡하면 별이 안 눌린다 (자주 하는 실수).** html 은 `<nds-star-rating interactive>` 속성을, React 는 `onValueChange` prop 을 줘야 클릭 가능. 둘 다 없으면 표시 전용(`role="img"`)이라 리뷰 작성 폼에서 "별점이 동작 안 함"으로 보인다. ❌ nds-icon-button 으로 별을 직접 만들지 말 것 — `interactive` 면 된다.
- 0.5 단위 반쪽 별 표시는 `precision="half"` 로 켠다. 기본 `precision="full"` 은 정수 반올림이라 4.5 가 5개로 보인다. 인터랙티브(입력) 모드는 항상 정수.
- readonly 와 disabled 혼동 — disabled 는 폼 비활성, readonly 는 보기 전용 (clickable 아님).
- max 가 5 인데 value 6 — 표시가 깨짐.
- HTML size 는 React 와 동일하게 px 숫자를 우선 사용. "md"/"lg" alias 는 허용되지만 목업 가이드 예제에서는 숫자 px 로 지시.

## examplesHtml.do

```html
<!-- 입력(리뷰 작성): interactive 로 클릭 가능, 이벤트로 값 수신 -->
<nds-star-rating value="0" size="32" max="5" interactive></nds-star-rating>
<script>el.addEventListener("star-rating-change", e => setRating(e.detail.value));</script>

<!-- 표시 전용(후기 노출): readonly + precision=half -->
<nds-star-rating value="4.5" size="16" max="5" precision="half" readonly></nds-star-rating>
```

## examplesHtml.dont

```html
<!-- value 가 max 초과 -->
<nds-star-rating value="6" max="5"></nds-star-rating>
```
