---
{}
---

## summary

알림 리스트 한 건. kind별 아이콘 톤, 미읽음 점, 시간 라벨, 본문 2줄 클램프.

## pitfalls

- Toast/Snackbar와 다름 — 알림 센터(히스토리) 한 건 표현용.
- description 본문은 자동 2줄 클램프. 더 길게 보여주려면 onClick으로 디테일 진입.
- unread는 단순 시각 표시 — 읽음 처리는 onClick 안에서 외부 state 갱신.

## recommended

- 알림 센터: List 안에 NotificationItem 반복
- kind별 자동 아이콘: 직접 icon prop 안 줘도 됨

## examplesHtml.do

```html
<nds-notification-item kind="success" item-title="결제 완료"
  description="6/1 14:00 첫 상담" time="방금 전" unread clickable></nds-notification-item>
<script>el.addEventListener("nds-notification-click", () => navigate("/notice/1"));</script>
```

## examplesHtml.dont

```html
<!-- kind 누락 — 색/아이콘이 의미 없는 default -->
<nds-notification-item item-title="알림"></nds-notification-item>
```
