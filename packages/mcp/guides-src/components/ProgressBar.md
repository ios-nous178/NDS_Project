---
{}
---

## summary

value/max 기반 진행도.

## pitfalls

- 상태(주의/에러/성공)를 표현할 때는 color prop에 semantic 토큰 var(--semantic-*-main)을 넘겨 시각적 의미를 통일.

## examplesHtml.do

```html
<nds-progress-bar value="65" max="100" size="md" aria-label="작성 65%"></nds-progress-bar>
```

## examplesHtml.dont

```html
<!-- 결정적이지 않은 작업(=언제 끝날지 모름)에 진행률 -->
<nds-progress-bar value="32"></nds-progress-bar> <!-- 차라리 spinner 사용 -->
```
