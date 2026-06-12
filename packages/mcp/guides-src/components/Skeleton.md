---
{}
---

## summary

데이터 로드 중 placeholder. 실제 콘텐츠의 box 모델을 그대로 흉내 — 스피너보다 인지된 속도가 빠름.

## pitfalls

- 긴 작업(>3초) 에 Skeleton 만 — 진척 표시 없으면 사용자가 멈췄다고 인식. ProgressBar / 안내문 병행.
- Skeleton 의 width/height 가 실제 콘텐츠와 크게 다르면 로드 후 layout shift — CLS 악화.
- variant='text' 를 짧은 카드/카운트 자리에 사용 — 시각적 비율이 어색. rect 권장.

## examplesHtml.do

```html
<nds-skeleton variant="text" width="60%"></nds-skeleton>
<nds-skeleton variant="rect" width="100%" height="200"></nds-skeleton>
```

## examplesHtml.dont

```html
<!-- 실제 콘텐츠보다 한참 작은 사이즈 — 로드 후 layout shift -->
<nds-skeleton variant="rect" width="40" height="20"></nds-skeleton> <!-- 실제로는 폭 100% -->
```
