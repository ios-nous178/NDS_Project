---
"@nudge-design/react": patch
"@nudge-design/html": patch
"@nudge-design/mcp": patch
---

별점 렌더 통합 — ReviewCard·MediaCard 가 StarRating 을 재사용 (3중 중복 제거)

ReviewCard·MediaCard 가 각자 별점 SVG 를 재구현하던 것을 StarRating 단일 구현으로 통합했습니다.

- StarRating 에 `precision` prop 신설 — `"half"` 면 0.5 단위 반쪽 별 표시. 기본 `"full"`(정수 반올림), 인터랙티브 입력 모드는 항상 정수.
- react: ReviewCard·MediaCard 가 `<StarRating precision="half">` 를 렌더(자체 renderStars 제거).
- html: nds-star-rating·nds-review-card·nds-media-card 가 공유 `base/star-icons.ts` 헬퍼를 사용. nds-star-rating 에 `precision` attr 추가.
- 채움/빈 별 색은 기존 `--nds-rating-star`/`--nds-rating-star-empty` 슬롯 그대로.
- MediaCard 는 정수 반올림 → 반쪽 별 표시로 별점 정밀도가 올라갑니다(예: 4.5 → 4.5개로 표시).
