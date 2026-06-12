---
{}
---

## summary

데이터/검색 결과/기록 없음 표시. 단순 '없음' 메시지 대신 다음 액션(추가하기 / 다시 검색 / 추천 보기)을 제안.

## pitfalls

- title 만 있고 description / action 누락 — 사용자에게 다음 행동을 안내하지 않음.
- EmptyState 를 페이지 전체 height 로 채우면 안 — 영역 안에서만 표시, footer / nav 가 가려지지 않도록.
- 에러 상황(네트워크 / 권한)에 EmptyState 를 재활용 — 시그널이 약함. ErrorState / Banner 사용.

## examplesHtml.do

```html
<nds-empty-state title="아직 작성한 일기가 없어요" description="오늘의 감정을 기록해 보세요" action="작성하기"></nds-empty-state>
<script>el.addEventListener("empty-state-action", () => navigate("/journal/new"));</script>
```

## examplesHtml.dont

```html
<!-- title 만 있고 다음 액션 없음 — 사용자가 막힘 -->
<nds-empty-state title="결과 없음"></nds-empty-state>
```
