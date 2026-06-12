---
{}
---

## summary

예약 가능한 시간 slot 그리드. 상담 / 예약 / 클래스 일정에 사용. 가용 / 비가용 / 만석 상태 시각화.

## pitfalls

- 한 화면에 30분 단위 24시간 = 48 slot 다 보여주기 — 너무 많아 선택 부담. AM/PM 또는 시간대 필터로 분할.
- 비가용 slot 을 단순 회색으로만 — 이유(예약 마감 / 휴무) 미명시.
- 선택 후 즉시 다음 step 으로 자동 이동 — 사용자의 confirm 단계를 우회.

## examplesHtml.do

```html
<nds-time-slot-picker columns="3"
  groups='[
    {"key":"am","label":"오전","slots":[{"value":"09:00"},{"value":"10:00","disabled":true}]},
    {"key":"pm","label":"오후","slots":[{"value":"14:00"},{"value":"15:00"}]}
  ]'></nds-time-slot-picker>
<script>el.addEventListener("nds-time-slot-change", e => pick(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- slots 와 groups 동시 — 둘 중 하나만 -->
<nds-time-slot-picker slots='[...]' groups='[...]'></nds-time-slot-picker>
```
