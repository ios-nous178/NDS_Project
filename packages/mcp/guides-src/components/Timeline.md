---
{}
---

## summary

타임라인 — data-array(items) API. mode=activity(시간순 이벤트 로그 — date/title/description + status/statusLabel 배지) + mode=tracker(정해진 단계 진행 트래커 — current 인덱스로 done/current/todo 파생, direction=vertical|horizontal). 구 ActivityTimeline+StatusTimeline 통합. (단계 진척만 간결히 보이려면 Stepper, 다단계 폼 컨테이너는 MultiStepForm.)

## pitfalls

- items 의 각 항목은 { key, title, date?, description?, status?, statusLabel? }. title 은 필수(이벤트/단계 이름), date 는 시점.
- mode=tracker 는 current(0-based)로 상태 파생 — per-item status 는 무시됨. 전부 완료는 current=items.length.
- mode=activity 는 per-item status(default/completed/ongoing/warning/error) 명시. statusLabel 없이 status만 주면 dot 색만 바뀌고 우측 배지는 안 뜸 — 둘 다 필요.
- direction='horizontal' 은 tracker 에서만 의미(가로 단계 트래커). activity 는 항상 세로.
- status='ongoing' 은 box-shadow ring 효과 — 한 화면에 여럿 두면 시각 잡음. 보통 1개. items 20+ 면 페이지네이션/가상화 권장.

## examplesHtml.do

```html
<!-- 이벤트 로그 -->
<nds-timeline mode="activity" items='[
  {"key":"1","date":"2026.05.25","title":"상담 예약 완료","status":"completed","statusLabel":"완료"},
  {"key":"2","date":"2026.05.28","title":"자가검사","status":"ongoing","statusLabel":"진행 중"}
]'></nds-timeline>
<!-- 단계 트래커 -->
<nds-timeline mode="tracker" current="1" direction="horizontal" items='[
  {"key":"r","title":"접수","date":"05/20"},
  {"key":"p","title":"처리 중"},
  {"key":"d","title":"완료"}
]'></nds-timeline>
```

## examplesHtml.dont

```html
<!-- 슬롯 자식(nds-timeline-item)·steps 속성은 폐기 — items 배열 + mode 사용 -->
<nds-timeline><nds-timeline-item title="…"></nds-timeline-item></nds-timeline>
```
