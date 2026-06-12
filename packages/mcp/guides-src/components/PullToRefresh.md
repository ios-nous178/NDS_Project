---
{}
---

## summary

모바일 풀 투 리프레시. 화면 최상단에서 당기면 onRefresh, Promise 종료 자동 처리.

## pitfalls

- scrollTop > 0이면 트리거 X — 항상 최상단에서만 동작 (의도적).
- 데스크톱에서 패턴이 어색 — 모바일 우선 화면에만.
- threshold가 너무 작으면 일반 스크롤도 잘못 인식. 64-96 권장.

## recommended

- 리스트 새로고침: onRefresh={async () => { await refetch(); }}
- 라벨 커스텀: pullLabel='당겨서 일기 동기화'

## examplesHtml.do

```html
<nds-pull-to-refresh threshold="80">
  <div slot="default">스크롤 콘텐츠…</div>
</nds-pull-to-refresh>
<script>
el.addEventListener("refresh", async () => {
  await reload();
  el.endRefresh();
});
</script>
```

## examplesHtml.dont

```html
<!-- endRefresh() 호출 안 함 — 스피너가 영원히 돌아감 -->
<nds-pull-to-refresh><div slot="default">…</div></nds-pull-to-refresh>
```
