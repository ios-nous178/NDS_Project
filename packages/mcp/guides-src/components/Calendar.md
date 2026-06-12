---
{}
---

## summary

인라인 월간 캘린더 그리드. DatePicker(popover 입력)와 다르게 화면에 펼쳐져 있는 콘텐츠형 캘린더.

## pitfalls

- 폼 안에서 날짜 한 개 입력받는 용도면 DatePicker를 쓸 것. Calendar는 캘린더 자체가 콘텐츠인 화면용.
- value/onChange는 ISO 문자열(YYYY-MM-DD). Date 객체로 비교하지 말 것 — 시간대 이슈 발생.
- markers는 dot만 표시. 라벨/시간 등 풍부한 정보가 필요하면 캘린더 아래에 별도 List/Card로 표현.
- month prop을 주면 controlled로 동작하고 onMonthChange로만 월이 바뀜. 안 주면 내부 state.

## recommended

- 예약 화면: isDateDisabled로 과거/예약 불가 날짜 차단
- 감정 캘린더: markers에 색상으로 mood 단계 매핑
- 복약 캘린더: markers + 클릭 시 BottomSheet로 상세

## interactivePattern

onChange(iso)로 선택을 받고, 외부에서 그 날짜에 해당하는 List/Card를 갱신. weekStartsOn=1로 월요일 시작도 가능.

## examplesHtml.do

```html
<nds-calendar value="2026-05-25" markers='[{"date":"2026-05-25","color":"red"}]'></nds-calendar>
<script>el.addEventListener("nds-calendar-change", e => setDate(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- month / value 형식 위반 (YYYY-MM, YYYY-MM-DD 필수) -->
<nds-calendar value="2026/5/25"></nds-calendar>
```
