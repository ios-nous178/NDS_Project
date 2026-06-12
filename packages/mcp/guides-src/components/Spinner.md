---
{}
---

## summary

인라인 회전 로더. 짧은 fetch (<2s)에 사용. 긴 로딩은 Skeleton.

## pitfalls

- 전체 페이지 로딩에 Spinner를 가운데 띄우지 말 것 — 빈 화면 인상이 강함. Skeleton(레이아웃 유지)이 UX 더 좋음.
- 버튼 내부에 넣을 때는 size="sm", color={cv.primary.fg} 등 컨텍스트 색에 맞춰 oversiede.
- label prop은 스크린리더용 ("로딩 중"이 기본). 무음 처리 금지.

## recommended

- <Button disabled><Spinner size="sm" color="currentColor" /> 처리 중...</Button>
- 리스트 끝 무한스크롤: <Spinner size="md" />

## examplesHtml.do

```html
<nds-button disabled>
  <nds-spinner size="sm" label="처리 중"></nds-spinner> 처리 중…
</nds-button>
<nds-spinner size="md" aria-label="목록 불러오는 중"></nds-spinner>
```

## examplesHtml.dont

```html
<!-- label/aria-label 둘 다 없는 단독 스피너 — 스크린리더에 안내가 없음 -->
<nds-spinner size="md"></nds-spinner>
```
