---
{}
---

## summary

별점 후기 카드 (0.5 단위). 작성자/별점/본문/태그/푸터 슬롯, verified 인증 마크.

## pitfalls

- rating은 0-5, 0.5 단위. 범위 밖이면 시각적으로 깨짐.
- 본문 줄바꿈은 white-space: pre-wrap 자동 — body에 \n 그대로 사용.
- footer는 보통 LikeButton/도움됨 버튼. 자유 슬롯이라 텍스트도 가능.

## recommended

- 상담 후기: verified + tags=['편안함','전문성']
- 상품 리뷰: meta='구매 인증' + verified

## examplesHtml.do

```html
<nds-review-card author="홍길동" meta="2025.05.20 · 1회기"
  rating="5" card-title="정말 좋았어요"
  body="처음엔 망설였는데 지금은 매주 기다려져요" verified></nds-review-card>
```

## examplesHtml.dont

```html
<!-- rating="6" — max(5) 초과로 표시가 깨짐 -->
<nds-review-card author="…" rating="6"></nds-review-card>
```
